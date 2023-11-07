import { Request, Response } from "express";
import { TPayloadBack } from "../../types/types";
import validator from "validator";
import Responsavel from "../../model/responsavel";
import logger from "../../utils/logs";

export async function putResponsavel(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { payload }: { payload: TPayloadBack } = req.body;
    const { nome, email, status} = req.body;

    if (!id) return res.status(400).json({ mensagem: "O id é obrigatório" });

    if (isNaN(Number(id)))
      return res.status(400).json({ mensagem: "O id deve ser um número" });

    if (!nome || status === undefined)
      return res.status(400).json({ mensagem: "O nome e o status são obrigatórios" });

    if (typeof nome !== "string" || nome.length < 3)
      return res
        .status(400)
        .json({ mensagem: "O nome deve ter no mínimo 3 caracteres" });

    if (email && !validator.isEmail(email))
      return res.status(400).json({ mensagem: "O email é inválido" });

    if (typeof status !== "boolean")
        return res.status(400).json({ mensagem: "O status deve ser um booleano" });

    const responsavel = await Responsavel.findOne({
      where: { id, id_conta: payload.conta.dataValues.id! },
    });

    if (!responsavel)
      return res.status(404).json({ mensagem: "Responsável não encontrado" });

      responsavel.update({
        nome,
        email: email ? email : null,
        status,
      });

    return res.status(200).json({ mensagem: "Responsável atualizado com sucesso" });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
}
