import { Request, Response } from "express";
import Banco from "../../model/banco";
import { TPayloadBack } from "../../types/types";
import logger from "../../utils/logs";

export async function putBanco(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { payload }: { payload: TPayloadBack } = req.body;
    const { nome } = req.body;

    if (!id)
      return res.status(400).json({ mensagem: "O campo id é obrigatório" });

    if (isNaN(Number(id)))
      return res
        .status(400)
        .json({ mensagem: "O campo id deve ser do tipo number" });

    if (!nome )
      return res
        .status(400)
        .json({ mensagem: "Nome é obrigatório" });

    if (typeof nome !== "string")
      return res.status(400).json({ mensagem: "Nome deve ser uma string" });

    const banco = await Banco.findOne({
      where: { id: Number(id), id_conta: payload.conta.dataValues.id },
    });

    if (!banco)
      return res.status(404).json({ mensagem: "Banco não encontrado" });

    await banco.update({ nome });

    return res.status(200).json({ mensagem: "Banco atualizado com sucesso" });
  } catch (error) {
    const erro: any = error;
    if (erro.errors && erro.errors[0].type === "unique violation") {
      return res
        .status(400)
        .json({ erro: `${erro.errors[0].path} já cadastrado` });
    } else {
      logger.error(error);
      return res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
  }
}
