import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { TPayload, TPayloadBack } from "../types/types";
import Acesso from "../model/acesso";
import Conta from "../model/conta";
import Permissao from "../model/permissao";
import logger from "../utils/logs";

export default async function auth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authorization = req.headers["authorization"];
    const notificationToken = req.headers.notificationToken as string;

    if (!authorization)
      return res.status(401).json({ mensagem: "Acesso não autorizado!" });

    const barer = authorization.split(" ")[0];
    const token = authorization.split(" ")[1];

    if (barer !== "Bearer")
      return res.status(401).json({ mensagem: "Acesso não autorizado!" });

    if (!token)
      return res.status(401).json({ mensagem: "Acesso não autorizado!" });

    if (notificationToken && typeof notificationToken !== "string")
      return res
        .status(401)
        .json({ mensagem: "Token de notificação é inválido" });

    const decoded = jwt.decode(token);

    if (!decoded)
      return res.status(401).json({ mensagem: "Acesso não autorizado!" });

    const decodedPayload = decoded as TPayload;

    const acesso = await Acesso.findOne({ where: { id: decodedPayload.id } });
    if (!acesso)
      return res.status(401).json({ mensagem: "Acesso não autorizado!" });

    if (!acesso.dataValues.status)
      return res.status(401).json({ mensagem: "Acesso não autorizado!" });

    if (
      acesso.dataValues.token &&
      notificationToken &&
      acesso.dataValues.token !== notificationToken
    )
      return res.status(401).json({ mensagem: "Acesso não autorizado!" });

    const conta = await Conta.findOne({
      where: { id: acesso.dataValues.id_conta },
    });

    if (!conta)
      return res.status(401).json({ mensagem: "Acesso não autorizado!" });

    if (!conta.dataValues.status)
      return res.status(401).json({ mensagem: "Acesso não autorizado!" });

    const payload = jwt.verify(token, conta.dataValues.chave_jwt);

    if (!payload)
      return res.status(401).json({ mensagem: "Acesso não autorizado!" });

    const permissoes = await Permissao.findAll({
      where: {
        id_acesso: acesso.dataValues.id,
        id_conta: acesso.dataValues.id_conta,
      },
    });

    const payloadBack: TPayloadBack = {
      id: acesso.dataValues.id!,
      conta: conta,
      permissao: permissoes.map((permissao) => permissao.dataValues.permissao),
    };

    req.body.payload = payloadBack;

    return next();
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
}
