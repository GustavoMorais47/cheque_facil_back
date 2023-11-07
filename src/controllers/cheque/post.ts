import { Request, Response } from "express";
import { EOperacaoCheque, EStatusCheque } from "../../types/enum";
import { TPayloadBack } from "../../types/types";
import moment from "moment";
import Responsavel from "../../model/responsavel";
import ContaBancaria from "../../model/conta_bancaria";
import Cheque from "../../model/cheque";
import DataBloqueada from "../../model/data_bloqueada";
import Config from "../../model/config";
import logger from "../../utils/logs";

export async function postCheque(req: Request, res: Response) {
  try {
    const { payload }: { payload: TPayloadBack } = req.body;
    const {
      operacao, //obrigatório
      id_conta_bancaria, //obrigatório
      id_responsavel, //obrigatório
      numero, //obrigatório
      valor, //obrigatório
      data_emissao, //obrigatório
      data_vencimento,
      data_pagamento,
      destinatario,
      descricao,
      status, //obrigatório
      motivo_devolucao,
    } = req.body;

    if (
      !operacao ||
      !id_conta_bancaria ||
      !id_responsavel ||
      !numero ||
      !valor ||
      !data_emissao ||
      !status
    )
      return res.status(400).json({
        mensagem:
          "Operação, conta bancária, responsável, número, valor, data de emissão e status são obrigatórios",
      });

    if (
      isNaN(Number(id_conta_bancaria)) ||
      isNaN(Number(id_responsavel)) ||
      isNaN(Number(valor))
    )
      return res.status(400).json({
        mensagem: "Conta bancária, responsável, valor devem ser números",
      });

    if (operacao !== EOperacaoCheque.A_PAGAR)
      return res.status(400).json({
        mensagem: "Operação inválida",
      });

    if (isNaN(Number(numero)) && typeof numero !== "string")
      return res.status(400).json({
        mensagem: "Número deve ser string numérica",
      });

    if (Number(valor) < 0)
      return res.status(400).json({
        mensagem: "Valor deve ser positivo",
      });

    if (isNaN(Date.parse(data_emissao)) && typeof data_emissao !== "string")
      return res.status(400).json({
        mensagem: "Data de emissão deve ser uma data válida no formato string",
      });

    if (
      status !== EStatusCheque.A_VENCER &&
      status !== EStatusCheque.DEVOLVIDO &&
      status !== EStatusCheque.PAGO &&
      status !== EStatusCheque.VENCIDO
    )
      return res.status(400).json({
        mensagem: "Status inválido",
      });

    if (
      data_vencimento &&
      isNaN(Date.parse(data_vencimento)) &&
      typeof data_vencimento !== "string"
    )
      return res.status(400).json({
        mensagem:
          "Data de vencimento deve ser uma data válida no formato string",
      });

    if (
      data_pagamento &&
      isNaN(Date.parse(data_pagamento)) &&
      typeof data_pagamento !== "string"
    )
      return res.status(400).json({
        mensagem:
          "Data de pagamento deve ser uma data válida no formato string",
      });

    if (
      data_vencimento &&
      moment(data_vencimento)
        .clone()
        .endOf("day")
        .milliseconds(999)
        .isBefore(data_emissao)
    )
      return res.status(400).json({
        mensagem: "Data de vencimento deve ser posterior à data de emissão",
      });

    if (
      data_pagamento &&
      moment(data_pagamento).clone().endOf("day").isBefore(data_emissao)
    )
      return res.status(400).json({
        mensagem: "Data de pagamento deve ser posterior à data de emissão",
      });

    if (destinatario && typeof destinatario !== "string")
      return res.status(400).json({
        mensagem: "Destinatário deve ser string",
      });

    if (descricao && typeof descricao !== "string")
      return res.status(400).json({
        mensagem: "Descrição deve ser string",
      });

    if (status === EStatusCheque.DEVOLVIDO && !motivo_devolucao)
      return res.status(400).json({
        mensagem: "Motivo de devolução é obrigatório",
      });

    if (motivo_devolucao && typeof motivo_devolucao !== "string")
      return res.status(400).json({
        mensagem: "Motivo de devolução deve ser string",
      });

    if (
      motivo_devolucao && motivo_devolucao.length > 250 || motivo_devolucao && motivo_devolucao.length < 1
    )
      return res.status(400).json({
        mensagem:
          "Motivo de devolução deve ter no máximo 250 caracteres e no mínimo 1 caracter",
      });

    const cheque = await Cheque.findOne({
      where: {
        id_conta: payload.conta.dataValues.id,
        id_conta_bancaria,
        numero,
      },
    });

    if (cheque)
      return res.status(400).json({
        mensagem: "Cheque já cadastrado",
      });

    const config = await Config.findOne({
      where: {
        id_conta: payload.conta.dataValues.id,
      },
    });

    if (
      config &&
      moment(data_emissao).clone().startOf("day").day() === 0 &&
      config.dataValues.permitir_cadastro_domingo === false
    )
      return res.status(400).json({
        mensagem: "Não é permitido cadastrar com data de emissão no domingo",
      });

    if (
      config &&
      moment(data_emissao).clone().startOf("day").day() === 6 &&
      config.dataValues.permitir_cadastro_sabado === false
    )
      return res.status(400).json({
        mensagem: "Não é permitido cadastrar com data de emissão no sábado",
      });

    if (
      config &&
      data_vencimento &&
      moment(data_vencimento).clone().endOf("day").day() === 0 &&
      config.dataValues.permitir_cadastro_domingo === false
    )
      return res.status(400).json({
        mensagem: "Não é permitido cadastrar com data de vencimento no domingo",
      });

    if (
      config &&
      data_vencimento &&
      moment(data_vencimento).clone().endOf("day").day() === 6 &&
      config.dataValues.permitir_cadastro_sabado === false
    )
      return res.status(400).json({
        mensagem: "Não é permitido cadastrar com data de vencimento no sábado",
      });

    const datas_bloqueadas = await DataBloqueada.findAll({
      where: {
        id_conta: payload.conta.dataValues.id,
      },
    });

    if (datas_bloqueadas.length > 0) {
      for (const data_bloqueada of datas_bloqueadas) {
        if (
          moment(data_emissao)
            .clone()
            .startOf("day")
            .isSame(
              moment({
                day: data_bloqueada.dataValues.dia,
                month: data_bloqueada.dataValues.mes,
                year: moment().get("year"),
              })
            )
        ) {
          return res.status(400).json({
            mensagem: "Data de emissão bloqueada",
          });
        }
        if (
          data_vencimento &&
          moment(data_vencimento)
            .clone()
            .endOf("day")
            .isSame(
              moment({
                day: data_bloqueada.dataValues.dia,
                month: data_bloqueada.dataValues.mes,
                year: moment().get("year"),
              })
            )
        ) {
          return res.status(400).json({
            mensagem: "Data de vencimento bloqueada",
          });
        }
      }
    }

    const conta_bancaria = await ContaBancaria.findOne({
      where: {
        id: id_conta_bancaria,
        id_conta: payload.conta.dataValues.id,
      },
    });

    if (!conta_bancaria)
      return res.status(404).json({
        mensagem: "Conta bancária não encontrada",
      });

    const responsavel = await Responsavel.findOne({
      where: {
        id: id_responsavel,
        id_conta: payload.conta.dataValues.id,
      },
    });

    if (!responsavel)
      return res.status(404).json({
        mensagem: "Responsável não encontrado",
      });

    await Cheque.create({
      id_conta: payload.conta.dataValues.id!,
      operacao,
      id_conta_bancaria,
      id_responsavel,
      numero,
      valor,
      data_emissao: new Date(
        moment(data_emissao).clone().startOf("day").toISOString()
      ),
      data_vencimento: data_vencimento
        ? new Date(moment(data_vencimento).clone().endOf("day").toISOString())
        : null,
      data_pagamento: data_pagamento
        ? new Date(moment(data_pagamento).clone().startOf("day").toISOString())
        : null,
      destinatario,
      descricao,
      status,
      motivo_devolucao: motivo_devolucao ? motivo_devolucao : null,
      criado_por: payload.id,
    });

    return res.status(201).json({ mensagem: "Cheque criado com sucesso" });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
}
