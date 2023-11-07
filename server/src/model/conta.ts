import { DataTypes, Model } from "sequelize";
import { IConta } from "../types/intefaces";
import sequelize from "../data";

class Conta extends Model<IConta> {}

Conta.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_acesso: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    chave: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    chave_jwt: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
  },
  {
    sequelize: sequelize,
    tableName: "contas",
  }
);

export default Conta;
