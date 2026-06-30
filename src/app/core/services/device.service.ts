import { computed, Injectable, OnDestroy, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DeviceService implements OnDestroy {
  private readonly cleanups: Array<() => void> = [];

  // Tailwind breakpoints — use window.matchMedia so the sidenav never affects the result
  private readonly _sm = this.watch('(min-width: 640px)');
  private readonly _md = this.watch('(min-width: 768px)');
  private readonly _lg = this.watch('(min-width: 1024px)');
  private readonly _xl = this.watch('(min-width: 1280px)');
  private readonly _2xl = this.watch('(min-width: 1536px)');

  readonly isSm = this._sm.asReadonly();
  readonly isMd = this._md.asReadonly();
  readonly isLg = this._lg.asReadonly();
  readonly isXl = this._xl.asReadonly();
  readonly is2xl = this._2xl.asReadonly();

  readonly isMobile = computed(() => !this._sm()); // < 640px
  readonly isTablet = computed(() => this._sm() && !this._lg()); // 640px – 1023px
  readonly isLarge = this._lg.asReadonly(); // ≥ 1024px
  readonly isHandsetOrTablet = computed(() => !this._lg()); // < 1024px

  private watch(query: string): WritableSignal<boolean> {
    const mql = window.matchMedia(query);
    const sig = signal(mql.matches);
    const handler = (e: MediaQueryListEvent) => sig.set(e.matches);
    mql.addEventListener('change', handler);
    this.cleanups.push(() => mql.removeEventListener('change', handler));
    return sig;
  }

  ngOnDestroy(): void {
    this.cleanups.forEach((fn) => fn());
  }
}
