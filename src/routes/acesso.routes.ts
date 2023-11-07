import { Router } from "express";
import { getAcessos } from "../controllers/acesso/get";
import { deleteAcesso } from "../controllers/acesso/delete";
import { postAcesso } from "../controllers/acesso/post";
import { putAcesso } from "../controllers/acesso/put";
import permissao from "../utils/permissao";
import { EPermissaoAcesso } from "../types/enum";

const acesso_router = Router();

acesso_router.get(
  "/",
  (req, res, next) =>
    permissao(req, res, next, [EPermissaoAcesso.GERENCIAR_ACESSOS]),
  getAcessos
);
acesso_router.post(
  "/",
  (req, res, next) =>
    permissao(req, res, next, [EPermissaoAcesso.GERENCIAR_ACESSOS]),
  postAcesso
);
acesso_router.put(
  "/:id",
  (req, res, next) =>
    permissao(req, res, next, [EPermissaoAcesso.GERENCIAR_ACESSOS]),
  putAcesso
);
acesso_router.delete(
  "/:id",
  (req, res, next) =>
    permissao(req, res, next, [EPermissaoAcesso.GERENCIAR_ACESSOS]),
  deleteAcesso
);

export default acesso_router;
