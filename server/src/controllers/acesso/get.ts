import { Request, Response } from "express";
import { TPayloadBack } from "../../types/types";
import { EPermissaoAcesso } from "../../types/enum";
import Acesso from "../../model/acesso";
import Permissao from "../../model/permissao";
import { Op } from "sequelize";
import logger from "../../utils/logs";

export async function getAcessos(req: Request, res: Response) {
  try {
    const { payload }: { payload: TPayloadBack } = req.body;

    const acessosDB = await Acesso.findAll({
      where: {
        id_conta: payload.conta.dataValues.id!,
        id: {
          [Op.ne]: payload.conta.dataValues.id_acesso!, // Não retornar o acesso do responsável
        },
      },
      attributes: [
        "id",
        "id_conta",
        "id_responsavel",
        "nome",
        "cpf",
        "email",
        "status",
      ],
    });

    const acessos = acessosDB.map((acesso) => acesso.dataValues);

    const acessoFinal: {
      id: number;
      id_responsavel: number | null;
      nome: string;
      cpf: string;
      email: string;
      permissoes: EPermissaoAcesso[];
      status: boolean;
    }[] = [];

    for (const acesso of acessos) {
      const permissoesDB = await Permissao.findAll({
        where: {
          id_conta: payload.conta.dataValues.id!,
          id_acesso: acesso.id,
        },
        attributes: ["permissao"],
      });

      const permissoes = permissoesDB.map(
        (permissao) => permissao.dataValues.permissao
      );

      acessoFinal.push({
        id: acesso.id!,
        id_responsavel: acesso.id_responsavel,
        nome: acesso.nome,
        cpf: acesso.cpf,
        email: acesso.email,
        permissoes: permissoes,
        status: acesso.status,
      });
    }

    return res.status(200).json(acessoFinal);
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ mensagem: "Erro interno do servidor." });
  }
}
