import { Request, Response } from "express";
import { TPayloadBack } from "../types/types";
import Acesso from "../model/acesso";
import logger from "../utils/logs";

export default async function logout(req: Request, res: Response) {
  try {
    const { payload }: { payload: TPayloadBack } = req.body;
    const { id } = payload;

    await Acesso.update({ token: null }, { where: { id } });

    return res.sendStatus(200)
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
}
