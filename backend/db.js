import sqlite3 from "sqlite3";
import { open } from "sqlite";

async function ensureColumnExists(db, table, columnName, columnDefinition) {
  const columns = await db.all(`PRAGMA table_info(${table})`);
  const exists = columns.some((column) => column.name === columnName);
  if (!exists) {
    await db.exec(`ALTER TABLE ${table} ADD COLUMN ${columnDefinition}`);
  }
}

async function ensureUniqueIndex(db, table, columnName) {
  const indexName = `idx_${table}_${columnName}`;
  await db.exec(`CREATE UNIQUE INDEX IF NOT EXISTS ${indexName} ON ${table}(${columnName})`);
}

export async function initDB() {
  const db = await open({
    filename: "./database.sqlite",
    driver: sqlite3.Database
  });

  // USERS table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      username TEXT,
      full_name TEXT,
      mobile_phone TEXT,
      location TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await ensureColumnExists(db, "users", "username", "username TEXT");
  await ensureUniqueIndex(db, "users", "username");
  await ensureColumnExists(db, "users", "full_name", "full_name TEXT");
  await ensureColumnExists(db, "users", "mobile_phone", "mobile_phone TEXT");
  await ensureColumnExists(db, "users", "location", "location TEXT");

  // MOVIES table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS movies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      movie_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      is_favorite BOOLEAN DEFAULT 0,
      is_watched BOOLEAN DEFAULT 0,
      watched_date TEXT DEFAULT NULL,
      review TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(user_id, movie_id)
    )
  `);

  await ensureColumnExists(db, "movies", "watched_date", "watched_date TEXT DEFAULT NULL");

  return db;
}