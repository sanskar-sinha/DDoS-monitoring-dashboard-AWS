
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./db');

const app = express();


app.use(cors());
app.use(express.json());


app.use(express.static('public'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'DDoS dashboard backend running' });
});


app.post('/api/logs', async (req, res) => {
  try {
    const { ip_address, endpoint, method, requests_count, is_suspected } = req.body;

    if (!ip_address || !endpoint || !method) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    const [result] = await pool.query(
      `INSERT INTO traffic_logs 
        (ip_address, endpoint, method, requests_count, is_suspected)
       VALUES (?, ?, ?, ?, ?)`,
      [ip_address, endpoint, method, requests_count || 1, is_suspected ? 1 : 0]
    );

    res.status(201).json({ id: result.insertId });

  } catch (err) {
    console.error('Error inserting log:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/logs', async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 100;

    const [rows] = await pool.query(
      `SELECT * FROM traffic_logs
       ORDER BY created_at DESC
       LIMIT ?`,
      [limit]
    );

    res.json(rows);

  } catch (err) {
    console.error('Error fetching logs:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


app.get('/api/stats/top-ips', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT ip_address,
              SUM(requests_count) AS total_requests,
              SUM(is_suspected) AS suspected_hits
       FROM traffic_logs
       GROUP BY ip_address
       ORDER BY total_requests DESC
       LIMIT 10`
    );

    res.json(rows);

  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/blocked-ips', async (req, res) => {
  try {
    const { ip_address, reason } = req.body;

    if (!ip_address) {
      return res.status(400).json({ error: 'IP is required' });
    }

    await pool.query(
      `INSERT INTO blocked_ips (ip_address, reason)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE reason = VALUES(reason), blocked_at = CURRENT_TIMESTAMP`,
      [ip_address, reason || 'Suspicious activity']
    );

    res.json({ message: 'IP blocked' });

  } catch (err) {
    console.error('Error blocking IP:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/blocked-ips', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM blocked_ips
       ORDER BY blocked_at DESC`
    );

    res.json(rows);

  } catch (err) {
    console.error('Error fetching blocked IPs:', err);
    res.status(500).json({ error: 'Server error' });
  }
});



app.delete('/api/blocked-ips/:ip', async (req, res) => {
  try {
    const ip = req.params.ip;

    const [result] = await pool.query(
      `DELETE FROM blocked_ips WHERE ip_address = ?`,
      [ip]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'IP not found' });
    }

    res.json({ message: 'IP unblocked' });

  } catch (err) {
    console.error('Error unblocking IP:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
