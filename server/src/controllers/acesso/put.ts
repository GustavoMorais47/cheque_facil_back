import { Request, Response } from "express";
import Acesso from "../../model/acesso";
import { TPayloadBack } from "../../types/types";
import validator from "validator";
import Responsavel from "../../model/responsavel";
import logger from "../../utils/logs";

export async function putAcesso(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { nome, email, status, id_responsavel } = req.body;
    const { payload }: { payload: TPayloadBack } = req.body;

    if (!id)
      return res.status(400).json({
        mensagem: "Informe todos os campos necessários! (id)",
      });

    if (isNaN(Number(id)))
      return res.status(400).json({
        mensagem: "O campo id deve ser um número!",
      });

    if (!nome || status === undefined || !email)
      return res.status(400).json({
        mensagem: "Informe todos os campos necessários! (nome, status, email)",
      });

    if (typeof nome !== "string" || nome.length < 3)
      return res.status(400).json({
        mensagem:
          "O campo nome deve ser uma string com no mínimo 3 caracteres!",
      });

    if (!validator.isEmail(email))
      return res
        .status(400)
        .json({ mensagem: "O campo email deve ser um email válido!" });

        if (id_responsavel && typeof id_responsavel !== "number")
      return res
        .status(400)
        .json({ mensagem: "O campo id_responsavel deve ser um número!" });

    let responsavel: any = null;

    if (id_responsavel) {
      const responsavelDB = await Responsavel.findOne({
        where: {
          id: id_responsavel,
          id_conta: payload.conta.dataValues.id!,
        },
      });

      if (!responsavelDB)
        return res
          .status(400)
          .json({ mensagem: "Responsável não encontrado!" });

      responsavel = responsavelDB.dataValues;
    }

    if (typeof status !== "boolean")
      return res
        .status(400)
        .json({ mensagem: "O campo status deve ser um booleano!" });

    const acesso = await Acesso.findOne({
      where: {
        id_conta: payload.conta.dataValues.id!,
        id: Number(id),
      },
    });

    if (!acesso)
      return res.status(404).json({
        mensagem: "Acesso não encontrado!",
      });

    await Acesso.update(
      {
        nome,
        email,
        status,
        id_responsavel: responsavel ? responsavel.id : null
      },
      {
        where: {
          id_conta: payload.conta.dataValues.id!,
          id: Number(id),
        },
      }
    );

    return res.status(201).json({ mensagem: "Acesso atualizado com sucesso" });
  } catch (error) {
    const erro: any = error;
    if (erro.name === "SequelizeUniqueConstraintError") {
      if (erro.errors[0].type === "unique violation")
        return res.status(400).json({ mensagem: "CPF já cadastrado!" });
    }
    logger.error(error);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
}
