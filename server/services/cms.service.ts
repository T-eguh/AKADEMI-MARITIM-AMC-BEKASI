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
        // Export fully consolidated JSON structure of all standard collections
        const tables = [
          'users', 'news', 'gallery', 'facilities', 'store_products', 'store_orders'
        ];
        const backupData: any = { isMySQLDump: true, timestamp: new Date().toISOString() };
        for (const table of tables) {
          const [rows] = await pool.query(`SELECT * FROM \`${table}\``);
          backupData[table] = rows;
        }
        
        // Also fetch site_content key-values
        const [contentRows]: any = await pool.query('SELECT * FROM site_content');
        backupData.site_content = contentRows;

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
        const tables = [
          'users', 'news', 'gallery', 'facilities', 'store_products', 'store_orders'
        ];
        
        for (const table of tables) {
          if (Array.isArray(backupData[table])) {
            await pool.query(`DELETE FROM \`${table}\``);
            for (const row of backupData[table]) {
              const keys = Object.keys(row).map(k => `\`${k}\``).join(', ');
              const values = Object.values(row);
              const placeholders = values.map(() => '?').join(', ');
              await pool.query(`INSERT INTO \`${table}\` (${keys}) VALUES (${placeholders})`, values);
            }
          }
        }

        if (Array.isArray(backupData.site_content)) {
          await pool.query('DELETE FROM site_content');
          for (const row of backupData.site_content) {
            await pool.query('INSERT INTO site_content (id, section, data) VALUES (?, ?, ?)', [
              row.id, row.section, row.data
            ]);
          }
        }
        console.log('CMSService: MySQL Backup imported successfully.');
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
