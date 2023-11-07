import { DataTypes, Model } from "sequelize";
import { IPermissao } from "../types/intefaces";
import sequelize from "../data";
import { EPermissaoAcesso } from "../types/enum";

class Permissao extends Model<IPermissao> {}

Permissao.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_conta: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_acesso: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    permissao: {
      type: DataTypes.ENUM(
        EPermissaoAcesso.GERENCIAR_ACESSOS,
        EPermissaoAcesso.GERENCIAR_PERMISSOES,
        EPermissaoAcesso.GERENCIAR_RESPONSAVEIS,
        EPermissaoAcesso.GERENCIAR_BANCOS,
        EPermissaoAcesso.GERENCIAR_CONTAS_BANCARIAS,
        EPermissaoAcesso.GERENCIAR_CHEQUES,
        EPermissaoAcesso.VISUALIZACAO_TOTAL,
        EPermissaoAcesso.GERENCIAR_DATAS_BLOQUEADAS
      ),
      allowNull: false,
    },
    criado_por: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize: sequelize,
    tableName: "permissoes",
  }
);

export default Permissao;
