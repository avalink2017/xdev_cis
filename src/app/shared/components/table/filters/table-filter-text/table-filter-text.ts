import { Component, input } from '@angular/core';
import { TableModule } from "primeng/table";
import { Button } from "primeng/button";
import { FormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';

@Component({
  selector: 'app-table-filter-text',
  imports: [TableModule, Button, FormsModule, InputText],
  standalone: true,
  template: `<p-columnFilter
    [field]="field()"
    type="text"
    display="row"
    [showMenu]="false"
    styleClass="w-full"
  >
    <ng-template #filter let-value let-filter="filterCallback">
      <div class="flex w-full">
        <input
          type="text"
          pInputText
          [ngModel]="value"
          (keyup.enter)="onEnter($event, filter)"
          pSize="small"
          fluid
          placeholder="Filtrar..."
          class="border-0! bg-transparent! shadow-none!"
        />
        @if (value) {
          <p-button
            size="small"
            rounded
            text
            class="ml-2"
            (onClick)="filter('')"
            icon="pi pi-filter-slash"
          />
        }
      </div>
    </ng-template>
  </p-columnFilter>`,
})
export class TableFilterText {
  field = input.required<string>();

  onEnter(event: any, filterCallback: Function) {
    filterCallback(event.target.value);
  }
}
