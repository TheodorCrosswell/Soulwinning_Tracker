import * as SQLite from "expo-sqlite";
import { SQLiteDatabase, SQLiteRunResult } from "expo-sqlite";

// openDatabaseSync is the correct new API for synchronous operations.
const db: SQLiteDatabase = SQLite.openDatabaseSync("mydata.db");

// The init function is now synchronous and throws an error on failure.
export const init = async (): Promise<void> => {
  try {
    // db.execSync() can execute multiple SQL statements.
    // The transaction is implicit for a single batch of commands.
    db.execSync(
      // drop table trying to clear the old schema
      // `DROP TABLE IF EXISTS records;` +
      `
      CREATE TABLE IF NOT EXISTS records (
        id INTEGER PRIMARY KEY NOT NULL,
        name TEXT,
        count INTEGER,
        description TEXT,
        imageUri TEXT,
        lat REAL,
        lng REAL,
        date TEXT
      );`
    );
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error; // Rethrow the error to be handled by the caller
  }
};

// The insertRecord function is also synchronous.
export const insertRecord = (
  name: string,
  count: number,
  description: string | null,
  imageUri: string | null,
  lat: number | null,
  lng: number | null,
  date: string
): SQLiteRunResult => {
  try {
    // For single statements, especially with parameters, runSync is preferred.
    // It automatically prepares and finalizes the statement.
    const result = db.runSync(
      `INSERT INTO records (name, count, description, imageUri, lat, lng, date) VALUES (?, ?, ?, ?, ?, ?, ?);`,
      [name, count, description, imageUri, lat, lng, date]
    );
    return result;
  } catch (error) {
    console.error("Error inserting record:", error);
    throw error; // Rethrow the error
  }
};

/**
 * Drops the 'records' table from the database.
 */
export const dropTable = (): void => {
  try {
    db.execSync(`DROP TABLE IF EXISTS records;`);
    console.log("Table 'records' dropped successfully.");
  } catch (error) {
    console.error("Error dropping table:", error);
    throw error;
  }
};

/**
 * Selects all records from the 'records' table.
 * @returns {any[]} An array of all records.
 */
export const selectAllRecords = (): any[] => {
  try {
    const allRows = db.getAllSync(`
      SELECT id,
        name,
        count,
        description,
        imageUri,
        lat,
        lng,
        date 
      FROM records;`);
    return allRows;
  } catch (error) {
    console.error("Error selecting all records:", error);
    throw error;
  }
};

/**
 * Selects a specified number of records with an offset from the 'records' table.
 * @param {number} limit - The number of records to retrieve.
 * @param {number} offset - The number of records to skip.
 * @returns {any[]} An array of the selected records.
 */
export const selectLatestRecords = (limit: number, offset: number): any[] => {
  try {
    const statement = `SELECT id,
        name,
        count,
        description,
        imageUri,
        lat,
        lng,
        date  FROM records ORDER BY date DESC LIMIT ? OFFSET ?;`;
    const params = [limit, offset];
    const result = db.getAllSync(statement, params);
    return result;
  } catch (error) {
    console.error("Error selecting records:", error);
    throw error;
  }
};

/**
 * Deletes a single record from the 'records' table by its ID.
 * @param {number} id The ID of the record to delete.
 * @returns {SQLiteRunResult} The result of the delete operation.
 */
export const deleteRecord = (id: number): SQLiteRunResult => {
  try {
    const result = db.runSync(`DELETE FROM records WHERE id = ?;`, [id]);
    console.log(`Record with ID ${id} deleted successfully.`);
    return result;
  } catch (error) {
    console.error(`Error deleting record with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Deletes all records from the 'records' table.
 * @returns {SQLiteRunResult} The result of the delete operation.
 */
export const deleteAllRecords = (): SQLiteRunResult => {
  try {
    const result = db.runSync(`DELETE FROM records;`);
    console.log("All records deleted successfully.");
    return result;
  } catch (error) {
    console.error("Error deleting all records:", error);
    throw error;
  }
};
