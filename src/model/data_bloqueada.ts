import { DataTypes, Model } from "sequelize";
import { IDataBloqueada } from "../types/intefaces";
import sequelize from "../data";

class DataBloqueada extends Model<IDataBloqueada> {}

DataBloqueada.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_conta: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    dia: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    mes: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    criado_por: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize: sequelize,
    tableName: "datas_bloqueadas",
  }
);

export default DataBloqueada;
