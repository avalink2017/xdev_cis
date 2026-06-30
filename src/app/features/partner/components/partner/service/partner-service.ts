import { inject, Injectable, signal } from '@angular/core';
import { PartnerTypeListDTO } from '../../partner-type/partner.type.model.dto';
import { PartnerRoleListDTO } from '../../partner-role/partner.role.model.dto';
import { PartnerCategoryListDTO } from '../../partner-category/partner.category.model.dto';
import { forkJoin } from 'rxjs';
import { ApiService } from '../../../../../core/services/api.service';
import { urlPartnerCategory, urlPartnerRole, urlPartnerType } from '../../../../../core/services/endpoint.service';

@Injectable({
  providedIn: 'root',
})
export class PartnerService {
  private api = inject(ApiService)

  partnerTypes = signal<PartnerTypeListDTO[]>([])
  partnerRoles = signal<PartnerRoleListDTO[]>([])
  partnerCategories = signal<PartnerCategoryListDTO[]>([])
  
  constructor() {
    this.getData()    
  }

  getData(){
    forkJoin({
      pt: this.api.get<PartnerTypeListDTO[]>(`${urlPartnerType}/list`),
      pc: this.api.get<PartnerCategoryListDTO[]>(`${urlPartnerCategory}/list`),
      pr: this.api.get<PartnerRoleListDTO[]>(`${urlPartnerRole}/list`)
    }).subscribe({
      next:({pt,pc,pr}) => {
        this.partnerTypes.set(pt),
        this.partnerCategories.set(pc),
        this.partnerRoles.set(pr)
      }
    });
  }
}
