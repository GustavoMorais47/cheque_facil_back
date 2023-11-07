import { Request, Response } from "express";
import Acesso from "../../model/acesso";
import { TPayloadBack } from "../../types/types";
import logger from "../../utils/logs";

export async function deleteAcesso(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { payload }: { payload: TPayloadBack } = req.body;

    if (!id) return res.status(400).json({ mensagem: "ID não informado" });

    if (isNaN(Number(id)))
      return res.status(400).json({ mensagem: "ID inválido" });

    if (payload.conta.dataValues.id_acesso === Number(id))
      return res
        .status(400)
        .json({ mensagem: "Não é possivel deletar o acesso principal" });

    const acesso = await Acesso.findOne({
      where: { id, id_conta: payload.conta.dataValues.id },
    });

    if (!acesso)
      return res.status(404).json({ mensagem: "Acesso não encontrado" });

    await acesso.destroy();

    return res.status(200).json({ mensagem: "Acesso deletado com sucesso" });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
}
