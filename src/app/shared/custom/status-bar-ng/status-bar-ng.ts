import { Component, computed, input } from '@angular/core';
import { StatusItem } from './statusbar.model.dto';
import { Icon } from "../../components/icon/icon";

@Component({
  selector: 'app-status-bar-ng',
  imports: [Icon],
  templateUrl: './status-bar-ng.html',
  styleUrl: './status-bar-ng.css',
})
export class StatusBarNg {
  // ── Inputs / Outputs ──────────────────────────────────────────────────────

  /** Lista de estados a mostrar. */
  statuses = input.required<StatusItem[]>();

  /** Id del estado activo. Solo lectura — controlado por el componente padre. */
  activeId = input<string | undefined | null>(null);

  /** Modo compacto: muestra solo el activo + popover para los demás. */
  compact = input<boolean>(false);

  // ── ViewChild ─────────────────────────────────────────────────────────────

  // ── Estado derivado ───────────────────────────────────────────────────────

  /** Estado actualmente seleccionado (fallback al primero si activeId no coincide). */
  activeStatus = computed<StatusItem | null>(() => {
    const id = this.activeId();
    const list = this.statuses();
    return list.find((s) => s.id === id) ?? list[0] ?? null;
  });

  // ── Utilidades de estilo ──────────────────────────────────────────────────

  /** Retorna si un StatusItem es el estado activo. */
  isActive(item: StatusItem): boolean {
    return item.id === this.activeStatus()?.id;
  }

  /**
   * Clases del item según su estado activo/inactivo.
   * Las clases del item (item.classes) solo se aplican cuando está activo.
   */
  itemClass(item: StatusItem): string {
    const base = 'inline-flex items-center gap-1 px-3 py-1 rounded-md text-sm select-none';
    return this.isActive(item) ? `${base} font-medium ${item.classes}` : `${base} text-muted-color`;
  }
}
