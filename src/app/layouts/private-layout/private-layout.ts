import {
  Component,
  DestroyRef,
  effect,
  inject,
  signal,
  twoWayBinding,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { DeviceService } from '../../core/services/device.service';
import { Drawer } from "primeng/drawer";
import { filter } from 'rxjs';

@Component({
  selector: 'app-private-layout',
  imports: [RouterOutlet, Drawer],
  templateUrl: './private-layout.html',
})
export class PrivateLayout {
  protected readonly auth = inject(AuthService);
  protected readonly device = inject(DeviceService);

  private sideBarDesktop = viewChild('sideNavbarDesktop', { read: ViewContainerRef });
  private sideBarDrawer = viewChild('sideNavbarDrawer', { read: ViewContainerRef });
  private navBarContainer = viewChild('topNavbar', { read: ViewContainerRef });
  private drawerRef = viewChild<Drawer>('drawerRef');

  toggleSideBar = signal<boolean>(false);

  constructor() {
    effect(() => {
      if (this.device.isLarge()) {
        this.sideBarDrawer()?.clear();
        this.loadSideBarComponent(this.sideBarDesktop());
      } else {
        this.sideBarDesktop()?.clear();
        this.sideBarDrawer()?.clear();
      }
    });

    effect(() => {
      if (this.toggleSideBar() && !this.device.isLarge()) {
        const container = this.sideBarDrawer();
        if (container && container.length === 0) {
          this.loadSideBarComponent(container);
        }
      }
    });

    effect(() => this.createTopNavbar());

    inject(Router)
      .events.pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(inject(DestroyRef)),
      )
      .subscribe(() => this.drawerRef()?.close(new Event('close')));
  }

  private loadSideBarComponent(container: ViewContainerRef | undefined) {
    if (!container) return;
    container.clear();
    import('../../shared/components/side-navbar/side-navbar').then((m) => {
      container.createComponent(m.SideNavbar);
    });
  }

  private createTopNavbar() {
    this.navBarContainer()?.clear();
    import('../../shared/components/top-navbar/top-navbar').then((m) => {
      this.navBarContainer()?.createComponent(m.TopNavbar, {
        bindings: [twoWayBinding('toggle', this.toggleSideBar)],
      });
    });
  }
}
