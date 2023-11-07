import { Router } from "express";
import { EPermissaoAcesso } from "../types/enum";
import permissao from "../utils/permissao";
import { putPermissao } from "../controllers/permissao/put";

const permissao_router = Router();

permissao_router.put(
  "/:id",
  (req, res, next) =>
    permissao(req, res, next, [EPermissaoAcesso.GERENCIAR_PERMISSOES]),
  putPermissao
);

export default permissao_router;
