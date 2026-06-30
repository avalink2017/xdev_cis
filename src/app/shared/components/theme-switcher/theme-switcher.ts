import { Component, computed, effect, inject, ViewChild } from '@angular/core';
import { Button } from 'primeng/button';
import { Drawer } from 'primeng/drawer';
import { Popover } from 'primeng/popover';
import { ThemePanel } from './theme-panel';
import { ThemeService } from '../../../core/services/theme.service';
import { DeviceService } from '../../../core/services/device.service';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  imports: [Button, Popover, Drawer, ThemePanel, Icon],
  template: `
    <div class="flex items-center">
      <p-button
        type="button"
        title="Personalizar tema"
        (click)="toggleOverlay($event)"
        styleClass="rounded-full! p-2"
      >
        <app-icon name="LucidePalette" [size]="16" />
      </p-button>

      <p-popover #popover>
        <div class="w-69">
          <app-theme-panel
            [primaryColors]="theme.primaryColors()"
            [surfaces]="theme.surfaces"
            [presetKeys]="theme.presetKeys"
            [selectedPrimary]="theme.themeState().primary"
            [selectedSurface]="theme.themeState().surface"
            [selectedPreset]="theme.themeState().preset"
            [darkMode]="theme.themeState().darkTheme"
            (primarySelected)="theme.selectPrimary($event)"
            (surfaceSelected)="theme.selectSurface($event)"
            (presetSelected)="theme.selectPreset($event)"
            (darkModeChange)="theme.toggleDarkMode()"
          />
        </div>
      </p-popover>

      @if (isHandsetOrTablet()) {
        <p-drawer
          [(visible)]="showDrawer"
          position="right"
          header="Personalización"
          appendTo="body"
        >
          <app-theme-panel
            [primaryColors]="theme.primaryColors()"
            [surfaces]="theme.surfaces"
            [presetKeys]="theme.presetKeys"
            [selectedPrimary]="theme.themeState().primary"
            [selectedSurface]="theme.themeState().surface"
            [selectedPreset]="theme.themeState().preset"
            [darkMode]="theme.themeState().darkTheme"
            (primarySelected)="theme.selectPrimary($event)"
            (surfaceSelected)="theme.selectSurface($event)"
            (presetSelected)="theme.selectPreset($event)"
            (darkModeChange)="theme.toggleDarkMode()"
          />
        </p-drawer>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
})
export class ThemeSwitcher {
  theme = inject(ThemeService);
  device = inject(DeviceService);

  @ViewChild('popover') popover?: Popover;

  showDrawer = false;

  isHandsetOrTablet = computed(() => this.device.isHandsetOrTablet());

  constructor() {
    effect(() => {
      if (this.device.isLarge()) this.showDrawer = false;
    });
  }

  toggleOverlay(event: MouseEvent) {
    if (this.device.isLarge()) {
      this.popover?.toggle(event);
    } else {
      this.showDrawer = true;
    }
  }
}
