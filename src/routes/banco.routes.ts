import { Router } from "express";
import { getBancos } from "../controllers/banco/get";
import { postBanco } from "../controllers/banco/post";
import { putBanco } from "../controllers/banco/put";
import permissao from "../utils/permissao";
import { EPermissaoAcesso } from "../types/enum";
import { deleteBanco } from "../controllers/banco/delete";

const banco_router = Router();

banco_router.get("/", getBancos);
banco_router.post(
  "/",
  (req, res, next) => permissao(req, res, next, [EPermissaoAcesso.GERENCIAR_BANCOS]),
  postBanco
);
banco_router.put(
  "/:id",
  (req, res, next) => permissao(req, res, next, [EPermissaoAcesso.GERENCIAR_BANCOS]),
  putBanco
);
banco_router.delete(
  "/:id",
  (req, res, next) => permissao(req, res, next, [EPermissaoAcesso.GERENCIAR_BANCOS]),
  deleteBanco
);

export default banco_router;
