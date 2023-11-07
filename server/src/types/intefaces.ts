import { EPermissaoAcesso, EStatusCheque, EOperacaoCheque } from "./enum";

export interface IConta {
  id?: number;
  id_acesso?: number;
  chave: string;
  chave_jwt: string;
  status: boolean;
}

export interface IConfig{
  id_conta: number;
  permitir_cadastro_sabado: boolean;
  permitir_cadastro_domingo: boolean;
}

export interface IAcesso {
  id?: number;
  id_conta: number;
  id_responsavel: number | null;
  token: string | null;
  nome: string;
  cpf: string;
  email: string;
  senha: string;
  status: boolean;
  criado_por: number | null;
  createdAt?: Date;
}

export interface IPermissao {
  id?: number;
  id_conta: number;
  id_acesso: number;
  permissao: EPermissaoAcesso;
  criado_por: number | null;
}

export interface IBanco {
  id?: number;
  id_conta: number;
  nome: string;
  codigo: string;
  criado_por: number;
}

export interface IContaBancaria {
  id?: number;
  id_conta: number;
  id_banco: number;
  agencia: string;
  conta: string;
  status: boolean;
  criado_por: number;
}

export interface IResponsavel {
  id?: number;
  id_conta: number;
  nome: string;
  email: string | null;
  status: boolean;
  criado_por: number | null;
}

export interface ICheque {
  id?: number;
  id_conta: number;
  id_conta_bancaria: number;
  id_responsavel: number;
  operacao: EOperacaoCheque;
  numero: string;
  valor: number;
  data_emissao: Date;
  data_vencimento: Date | null;
  data_pagamento: Date | null;
  destinatario: string | null;
  descricao: string | null;
  status: EStatusCheque;
  criado_por: number;
}

export interface IDataBloqueada {
  id?: number;
  id_conta: number;
  dia: number;
  mes: number;
  criado_por: number;
}
