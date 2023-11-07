import { Sequelize } from "sequelize";

const db_host = process.env.MYSQL_HOST as string;
const db_name = process.env.MYSQL_DATABASE as string;
const db_user = process.env.MYSQL_USER as string;
const db_pass = process.env.MYSQL_PASSWORD as string;

const sequelize = new Sequelize(db_name, db_user, db_pass, {
  host: db_host,
  dialect: "mysql",
  logging: false
});

export default sequelize;
