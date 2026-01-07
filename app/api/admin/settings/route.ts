// app/api/admin/settings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/mysql-db';
import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'your-secret-encryption-key-32-bytes-long';

function encrypt(text: string): string {
  const algorithm = 'aes-256-cbc';
  const key = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipher(algorithm, key);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

function decrypt(text: string): string {
  const algorithm = 'aes-256-cbc';
  const key = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32);
  const parts = text.split(':');
  const iv = Buffer.from(parts.shift()!, 'hex');
  const encryptedText = parts.join(':');
  const decipher = crypto.createDecipher(algorithm, key);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// GET: Fetch all settings
export async function GET() {
  try {
    const settings = await executeQuery('SELECT * FROM settings ORDER BY category, setting_key');

    // Organize settings by category
    const organizedSettings = {
      general: {} as any,
      payment: {} as any,
      email: {} as any,
      security: {} as any,
      seo: {} as any
    };

    settings.forEach((setting: any) => {
      let value = setting.setting_value;
      
      // Decrypt encrypted values
      if (setting.is_encrypted && value) {
        try {
          value = decrypt(value);
        } catch (error) {
          console.error(`Failed to decrypt setting ${setting.setting_key}:`, error);
          value = '';
        }
      }

      // Convert values based on type
      if (setting.setting_type === 'boolean') {
        value = value === 'true';
      } else if (setting.setting_type === 'number') {
        value = parseInt(value) || 0;
      }

      // Convert setting_key to camelCase
      const camelKey = setting.setting_key.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
      organizedSettings[setting.category as keyof typeof organizedSettings][camelKey] = value;
    });

    return NextResponse.json({
      success: true,
      data: organizedSettings
    });

  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// POST: Update settings
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { category, settings } = body;

    if (!category || !settings) {
      return NextResponse.json(
        { error: 'Category and settings are required' },
        { status: 400 }
      );
    }

    // Get current settings to check which ones are encrypted
    const currentSettings = await executeQuery(
      'SELECT setting_key, is_encrypted FROM settings WHERE category = ?',
      [category]
    );

    // Update each setting
    for (const [key, value] of Object.entries(settings as any)) {
      // Convert camelCase back to snake_case
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      
      // Find if this setting should be encrypted
      const currentSetting = currentSettings.find((s: any) => s.setting_key === snakeKey);
      let finalValue = String(value);
      let isEncrypted = false;

      if (currentSetting && currentSetting.is_encrypted) {
        // Encrypt sensitive data
        finalValue = encrypt(finalValue);
        isEncrypted = true;
      }

      await executeQuery(
        `UPDATE settings SET setting_value = ?, updated_at = NOW() WHERE setting_key = ?`,
        [finalValue, snakeKey]
      );
    }

    return NextResponse.json({
      success: true,
      message: `${category} settings updated successfully`
    });

  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}