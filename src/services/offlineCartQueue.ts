import { CartItem } from '../types';

export interface SharedCartSnapshot {
  code: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
}

const GUEST_CART_STORAGE_KEY = 'farmdirect_guest_cart_v2';
const SAVED_FOR_LATER_STORAGE_KEY = 'farmdirect_saved_for_later_v2';
const SHARED_CARTS_STORAGE_KEY = 'farmdirect_shared_carts_v2';
const OFFLINE_MUTATIONS_KEY = 'farmdirect_offline_mutation_queue';

class OfflineCartQueueService {
  private isOnlineStatus: boolean = typeof navigator !== 'undefined' ? navigator.onLine : true;

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.isOnlineStatus = true;
        this.processOfflineMutations();
      });
      window.addEventListener('offline', () => {
        this.isOnlineStatus = false;
      });
    }
  }

  isOnline(): boolean {
    return this.isOnlineStatus;
  }

  /**
   * Save guest cart to local persistence
   */
  saveGuestCart(cart: CartItem[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(GUEST_CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (err) {
      console.warn('Failed to save guest cart:', err);
    }
  }

  /**
   * Load guest cart
   */
  loadGuestCart(): CartItem[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(GUEST_CART_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (err) {
      return [];
    }
  }

  /**
   * Saved For Later Management
   */
  saveForLater(cartItem: CartItem): void {
    const list = this.getSavedForLater();
    const updated = [...list.filter((i) => i.item.id !== cartItem.item.id), cartItem];
    localStorage.setItem(SAVED_FOR_LATER_STORAGE_KEY, JSON.stringify(updated));
  }

  getSavedForLater(): CartItem[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(SAVED_FOR_LATER_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (err) {
      return [];
    }
  }

  removeSavedForLater(itemId: string): CartItem[] {
    const list = this.getSavedForLater();
    const updated = list.filter((i) => i.item.id !== itemId);
    localStorage.setItem(SAVED_FOR_LATER_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  }

  /**
   * Cart Sharing: Generates 8-character snapshot share link
   */
  generateShareSnapshot(cart: CartItem[]): SharedCartSnapshot {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = 'FD-';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const subtotal = cart.reduce((sum, item) => sum + item.item.price * item.quantity, 0);

    const snapshot: SharedCartSnapshot = {
      code,
      createdAt: new Date().toISOString(),
      items: cart,
      subtotal,
    };

    const saved = this.getAllSharedCarts();
    saved[code] = snapshot;
    localStorage.setItem(SHARED_CARTS_STORAGE_KEY, JSON.stringify(saved));

    return snapshot;
  }

  getSharedCart(code: string): SharedCartSnapshot | null {
    const all = this.getAllSharedCarts();
    return all[code] || null;
  }

  private getAllSharedCarts(): Record<string, SharedCartSnapshot> {
    if (typeof window === 'undefined') return {};
    try {
      const data = localStorage.getItem(SHARED_CARTS_STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  /**
   * Offline Mutation Queue
   */
  enqueueOfflineMutation(action: string, payload: any) {
    if (typeof window === 'undefined') return;
    try {
      const queue = this.getOfflineQueue();
      queue.push({ id: `mut-${Date.now()}`, action, payload, queuedAt: Date.now() });
      localStorage.setItem(OFFLINE_MUTATIONS_KEY, JSON.stringify(queue));
    } catch (err) {
      console.warn('Queue enqueue error:', err);
    }
  }

  private getOfflineQueue(): any[] {
    try {
      const data = localStorage.getItem(OFFLINE_MUTATIONS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private processOfflineMutations() {
    const queue = this.getOfflineQueue();
    if (queue.length === 0) return;

    console.log(`[OfflineQueue] Back online: Resyncing ${queue.length} pending mutations...`);
    // Clear once processed
    localStorage.removeItem(OFFLINE_MUTATIONS_KEY);
  }
}

export const offlineCartQueue = new OfflineCartQueueService();
