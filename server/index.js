import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const db = new Database(join(__dirname, 'database.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS participants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    sector TEXT NOT NULL,
    formation TEXT NOT NULL,
    phone TEXT NOT NULL,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    answers TEXT NOT NULL,
    completed_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS presentation_viewers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    sector TEXT NOT NULL,
    formation TEXT NOT NULL,
    phone TEXT NOT NULL,
    viewed_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

app.post('/api/submit', (req, res) => {
  try {
    const { name, sector, formation, phone, score, totalQuestions, answers } = req.body;
    
    const stmt = db.prepare(`
      INSERT INTO participants (name, sector, formation, phone, score, total_questions, answers)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(name, sector, formation, phone, score, totalQuestions, JSON.stringify(answers));
    
    res.json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    console.error('Error submitting data:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/presentation-view', (req, res) => {
  try {
    const { name, sector, formation, phone } = req.body;
    
    const stmt = db.prepare(`
      INSERT INTO presentation_viewers (name, sector, formation, phone)
      VALUES (?, ?, ?, ?)
    `);
    
    const result = stmt.run(name, sector, formation, phone);
    
    res.json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    console.error('Error recording presentation view:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/participants', (req, res) => {
  try {
    const participants = db.prepare('SELECT * FROM participants ORDER BY completed_at DESC').all();
    
    const formattedParticipants = participants.map(p => ({
      ...p,
      answers: JSON.parse(p.answers)
    }));
    
    res.json(formattedParticipants);
  } catch (error) {
    console.error('Error fetching participants:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/viewers', (req, res) => {
  try {
    const viewers = db.prepare('SELECT * FROM presentation_viewers ORDER BY viewed_at DESC').all();
    res.json(viewers);
  } catch (error) {
    console.error('Error fetching viewers:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/stats', (req, res) => {
  try {
    const participantStats = db.prepare(`
      SELECT 
        COUNT(*) as total_participants,
        AVG(score) as average_score,
        MAX(score) as highest_score,
        MIN(score) as lowest_score
      FROM participants
    `).get();
    
    const viewerStats = db.prepare(`
      SELECT COUNT(*) as total_viewers
      FROM presentation_viewers
    `).get();
    
    res.json({
      ...participantStats,
      ...viewerStats,
      total_access: participantStats.total_participants + viewerStats.total_viewers
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/participants/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM participants WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting participant:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/viewers/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM presentation_viewers WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting viewer:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
