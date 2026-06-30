import { Component, Input, OnChanges, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { LucideIcon, LucideIconData } from '@lucide/angular';
import { IconRegistryService } from '../../../core/services/icon.registry.service';


@Component({
  selector: 'app-icon',
  standalone: true,
  template: `<span
    [innerHTML]="svg"
    class="inline-flex items-center justify-center leading-none"
    [style.width.px]="size"
    [style.height.px]="size"
  ></span>`,
  host: { class: 'inline-flex' },
})
export class Icon implements OnChanges {
  @Input() icon?: LucideIcon | LucideIconData;

  /** Nombre string del Ã­cono registrado en icons.registry.ts. */
  @Input() name?: string;

  @Input() size: number = 16;
  @Input() color: string = 'currentColor';
  @Input() strokeWidth: number = 2;

  private sanitizer = inject(DomSanitizer);
  private registry = inject(IconRegistryService);

  svg!: SafeHtml;

  ngOnChanges(): void {
    const iconData = this.resolveIcon();

    if (!iconData) {
      if (this.name) {
        console.warn(
          `[IconComponent] Ãcono "${this.name}" no encontrado en el registry. Agrégalo en icons.registry.ts`,
        );
      }
      this.svg = this.sanitizer.bypassSecurityTrustHtml('');
      return;
    }

    this.svg = this.sanitizer.bypassSecurityTrustHtml(this.buildSvg(iconData));
  }

  private resolveIcon(): LucideIconData | null {
    if (this.icon) return this.toData(this.icon);
    if (this.name) return this.registry.get(this.name);
    return null;
  }

  /** Normaliza un componente Lucide (clase) o sus datos a `LucideIconData`. */
  private toData(icon: LucideIcon | LucideIconData): LucideIconData {
    return typeof icon === 'function' ? (icon as LucideIcon).icon : icon;
  }

  private buildSvg(iconData: LucideIconData): string {
    const nodes = iconData.node
      .map(([tag, attrs]) => {
        const attrStr = Object.entries(attrs)
          .map(([k, v]) => `${k}="${v}"`)
          .join(' ');
        return `<${tag} ${attrStr}/>`;
      })
      .join('');

    return `<svg
      xmlns="http://www.w3.org/2000/svg"
      width="${this.size}"
      height="${this.size}"
      viewBox="0 0 24 24"
      fill="none"
      stroke="${this.color}"
      stroke-width="${this.strokeWidth}"
      stroke-linecap="round"
      stroke-linejoin="round"
    >${nodes}</svg>`;
  }
}
