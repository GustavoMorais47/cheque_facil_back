import { Router } from "express";
import permissao from "../utils/permissao";
import { EPermissaoAcesso } from "../types/enum";
import { postCheque } from "../controllers/cheque/post";
import { getCheque, getCheques } from "../controllers/cheque/get";
import { deleteCheque } from "../controllers/cheque/delete";
import { putCheque } from "../controllers/cheque/put";

const cheque_router = Router();

cheque_router.get("/", getCheques);
cheque_router.get("/:id", getCheque);
cheque_router.post(
  "/",
  (req, res, next) =>
    permissao(req, res, next, [EPermissaoAcesso.GERENCIAR_CHEQUES]),
  postCheque
);
cheque_router.put(
  "/:id",
  (req, res, next) =>
    permissao(req, res, next, [EPermissaoAcesso.GERENCIAR_CHEQUES]),
  putCheque
);
cheque_router.delete(
  "/:id",
  (req, res, next) =>
    permissao(req, res, next, [EPermissaoAcesso.GERENCIAR_CHEQUES]),
  deleteCheque
);

export default cheque_router;
