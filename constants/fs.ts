import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';
const KEY_PREFIX = 'expo_fs:';

async function ensureNativeFs() {
  // dynamic import so bundlers for web don't try to load expo-file-system
  const fs = await import('expo-file-system');
  return fs as any;
}

export async function fileExists(filename: string): Promise<boolean> {
  if (isWeb) {
    return localStorage.getItem(KEY_PREFIX + filename) !== null;
  }

  try {
    const fs = await ensureNativeFs();
    const { File, Paths } = fs;
    const file = new File(Paths.document, filename);
    return !!file.exists;
  } catch (e) {
    console.warn('fileExists native check failed', e);
    return false;
  }
}

export async function readFileText(filename: string): Promise<string | null> {
  if (isWeb) {
    const v = localStorage.getItem(KEY_PREFIX + filename);
    return v === null ? null : v;
  }

  try {
    const fs = await ensureNativeFs();
    const { File, Paths } = fs;
    const file = new File(Paths.document, filename);
    if (!file.exists) return null;
    // File.textSync may be synchronous, but keep awaiting in case (compat)
    const text = await file.textSync();
    return text ?? null;
  } catch (e) {
    console.warn('readFileText native read failed', e);
    return null;
  }
}

export async function writeFileText(filename: string, text: string): Promise<void> {
  if (isWeb) {
    localStorage.setItem(KEY_PREFIX + filename, text);
    return;
  }

  try {
    const fs = await ensureNativeFs();
    const { File, Paths } = fs;
    const file = new File(Paths.document, filename);
    await file.write(text);
  } catch (e) {
    console.warn('writeFileText native write failed', e);
  }
}

export async function removeFile(filename: string): Promise<void> {
  if (isWeb) {
    localStorage.removeItem(KEY_PREFIX + filename);
    return;
  }

  try {
    const fs = await ensureNativeFs();
    const { File, Paths } = fs;
    const file = new File(Paths.document, filename);
    // expo-file-system File doesn't seem to have a delete method on all platforms; attempt write empty
    if (file.exists) {
      try {
        await file.delete();
      } catch (e) {
        // fallback: overwrite with empty
        await file.write('');
      }
    }
  } catch (e) {
    console.warn('removeFile native remove failed', e);
  }
}

export default {
  fileExists,
  readFileText,
  writeFileText,
  removeFile,
};

/**
 * Return a File-like object that matches the minimal API used in the app.
 * On web this is a small wrapper around localStorage. On native it returns
 * the real `File` instance from `expo-file-system` (dynamically imported).
 *
 * Usage:c
 *   const file = await getFile('products.json');
 *   if (!file.exists) await file.create?.();
 *   const text = await file.textSync();
 *   await file.write('...');
 */
export async function getFile(filename: string) {
  if (isWeb) {
    const key = KEY_PREFIX + filename;
    const wrapper = {
      get exists() {
        return localStorage.getItem(key) !== null;
      },
      async create() {
        if (localStorage.getItem(key) === null) {
          localStorage.setItem(key, '');
        }
      },
      async textSync() {
        // keep the same name used elsewhere (textSync)
        const v = localStorage.getItem(key);
        return v === null ? '' : v;
      },
      async write(text: string) {
        localStorage.setItem(key, text);
      },
      async delete() {
        localStorage.removeItem(key);
      },
    } as const;

    return wrapper as unknown as any;
  }

  const fsModule = await ensureNativeFs();
  const { File, Paths } = fsModule;
  const file = new File(Paths.document, filename);
  return file;
}
