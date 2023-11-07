import { Request, Response } from "express";
import { TPayloadBack } from "../../types/types";
import { EPermissaoAcesso } from "../../types/enum";
import Permissao from "../../model/permissao";
import logger from "../../utils/logs";

export async function putPermissao(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { permissoes } = req.body;
    const { payload }: { payload: TPayloadBack } = req.body;

    if (!id) return res.status(400).json({ mensagem: "Id não informado" });

    if (isNaN(Number(id)))
      return res.status(400).json({ mensagem: "Id inválido" });

    if (!permissoes)
      return res.status(400).json({ mensagem: "Permissões não informadas" });

    if (!Array.isArray(permissoes))
      return res.status(400).json({ mensagem: "Permissões inválidas" });

    for (const permissao of permissoes) {
      if (
        permissao !== EPermissaoAcesso.GERENCIAR_ACESSOS &&
        permissao !== EPermissaoAcesso.GERENCIAR_PERMISSOES &&
        permissao !== EPermissaoAcesso.GERENCIAR_RESPONSAVEIS &&
        permissao !== EPermissaoAcesso.GERENCIAR_BANCOS &&
        permissao !== EPermissaoAcesso.GERENCIAR_CONTAS_BANCARIAS &&
        permissao !== EPermissaoAcesso.GERENCIAR_CHEQUES &&
        permissao !== EPermissaoAcesso.VISUALIZACAO_TOTAL &&
        permissao !== EPermissaoAcesso.GERENCIAR_DATAS_BLOQUEADAS
      )
        return res
          .status(400)
          .json({ mensagem: `${permissao} não é uma permissão válida` });
    }

    const acesso = await Permissao.findOne({
      where: { id: Number(id), id_conta: payload.conta.dataValues.id },
    });

    if (!acesso)
      return res.status(404).json({ mensagem: "Acesso não encontrado" });

    const permissoesDB = await Permissao.findAll({
      where: { id_acesso: id, id_conta: payload.conta.dataValues.id },
    });

    const permissoesUsuario = permissoesDB.map(
      (permissao) => permissao.dataValues.permissao
    );

    const permissoesRemover = permissoesUsuario.filter(
      (permissao) => !permissoes.includes(permissao)
    );

    const permissoesAdicionar = permissoes.filter(
      (permissao) => !permissoesUsuario.includes(permissao)
    );

    for (const permissao of permissoesRemover) {
      await Permissao.destroy({
        where: {
          id_acesso: id,
          id_conta: payload.conta.dataValues.id,
          permissao,
        },
      });
    }

    for (const permissao of permissoesAdicionar) {
      await Permissao.create({
        id_acesso: Number(id),
        id_conta: payload.conta.dataValues.id!,
        permissao,
        criado_por: payload.id,
      });
    }

    return res
      .status(200)
      .json({ mensagem: "Permissões atualizadas com sucesso!" });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
}
