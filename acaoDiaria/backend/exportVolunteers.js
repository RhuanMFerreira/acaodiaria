const fs = require('fs');
const { Parser } = require('json2csv');
const db = require('../backend/config/database'); // ou o caminho do seu arquivo de conexão MariaDB

// Função para buscar voluntários e exportar para CSV
async function exportVolunteersToCSV() {
  try {
    const [volunteers] = await db.query('SELECT * FROM volunteers');
    if (volunteers.length === 0) {
      console.log('Nenhum voluntário encontrado.');
      return;
    }

    const fields = ['id', 'name', 'email', 'message', 'created_at'];
    const opts = { fields };
    const parser = new Parser(opts);

    const csv = parser.parse(volunteers);

    fs.writeFileSync('voluntarios.csv', csv);

    console.log('Arquivo voluntarios.csv criado com sucesso!');
  } catch (error) {
    console.error('Erro ao exportar voluntários:', error);
  }
}

exportVolunteersToCSV();