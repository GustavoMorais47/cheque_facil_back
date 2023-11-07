import { DataTypes, Model } from "sequelize";
import { IConfig } from "../types/intefaces";
import sequelize from "../data";

class Config extends Model<IConfig> {}

Config.init(
  {
    id_conta: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    permitir_cadastro_sabado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    permitir_cadastro_domingo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    sequelize: sequelize,
    modelName: "configs",
  }
);

export default Config;
