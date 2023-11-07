import { Request, Response } from "express";
import Banco from "../../model/banco";
import { TPayloadBack } from "../../types/types";
import logger from "../../utils/logs";

export async function postBanco(req: Request, res: Response) {
  try {
    const { payload }: { payload: TPayloadBack } = req.body;
    const { nome, codigo } = req.body;

    if (!nome || !codigo)
      return res
        .status(400)
        .json({ mensagem: "Nome e código são obrigatórios" });

    if (typeof nome !== "string")
      return res.status(400).json({ mensagem: "Nome deve ser uma string" });

    if (
      isNaN(Number(codigo)) ||
      typeof codigo !== "string" ||
      codigo.length !== 3
    )
      return res
        .status(400)
        .json({ mensagem: "Código deve ser um número, no formato string" });

    const bancoExistente = await Banco.findOne({
      where: {
        codigo,
        id_conta: payload.conta.dataValues.id!,
      },
    });

    if (bancoExistente)
      return res.status(400).json({ mensagem: "Banco já cadastrado" });

    const banco = await Banco.build({
      id_conta: payload.conta.dataValues.id!,
      nome,
      codigo,
      criado_por: payload.id,
    });

    await banco.save();

    return res.status(200).json({
      mensagem: "Banco criado com sucesso",
      banco: {
        id: banco.dataValues.id,
        nome: banco.dataValues.nome,
        codigo: banco.dataValues.codigo,
      },
    });
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
