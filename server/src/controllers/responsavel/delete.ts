import { Request, Response } from "express";
import { TPayloadBack } from "../../types/types";
import Responsavel from "../../model/responsavel";
import Cheque from "../../model/cheque";
import Acesso from "../../model/acesso";
import logger from "../../utils/logs";

export async function deleteResponsavel(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { payload }: { payload: TPayloadBack } = req.body;

    if (!id) return res.status(400).json({ mensagem: "O id é obrigatório" });

    if (isNaN(Number(id)))
      return res.status(400).json({ mensagem: "O id deve ser um número" });

    const responsavel = await Responsavel.findOne({
      where: {
        id,
        id_conta: payload.conta.dataValues.id!,
      },
    });

    if (!responsavel)
      return res.status(400).json({ mensagem: "Responsável não encontrado" });

    const qtdCheques = await Cheque.count({
      where: {
        id_conta: payload.conta.dataValues.id!,
        id_responsavel: responsavel.dataValues.id,
      },
    });

    const qtdAcesso = await Acesso.count({
      where: {
        id_conta: payload.conta.dataValues.id!,
        id_responsavel: responsavel.dataValues.id,
      },
    });

    if (qtdCheques > 0 || qtdAcesso > 0)
      await Responsavel.update(
        {
          status: false,
        },
        {
          where: {
            id,
            id_conta: payload.conta.dataValues.id!,
          },
        }
      );

    if (qtdCheques > 0)
      return res
        .status(400)
        .json({
          mensagem:
            "Responsável possui cheques vinculados. O status do responsável foi alterado para inativo",
        });

    if (qtdAcesso > 0)
      return res
        .status(400)
        .json({
          mensagem:
            "Responsável possui acessos vinculados. O status do responsável foi alterado para inativo",
        });

    await Responsavel.destroy({
      where: {
        id,
        id_conta: payload.conta.dataValues.id!,
      },
    });

    return res
      .status(200)
      .json({ mensagem: "Responsável deletado com sucesso" });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
}
