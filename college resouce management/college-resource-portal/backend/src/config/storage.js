import path from 'path';
import fs from 'fs';
import { config } from './env.js';
import { logger } from '../utils/logger.js';

// Ensure local upload directory exists
const localDir = path.resolve(config.storage.localDir);
if (!fs.existsSync(localDir)) {
  fs.mkdirSync(localDir, { recursive: true });
}

/**
 * Upload a file buffer to the configured storage provider.
 * Returns { url, key }
 */
export const uploadFile = async (fileBuffer, originalName, mimeType) => {
  const ext = path.extname(originalName);
  const key = `resources/${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;

  switch (config.storage.provider) {
    case 'local': {
      const filePath = path.join(localDir, key.replace('resources/', ''));
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, fileBuffer);
      const url = `/api/files/${key.replace('resources/', '')}`;
      logger.info(`File saved locally: ${filePath}`);
      return { url, key };
    }

    case 'supabase': {
      // Dynamic import so missing credentials don't crash non-supabase setups
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        config.storage.supabase.url,
        config.storage.supabase.serviceKey
      );
      const { error } = await supabase.storage
        .from(config.storage.supabase.bucket)
        .upload(key, fileBuffer, { contentType: mimeType, upsert: false });
      if (error) throw error;
      const { data } = supabase.storage
        .from(config.storage.supabase.bucket)
        .getPublicUrl(key);
      return { url: data.publicUrl, key };
    }

    case 'cloudinary': {
      const { v2: cloudinary } = await import('cloudinary');
      cloudinary.config({
        cloud_name: config.storage.cloudinary.cloudName,
        api_key:    config.storage.cloudinary.apiKey,
        api_secret: config.storage.cloudinary.apiSecret,
      });
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ resource_type: 'raw', public_id: key }, (err, res) =>
            err ? reject(err) : resolve(res)
          )
          .end(fileBuffer);
      });
      return { url: result.secure_url, key: result.public_id };
    }

    default:
      throw new Error(`Unknown storage provider: ${config.storage.provider}`);
  }
};

/**
 * Delete a file from storage.
 */
export const deleteFile = async (key) => {
  try {
    switch (config.storage.provider) {
      case 'local': {
        const filePath = path.join(localDir, key.replace('resources/', ''));
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        break;
      }
      case 'supabase': {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(
          config.storage.supabase.url,
          config.storage.supabase.serviceKey
        );
        await supabase.storage.from(config.storage.supabase.bucket).remove([key]);
        break;
      }
      case 'cloudinary': {
        const { v2: cloudinary } = await import('cloudinary');
        cloudinary.config({
          cloud_name: config.storage.cloudinary.cloudName,
          api_key:    config.storage.cloudinary.apiKey,
          api_secret: config.storage.cloudinary.apiSecret,
        });
        await cloudinary.uploader.destroy(key, { resource_type: 'raw' });
        break;
      }
    }
  } catch (err) {
    logger.error(`Failed to delete file ${key}:`, err.message);
  }
};
