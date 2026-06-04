import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const [rows] = await conn.execute('SELECT * FROM leads WHERE slug = ?', ['la-letizia-dubai-marina']);
if (rows.length > 0) {
  const lead = rows[0];
  console.log(JSON.stringify(lead, null, 2));
}
await conn.end();
