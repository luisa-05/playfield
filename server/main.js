import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const db = new Database('./server/database/playfields.db');
db.pragma('journal_mode = WAL');

app.get('/playfield', function (req, res) {
  try {
    const rows = db.prepare('SELECT * FROM playfields').all();
    res.set('Content-Type', 'application/json');

    const result = rows.map((row) => {
      try {
        return {
          ...row,
          data: JSON.parse(row.data),
          name: JSON.parse(row.name),
        };
      } catch (error) {
        console.error('Error parsing JSON:', error);
        return { ...row, data: null };
      }
    });

    res.send(result);
  } catch (error) {
    console.error('Datenbankfehler:', error);
    res
      .status(500)
      .send(
        'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.',
      );
  }
});

app.get('/playfield-id', function (req, res) {
  res.set('Content-Type', 'application/json');

  try {
    const stmt = db.prepare('SELECT seq FROM sqlite_sequence WHERE name = ?');
    const row = stmt.get('playfields');

    if (row) {
      res.json(row.seq); // returns the current value
    } else {
      res.json(0); // if the table has no entries, return 0
    }
  } catch (error) {
    console.error('Datenbankfehler:', error);
    res
      .status(500)
      .send(
        'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.',
      );
  }
});

app.get('/playfield-name-search', function (req, res) {
  res.set('Content-Type', 'application/json');

  try {
    const stmt = db.prepare(
      'SELECT COUNT(*) AS count FROM playfields WHERE name = ?',
    );
    const result = stmt.get(req.query.name);
    res.send(result);
  } catch (error) {
    console.error('Datenbankfehler:', error);
    res
      .status(500)
      .send(
        'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.',
      );
  }
});

app.post('/playfield', function (req, res) {
  res.set('Content-Type', 'application/json');
  const { data, name, playfieldImg, creationDate } = req.body;

  if (!data || !name || !playfieldImg || !creationDate) {
    return res
      .status(400)
      .send(
        'Das Spielfeld konnte nicht gespeichert werden. Fehlende erforderliche Felder: data, name oder creationDate.',
      );
  }

  const base64Data = playfieldImg.replace(/^data:image\/png;base64,/, '');

  try {
    const stmtFields = db.prepare(
      'INSERT INTO playfields (data, name, playfieldImg, creationDate) VALUES (?, ?, ?, ?)',
    );
    stmtFields.run(
      JSON.stringify(data),
      JSON.stringify(name),
      base64Data,
      creationDate,
    );

    res.send('success');
  } catch (error) {
    console.error('Datenbankfehler:', error);
    res
      .status(500)
      .send(
        'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.',
      );
  }
});

app.delete('/playfield', function (req, res) {
  // const stmtFields = db.prepare('DELETE FROM playfields');
  // stmtFields.run();

  // const stmtResetId = db.prepare('DELETE FROM sqlite_sequence WHERE name = ?');
  // stmtResetId.run('playfields');

  if (!req.body.id || typeof req.body.id !== 'number') {
    return res
      .status(400)
      .send(
        'Das Spielfeld konnte nicht gelöscht werden. Fehlende erforderliche Felder: "id" oder nicht übereinstimmender Datentyp',
      );
  }

  try {
    const stmt = db.prepare('DELETE FROM playfields WHERE id = ?');
    stmt.run(req.body.id);

    res.send('success');
  } catch (error) {
    console.error('Datenbankfehler:', error);
    res
      .status(500)
      .send(
        'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.',
      );
  }
});

app.put('/playfield', function (req, res) {
  res.set('Content-Type', 'application/json');

  const { name, id } = req.body;
  if (!name || typeof name !== 'string' || !id || typeof id !== 'number') {
    return res
      .status(400)
      .send(
        'Fehlende erforderliche Felder: "name" oder "id" oder nicht übereinstimmender Datentyp',
      );
  }

  try {
    const stmt = db.prepare('UPDATE playfields SET name = ? WHERE id = ?');
    stmt.run(JSON.stringify(req.body.name), req.body.id);
    res.send('success');
  } catch (error) {
    console.error('Datenbankfehler:', error);
    res
      .status(500)
      .send(
        'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.',
      );
  }
});

console.log('Server is running on port 3000');
app.listen(3000);
