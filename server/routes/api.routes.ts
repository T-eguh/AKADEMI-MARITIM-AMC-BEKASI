import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { CMSController } from '../controllers/cms.controller';
import { authenticateJWT, authorizeRoles } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload.middleware';
import { validateNews, validateProduct, validateOrder, validateUser } from '../validators';

const router = Router();

// ==================== AUTHENTICATION ENDPOINTS ====================
router.post('/auth/login', AuthController.login);
router.post('/auth/refresh', AuthController.refresh);
router.post('/auth/logout', AuthController.logout);

// ==================== BACKWARD COMPATIBLE AUTO-SAVE ENDPOINT ====================
router.post('/save-backup', CMSController.saveBackupDirect);

// ==================== UNIVERSAL CMS COLLECTION CRUD ENDPOINTS ====================
// Standard endpoints for fetching (any user can view)
router.get('/cms/:collection', CMSController.getCollection);
router.get('/cms/:collection/:id', CMSController.getCollection); // handled within standard search

// Protected CMS creation & modifications (Admin / Super Admin / Editor only)
router.post(
  '/cms/:collection',
  authenticateJWT,
  authorizeRoles(['Super Admin', 'Admin', 'Editor']),
  CMSController.createItem
);
router.put(
  '/cms/:collection/:id',
  authenticateJWT,
  authorizeRoles(['Super Admin', 'Admin', 'Editor']),
  CMSController.updateItem
);
router.delete(
  '/cms/:collection/:id',
  authenticateJWT,
  authorizeRoles(['Super Admin', 'Admin']),
  CMSController.deleteItem
);

// ==================== SINGLE VALUE / WEBSITE SETTINGS ENDPOINTS ====================
router.get('/config/:key', CMSController.getConfig);
router.post(
  '/config/:key',
  authenticateJWT,
  authorizeRoles(['Super Admin', 'Admin']),
  CMSController.saveConfig
);

// ==================== MEDIA UPLOAD ENDPOINT ====================
router.post(
  '/upload',
  authenticateJWT,
  upload.single('image'),
  CMSController.uploadMedia
);

// ==================== SYSTEM BACKUP & RESTORE ENDPOINTS ====================
router.get(
  '/backup/export',
  authenticateJWT,
  authorizeRoles(['Super Admin']),
  CMSController.exportBackupFile
);
router.post(
  '/backup/import',
  authenticateJWT,
  authorizeRoles(['Super Admin']),
  CMSController.importBackupFile
);

export default router;
