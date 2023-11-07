import { Request, Response } from "express";
import { TPayloadBack } from "../../types/types";
import ContaBancaria from "../../model/conta_bancaria";
import logger from "../../utils/logs";

export async function getContasBancarias(req: Request, res: Response) {
  try {
    const { payload }: { payload: TPayloadBack } = req.body;
    const contas = await ContaBancaria.findAll({
      where: {
        id_conta: payload.conta.dataValues.id,
      },
    });

    return res.status(200).json(contas);
  } catch (error) {
    logger.error(error)
    return res.status(500).json({ mensagem: error });
  }
}
export async function getContaBancaria(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { payload }: { payload: TPayloadBack } = req.body;

    if (!id) return res.status(400).json({ mensagem: "ID é obrigatório" });

    if (isNaN(Number(id)))
      return res.status(400).json({ mensagem: "ID deve ser um número" });

    const conta = await ContaBancaria.findOne({
      where: { id, id_conta: payload.conta.dataValues.id },
    });

    if (!conta)
      return res.status(404).json({ mensagem: "Conta não encontrado" });

    return res.status(200).json(conta);
  } catch (error) {
    logger.error(error)
    return res.status(500).json({ mensagem: error });
  }
}
