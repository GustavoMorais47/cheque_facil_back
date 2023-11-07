import { Request, Response } from "express";
import Banco from "../../model/banco";
import ContaBancaria from "../../model/conta_bancaria";
import { TPayloadBack } from "../../types/types";
import logger from "../../utils/logs";

export async function putContaBancaria(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { payload }: { payload: TPayloadBack } = req.body;
    const { id_banco, agencia, numero, status } = req.body;

    if (!id) return res.status(400).json({ mensagem: "ID é obrigatório" });

    if (isNaN(Number(id)))
      return res.status(400).json({ mensagem: "ID deve ser um número" });

    if (!id_banco || !agencia || !numero || status === undefined)
      return res
        .status(400)
        .json({ mensagem: "Banco, agência, número e status são obrigatórios" });

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

    if (typeof status !== "boolean")
      return res
        .status(400)
        .json({ mensagem: "Status deve ser um booleano ou não ser enviado" });

    const banco = await Banco.findOne({
      where: { id: id_banco, id_conta: payload.conta.dataValues.id },
    });

    if (!banco)
      return res.status(404).json({ mensagem: "Banco não encontrado" });

    const conta = await ContaBancaria.findOne({
      where: { id, id_conta: payload.conta.dataValues.id },
    });

    if (!conta)
      return res.status(404).json({ mensagem: "Conta não encontrada" });

    await conta.update({
      id_banco: banco.dataValues.id!,
      agencia,
      conta: numero,
      status,
    });

    return res.status(200).json({
      mensagem: "Conta atualizada com sucesso",
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
}
