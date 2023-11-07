import { DataTypes, Model } from "sequelize";
import { IContaBancaria } from "../types/intefaces";
import sequelize from "../data";

class ContaBancaria extends Model<IContaBancaria> {}

ContaBancaria.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    id_conta: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_banco: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    agencia: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    conta: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    criado_por: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize: sequelize,
    tableName: "contas_bancarias",
  }
);

export default ContaBancaria;
