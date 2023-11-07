import { Request, Response } from "express";
import { TPayloadBack } from "../../types/types";
import ContaBancaria from "../../model/conta_bancaria";
import Cheque from "../../model/cheque";
import logger from "../../utils/logs";

export default async function deleteContaBancaria(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { payload }: { payload: TPayloadBack } = req.body;

    if (!id) return res.status(400).json({ mensagem: "ID é obrigatório" });

    if (isNaN(Number(id)))
      return res.status(400).json({ mensagem: "ID deve ser um número" });

    const conta = await ContaBancaria.findOne({
      where: { id, id_conta: payload.conta.dataValues.id },
    });

    if (!conta)
      return res.status(404).json({ mensagem: "Conta não encontrado" });

    const qtdCheques = await Cheque.count({
      where: {
        id_conta_bancaria: conta.dataValues.id,
        id_conta: payload.conta.dataValues.id,
      },
    });

    if (qtdCheques > 0)
      return res
        .status(400)
        .json({
          mensagem:
            "Conta não pode ser excluída pois possui cheques vinculados",
        });

    await conta.destroy();

    return res.status(200).json({ mensagem: "Conta deletada com sucesso" });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
}
