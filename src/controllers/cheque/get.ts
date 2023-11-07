import { Request, Response } from "express";
import { Op } from "sequelize";
import moment from "moment";
import { TPayloadBack } from "../../types/types";
import { EPermissaoAcesso } from "../../types/enum";
import Responsavel from "../../model/responsavel";
import Cheque from "../../model/cheque";
import logger from "../../utils/logs";

export async function getCheques(req: Request, res: Response) {
  try {
    const { inicio, fim, filtro } = req.query;
    const { payload }: { payload: TPayloadBack } = req.body;
    const { id } = payload;

    if (!inicio)
      return res.status(400).json({
        mensagem: "A data de inicío é obrigatória",
      });

    if (!fim)
      return res.status(400).json({
        mensagem: "A data de fim é obrigatória",
      });

    if (!filtro)
      return res.status(400).json({
        mensagem: "O filtro é obrigatório",
      });

    if (isNaN(Date.parse(inicio as string)))
      return res.status(400).json({
        mensagem: "A data de inicío deve ser uma data válida",
      });

    if (isNaN(Date.parse(fim as string)))
      return res.status(400).json({
        mensagem: "A data de fim deve ser uma data válida",
      });

    if (filtro !== "emissao" && filtro !== "vencimento")
      return res.status(400).json({
        mensagem: "O filtro deve ser emissao ou vencimento",
      });

    if (isNaN(Number(id)))
      return res.status(400).json({
        mensagem: "ID deve ser um número",
      });

    const responsavel = await Responsavel.findOne({
      where: {
        id,
        id_conta: payload.conta.dataValues.id,
      },
    });

    if (!responsavel)
      return res.status(404).json({
        mensagem: "Responsável não encontrado",
      });

    let cheques: Cheque[] = [];

    const inicioDate = moment(new Date(inicio as string))
      .startOf("day")
      .toDate();
    const fimDate = moment(fim as string)
      .endOf("day")
      .toDate();

    if (payload.permissao.indexOf(EPermissaoAcesso.VISUALIZACAO_TOTAL) !== -1) {
      cheques =
        filtro === "emissao"
          ? await Cheque.findAll({
              where: {
                id_conta: payload.conta.dataValues.id,
                data_emissao: {
                  [Op.between]: [inicioDate, fimDate],
                },
              },
            })
          : await Cheque.findAll({
              where: {
                id_conta: payload.conta.dataValues.id,
                data_vencimento: {
                  [Op.between]: [inicioDate, fimDate],
                },
              },
            });
    } else {
      cheques =
        filtro === "emissao"
          ? await Cheque.findAll({
              where: {
                id_conta: payload.conta.dataValues.id,
                id_responsavel: responsavel.dataValues.id,
                data_emissao: {
                  [Op.between]: [inicioDate, fimDate],
                },
              },
            })
          : await Cheque.findAll({
              where: {
                id_conta: payload.conta.dataValues.id,
                id_responsavel: responsavel.dataValues.id,
                data_vencimento: {
                  [Op.between]: [inicioDate, fimDate],
                },
              },
            });
    }
    return res.status(200).json(cheques);
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
}

export async function getCheque(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { payload }: { payload: TPayloadBack } = req.body;
    if (!id)
      return res.status(400).json({
        mensagem: "ID é obrigatório",
      });
    if (isNaN(Number(id)))
      return res.status(400).json({
        mensagem: "ID deve ser um número",
      });
    const cheque = await Cheque.findOne({
      where: {
        id,
        id_conta: payload.conta.dataValues.id,
      },
    });
    if (!cheque)
      return res.status(404).json({
        mensagem: "Cheque não encontrado",
      });
    return res.status(200).json(cheque);
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
}
