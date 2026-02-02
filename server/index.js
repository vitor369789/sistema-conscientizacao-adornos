import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import multer from 'multer';
import { existsSync, unlinkSync } from 'fs';

// Carrega variáveis de ambiente do arquivo .env na raiz do projeto
dotenv.config({ path: join(dirname(fileURLToPath(import.meta.url)), '..', '.env') });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.API_PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve static files from client/public directory
const clientPublicPath = join(__dirname, '..', 'client', 'public');
app.use('/uploads', express.static(clientPublicPath));

// Configure multer for logo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, clientPublicPath);
  },
  filename: (req, file, cb) => {
    const logoNumber = req.params.number;
    cb(null, `logo${logoNumber}.png`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

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

db.exec(`
  CREATE TABLE IF NOT EXISTS slides (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    icon TEXT NOT NULL,
    color TEXT NOT NULL,
    illustration TEXT NOT NULL,
    content TEXT NOT NULL,
    slide_order INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS quiz_questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT NOT NULL,
    options TEXT NOT NULL,
    correct INTEGER NOT NULL,
    explanation TEXT NOT NULL,
    question_order INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS site_config (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    config_key TEXT UNIQUE NOT NULL,
    config_value TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Insert default config values if not exists
const defaultConfigs = [
  { key: 'site_title', value: 'Conscientização sobre Adornos' },
  { key: 'welcome_message', value: 'Bem-vindo! Vamos começar uma jornada interativa de aprendizado' }
];

defaultConfigs.forEach(config => {
  db.prepare(`
    INSERT OR IGNORE INTO site_config (config_key, config_value)
    VALUES (?, ?)
  `).run(config.key, config.value);
});

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

// Slides API endpoints
app.get('/api/slides', (req, res) => {
  try {
    const slides = db.prepare('SELECT * FROM slides ORDER BY slide_order ASC').all();
    const formattedSlides = slides.map(s => ({
      ...s,
      content: JSON.parse(s.content)
    }));
    res.json(formattedSlides);
  } catch (error) {
    console.error('Error fetching slides:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/slides', (req, res) => {
  try {
    const { title, icon, color, illustration, content, slide_order } = req.body;
    const stmt = db.prepare(`
      INSERT INTO slides (title, icon, color, illustration, content, slide_order)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(title, icon, color, illustration, JSON.stringify(content), slide_order);
    res.json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    console.error('Error creating slide:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/slides/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, icon, color, illustration, content, slide_order } = req.body;
    const stmt = db.prepare(`
      UPDATE slides 
      SET title = ?, icon = ?, color = ?, illustration = ?, content = ?, slide_order = ?
      WHERE id = ?
    `);
    stmt.run(title, icon, color, illustration, JSON.stringify(content), slide_order, id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating slide:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/slides/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM slides WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting slide:', error);
    res.status(500).json({ error: error.message });
  }
});

// Quiz Questions API endpoints
app.get('/api/quiz-questions', (req, res) => {
  try {
    const questions = db.prepare('SELECT * FROM quiz_questions ORDER BY question_order ASC').all();
    const formattedQuestions = questions.map(q => ({
      ...q,
      options: JSON.parse(q.options)
    }));
    res.json(formattedQuestions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/quiz-questions', (req, res) => {
  try {
    const { question, options, correct, explanation, question_order } = req.body;
    const stmt = db.prepare(`
      INSERT INTO quiz_questions (question, options, correct, explanation, question_order)
      VALUES (?, ?, ?, ?, ?)
    `);
    const result = stmt.run(question, JSON.stringify(options), correct, explanation, question_order);
    res.json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    console.error('Error creating question:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/quiz-questions/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { question, options, correct, explanation, question_order } = req.body;
    const stmt = db.prepare(`
      UPDATE quiz_questions 
      SET question = ?, options = ?, correct = ?, explanation = ?, question_order = ?
      WHERE id = ?
    `);
    stmt.run(question, JSON.stringify(options), correct, explanation, question_order, id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating question:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/quiz-questions/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM quiz_questions WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({ error: error.message });
  }
});

// Site Config API endpoints
app.get('/api/config', (req, res) => {
  try {
    const configs = db.prepare('SELECT * FROM site_config').all();
    const configObj = {};
    configs.forEach(c => {
      configObj[c.config_key] = c.config_value;
    });
    res.json(configObj);
  } catch (error) {
    console.error('Error fetching config:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/config', (req, res) => {
  try {
    const { site_title, welcome_message } = req.body;
    
    if (site_title) {
      db.prepare(`
        INSERT OR REPLACE INTO site_config (id, config_key, config_value, updated_at)
        VALUES (
          (SELECT id FROM site_config WHERE config_key = 'site_title'),
          'site_title',
          ?,
          CURRENT_TIMESTAMP
        )
      `).run(site_title);
    }
    
    if (welcome_message) {
      db.prepare(`
        INSERT OR REPLACE INTO site_config (id, config_key, config_value, updated_at)
        VALUES (
          (SELECT id FROM site_config WHERE config_key = 'welcome_message'),
          'welcome_message',
          ?,
          CURRENT_TIMESTAMP
        )
      `).run(welcome_message);
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating config:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Logo Management API endpoints (only for logos 1, 2, and 3)
app.post('/api/logo/:number', upload.single('logo'), (req, res) => {
  try {
    const { number } = req.params;
    
    // Only allow logos 1, 2, and 3
    if (!['1', '2', '3'].includes(number)) {
      return res.status(400).json({ success: false, error: 'Only logos 1, 2, and 3 can be managed' });
    }
    
    res.json({ 
      success: true, 
      message: `Logo ${number} uploaded successfully`,
      filename: `logo${number}.png`
    });
  } catch (error) {
    console.error('Error uploading logo:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/logo/:number', (req, res) => {
  try {
    const { number } = req.params;
    
    // Only allow logos 1, 2, and 3
    if (!['1', '2', '3'].includes(number)) {
      return res.status(400).json({ success: false, error: 'Only logos 1, 2, and 3 can be managed' });
    }
    
    const logoPath = join(clientPublicPath, `logo${number}.png`);
    
    if (existsSync(logoPath)) {
      unlinkSync(logoPath);
      res.json({ success: true, message: `Logo ${number} deleted successfully` });
    } else {
      res.status(404).json({ success: false, error: 'Logo not found' });
    }
  } catch (error) {
    console.error('Error deleting logo:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/logos/status', (req, res) => {
  try {
    const status = {
      logo1: existsSync(join(clientPublicPath, 'logo1.png')),
      logo2: existsSync(join(clientPublicPath, 'logo2.png')),
      logo3: existsSync(join(clientPublicPath, 'logo3.png'))
    };
    res.json(status);
  } catch (error) {
    console.error('Error checking logos status:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
