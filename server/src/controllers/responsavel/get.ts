import { Request, Response } from "express";
import { TPayloadBack } from "../../types/types";
import { EPermissaoAcesso } from "../../types/enum";
import Responsavel from "../../model/responsavel";
import logger from "../../utils/logs";

export async function getResponsaveis(req: Request, res: Response) {
  try {
    const { payload }: { payload: TPayloadBack } = req.body;

    let pessoas: Responsavel[] = [];

    if (payload.permissao.indexOf(EPermissaoAcesso.VISUALIZACAO_TOTAL) !== -1) {
      pessoas = await Responsavel.findAll({
        attributes: ["id", "nome", "email", "status"],
      });
    } else {
      pessoas = await Responsavel.findAll({
        attributes: ["id", "nome", "email", "status"],
        where: {
          id: payload.id,
        },
      });
    }

    return res.status(200).json(pessoas);
  } catch (error) {
    logger.error(error)
    return res.status(500).json({ mensagem: error });
  }
}