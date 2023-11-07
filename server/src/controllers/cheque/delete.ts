import { Request, Response } from "express";
import Cheque from "../../model/cheque";
import { TPayloadBack } from "../../types/types";
import logger from "../../utils/logs";

export async function deleteCheque(req: Request, res: Response) {
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

    await cheque.destroy();

    return res.status(200).json({
      mensagem: "Cheque excluído com sucesso",
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
}
