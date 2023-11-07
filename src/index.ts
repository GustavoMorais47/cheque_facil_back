import "dotenv/config";
import express from "express";
import sequelize from "./data";
import router from "./routes/index.routes";
import cron from "node-cron";
import tarefas from "./utils/tarefas";
import fs from "fs";
import logger from "./utils/logs";
import readOnly from "./middleware/readOnly";
import moment from "moment";

const app = express();
const PORT = Number(process.env.PORT) || 8084;
const PATH_LOGS = process.env.PATH_LOGS as string;
const PATH_BACKUP = process.env.PATH_BACKUP as string;

app.use(express.json());
app.use(readOnly);
app.use("/", router);
app.get("/", (_, res) => res.sendStatus(200));
if (!fs.existsSync(PATH_LOGS)) {
  fs.mkdirSync(PATH_LOGS);
}
if (!fs.existsSync(PATH_BACKUP)) {
  fs.mkdirSync(PATH_BACKUP);
}

function main() {
  sequelize
    .authenticate()
    .then(async () => {
      sequelize
        .sync({ alter: true })
        .then(() => {
          console.log("✅ Banco de dados sincronizado");
        })
        .catch((err) => {
          console.log(`❌ Erro ao sincronizar o banco de dados`);
          logger.error(err);
          process.exit(1);
        });
      app.listen(PORT, () => {
        cron.schedule("0 0 * * *", tarefas.statusCheque);
        cron.schedule("0 7 1 * *", tarefas.notificacao.mensal);
        cron.schedule("30 7 * * 1", tarefas.notificacao.semanal);
        cron.schedule("0 8 * * *", tarefas.notificacao.diaria);
        cron.schedule("0 1 * * *", tarefas.backup);
        tarefas.backup();
        console.log(`✅ Servidor iniciado na porta ${PORT}`);
        logger.info(
          `✅ Servidor iniciado na porta ${PORT} as ${moment().format(
            "DD/MM/YYYY HH:mm:ss"
          )} `
        );
      });
    })
    .catch((err) => {
      console.log(`❌ Erro ao conectar ao banco de dados`);
      logger.error(err);
      process.exit(1);
    });
}

main();
