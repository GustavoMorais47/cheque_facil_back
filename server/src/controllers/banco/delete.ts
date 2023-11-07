import { Request, Response } from "express";
import Banco from "../../model/banco";
import { TPayloadBack } from "../../types/types";
import ContaBancaria from "../../model/conta_bancaria";
import logger from "../../utils/logs";

export async function deleteBanco(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { payload }: { payload: TPayloadBack } = req.body;

    if (!id) return res.status(400).json({ mensagem: "Id é obrigatório" });

    if (isNaN(Number(id)))
      return res.status(400).json({ mensagem: "Id deve ser um número" });

    const banco = await Banco.findOne({
      where: {
        id,
        id_conta: payload.conta.dataValues.id!,
      },
    });

    if (!banco)
      return res.status(400).json({ mensagem: "Banco não encontrado" });

    const qtdContas = await ContaBancaria.count({
      where: {
        id_conta: payload.conta.dataValues.id!,
        id_banco: banco.dataValues.id!,
      },
    });

    if (qtdContas > 0)
      return res
        .status(400)
        .json({
          mensagem: "Existem contas bancárias cadastradas para esse banco",
        });

    await banco.destroy();

    return res.status(200).json({ mensagem: "Banco deletado com sucesso" });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
}
