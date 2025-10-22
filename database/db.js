import { Sequelize } from 'sequelize';

// --- SUAS CONFIGURAÇÕES ---
// 1. Altere 'seu_banco' para o nome do banco que você criou (ex: 'projeto_sesi_db')
// 2. Altere 'root' se o seu usuário do MySQL for outro.

const dbName = 'atividade_produtos';
const dbUser = 'root';
const dbPass = '';
const dbHost = 'localhost';
const dbPort = 3309;

// ---------------------------

const db = new Sequelize(dbName, dbUser, dbPass, {
  host: dbHost,
  port: dbPort,
  dialect: 'mysql'
});

try {
  await db.authenticate();
  console.log(`Conexão com o banco '${dbName}' na porta ${dbPort} estabelecida.`);
} catch (error) {
  console.error('Não foi possível conectar ao banco de dados:', error);
}

export default db;