/**
 * Safe LocalStorage Adapter with in-memory fallback.
 * Prevents application crashes in environments with disabled storage,
 * private browsing restrictions, or quota exceeded errors.
 */

class SafeStorage {
  private memoryFallback: Map<string, string> = new Map();
  private isAvailable: boolean | null = null;

  private checkAvailability(): boolean {
    if (this.isAvailable !== null) return this.isAvailable;
    if (typeof window === "undefined") {
      this.isAvailable = false;
      return false;
    }
    try {
      const testKey = "__recipehub_storage_test__";
      window.localStorage.setItem(testKey, "1");
      window.localStorage.removeItem(testKey);
      this.isAvailable = true;
      return true;
    } catch {
      this.isAvailable = false;
      return false;
    }
  }

  getItem(key: string): string | null {
    if (this.checkAvailability()) {
      try {
        return window.localStorage.getItem(key);
      } catch (e) {
        console.warn(`[SafeStorage] Error reading key "${key}":`, e);
      }
    }
    return this.memoryFallback.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    if (this.checkAvailability()) {
      try {
        window.localStorage.setItem(key, value);
        return;
      } catch (e) {
        console.warn(`[SafeStorage] Error setting key "${key}", falling back to memory:`, e);
      }
    }
    this.memoryFallback.set(key, value);
  }

  removeItem(key: string): void {
    if (this.checkAvailability()) {
      try {
        window.localStorage.removeItem(key);
      } catch (e) {
        console.warn(`[SafeStorage] Error removing key "${key}":`, e);
      }
    }
    this.memoryFallback.delete(key);
  }

  getJSON<T>(key: string, fallback: T): T {
    const raw = this.getItem(key);
    if (!raw) return fallback;
    try {
      return JSON.parse(raw) as T;
    } catch (e) {
      console.warn(`[SafeStorage] Error parsing JSON for key "${key}":`, e);
      return fallback;
    }
  }

  setJSON<T>(key: string, value: T): void {
    try {
      this.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`[SafeStorage] Error serializing JSON for key "${key}":`, e);
    }
  }
}

export const safeStorage = new SafeStorage();
