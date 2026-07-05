import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-periodo-form',
  imports: [],
  templateUrl: './periodo-form.html',
  styleUrl: './periodo-form.css',
})
export class PeriodoForm {
  entityId = input<string | null>(null);
  formClose = output<boolean>();
}
