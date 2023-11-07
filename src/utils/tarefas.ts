import moment from "moment";
import Conta from "../model/conta";
import Cheque from "../model/cheque";
import { EStatusCheque } from "../types/enum";
import { Op } from "sequelize";
import "moment/locale/pt-br";
import logger from "./logs";
import { exec } from "child_process";

moment.locale("pt-br");

const MYSQL_DATABASE = process.env.MYSQL_DATABASE;
const MYSQL_USER = process.env.MYSQL_USER;
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD;
const PATH_BACKUP = process.env.PATH_BACKUP;

async function statusCheque() {
  try {
    const contasDB = await Conta.findAll({
      where: {
        status: true,
      },
    });
    const contas = contasDB.map((conta) => conta.dataValues);
    const hoje = moment();
    for (const conta of contas) {
      const chequesDB = await Cheque.findAll({
        where: {
          id_conta: conta.id,
          data_vencimento: {
            [Op.ne]: null,
          },
          data_pagamento: null,
          status: EStatusCheque.A_VENCER,
        },
      });

      const cheques = chequesDB.map((cheque) => cheque.dataValues);

      for (const cheque of cheques) {
        const dataVencimento = moment(cheque.data_vencimento);
        if (hoje.isAfter(dataVencimento)) {
          await Cheque.update(
            {
              status: EStatusCheque.VENCIDO,
            },
            {
              where: {
                id: cheque.id,
                id_conta: conta.id,
              },
            }
          );
        }
      }
    }
  } catch (error) {
    logger.error(`Erro ao atualizar status dos cheques: ${error}`);
  }
}

async function notificacaoDiaria() {}

async function notificacaoSemanal() {}

async function notificacaoMensal() {}

const notificacao = {
  diaria: notificacaoDiaria,
  semanal: notificacaoSemanal,
  mensal: notificacaoMensal,
};

async function backup() {
  const horario = moment()
    .format("DD-MM-YYYY HH:mm:ss")
    .replace(/:/g, "_")
    .replace(/ /g, "_")
    .replace(/-/g, "_");
  const arquivo = `${PATH_BACKUP}\\${horario}.sql`;
  const command =
    "mysqldump -u " +
    MYSQL_USER +
    ' -p"' +
    MYSQL_PASSWORD +
    '" ' +
    MYSQL_DATABASE +
    ' > "' +
    arquivo +
    '"';

  try {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.log(`❌ Erro ao realizar backup do banco de dados`);
        logger.error({
          message: `Erro ao realizar backup do banco de dados`,
          error,
          path: PATH_BACKUP,
        });
        return;
      }
      console.log(`✅ Backup realizado com sucesso as ${horario}`);
      logger.info({
        message: `Backup realizado com sucesso`,
        path: PATH_BACKUP,
      });
    });
  } catch (error) {
    logger.error({
      message: `Erro ao realizar backup do banco de dados`,
      error,
      path: PATH_BACKUP,
    });
  }
}
export default {
  statusCheque,
  notificacao,
  backup,
};
