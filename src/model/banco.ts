import { DataTypes, Model } from "sequelize";
import { IBanco } from "../types/intefaces";
import sequelize from "../data";

class Banco extends Model<IBanco> {}

Banco.init(
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
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    codigo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    criado_por: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize: sequelize,
    tableName: "bancos",
  }
);

export default Banco;
