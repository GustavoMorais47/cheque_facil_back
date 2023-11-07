import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { TPayload } from "../types/types";
import Acesso from "../model/acesso";
import Conta from "../model/conta";
import logger from "../utils/logs";

export default async function login(req: Request, res: Response) {
  try {
    const notificationToken = req.headers.notificationToken as string | undefined;
    const { cpf, senha, deslogar } = req.body;

    if (!cpf || !senha)
      return res.status(400).json({ mensagem: "CPF e senha são obrigatórios" });

    if (typeof deslogar !== "boolean")
      return res
        .status(400)
        .json({ mensagem: "Deslogar deve ser do tipo boolean" });

    if (typeof cpf !== "string" || typeof senha !== "string")
      return res
        .status(400)
        .json({ mensagem: "CPF e senha devem ser do tipo string" });

    if (cpf.length !== 11 || isNaN(Number(cpf)))
      return res.status(400).json({ mensagem: "CPF inválido" });

    if (notificationToken && typeof notificationToken !== "string")
      return res
        .status(400)
        .json({ mensagem: "Token de notificação é inválido" });

    const acesso = await Acesso.findOne({ where: { cpf } });

    if (!acesso)
      return res.status(400).json({ mensagem: "Usuário não encontrado" });

    if (acesso.dataValues.status === false)
      return res.status(400).json({ mensagem: "Usuário desativado" });

    if (!deslogar && notificationToken && acesso.dataValues.token && acesso.dataValues.token !== notificationToken)
      return res.status(400).json({ mensagem: "Usuário já está logado" });

    const conta = await Conta.findByPk(acesso.dataValues.id_conta);

    if (!conta)
      return res.status(404).json({ mensagem: "Conta não encontrada" });

    if (conta.dataValues.status === false)
      return res.status(404).json({ mensagem: "Conta desativada" });

    const match = bcrypt.compareSync(senha, acesso.dataValues.senha);

    if (!match)
      return res.status(400).json({ mensagem: "CPF ou senha inválidos" });

    const payload: TPayload = {
      id: acesso.dataValues.id!,
    };

    const token = jwt.sign(payload, conta.dataValues.chave_jwt);

    notificationToken && (await acesso.update({ token: notificationToken }));

    return res.status(200).json({
      mensagem: "Login realizado com sucesso",
      token,
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ erro: "Erro interno do servidor" });
  }
}
