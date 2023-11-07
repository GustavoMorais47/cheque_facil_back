import { Router } from "express";
import { getDatasBloqueadas } from "../controllers/data_bloqueada/get";
import { postDataBloqueada } from "../controllers/data_bloqueada/post";
import { putDataBloqueada } from "../controllers/data_bloqueada/put";
import { deleteDataBloqueada } from "../controllers/data_bloqueada/delete";
import { EPermissaoAcesso } from "../types/enum";
import permissao from "../utils/permissao";

const data_bloqueada_router = Router();

data_bloqueada_router.get(
  "/",
  (req, res, next) =>
    permissao(req, res, next, [EPermissaoAcesso.GERENCIAR_DATAS_BLOQUEADAS]),
  getDatasBloqueadas
);
data_bloqueada_router.post(
  "/",
  (req, res, next) =>
    permissao(req, res, next, [EPermissaoAcesso.GERENCIAR_DATAS_BLOQUEADAS]),
  postDataBloqueada
);
data_bloqueada_router.put(
  "/:id",
  (req, res, next) =>
    permissao(req, res, next, [EPermissaoAcesso.GERENCIAR_DATAS_BLOQUEADAS]),
  putDataBloqueada
);
data_bloqueada_router.delete(
  "/:id",
  (req, res, next) =>
    permissao(req, res, next, [EPermissaoAcesso.GERENCIAR_DATAS_BLOQUEADAS]),
  deleteDataBloqueada
);

export default data_bloqueada_router;
