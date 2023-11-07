import { Request, Response } from "express";
import { TPayloadBack } from "../types/types";
import Acesso from "../model/acesso";
import moment from "moment";
import "moment/locale/pt-br";
import logger from "../utils/logs";

moment.locale("pt-br");

export default async function me(req: Request, res: Response) {
  try {
    const { payload }: { payload: TPayloadBack } = req.body;

    const acesso = await Acesso.findOne({
      where: { id: payload.id },
    });

    if (!acesso)
      return res.status(404).json({ mensagem: "Acesso não encontrado" });

    return res.status(200).json({
      id: acesso.dataValues.id,
      id_responsavel: acesso.dataValues.id_responsavel,
      nome: acesso.dataValues.nome,
      cpf: acesso.dataValues.cpf,
      email: acesso.dataValues.email,
      permissoes: payload.permissao,
      criado_em: moment(acesso.dataValues.createdAt).toISOString(),
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
}
