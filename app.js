const express = require('express');
const { db, initDB } = require('./db');  // Importamos la función initDB
const app = express();
const port = 8000;

// Middleware para parsear el cuerpo de las peticiones en formato JSON
app.use(express.json());

// Inicializar la base de datos
initDB();  // Solo llamamos a initDB para crear la tabla

// Ruta para obtener todos los estudiantes
app.get('/students', (req, res) => {
  db.all("SELECT * FROM students", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ students: rows });
  });
});

// Ruta para obtener un estudiante específico
app.get('/student/:id', (req, res) => {
  const { id } = req.params;
  db.get("SELECT * FROM students WHERE id = ?", [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (row) {
      res.json({ student: row });
    } else {
      res.status(404).json({ error: "Estudiante no encontrado" });
    }
  });
});

// Ruta para crear un nuevo estudiante
app.post('/students', (req, res) => {
  const { firstname, lastname, gender, age } = req.body || {};

  if (!firstname || !lastname || !gender || !age) {
    return res.status(400).json({ error: "Todos los campos son requeridos" });
  }

  const sql = `INSERT INTO students (firstname, lastname, gender, age) VALUES (?, ?, ?, ?)`;
  db.run(sql, [firstname, lastname, gender, age], function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({ id: this.lastID });
  });
});

// Ruta para actualizar un estudiante específico
app.put('/student/:id', (req, res) => {
  const { id } = req.params;
  const { firstname, lastname, gender, age } = req.body;

  const sql = `UPDATE students SET firstname = ?, lastname = ?, gender = ?, age = ? WHERE id = ?`;
  db.run(sql, [firstname, lastname, gender, age, id], function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (this.changes > 0) {
      res.json({ updated: this.changes });
    } else {
      res.status(404).json({ error: "Estudiante no encontrado para actualizar" });
    }
  });
});

// Ruta para eliminar un estudiante
app.delete('/student/:id', (req, res) => {
  const { id } = req.params;

  const sql = `DELETE FROM students WHERE id = ?`;
  db.run(sql, [id], function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (this.changes > 0) {
      res.json({ deleted: this.changes });
    } else {
      res.status(404).json({ error: "Estudiante no encontrado para eliminar" });
    }
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
