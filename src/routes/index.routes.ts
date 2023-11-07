import { Router } from "express";
import banco_router from "./banco.routes";
import conta_router from "./conta.routes";
import cheque_router from "./cheque.routes";
import auth from "../middleware/auth";
import login from "../controllers/login";
import registro from "../controllers/registro";
import me from "../controllers/me";
import responsavel_router from "./responsavel.routes";
import acesso_router from "./acesso.routes";
import permissao_router from "./permissao.routes";
import data_bloqueada_router from "./data_bloqueada.routes";
import logout from "../controllers/logout";

const router = Router();

// Rotas que não precisam de autenticação
router.post("/login", login);
router.post("/registro", registro);
// Rotas que precisam de autenticação
router.get("/logout", auth, logout);
router.get("/ping-auth", auth, (_, res) => res.sendStatus(200));
router.get("/me", auth, me);
router.use("/acesso", auth, acesso_router);
router.use("/permissao", auth, permissao_router);
router.use("/banco", auth, banco_router);
router.use("/conta", auth, conta_router);
router.use("/responsavel", auth, responsavel_router);
router.use("/cheque", auth, cheque_router);
router.use("/data-bloqueada", auth, data_bloqueada_router); // falta

export default router;
