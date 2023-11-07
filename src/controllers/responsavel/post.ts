import { Request, Response } from "express";
import { TPayloadBack } from "../../types/types";
import validator from "validator";
import Responsavel from "../../model/responsavel";
import logger from "../../utils/logs";

export async function postResponsavel(req: Request, res: Response) {
  try {
    const { payload }: { payload: TPayloadBack } = req.body;
    const { nome, email } = req.body;

    if (!nome)
      return res.status(400).json({ mensagem: "O nome é obrigatório" });

      if(typeof nome !== "string" || nome.length < 3)
        return res.status(400).json({ mensagem: "O nome deve ter no mínimo 3 caracteres" });

    if (email && !validator.isEmail(email))
      return res.status(400).json({ mensagem: "O email é inválido" });
    
    await Responsavel.create({
      id_conta: payload.conta.dataValues.id!,
      nome,
      email: email ? email : null,
      criado_por: payload.id,
      status: true,
    });

    return res.status(201).json({ mensagem: "Responsável criado com sucesso" });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
}
