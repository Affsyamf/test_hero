require('dotenv').config({ path: './.env' });
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

//Middleware jwt
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token tidak ditemukan' });

  const secretKey = process.env.JWT_SECRET || 'default_secret_key';

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token tidak valid' });
    req.user = user;
    next();
  });
};


const taskLogsRoutes = require('./routes/taskLogsRoutes');
app.use('/api/task-logs', authenticateToken, taskLogsRoutes);

//koneksi database
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

//cej db
const checkDatabaseConnection = async () => {
  try {
    await pool.connect();
    console.log('Koneksi ke database berhasil!');
  } catch (err) {
    console.error('KONEKSI DATABASE GAGAL:', err.message);
  }
};

//rute lgin
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const userResult = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (userResult.rows.length === 0)
      return res.status(400).json({ message: 'Username atau password salah' });

    const user = userResult.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword)
      return res.status(400).json({ message: 'Username atau password salah' });

    const secret = process.env.JWT_SECRET || 'default_secret_key';
    const accessToken = jwt.sign(
      { id: user.id, username: user.username },
      secret,
      { expiresIn: '1h' }
    );

    res.json({ accessToken });
  } catch (err) {
    console.error('Error saat login:', err.message);
    res.status(500).send('Server Error');
  }
});


//GET semua tugas
app.get('/api/tasks', authenticateToken, async (req, res) => {
  const { status } = req.query;
  let query = 'SELECT * FROM tasks WHERE user_id = $1';
  const queryParams = [req.user.id];

  if (status && status !== 'Semua') {
    query += ' AND status = $2';
    queryParams.push(status);
  }

  query += ' ORDER BY created_at DESC';

  try {
    const result = await pool.query(query, queryParams);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//post log 
app.post('/api/task-logs', authenticateToken, async (req, res) => {
  const { task_id, action } = req.body;
  try {
    await pool.query(
      'INSERT INTO task_logs (task_id, action) VALUES ($1, $2)',
      [task_id, action]
    );
    res.status(201).json({ message: 'Log berhasil dibuat' });
  } catch (err) {
    console.error('Error saat membuat log:', err.message);
    res.status(500).send('Server Error');
  }
});

//buat tugas baru
app.post('/api/tasks', authenticateToken, async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { title, description, assignee_name, start_date, due_date } = req.body;
    const user_id = req.user.id;

    const newTaskQuery = `
      INSERT INTO tasks (title, description, assignee_name, start_date, due_date, user_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, title, status
    `;
    const taskValues = [title, description, assignee_name, start_date, due_date, user_id];
    const newTaskResult = await client.query(newTaskQuery, taskValues);
    const newTask = newTaskResult.rows[0];

    //Log pembuatan tugas
    const logAction = `Tugas "${title}" telah dibuat oleh ${req.user.username}.`;
    await client.query('INSERT INTO task_logs (task_id, action) VALUES ($1, $2)', [newTask.id, logAction]);

    await client.query('COMMIT');
    res.status(201).json({ message: 'Tugas berhasil dibuat', task: newTask });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error saat membuat tugas:', err.message);
    res.status(500).send('Server Error');
  } finally {
    client.release();
  }
});

// update tugas
app.put('/api/tasks/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, description, assignee_name, status, start_date, due_date } = req.body;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const oldTaskResult = await client.query('SELECT * FROM tasks WHERE id = $1 AND user_id = $2', [id, req.user.id]);
    if (oldTaskResult.rows.length === 0)
      return res.status(404).json({ message: 'Tugas tidak ditemukan atau Anda tidak punya akses.' });

  const oldTask = oldTaskResult.rows[0];
  const normalizeDate = (dateString) => {
  if (!dateString) return null;
  return dateString.split('T')[0] || dateString;
};

const fixedStartDate = normalizeDate(start_date);
const fixedDueDate = normalizeDate(due_date);

    const updateQuery = `
      UPDATE tasks
      SET title=$1, description=$2, assignee_name=$3, status=$4, start_date=$5, due_date=$6
      WHERE id=$7 RETURNING *
    `;

    const updatedTaskResult = await client.query(updateQuery, [
      title,
      description,
      assignee_name,
      status,
      fixedStartDate,
      fixedDueDate,
      id,
    ]);

    //Log perubahan status
    if (oldTask.status !== status) {
      const logAction = `Status tugas "${oldTask.title}" diubah dari "${oldTask.status}" menjadi "${status}".`;
      await client.query('INSERT INTO task_logs (task_id, action) VALUES ($1, $2)', [id, logAction]);
    }

    await client.query('COMMIT');
    res.json({ message: 'Tugas berhasil diperbarui', task: updatedTaskResult.rows[0] });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error saat memperbarui tugas:', err.message);
    res.status(500).send('Server Error');
  } finally {
    client.release();
  }
});

//hapus tugas
app.delete('/api/tasks/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const result = await client.query('SELECT title FROM tasks WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );
    if (result.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Tugas tidak ditemukan atau Anda tidak punya akses.' });
    }

    const deletedTitle = result.rows[0].title;

    //Log penghapusan tugas
    const logAction = `Tugas "${deletedTitle}" telah dihapus oleh ${req.user.username}.`;
    await client.query('INSERT INTO task_logs (task_id, action) VALUES ($1, $2)', [id, logAction]);

     await client.query('DELETE FROM tasks WHERE id = $1 AND user_id = $2', [id, req.user.id]);
    await client.query('COMMIT');
    res.status(200).json({ message: 'Tugas berhasil dihapus' });
} catch (err) {
    await client.query('ROLLBACK');
    console.error('Error saat menghapus tugas:', err.message);
    res.status(500).send('Server Error');
  } finally {
    client.release();
  }
});

//GET ringkasan dashboard
app.get('/api/dashboard/summary', authenticateToken, async (req, res) => {
  try {
    const query = `
      SELECT
        COUNT(*) AS total_tasks,
        COUNT(*) FILTER (WHERE status = 'Sedang Dikerjakan') AS in_progress_tasks,
        COUNT(*) FILTER (WHERE status = 'Selesai') AS completed_tasks,
        COUNT(*) FILTER (WHERE status = 'Belum Dimulai') AS pending_tasks
      FROM tasks
      WHERE user_id = $1;
    `;
    const result = await pool.query(query, [req.user.id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error saat mengambil ringkasan dashboard:', err.message);
    res.status(500).send('Server Error');
  }
});

//semua log tugas
app.get('/api/task-logs/:task_id', authenticateToken, async (req, res) => {
  const { task_id } = req.params;
  try {
    // Pastikan tugas milik user ini
    const taskCheck = await pool.query('SELECT id FROM tasks WHERE id = $1 AND user_id = $2', [task_id, req.user.id]);
    if (taskCheck.rows.length === 0) {
      return res.status(403).json({ message: 'Anda tidak memiliki akses ke log tugas ini.' });
    }

    //ambil log tugas
    const logsResult = await pool.query(
      'SELECT id, action, created_at FROM task_logs WHERE task_id = $1 ORDER BY created_at DESC',
      [task_id]
    );

    res.json(logsResult.rows);
  } catch (err) {
    console.error('Error saat mengambil log tugas:', err.message);
    res.status(500).send('Server Error');
  }
});

//run server
const startServer = async () => {
  await checkDatabaseConnection();
  app.listen(port, () => {
    console.log(`🚀 Server berjalan di http://localhost:${port}`);
  });
};

startServer();
