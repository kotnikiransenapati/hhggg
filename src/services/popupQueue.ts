/**
 * Sequential Popup Orchestrator (popupQueue.ts)
 * Prevents overlapping modals, welcome popups, spin wheels, and notices.
 * Items display sequentially with clean transition and dismissal hooks.
 */

export type PopupItemType = 'spin-wheel' | 'welcome-offer' | 'wholesale-kyc' | 'waitlist-alert';

export interface PopupItem {
  id: string;
  type: PopupItemType;
  priority: number; // lower number = higher priority
  payload?: any;
  delayMs?: number;
}

type PopupSubscriber = (activeItem: PopupItem | null) => void;

class PopupQueueManager {
  private queue: PopupItem[] = [];
  private activeItem: PopupItem | null = null;
  private subscribers: Set<PopupSubscriber> = new Set();
  private dismissedIds: Set<string> = new Set();

  constructor() {
    // Restore dismissed IDs from session storage
    if (typeof window !== 'undefined') {
      try {
        const saved = sessionStorage.getItem('farmdirect_dismissed_popups');
        if (saved) {
          const ids = JSON.parse(saved);
          this.dismissedIds = new Set(ids);
        }
      } catch (err) {
        console.warn('Session storage read error:', err);
      }
    }
  }

  public enqueue(item: PopupItem) {
    if (this.dismissedIds.has(item.id)) {
      return;
    }

    // Check if item or type already queued or active
    const alreadyExists = this.queue.some((q) => q.id === item.id) || this.activeItem?.id === item.id;
    if (alreadyExists) return;

    this.queue.push(item);
    // Sort by priority (ascending)
    this.queue.sort((a, b) => a.priority - b.priority);

    if (!this.activeItem) {
      this.processNext();
    }
  }

  public dismissCurrent(rememberSession: boolean = true) {
    if (this.activeItem) {
      if (rememberSession) {
        this.dismissedIds.add(this.activeItem.id);
        this.saveDismissedToStorage();
      }
      this.activeItem = null;
      this.notify();

      // Clean delay before showing next popup
      setTimeout(() => {
        this.processNext();
      }, 800);
    }
  }

  public getActiveItem(): PopupItem | null {
    return this.activeItem;
  }

  public subscribe(cb: PopupSubscriber): () => void {
    this.subscribers.add(cb);
    cb(this.activeItem);
    return () => {
      this.subscribers.delete(cb);
    };
  }

  private processNext() {
    if (this.activeItem || this.queue.length === 0) return;

    const next = this.queue.shift();
    if (!next) return;

    const delay = next.delayMs ?? 0;
    if (delay > 0) {
      setTimeout(() => {
        this.activeItem = next;
        this.notify();
      }, delay);
    } else {
      this.activeItem = next;
      this.notify();
    }
  }

  private notify() {
    this.subscribers.forEach((cb) => cb(this.activeItem));
  }

  private saveDismissedToStorage() {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(
          'farmdirect_dismissed_popups',
          JSON.stringify(Array.from(this.dismissedIds))
        );
      } catch (err) {
        console.warn('Session storage write error:', err);
      }
    }
  }
}

export const popupQueue = new PopupQueueManager();
