import { Request, Response } from "express";
import { TPayloadBack } from "../../types/types";
import Banco from "../../model/banco";
import logger from "../../utils/logs";

export async function getBancos(req: Request, res: Response) {
  try {
    const { payload }: { payload: TPayloadBack } = req.body;
    const bancos = await Banco.findAll({
      where: {
        id_conta: payload.conta.dataValues.id,
      },
    });

    return res.status(200).json(bancos);
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
}