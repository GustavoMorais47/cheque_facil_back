import { Request, Response, NextFunction } from "express";
import { EPermissaoAcesso } from "../types/enum";
import { TPayloadBack } from "../types/types";
import logger from "./logs";

export default async function permissao(
  req: Request,
  res: Response,
  next: NextFunction,
  perms: EPermissaoAcesso[]
) {
  try {
    const { payload }: { payload: TPayloadBack } = req.body;
    const { permissao } = payload;

    const possuiPermissao = perms.some((perm) => permissao.includes(perm));

    if (!possuiPermissao)
      return res
        .status(403)
        .json({ mensagem: "Sem permissão de acesso", permissoes: permissao });

    return next();
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
}
