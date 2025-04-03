const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'students.sqlite'); // Asegúrate de que la base de datos tenga el nombre correcto

// Crear o abrir la base de datos
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err.message);
  } else {
    console.log('Conectado a la base de datos SQLite.');
  }
});

// Función de inicialización de la base de datos
const initDB = () => {
  db.serialize(() => {  // db.serialize() solo funciona si db es una instancia de sqlite3.Database
    db.run(`CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstname TEXT NOT NULL,
      lastname TEXT NOT NULL,
      gender TEXT NOT NULL,
      age INTEGER
    )`);
    console.log("Tabla 'students' creada o ya existente.");
  });
};

module.exports = {
  db,
  initDB
};
