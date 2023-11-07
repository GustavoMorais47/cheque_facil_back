import { Request, Response } from "express";
import Acesso from "../../model/acesso";
import { TPayloadBack } from "../../types/types";
import validator from "validator";
import * as cpfValidator from "cpf-cnpj-validator";
import bycrypt from "bcrypt";
import Responsavel from "../../model/responsavel";
import logger from "../../utils/logs";

export async function postAcesso(req: Request, res: Response) {
  try {
    const { nome, cpf, email, id_responsavel } = req.body;
    const { payload }: { payload: TPayloadBack } = req.body;
    if (!nome || !cpf || !email)
      return res.status(400).json({
        mensagem: "Informe todos os campos necessários! (nome, cpf, email)",
      });

    if (typeof nome !== "string" || nome.length < 3)
      return res.status(400).json({
        mensagem:
          "O campo nome deve ser uma string com no mínimo 3 caracteres!",
      });

    if (!cpfValidator.cpf.isValid(cpf) || typeof cpf !== "string")
      return res
        .status(400)
        .json({ mensagem: "CPF inválido!" });

    if (!validator.isEmail(email))
      return res
        .status(400)
        .json({ mensagem: "Email inválido!" });

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

    const qtdAcessos = await Acesso.count({
      where: {
        id_conta: payload.conta.dataValues.id!,
        cpf,
      },
    });

    if (qtdAcessos > 0)
      return res
        .status(400)
        .json({ mensagem: "Já existe um acesso com esse cpf!" });

    const hash = await bycrypt.hash(
      cpf.slice(0, 9),
      payload.conta.dataValues.chave
    );

    await Acesso.create({
      id_conta: payload.conta.dataValues.id!,
      id_responsavel: responsavel ? responsavel.id : null,
      nome,
      cpf,
      email,
      senha: hash,
      status: true,
      criado_por: payload.id,
    });

    return res.status(201).json({ mensagem: "Acesso criado com sucesso" });
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
