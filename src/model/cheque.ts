import { DataTypes, Model } from "sequelize";
import { ICheque } from "../types/intefaces";
import sequelize from "../data";
import { EOperacaoCheque, EStatusCheque } from "../types/enum";

class Cheque extends Model<ICheque> {}

Cheque.init(
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
    id_conta_bancaria: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_responsavel: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    operacao: {
      type: DataTypes.ENUM(EOperacaoCheque.A_PAGAR),
      allowNull: false,
    },
    numero: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    valor: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    data_emissao: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    data_vencimento: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    data_pagamento: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    destinatario: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    descricao: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(
        EStatusCheque.A_VENCER,
        EStatusCheque.VENCIDO,
        EStatusCheque.PAGO,
        EStatusCheque.DEVOLVIDO
      ),
      allowNull: false,
    },
    motivo_devolucao: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    criado_por: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize: sequelize,
    tableName: "cheques",
  }
);

export default Cheque;
