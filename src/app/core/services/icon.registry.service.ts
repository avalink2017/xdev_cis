import { Injectable } from '@angular/core';
import { LucideIcon, LucideIconData } from '@lucide/angular';

@Injectable({
  providedIn: 'root',
})
export class IconRegistryService {
  private readonly registry = new Map<string, LucideIconData>();

  register(icons: Record<string, LucideIcon | LucideIconData>): void {
    for (const [name, icon] of Object.entries(icons)) {
      // Los íconos de @lucide/angular v1 son componentes (clase) con `.icon`.
      const data = typeof icon === 'function' ? (icon as LucideIcon).icon : icon;
      this.registry.set(name, data);
    }
  }

  get(name: string): LucideIconData | null {
    return this.registry.get(name) ?? null;
  }
}
