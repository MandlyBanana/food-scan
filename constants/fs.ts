const KEY_PREFIX = 'expo_fs:';

/**
 * A File-like interface for working with localStorage data
 */
export interface FileInterface {
  exists: boolean;
  create(): Promise<void>;
  textSync(): Promise<string>;
  write(text: string): Promise<void>;
  delete(): Promise<void>;
}

/**
 * Gets a File-like interface for working with localStorage data.
 * Mimics the expo-file-system File API but uses localStorage instead.
 */
export function getFile(filename: string): FileInterface {
  const key = KEY_PREFIX + filename;
  return {
    get exists() {
      return localStorage.getItem(key) !== null;
    },
    async create() {
      if (localStorage.getItem(key) === null) {
        localStorage.setItem(key, '');
      }
    },
    async textSync() {
      const v = localStorage.getItem(key);
      return v === null ? '' : v;
    },
    async write(text: string) {
      localStorage.setItem(key, text);
    },
    async delete() {
      localStorage.removeItem(key);
    },
  };
}
