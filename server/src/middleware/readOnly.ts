import { Request, Response, NextFunction } from "express";
import logger from "../utils/logs";
import sequelize from "../data";

export default async function readOnly(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await sequelize
      .query("SHOW VARIABLES LIKE 'read_only'")
      .then(([results, metadata]) => {
        const result: {
          Variable_name: string;
          Value: string;
        }[] = results as any;
        const readOnly = result[0].Value! as string;

        if (readOnly === "ON" && req.method !== "GET") {
          return res
            .status(403)
            .json({
              mensagem:
                "Apenas serviços de leitura estão disponíveis no momento. Tente novamente mais tarde.",
            });
        }
        return next();
      })
      .catch((error) => {
        logger.error(error);
        return res.status(500).json({ mensagem: "Erro interno do servidor" });
      });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
}
