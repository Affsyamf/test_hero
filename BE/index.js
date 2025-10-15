require ('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const app = express();
const port = process.env.PORT || 5000;
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,  
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

//middleware

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Selamat datang di tracer apk');
})


//endpoint data tuags

app.get('/api/tasks', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM tasks ORDER BY id ASC');
        res.json(result.rows);
    }catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
}); 


//enpoint jika ada tigas baru

app.post('/api/tasks', async (req, res) => {
    const client = await pool.connect();
    try {
        const { title, description, assignee_name, start_date, due_date } = req.body;
        const user_id = 1; 
        await client.query('BEGIN');
        const newTaskQuery = 'INSERT INTO tasks (title, description, assignee_name, start_date, due_date, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id';
        
        const taskValues = [title, description, assignee_name, start_date, due_date, user_id];
        const newTaskResult = await client.query(newTaskQuery, taskValues);

        const newTaskId = newTaskResult.rows[0].id;

        //masukan data log ke tabel logs
        const logAction = `tugas "${title}" telah dibuat dan ditugaskan kepada ${assignee_name}`;
        const newLogQuery = 'INSERT INTO logs (task_id, action) VALUES ($1, $2)';
        await client.query(newLogQuery, [newTaskId, logAction]);

        await client.query('COMMIT');

        res.status(201).json({ message: 'Tugas berhasil dibuat', task: {id: newTaskId, title, status: 'Belum Dimulai' }
        });
    }catch (err) {
        await client.query('ROLLBACK');
        console.error(err.message);
        res.status(500).send('Server Error');
    }finally{
        client.release();
    }
});

    app.listen(port, () => {
        console.log(`Server berjalan di http://localhost:${port}`);
});