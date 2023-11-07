import { Request, Response } from "express";
import * as cpfValidator from "cpf-cnpj-validator";
import validator from "validator";
import { gerarChave, gerarChaveAcesso } from "../utils/gerarChave";
import Conta from "../model/conta";
import Acesso from "../model/acesso";
import Permissao from "../model/permissao";
import { EPermissaoAcesso } from "../types/enum";
import bycrypt from "bcrypt";
import Responsavel from "../model/responsavel";
import DataBloqueada from "../model/data_bloqueada";
import { IDataBloqueada } from "../types/intefaces";
import Config from "../model/config";
import "moment/locale/pt-br";
import moment from "moment";
import logger from "../utils/logs";

moment.locale("pt-br");

function feriados(conta: number, acesso: number): IDataBloqueada[] {
  return [
    {
      dia: 1,
      mes: 1,
      id_conta: conta,
      criado_por: acesso,
    },
    {
      dia: 1,
      mes: 5,
      id_conta: conta,
      criado_por: acesso,
    },
    {
      dia: 7,
      mes: 9,
      id_conta: conta,
      criado_por: acesso,
    },
    {
      dia: 12,
      mes: 10,
      id_conta: conta,
      criado_por: acesso,
    },
    {
      dia: 15,
      mes: 11,
      id_conta: conta,
      criado_por: acesso,
    },
    {
      dia: 25,
      mes: 12,
      id_conta: conta,
      criado_por: acesso,
    },
  ];
}

export default async function registro(req: Request, res: Response) {
  try {
    const notificationToken = req.headers.notificationToken as string | undefined;
    const { nome, cpf, email, senha } = req.body;

    // Excluir quando for para produção individual
    const count = await Conta.count();

    if (count > 0)
      return res
        .status(400)
        .json({ mensagem: "Já existe uma conta cadastrada!" });

    if (notificationToken && typeof notificationToken !== "string")
      return res.status(400).json({ mensagem: "Token de notificação inválido" });

    if (!nome || !cpf || !email || !senha)
      return res.status(400).json({
        mensagem:
          "Informe todos os campos necessários! (nome, cpf, email, senha)",
      });

    if (typeof nome !== "string" || nome.length < 3)
      return res.status(400).json({
        mensagem:
          "O campo nome deve ser uma string com no mínimo 3 caracteres!",
      });

    if (!cpfValidator.cpf.isValid(cpf))
      return res
        .status(400)
        .json({ mensagem: "O campo cpf deve ser um cpf válido!" });

    if (!validator.isEmail(email))
      return res
        .status(400)
        .json({ mensagem: "O campo email deve ser um email válido!" });

    if (
      !validator.isStrongPassword(senha, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
    )
      return res.status(400).json({
        mensagem:
          "O campo senha deve conter no mínimo 8 caracteres, 1 letra maiúscula, 1 letra minúscula, 1 número e 1 símbolo!",
      });

    const chave = gerarChave();
    const chave_jwt = gerarChaveAcesso();

    if (!chave || !chave_jwt)
      return res.status(500).json({ mensagem: "Erro interno do servidor!" });

    const hash = bycrypt.hashSync(senha, chave);

    const conta = await Conta.create({
      chave,
      chave_jwt,
      status: true,
    });
    const responsavel = await Responsavel.create({
      id_conta: conta.dataValues.id!,
      nome,
      email,
      status: true,
      criado_por: null,
    });
    const acesso = await Acesso.create({
      id_conta: conta.dataValues.id!,
      id_responsavel: responsavel.dataValues.id!,
      nome,
      cpf,
      email,
      senha: hash,
      status: true,
      token: notificationToken ? notificationToken : null,
    });

    await conta.update({ id_acesso: acesso.dataValues.id! });

    await Config.create({
      id_conta: conta.dataValues.id!,
      permitir_cadastro_sabado: true,
      permitir_cadastro_domingo: true,
    });

    await Permissao.bulkCreate([
      {
        id_acesso: acesso.dataValues.id!,
        id_conta: conta.dataValues.id!,
        permissao: EPermissaoAcesso.GERENCIAR_ACESSOS,
        criado_por: null,
      },
      {
        id_acesso: acesso.dataValues.id!,
        id_conta: conta.dataValues.id!,
        permissao: EPermissaoAcesso.GERENCIAR_PERMISSOES,
        criado_por: null,
      },
      {
        id_acesso: acesso.dataValues.id!,
        id_conta: conta.dataValues.id!,
        permissao: EPermissaoAcesso.GERENCIAR_RESPONSAVEIS,
        criado_por: null,
      },
      {
        id_acesso: acesso.dataValues.id!,
        id_conta: conta.dataValues.id!,
        permissao: EPermissaoAcesso.GERENCIAR_BANCOS,
        criado_por: null,
      },
      {
        id_acesso: acesso.dataValues.id!,
        id_conta: conta.dataValues.id!,
        permissao: EPermissaoAcesso.GERENCIAR_CONTAS_BANCARIAS,
        criado_por: null,
      },
      {
        id_acesso: acesso.dataValues.id!,
        id_conta: conta.dataValues.id!,
        permissao: EPermissaoAcesso.GERENCIAR_CHEQUES,
        criado_por: null,
      },
      {
        id_acesso: acesso.dataValues.id!,
        id_conta: conta.dataValues.id!,
        permissao: EPermissaoAcesso.VISUALIZACAO_TOTAL,
        criado_por: null,
      },
      {
        id_acesso: acesso.dataValues.id!,
        id_conta: conta.dataValues.id!,
        permissao: EPermissaoAcesso.GERENCIAR_DATAS_BLOQUEADAS,
        criado_por: null,
      },
    ]);

    await DataBloqueada.bulkCreate(
      feriados(conta.dataValues.id!, acesso.dataValues.id!)
    );

    return res.status(201).json({ mensagem: "Conta criada com sucesso!" });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ mensagem: "Erro interno do servidor!" });
  }
}
