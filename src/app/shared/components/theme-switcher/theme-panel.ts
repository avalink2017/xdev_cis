import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { SelectButton } from 'primeng/selectbutton';
import { ColorEntry, PresetKey, SurfaceEntry } from '../../../core/services/theme.service';


export type { ColorEntry, SurfaceEntry };

@Component({
  selector: 'app-theme-panel',
  standalone: true,
  imports: [FormsModule, ToggleSwitch, SelectButton],
  template: `
    <div class="flex flex-col gap-5">
      <!-- Primary Colors -->
      <section>
        <p class="section-title">Primary Colors</p>
        <div class="color-grid">
          @for (color of primaryColors; track color.name) {
            <button
              type="button"
              class="color-dot"
              [title]="color.name"
              [style.background-color]="
                color.name === 'noir' ? 'var(--p-text-color)' : color.palette[500]
              "
              [class.selected]="selectedPrimary === color.name"
              (click)="primarySelected.emit(color)"
            ></button>
          }
        </div>
      </section>

      <!-- Surface Colors -->
      <section>
        <p class="section-title">Surface Colors</p>
        <div class="color-grid">
          @for (surface of surfaces; track surface.name) {
            <button
              type="button"
              class="color-dot"
              [title]="surface.name"
              [style.background-color]="surface.palette[500]"
              [class.selected]="selectedSurface === surface.name"
              (click)="surfaceSelected.emit(surface)"
            ></button>
          }
        </div>
      </section>

      <!-- Preset -->
      <section>
        <p class="section-title">Preset</p>
        <p-selectbutton
          [options]="presetKeys"
          [ngModel]="selectedPreset"
          (ngModelChange)="presetSelected.emit($event)"
          size="small"
        />
      </section>

      <!-- Dark Mode -->
      <section class="flex items-center justify-between">
        <p class="section-title mb-0">Modo Oscuro</p>
        <p-toggleswitch [ngModel]="darkMode" (ngModelChange)="darkModeChange.emit($event)" />
      </section>
    </div>
  `,
  styles: [
    `
      .section-title {
        font-size: 0.8rem;
        font-weight: 600;
        margin: 0 0 0.5rem 0;
        color: var(--p-text-muted-color);
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }

      .color-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }

      .color-dot {
        width: 1.2rem;
        height: 1.2rem;
        border-radius: 50%;
        border: 2px solid transparent;
        cursor: pointer;
        padding: 0;
        transition:
          transform 0.15s,
          outline 0.15s;
        outline: 2px solid transparent;
        outline-offset: 2px;

        &:hover {
          transform: scale(1.15);
        }
        &.selected {
          outline-color: var(--p-primary-color);
        }
      }
    `,
  ],
})
export class ThemePanel {
  @Input() primaryColors: ColorEntry[] = [];
  @Input() surfaces: SurfaceEntry[] = [];
  @Input() presetKeys: PresetKey[] = [];
  @Input() selectedPrimary: string = 'noir';
  @Input() selectedSurface: string | null = null;
  @Input() selectedPreset: PresetKey = 'Aura';
  @Input() darkMode: boolean = false;

  @Output() primarySelected = new EventEmitter<ColorEntry>();
  @Output() surfaceSelected = new EventEmitter<SurfaceEntry>();
  @Output() presetSelected = new EventEmitter<PresetKey>();
  @Output() darkModeChange = new EventEmitter<boolean>();
}
