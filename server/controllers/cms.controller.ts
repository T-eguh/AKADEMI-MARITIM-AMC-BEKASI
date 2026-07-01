import { Request, Response } from 'express';
import { CMSService } from '../services/cms.service';
import { isCloudinaryConfigured, cloudinary } from '../config/cloudinary';
import fs from 'fs';
import path from 'path';

export class CMSController {
  // --- Universal Collection Handlers ---
  static async getCollection(req: Request, res: Response) {
    const { collection } = req.params;
    try {
      const items = await CMSService.getAll(collection);
      return res.status(200).json(items);
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }

  static async createItem(req: Request, res: Response) {
    const { collection } = req.params;
    const body = req.body;
    
    if (!body.id) {
      body.id = `${collection.substring(0, 4)}_${Date.now()}`;
    }

    try {
      const created = await CMSService.create(collection, body);
      return res.status(201).json(created);
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }

  static async updateItem(req: Request, res: Response) {
    const { collection, id } = req.params;
    const body = req.body;
    try {
      const updated = await CMSService.update(collection, id, body);
      if (!updated) {
        return res.status(404).json({ message: `Item with ID ${id} not found in ${collection}` });
      }
      return res.status(200).json(updated);
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }

  static async deleteItem(req: Request, res: Response) {
    const { collection, id } = req.params;
    try {
      const deleted = await CMSService.delete(collection, id);
      if (!deleted) {
        return res.status(404).json({ message: `Item with ID ${id} not found in ${collection}` });
      }
      return res.status(200).json({ message: 'Deleted successfully' });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }

  // --- Website Configuration Handlers ---
  static async getConfig(req: Request, res: Response) {
    const { key } = req.params;
    try {
      const value = await CMSService.getValue(key);
      return res.status(200).json(value);
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }

  static async saveConfig(req: Request, res: Response) {
    const { key } = req.params;
    const body = req.body;
    try {
      await CMSService.saveValue(key, body);
      return res.status(200).json({ message: `Configuration '${key}' saved successfully` });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }

  // --- Save Whole Backup Payload (Compatibility Support) ---
  static async saveBackupDirect(req: Request, res: Response) {
    try {
      const payload = req.body;
      await CMSService.importBackup(payload);
      return res.status(200).json({ message: 'Backup state auto-saved successfully on server' });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }

  // --- Upload Media Controller (Resizes, Compresses & Uploads to Cloudinary) ---
  static async uploadMedia(req: Request, res: Response) {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const localFilePath = req.file.path;

    try {
      if (isCloudinaryConfigured) {
        // Upload to Cloudinary with auto resize & optimization settings
        const result = await cloudinary.uploader.upload(localFilePath, {
          folder: 'amc_bekasi',
          transformation: [
            { width: 1200, height: 1200, crop: 'limit' },
            { quality: 'auto' },
            { fetch_format: 'auto' }
          ]
        });

        // Clean up temporary local file safely
        fs.unlinkSync(localFilePath);

        return res.status(200).json({
          url: result.secure_url,
          publicId: result.public_id,
          message: 'Uploaded to Cloudinary successfully'
        });
      } else {
        // Fallback: Copy to public uploads folder so it is accessible by client directly
        const filename = req.file.filename;
        const publicUploadsDir = path.join(process.cwd(), 'public', 'uploads');
        if (!fs.existsSync(publicUploadsDir)) {
          fs.mkdirSync(publicUploadsDir, { recursive: true });
        }

        const publicDest = path.join(publicUploadsDir, filename);
        fs.renameSync(localFilePath, publicDest);

        return res.status(200).json({
          url: `/uploads/${filename}`,
          message: 'Saved to local uploads successfully (Cloudinary fallback)'
        });
      }
    } catch (err: any) {
      // Clean up local temp file on failure
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
      }
      return res.status(500).json({ message: 'File processing failed: ' + err.message });
    }
  }

  // --- Backup & Restore Handlers ---
  static async exportBackupFile(req: Request, res: Response) {
    try {
      const data = await CMSService.exportBackup();
      return res.status(200).json(data);
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }

  static async importBackupFile(req: Request, res: Response) {
    const backupData = req.body;
    try {
      await CMSService.importBackup(backupData);
      return res.status(200).json({ message: 'Database state restored successfully' });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }

  static async syncFileToDB(req: Request, res: Response) {
    try {
      const backupPath = path.join(process.cwd(), 'public', 'amc_backup.json');
      if (!fs.existsSync(backupPath)) {
        return res.status(404).json({ message: 'File amc_backup.json tidak ditemukan di server.' });
      }
      const fileData = fs.readFileSync(backupPath, 'utf8');
      const backupData = JSON.parse(fileData);
      await CMSService.importBackup(backupData);
      return res.status(200).json({ message: 'Sistem berhasil sinkronisasi dari file amc_backup.json ke database!' });
    } catch (err: any) {
      return res.status(500).json({ message: 'Gagal melakukan sinkronisasi: ' + err.message });
    }
  }
}
