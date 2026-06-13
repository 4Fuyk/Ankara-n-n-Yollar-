// Resilient Hybrid Save/Load Storage Manager for Mobile WebViews and Tablets
class ResilientSaveManager {
  private memoryDb: Record<string, string> = {};

  constructor() {
    // Synchronize memory cache with localStorage if available on boot
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        for (let i = 1; i <= 5; i++) {
          const key = `secim_sim_save_slot_${i}`;
          const val = localStorage.getItem(key);
          if (val) {
            this.memoryDb[key] = val;
          }
        }
      }
    } catch (e) {
      console.warn("Storage Warning: LocalStorage is inaccessible (possibly due to WebView Incognito or browser storage blocks). Syncing with session in-memory storage fallback.", e);
    }
  }

  /**
   * Reads stored string value from localStorage or memory DB.
   */
  public getItem(key: string): string | null {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const val = localStorage.getItem(key);
        if (val) {
          this.memoryDb[key] = val; // keep memory in sync
          return val;
        }
      }
    } catch (e) {
      console.warn(`LocalStorage failed to read key "${key}":`, e);
    }
    return this.memoryDb[key] || null;
  }

  /**
   * Writes string value to localStorage and updates in-memory cache as double-lock sync.
   */
  public setItem(key: string, value: string): boolean {
    this.memoryDb[key] = value;
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(key, value);
        return true;
      }
    } catch (e) {
      console.error(`LocalStorage failed to write key "${key}":`, e);
    }
    return false;
  }

  /**
   * Deletes key from both localStorage and memory store.
   */
  public removeItem(key: string): void {
    delete this.memoryDb[key];
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(key);
      }
    } catch (e) {
      console.error(`LocalStorage failed to delete key "${key}":`, e);
    }
  }
}

export const saveManager = new ResilientSaveManager();
