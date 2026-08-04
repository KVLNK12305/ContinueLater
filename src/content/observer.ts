export interface ObserverState {
  scrollPercent: number;
  currentTime: number;
  duration: number;
  pageNumber: number;
  totalPages: number;
  isIdle: boolean;
}

export type ObserverCallback = (state: ObserverState) => void;

export class PageObserver {
  private state: ObserverState = {
    scrollPercent: 0,
    currentTime: 0,
    duration: 0,
    pageNumber: 1,
    totalPages: 1,
    isIdle: false
  };

  private callbacks: ObserverCallback[] = [];
  private scrollListener: (() => void) | null = null;
  private videoListeners: Array<{ element: HTMLVideoElement; event: string; fn: any }> = [];
  private idleTimer: any = null;
  private idleTimeoutMs = 5 * 60 * 1000; // 5 minutes

  // Active engagement variables
  private activeTimeMs = 0;
  private activeTimeInterval: any = null;
  private onAutosaveCallbacks: Array<() => void> = [];

  constructor(idleMinutes = 5) {
    this.idleTimeoutMs = idleMinutes * 60 * 1000;
  }

  public start(): void {
    this.initScrollTracking();
    this.initVideoTracking();
    this.initIdleTracking();
    this.startActiveTimeTracking();
  }

  public subscribe(callback: ObserverCallback): () => void {
    this.callbacks.push(callback);
    return () => {
      this.callbacks = this.callbacks.filter((cb) => cb !== callback);
    };
  }

  public onAutosave(callback: () => void): () => void {
    this.onAutosaveCallbacks.push(callback);
    return () => {
      this.onAutosaveCallbacks = this.onAutosaveCallbacks.filter((cb) => cb !== callback);
    };
  }

  public getState(): ObserverState {
    return { ...this.state };
  }

  private notify(): void {
    const currentState = this.getState();
    this.callbacks.forEach((cb) => cb(currentState));
  }

  private triggerAutosave(): void {
    this.onAutosaveCallbacks.forEach((cb) => {
      try {
        cb();
      } catch (e) {
        console.error('[PageObserver] Error in autosave callback:', e);
      }
    });
  }

  private startActiveTimeTracking(): void {
    if (this.activeTimeInterval) clearInterval(this.activeTimeInterval);
    this.activeTimeInterval = setInterval(() => {
      // User is active if not idle and the page is currently visible
      const isVisible = typeof document !== 'undefined' ? document.visibilityState === 'visible' : true;
      if (!this.state.isIdle && isVisible) {
        this.activeTimeMs += 1000;
        if (this.activeTimeMs >= 20000) { // 20s threshold for autosave
          this.activeTimeMs = 0;
          this.triggerAutosave();
        }
      }
    }, 1000);
  }

  private initScrollTracking(): void {
    let ticking = false;
    this.scrollListener = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          this.updateScrollPercent();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', this.scrollListener, { passive: true });
    this.updateScrollPercent();
  }

  private updateScrollPercent(): void {
    const docEl = document.documentElement;
    const body = document.body;
    const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop || 0;
    const scrollHeight = (docEl.scrollHeight || body.scrollHeight || 1) - window.innerHeight;

    if (scrollHeight <= 0) {
      this.state.scrollPercent = 100;
    } else {
      const rawPercent = (scrollTop / scrollHeight) * 100;
      this.state.scrollPercent = Math.min(100, Math.max(0, Math.round(rawPercent)));
    }
    this.resetIdleTimer();
    this.notify();
  }

  private initVideoTracking(): void {
    const checkVideo = () => {
      const video = document.querySelector('video');
      if (video) {
        const updateVideoState = () => {
          this.state.currentTime = video.currentTime || 0;
          this.state.duration = video.duration || 0;
          this.notify();
        };

        ['timeupdate', 'play', 'pause', 'seeking', 'seeked'].forEach((evt) => {
          video.addEventListener(evt, updateVideoState);
          this.videoListeners.push({ element: video, event: evt, fn: updateVideoState });
        });

        updateVideoState();
      }
    };

    checkVideo();
    // Re-check periodically for dynamically added videos (SPA navigation)
    const interval = setInterval(checkVideo, 3000);
    setTimeout(() => clearInterval(interval), 30000);
  }

  private initIdleTracking(): void {
    const activityEvents = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    const handleActivity = () => {
      if (this.state.isIdle) {
        this.state.isIdle = false;
        this.notify();
      }
      this.resetIdleTimer();
    };

    activityEvents.forEach((evt) => window.addEventListener(evt, handleActivity, { passive: true }));
    this.resetIdleTimer();
  }

  private resetIdleTimer(): void {
    if (this.idleTimer) clearTimeout(this.idleTimer);
    this.idleTimer = setTimeout(() => {
      this.state.isIdle = true;
      this.notify();
    }, this.idleTimeoutMs);
  }

  public stop(): void {
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
    }
    this.videoListeners.forEach(({ element, event, fn }) => {
      element.removeEventListener(event, fn);
    });
    if (this.idleTimer) clearTimeout(this.idleTimer);
    if (this.activeTimeInterval) {
      clearInterval(this.activeTimeInterval);
    }
  }
}
