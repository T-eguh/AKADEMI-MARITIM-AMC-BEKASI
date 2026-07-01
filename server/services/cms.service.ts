import { BaseRepository } from '../repositories/base.repository';
import fs from 'fs';
import { JSON_DB_PATH, getIsMySQL, pool } from '../config/db';

export class CMSService {
  // --- Dynamic Collection Accessors ---
  static async getAll<T>(collection: string): Promise<T[]> {
    return await BaseRepository.getCollection<T>(collection);
  }

  static async getById<T extends { id: string }>(collection: string, id: string): Promise<T | null> {
    return await BaseRepository.findById<T>(collection, id);
  }

  static async create<T extends { id: string }>(collection: string, item: T): Promise<T> {
    return await BaseRepository.insertItem<T>(collection, item);
  }

  static async update<T extends { id: string }>(collection: string, id: string, fields: Partial<T>): Promise<T | null> {
    return await BaseRepository.updateItem<T>(collection, id, fields);
  }

  static async delete(collection: string, id: string): Promise<boolean> {
    return await BaseRepository.deleteItem(collection, id);
  }

  // --- Website Configuration Accessors ---
  static async getValue<T>(key: string): Promise<T> {
    return await BaseRepository.getValue<T>(key);
  }

  static async saveValue<T>(key: string, value: T): Promise<void> {
    return await BaseRepository.saveValue<T>(key, value);
  }

  // --- Backup & Restore Features ---
  static async exportBackup(): Promise<any> {
    if (getIsMySQL() && pool) {
      try {
        const backupData: any = { 
          isMySQLDump: true, 
          timestamp: new Date().toISOString(),
          updatedAt: Date.now()
        };

        // 1. Fetch from standard tables
        const tableMappings: { [key: string]: string } = {
          'users': 'users',
          'news': 'newsItems',
          'gallery': 'galleryItems',
          'facilities': 'facilities',
          'store_products': 'storeProducts',
          'store_orders': 'storeOrders'
        };

        for (const [tableName, payloadKey] of Object.entries(tableMappings)) {
          const [rows]: any = await pool.query(`SELECT * FROM \`${tableName}\``);
          // Parse stringified JSON fields (like store_orders.items)
          const parsedRows = rows.map((row: any) => {
            const parsedRow: any = {};
            for (const [k, v] of Object.entries(row)) {
              if (typeof v === 'string') {
                try {
                  // Try to parse JSON array or object
                  if ((v.startsWith('{') && v.endsWith('}')) || (v.startsWith('[') && v.endsWith(']'))) {
                    parsedRow[k] = JSON.parse(v);
                  } else {
                    parsedRow[k] = v;
                  }
                } catch {
                  parsedRow[k] = v;
                }
              } else {
                parsedRow[k] = v;
              }
            }
            return parsedRow;
          });
          backupData[payloadKey] = parsedRows;
        }

        // 2. Fetch site_content and map into top-level keys
        const [contentRows]: any = await pool.query('SELECT * FROM site_content');
        for (const row of contentRows) {
          try {
            backupData[row.section] = JSON.parse(row.data);
          } catch {
            backupData[row.section] = row.data;
          }
        }

        return backupData;
      } catch (err) {
        console.error('CMSService: Error dumping MySQL database:', err);
      }
    }

    // Default JSON fallback
    if (fs.existsSync(JSON_DB_PATH)) {
      return JSON.parse(fs.readFileSync(JSON_DB_PATH, 'utf8'));
    }
    throw new Error('No backup file available');
  }

  static async importBackup(backupData: any): Promise<void> {
    if (!backupData || typeof backupData !== 'object') {
      throw new Error('Invalid backup format');
    }

    if (getIsMySQL() && pool) {
      try {
        // 1. Save standard tables
        const tableMappings: { [key: string]: string } = {
          'users': 'users',
          'news': 'newsItems',
          'gallery': 'galleryItems',
          'facilities': 'facilities',
          'store_products': 'storeProducts',
          'store_orders': 'storeOrders'
        };

        for (const [tableName, payloadKey] of Object.entries(tableMappings)) {
          const items = backupData[payloadKey] || backupData[tableName];
          if (Array.isArray(items)) {
            await pool.query(`DELETE FROM \`${tableName}\``);
            for (const row of items) {
              // Convert object fields to string if they are arrays/objects for MySQL
              const cleanedRow: any = {};
              for (const [k, v] of Object.entries(row)) {
                cleanedRow[k] = (typeof v === 'object' && v !== null) ? JSON.stringify(v) : v;
              }
              const keys = Object.keys(cleanedRow).map(k => `\`${k}\``).join(', ');
              const values = Object.values(cleanedRow);
              const placeholders = values.map(() => '?').join(', ');
              if (keys.length > 0) {
                await pool.query(`INSERT INTO \`${tableName}\` (${keys}) VALUES (${placeholders})`, values);
              }
            }
          }
        }

        // 2. Save all other keys into site_content
        const standardKeys = ['users', 'news', 'gallery', 'facilities', 'store_products', 'store_orders', 'newsItems', 'galleryItems', 'storeProducts', 'storeOrders', 'site_content', 'isMySQLDump', 'timestamp', 'updatedAt'];
        
        await pool.query('DELETE FROM site_content');
        for (const [key, value] of Object.entries(backupData)) {
          if (!standardKeys.includes(key)) {
            const serialized = JSON.stringify(value);
            const id = `content_${key}_${Date.now()}`;
            await pool.query(
              'INSERT INTO site_content (id, section, data) VALUES (?, ?, ?)',
              [id, key, serialized]
            );
          }
        }

        console.log('CMSService: MySQL Backup imported successfully.');
        // Also sync write to JSON_DB_PATH as an automatic dual-write backup!
        fs.writeFileSync(JSON_DB_PATH, JSON.stringify(backupData, null, 2), 'utf8');
        return;
      } catch (err: any) {
        console.error('CMSService: Failed to import to MySQL, writing to JSON file as fallback:', err);
      }
    }

    // File database fallback
    fs.writeFileSync(JSON_DB_PATH, JSON.stringify(backupData, null, 2), 'utf8');
    console.log('CMSService: JSON File Backup imported successfully.');
  }
}
