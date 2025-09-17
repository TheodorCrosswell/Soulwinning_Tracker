// @/lib/database.ts
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
 * Selects a specified number of records with an offset from the 'records' table.
 * @param {number} limit - The number of records to retrieve.
 * @param {number} offset - The number of records to skip.
 * @returns {any[]} An array of the selected records.
 */
export const selectLatestRecordsForMap = (
  limit: number,
  offset: number
): any[] => {
  try {
    const statement = `SELECT id,
            name,
            count,
            description,
            imageUri,
            lat,
            lng,
            date
        FROM records
        WHERE lat IS NOT NULL 
        AND lng IS NOT NULL
        ORDER BY date DESC
        LIMIT ? OFFSET ?;`;
    const params = [limit, offset];
    const result = db.getAllSync(statement, params);
    return result;
  } catch (error) {
    console.error("Error selecting records:", error);
    throw error;
  }
};

/**
 * Counts the total number of records in the 'records' table.
 * @returns {number} The total number of records.
 */
export const countRecords = (): number => {
  try {
    // Use an alias 'total' for cleaner property access
    const result = db.getFirstSync<{ total: number }>(
      `SELECT COUNT(*) as total FROM records;`
    );

    if (result && typeof result.total === "number") {
      return result.total;
    }
    return 0;
  } catch (error) {
    console.error("Error counting records:", error);
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

/**
 * Updates an existing record in the database.
 * @param id The ID of the record to update.
 * @param name The updated name.
 * @param count The updated count.
 * @param description The updated description.
 * @param imageUri The updated image URI.
 * @param lat The updated latitude.
 * @param lng The updated longitude.
 * @param date The updated date.
 * @returns The result of the update operation.
 */
export const updateRecord = (
  id: number,
  name: string,
  count: number,
  description: string | null,
  imageUri: string | null,
  lat: number | null,
  lng: number | null,
  date: string
): SQLiteRunResult => {
  try {
    const result = db.runSync(
      "UPDATE records SET name = ?, count = ?, description = ?, imageUri = ?, lat = ?, lng = ?, date = ? WHERE id = ?",
      [name, count, description, imageUri, lat, lng, date, id]
    );
    console.log(`Record with ID ${id} updated successfully.`);
    return result;
  } catch (error) {
    console.error(`Error updating record with ID ${id}:`, error);
    throw error;
  }
};

export const insertDummyData = (): void => {
  try {
    const dummyData = [
      {
        name: "Apple",
        count: 5,
        description: "Fresh red apples",
        imageUri: null,
        lat: 34.0522,
        lng: -118.2437,
        date: "2023-10-27T10:00:00.000Z",
      },
      {
        name: "Banana",
        count: 10,
        description: "Ripe yellow bananas",
        imageUri: null,
        lat: 36.7783,
        lng: -119.4179,
        date: "2023-10-27T10:05:00.000Z",
      },
      {
        name: "Orange",
        count: 8,
        description: "Juicy oranges",
        imageUri: null,
        lat: 38.5816,
        lng: -121.4944,
        date: "2023-10-27T10:10:00.000Z",
      },
      {
        name: "Grapes",
        count: 25,
        description: "Sweet green grapes",
        imageUri: null,
        lat: 35.3733,
        lng: -119.0187,
        date: "2023-10-28T11:00:00.000Z",
      },
      {
        name: "Strawberry",
        count: 50,
        description: "Organic strawberries",
        imageUri: null,
        lat: 33.6846,
        lng: -117.8265,
        date: "2023-10-28T11:05:00.000Z",
      },
      {
        name: "Blueberry",
        count: 100,
        description: "Fresh blueberries",
        imageUri: null,
        lat: 45.5051,
        lng: -122.675,
        date: "2023-10-29T12:00:00.000Z",
      },
      {
        name: "Mango",
        count: 3,
        description: "Sweet mangoes",
        imageUri: null,
        lat: 25.7617,
        lng: -80.1918,
        date: "2023-10-29T12:05:00.000Z",
      },
      {
        name: "Pineapple",
        count: 2,
        description: "Tropical pineapples",
        imageUri: null,
        lat: 21.3069,
        lng: -157.8583,
        date: "2023-10-30T13:00:00.000Z",
      },
      {
        name: "Watermelon",
        count: 1,
        description: "Large juicy watermelon",
        imageUri: null,
        lat: 32.7157,
        lng: -117.1611,
        date: "2023-10-30T13:05:00.000Z",
      },
      {
        name: "Peach",
        count: 6,
        description: "Ripe peaches",
        imageUri: null,
        lat: 33.749,
        lng: -84.388,
        date: "2023-10-31T14:00:00.000Z",
      },
    ];

    for (const record of dummyData) {
      db.runSync(
        `INSERT INTO records (name, count, description, imageUri, lat, lng, date) VALUES (?, ?, ?, ?, ?, ?, ?);`,
        [
          record.name,
          record.count,
          record.description,
          record.imageUri,
          record.lat,
          record.lng,
          record.date,
        ]
      );
    }
  } catch (error) {
    console.error("Error inserting dummy data:", error);
    throw error;
  }
};
