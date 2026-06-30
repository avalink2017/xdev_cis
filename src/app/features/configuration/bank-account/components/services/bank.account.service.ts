import { inject, Injectable, signal } from '@angular/core';
import { BankListDTO } from '../../../bank/components/bank.model.dto';
import { ApiService } from '../../../../../core/services/api.service';
import { urlBank } from '../../../../../core/services/endpoint.service';

@Injectable({
  providedIn: 'root',
})
export class BankAccountService {
  private api = inject(ApiService);
  bankList = signal<BankListDTO[] | undefined>(undefined);

  getData() {
    this.api.get<BankListDTO[]>(`${urlBank}/list`).subscribe((res) => this.bankList.set(res));
  }
}
