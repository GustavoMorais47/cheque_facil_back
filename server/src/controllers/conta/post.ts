import { Request, Response } from "express";
import { TPayloadBack } from "../../types/types";
import Banco from "../../model/banco";
import ContaBancaria from "../../model/conta_bancaria";
import logger from "../../utils/logs";

export async function postContaBancaria(req: Request, res: Response) {
  try {
    const { payload }: { payload: TPayloadBack } = req.body;
    const { id_banco, agencia, numero } = req.body;

    if (!id_banco || !agencia || !numero)
      return res
        .status(400)
        .json({ mensagem: "Banco, agência e número são obrigatórios" });

    if (isNaN(Number(id_banco)))
      return res.status(400).json({ mensagem: "Banco deve ser um número" });

    if (isNaN(Number(agencia)) || typeof agencia !== "string")
      return res
        .status(400)
        .json({ mensagem: "Agência deve ser um número no formato string" });

    if (isNaN(Number(numero)) || typeof numero !== "string")
      return res
        .status(400)
        .json({ mensagem: "Número deve ser um número no formato string" });

    const banco = await Banco.findOne({
      where: { id: id_banco, id_conta: payload.conta.dataValues.id },
    });

    if (!banco)
      return res.status(404).json({ mensagem: "Banco não encontrado" });

    await ContaBancaria.create({
      id_conta: payload.conta.dataValues.id!,
      id_banco: banco.dataValues.id!,
      agencia,
      conta: numero,
      status: true,
      criado_por: payload.id,
    })

    return res.status(200).json({
      mensagem: "Conta criada com sucesso",
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
}
