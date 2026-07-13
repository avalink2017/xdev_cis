import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  contentChild,
  effect,
  inject,
  input,
  model,
  output,
  signal,
  TemplateRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormValueControl, ValidationError, WithOptionalFieldTree } from '@angular/forms/signals';
import { AutoComplete, AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { ApiService } from '../../../core/services/api.service';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-search-autocomplete',
  imports: [AutoComplete, FormsModule, NgTemplateOutlet],
  template: `<div class="flex flex-col gap-1">
    <label
      [for]="name()"
      class="text-sm ms-2"
      [class.text-red-400]="required() && invalid() && touched()"
      >{{ label() }}</label
    >
    <p-autocomplete
      [suggestions]="items()"
      (completeMethod)="filterItems($event)"
      [optionLabel]="optionLabel()"
      [(ngModel)]="selectedObject"
      (ngModelChange)="onSelectedObjectChange($event)"
      [dropdown]="dropdown()"
      [disabled]="disabled()"
      [inputId]="name()"
      fluid
      (onBlur)="touched.set(true)"
      (onSelect)="onItemSelect($event)"
      (onClear)="onClear()"
      [showClear]="showClear()"
      [invalid]="invalid()"
      [panelStyle]="{ 'max-width': '90vw', width: 'auto' }"
      appendTo="body"
      [size]="size()"
      [placeholder]="placeHolder()"
    >
      <ng-template let-row #item>
        @if (itemTemplate(); as tpl) {
          <ng-container [ngTemplateOutlet]="tpl" [ngTemplateOutletContext]="{ $implicit: row }" />
        } @else {
          <span class="text-sm">{{ row[optionLabel()] }}</span>
        }
      </ng-template>

      <ng-template #header>
        @if (headerText()) {
          <div class="text-sm font-medium px-3 py-2">{{ headerText() }}</div>
        }
      </ng-template>
    </p-autocomplete>
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchAutocomplete implements FormValueControl<string> {
  // Required — stores only the ID (primitive) for the form model
  value = model<string>('');

  // Writable interaction state - control updates these
  touched = model<boolean>(false);

  // Read-only state - form system manages these
  name = input<string>('');
  required = input<boolean>(false);
  disabled = input<boolean>(false);
  readonly = input<boolean>(false);
  hidden = input<boolean>(false);
  invalid = input<boolean>(false);
  errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([]);

  label = input<string>();
  autoFocus = input<boolean>(false);
  placeHolder = input<string>('Buscar');
  optionLabel = input<string>('name');
  optionValue = input<string>('id');
  headerText = input<string>('Resultados');
  showClear = input<boolean>(false);
  dropdown = input<boolean>(true);
  size = input<'small' | 'large' | undefined>(undefined);
  searchParam = input<string>('search');

  urlList = input.required<string>();
  urlEntity = input<string>('');

  selectionChange = output<any>();

  // Internal object used by p-autocomplete for display (needs the full object, not just the ID)
  selectedObject: any = null;

  private lastFilter = '';
  private api = inject(ApiService);
  private resolving = false;
  items = signal<any[]>([]);

  @ViewChild(AutoComplete) autoComplete?: AutoComplete;
  itemTemplate = contentChild<TemplateRef<{ $implicit: any }>>('itemTemplate');

  constructor() {
    effect(() => {
      const val = this.value();
      // When the form patches a new ID from outside (e.g. edit mode),
      // and the internal object doesn't match, resolve and display the entity.
      const currentId = this.selectedObject?.[this.optionValue()] ?? null;
      if (val && val !== currentId && !this.resolving) {
        this.resolveEntityById(val);
      } else if (!val && this.selectedObject) {
        // Form was cleared externally (e.g. reset)
        this.selectedObject = null;
      }
    });

    effect(() => {
      const url = this.urlList();
      if (url) this.getList('');
    });
  }

  filterItems(event: AutoCompleteCompleteEvent): void {
    if (event.query === this.lastFilter) {
      this.items.set([...this.items()]);
      return;
    }
    this.getList(event.query);
  }

  getList(filter: string): void {
    if (!this.urlList()) return;
    this.lastFilter = filter;
    this.api
      .get<
        any[]
      >(`${this.urlList()}${this.urlList()!.includes('?') ? '&' : '?'}${this.searchParam()}=${filter}`)
      .subscribe((res) => {
        this.items.set(res ?? []);
      });
  }

  /**
   * Resolves the full entity object for a given ID and sets selectedObject
   * so the autocomplete displays the label (name) instead of the raw ID.
   */
  private resolveEntityById(id: string): void {
    this.resolving = true;

    // 1. Try to find it in the already-loaded list first (avoids an extra HTTP call)
    const cached = this.items().find((item) => String(item[this.optionValue()]) === String(id));

    if (cached) {
      this.selectedObject = cached;
      this.resolving = false;
      return;
    }

    // 2. Fetch from the entity endpoint if available
    if (this.urlEntity()) {
      this.api.get<any>(this.urlEntity().replace('{id}', id)).subscribe({
        next: (res) => {
          if (res) {
            this.selectedObject = res;
            // Keep the entity in the suggestions list so it's selectable again
            this.items.update((list) => {
              const exists = list.find(
                (item) => item[this.optionValue()] === res[this.optionValue()],
              );
              return exists ? list : [res, ...list];
            });
            this.selectionChange.emit(res);
          }
          this.resolving = false;
        },
        error: () => {
          this.resolving = false;
        },
      });
    } else {
      // No entity URL configured — nothing we can do
      this.resolving = false;
    }
  }

  /** Called when the user picks an option from the dropdown. */
  onItemSelect(event: { value: any }): void {
    const obj = event.value;
    if (!obj) return;

    this.selectedObject = obj;
    // Write only the ID back to the form model
    this.value.set(obj[this.optionValue()]);

    if (this.urlEntity()) {
      this.api.get<any>(this.urlEntity().replace('{id}', obj[this.optionValue()])).subscribe({
        next: (res) => {
          if (res) {
            this.selectedObject = res;
            this.selectionChange.emit(res);
          }
        },
      });
    } else {
      this.selectionChange.emit(obj);
    }
  }

  /** Sync the form model ID whenever ngModel changes (e.g. programmatic clear). */
  onSelectedObjectChange(obj: any): void {
    if (!obj) {
      // Handles the case where the user manually clears the field via keyboard
      this.value.set('');
    }
  }

  onClear(): void {
    this.selectedObject = null;
    this.value.set('');
    this.selectionChange.emit(undefined);
  }
}
