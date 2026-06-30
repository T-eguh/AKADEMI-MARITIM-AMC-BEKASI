import fs from 'fs';
import path from 'path';
import { isMySQL, pool, JSON_DB_PATH } from '../config/db';

// Simple in-memory cache for JSON File DB to prevent continuous disk reads
let cachedJSONData: any = null;

function loadJSONData(): any {
  if (cachedJSONData) return cachedJSONData;
  try {
    if (fs.existsSync(JSON_DB_PATH)) {
      const content = fs.readFileSync(JSON_DB_PATH, 'utf8');
      cachedJSONData = JSON.parse(content);
      return cachedJSONData;
    }
  } catch (error) {
    console.error('BaseRepository: Error reading amc_backup.json:', error);
  }

  // High fidelity presets fallback if file doesn't exist
  return {
    users: [],
    news: [],
    gallery: [],
    facilities: [],
    applications: [],
    alumni: [],
    timeline: [],
    lecturers: [],
    calendar: [],
    programs: [],
    banners: [],
    running_texts: [],
    announcements: [],
    store_products: [],
    store_orders: [],
    sections: [],
    images: [],
    content: {},
    seo: {},
    popup_promo: {},
    pmb_config: {},
    media: [],
    logs: []
  };
}

function saveJSONData(data: any) {
  cachedJSONData = data;
  try {
    const dir = path.dirname(JSON_DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(JSON_DB_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('BaseRepository: Error writing to amc_backup.json:', error);
  }
}

export class BaseRepository {
  /**
   * Retrieves a collection array (e.g., 'news', 'gallery')
   */
  static async getCollection<T>(key: string): Promise<T[]> {
    if (isMySQL && pool) {
      try {
        // If MySQL table is active, query it (with safety fallback to JSON if table missing)
        const [rows] = await pool.query(`SELECT * FROM \`${key}\``);
        return rows as T[];
      } catch (err: any) {
        console.warn(`BaseRepository: Failed to fetch from MySQL table '${key}', using JSON fallback. Error:`, err.message);
      }
    }

    const data = loadJSONData();
    return (data[key] || []) as T[];
  }

  /**
   * Saves or overrides a collection array entirely
   */
  static async saveCollection<T>(key: string, items: T[]): Promise<void> {
    if (isMySQL && pool) {
      try {
        // Clear and insert to MySQL
        await pool.query(`DELETE FROM \`${key}\``);
        for (const item of items as any) {
          const keys = Object.keys(item).map(k => `\`${k}\``).join(', ');
          const values = Object.values(item);
          const placeholders = values.map(() => '?').join(', ');
          await pool.query(`INSERT INTO \`${key}\` (${keys}) VALUES (${placeholders})`, values);
        }
        return;
      } catch (err: any) {
        console.warn(`BaseRepository: Failed to save to MySQL table '${key}', using JSON fallback. Error:`, err.message);
      }
    }

    const data = loadJSONData();
    data[key] = items;
    saveJSONData(data);
  }

  /**
   * Gets a specific document or setting object by key
   */
  static async getValue<T>(key: string): Promise<T> {
    if (isMySQL && pool) {
      try {
        const [rows]: any = await pool.query('SELECT data FROM site_content WHERE section = ?', [key]);
        if (rows.length > 0) {
          return JSON.parse(rows[0].data) as T;
        }
      } catch (err: any) {
        console.warn(`BaseRepository: Failed to get value '${key}' from MySQL, using JSON fallback. Error:`, err.message);
      }
    }

    const data = loadJSONData();
    return (data[key] || {}) as T;
  }

  /**
   * Saves a specific document or setting object by key
   */
  static async saveValue<T>(key: string, value: T): Promise<void> {
    if (isMySQL && pool) {
      try {
        const serialized = JSON.stringify(value);
        await pool.query(
          'INSERT INTO site_content (section, data) VALUES (?, ?) ON DUPLICATE KEY UPDATE data = ?',
          [key, serialized, serialized]
        );
        return;
      } catch (err: any) {
        console.warn(`BaseRepository: Failed to save value '${key}' to MySQL, using JSON fallback. Error:`, err.message);
      }
    }

    const data = loadJSONData();
    data[key] = value;
    saveJSONData(data);
  }

  /**
   * Insert, Update, Delete for general items inside a collection
   */
  static async findById<T extends { id: string }>(key: string, id: string): Promise<T | null> {
    if (isMySQL && pool) {
      try {
        const [rows]: any = await pool.query(`SELECT * FROM \`${key}\` WHERE id = ?`, [id]);
        if (rows.length > 0) return rows[0] as T;
        return null;
      } catch (err: any) {
        console.warn(`BaseRepository: MySQL findById fail on '${key}', falling back to JSON. Error:`, err.message);
      }
    }

    const items = await this.getCollection<T>(key);
    return items.find(item => item.id === id) || null;
  }

  static async insertItem<T extends { id: string }>(key: string, item: T): Promise<T> {
    if (isMySQL && pool) {
      try {
        const fields = Object.keys(item);
        const placeholders = fields.map(() => '?').join(', ');
        const columns = fields.map(f => `\`${f}\``).join(', ');
        const values = Object.values(item).map(val => 
          typeof val === 'object' ? JSON.stringify(val) : val
        );

        await pool.query(`INSERT INTO \`${key}\` (${columns}) VALUES (${placeholders})`, values);
        return item;
      } catch (err: any) {
        console.warn(`BaseRepository: MySQL insert failed on '${key}', falling back to JSON. Error:`, err.message);
      }
    }

    const data = loadJSONData();
    if (!data[key]) data[key] = [];
    data[key].push(item);
    saveJSONData(data);
    return item;
  }

  static async updateItem<T extends { id: string }>(key: string, id: string, updatedFields: Partial<T>): Promise<T | null> {
    if (isMySQL && pool) {
      try {
        const fields = Object.keys(updatedFields);
        const setClause = fields.map(f => `\`${f}\` = ?`).join(', ');
        const values = Object.values(updatedFields).map(val => 
          typeof val === 'object' ? JSON.stringify(val) : val
        );

        await pool.query(`UPDATE \`${key}\` SET ${setClause} WHERE id = ?`, [...values, id]);
        return await this.findById<T>(key, id);
      } catch (err: any) {
        console.warn(`BaseRepository: MySQL update failed on '${key}', falling back to JSON. Error:`, err.message);
      }
    }

    const data = loadJSONData();
    const items = (data[key] || []) as T[];
    const idx = items.findIndex(item => item.id === id);
    if (idx !== -1) {
      items[idx] = { ...items[idx], ...updatedFields };
      data[key] = items;
      saveJSONData(data);
      return items[idx];
    }
    return null;
  }

  static async deleteItem<T extends { id: string }>(key: string, id: string): Promise<boolean> {
    if (isMySQL && pool) {
      try {
        const [result]: any = await pool.query(`DELETE FROM \`${key}\` WHERE id = ?`, [id]);
        return result.affectedRows > 0;
      } catch (err: any) {
        console.warn(`BaseRepository: MySQL delete failed on '${key}', falling back to JSON. Error:`, err.message);
      }
    }

    const data = loadJSONData();
    const items = (data[key] || []) as T[];
    const lengthBefore = items.length;
    data[key] = items.filter(item => item.id !== id);
    saveJSONData(data);
    return data[key].length < lengthBefore;
  }
}
