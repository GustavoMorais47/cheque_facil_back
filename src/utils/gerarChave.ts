import bycrypt from "bcrypt";
import crypto from "crypto";
import logger from "./logs";

export function gerarChave() {
  try {
    const round = Math.floor(Math.random() * (14 - 10 + 1) + 10);
    return bycrypt.genSaltSync(round);
  } catch (error) {
    logger.error(error);
  }
}

export function gerarChaveAcesso() {
  try {
    return crypto.randomBytes(10).toString("hex");
  } catch (error) {
    logger.error(error);
  }
}
