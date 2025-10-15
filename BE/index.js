require('dotenv').config({ path: './.env' });
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const app = express();
const port = process.env.PORT || 5001;

//middleware
app.use(cors());
app.use(express.json());

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,  
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

//proteksi rute token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401). json({ message: 'Token tidak ditemukan' });

    const secretKey = process.env.JWT_SECRET || 'default'

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.sendStatus(403).json({ message: 'Token tidak valid' });
        req.user = user;
        next();
    }
    );
};




const checkDatabaseConnection = async () => {
    try {
        await pool.connect();
        console.log('Koneksi ke database berhasil!');
    } catch (err) {
        console.error('KONEKSI DATABASE GAGAL:', err.message); 
    }
};

//rute authentikasi
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const userResult = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (userResult.rows.length === 0) {
            return res.status(400).json({ message: 'Username atau password salah' });
        }
        const user = userResult.rows[0];
        const secret = process.env  .JWT_SECRET || 'default';
        const accessToken = jwt.sign({ id: user.id, username: user.username }, secret, { expiresIn: '1h' });
        res.json({ accessToken });
    } catch (err) {
        console.error("errorsaat login", err.message);
        res.status(500).send('Server Error');
    }
});

//endpoint data tuags
app.get('/api/tasks', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
        res.json(result.rows);
    }catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

//enpoint jika ada tigas baru

app.post('/api/tasks', authenticateToken, async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const { title, description, assignee_name, start_date, due_date } = req.body;
        const user_id = req.user.id;

        const newTaskQuery = 'INSERT INTO tasks (title, description, assignee_name, start_date, due_date, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, title, status';
        const taskValues = [title, description, assignee_name, start_date, due_date, user_id];
        const newTaskResult = await client.query(newTaskQuery, taskValues);
        const newTask = newTaskResult.rows[0];

        const logAction = `Tugas "${title}" telah dibuat.`;
        const newLogQuery = 'INSERT INTO task_logs (task_id, action) VALUES ($1, $2)';
        await client.query(newLogQuery, [newTask.id, logAction]);
        
        await client.query('COMMIT');
        res.status(201).json({ message: 'Tugas berhasil dibuat', task: newTask });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error("Error saat membuat tugas:", err.message);
        res.status(500).send('Server Error');
    } finally {
        client.release();
    }
});

//update
app.put('/api/tasks/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { title, description, assignee_name, start_date, due_date, status } = req.body;
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // ambil data
        const oldTaskResult = await client.query('SELECT * FROM tasks WHERE id = $1', [id]);
        const oldStatus = oldTaskResult.rows[0].status;

        //update data
        const updateQuery = 'UPDATE tasks SET title=$1, description=$2, assignee_name=$3, status=$4 WHERE id=$5 RETURNING *';
        const updatedTaskResult = await client.query(updateQuery, [title, description, assignee_name, status, id]);

        //buat log jika status berubah
        if (oldStatus !== status) {
            const logAction = `status diubah dari "${oldStatus}" menjadi "${status}".`;
            await client.query('INSERT INTO task_logs (task_id, action) VALUES ($1, $2)', [id, logAction]);
        }

        await client.query('COMMIT');
        res.json({ message: 'Tugas berhasil diperbarui', task: updatedTaskResult.rows[0] });
    }catch (err) {
        await client.query('ROLLBACK');
        console.error("Error saat memperbarui tugas:", err.message);
        res.status(500).send('Server Error');
    }finally {
        client.release();
    }
});


//delete

app.delete('/api/tasks/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
        res.status(200).json({ message: 'Tugas berhasil dihapus' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

 const startServer = async () => {
    await checkDatabaseConnection(); // Jalankan pengecekan koneksi dulu
    app.listen(port, () => {
        console.log(`🚀 Server berjalan di http://localhost:${port}`);
    });
};

startServer();