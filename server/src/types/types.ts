import Conta from "../model/conta";
import { EPermissaoAcesso } from "./enum";

export type TPayload = {
  id: number;
};

export type TPayloadBack = {
  id: number;
  conta: Conta;
  permissao: EPermissaoAcesso[];
};
