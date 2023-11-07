import { NextFunction, Request, Response, Router } from "express";
import { getResponsaveis } from "../controllers/responsavel/get";
import permissao from "../utils/permissao";
import { EPermissaoAcesso } from "../types/enum";
import { postResponsavel } from "../controllers/responsavel/post";
import { deleteResponsavel } from "../controllers/responsavel/delete";
import { putResponsavel } from "../controllers/responsavel/put";

const responsavel_router = Router();

responsavel_router.get("/", getResponsaveis);
responsavel_router.post(
  "/",
  (req: Request, res: Response, next: NextFunction) =>
    permissao(req, res, next, [EPermissaoAcesso.GERENCIAR_RESPONSAVEIS]),
  postResponsavel
);
responsavel_router.put(
  "/:id",
  (req: Request, res: Response, next: NextFunction) =>
    permissao(req, res, next, [EPermissaoAcesso.GERENCIAR_RESPONSAVEIS]),
  putResponsavel
);
responsavel_router.delete(
  "/:id",
  (req: Request, res: Response, next: NextFunction) =>
    permissao(req, res, next, [EPermissaoAcesso.GERENCIAR_RESPONSAVEIS]),
  deleteResponsavel
);

export default responsavel_router;
