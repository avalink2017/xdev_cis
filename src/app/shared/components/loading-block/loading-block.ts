import { Component, input, model } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
  selector: 'app-loading-block',
  imports: [Dialog, ProgressSpinner],
  template: `<div>
    <p-dialog
      [(visible)]="visible"
      [modal]="true"
      [style]="{ width: '25rem' }"
      maskStyleClass="backdrop-blur-sm"
      [closeOnEscape]="false"
      appendTo="body"
    >
      <ng-template #headless>
        <div class="flex flex-col justify-center p-5">
          <div class="flex justify-center">
            <p-progress-spinner
              strokeWidth="5"
              fill="transparent"
              animationDuration=".5s"
              [style]="{ width: '50px', height: '50px' }"
            />
          </div>
          <h1 class="mx-auto">{{ message() || 'Cargando...' }}</h1>
        </div>
      </ng-template>
    </p-dialog>
  </div>`,
})
export class LoadingBlock {
  visible = model.required<boolean>();
  message = input<string>();
}
