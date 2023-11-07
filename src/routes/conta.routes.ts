import { Router } from "express";
import permissao from "../utils/permissao";
import { EPermissaoAcesso } from "../types/enum";
import { getContaBancaria, getContasBancarias } from "../controllers/conta/get";
import { postContaBancaria } from "../controllers/conta/post";
import { putContaBancaria } from "../controllers/conta/put";
import deleteContaBancaria from "../controllers/conta/delete";

const conta_router = Router();

conta_router.get("/", getContasBancarias);
conta_router.get("/:id", getContaBancaria);
conta_router.post(
  "/",
  (req, res, next) =>
    permissao(req, res, next, [EPermissaoAcesso.GERENCIAR_CONTAS_BANCARIAS]),
  postContaBancaria
);
conta_router.put(
  "/:id",
  (req, res, next) =>
    permissao(req, res, next, [EPermissaoAcesso.GERENCIAR_CONTAS_BANCARIAS]),
  putContaBancaria
);
conta_router.delete(
  "/:id",
  (req, res, next) =>
    permissao(req, res, next, [EPermissaoAcesso.GERENCIAR_CONTAS_BANCARIAS]),
  deleteContaBancaria
);

export default conta_router;
