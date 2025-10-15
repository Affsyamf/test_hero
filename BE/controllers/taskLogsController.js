const { Pool } = require('pg');
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,  
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const getTaskLogs = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT task_logs.id, task_logs.action, task_logs.created_at, tasks.title
      FROM task_logs
      JOIN tasks ON task_logs.task_id = tasks.id
      WHERE tasks.user_id = $1
      ORDER BY task_logs.created_at DESC;
    `, [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    console.error("Error saat mengambil task logs:", err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = { getTaskLogs };
