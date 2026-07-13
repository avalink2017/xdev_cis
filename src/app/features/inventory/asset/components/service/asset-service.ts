import { inject, Injectable, signal } from '@angular/core';
import { BrandListDTO } from '../../../../configuration/brand/components/brand.model.dto';
import { AssetStatusListDTO } from '../../../../configuration/asset-status/components/asset-status.model.dto';
import { AssetCategoryListDTO } from '../../../../configuration/asset-category/components/asset-category.model.dto';
import { forkJoin } from 'rxjs';
import { ApiService } from '../../../../../core/services/api.service';
import {
  urlAssetCategory,
  urlAssetLocation,
  urlAssetStatus,
  urlBrand,
} from '../../../../../core/services/endpoint.service';
import { AssetLocationListDTO } from '../../../../configuration/asset-location/components/asset-location.model.dto';

@Injectable({
  providedIn: 'root',
})
export class AssetService {
  private api = inject(ApiService);

  brandList = signal<BrandListDTO[]>([]);
  statusList = signal<AssetStatusListDTO[]>([]);
  categoryList = signal<AssetCategoryListDTO[]>([]);
  locationList = signal<AssetLocationListDTO[]>([])

  constructor() {
    forkJoin({
      br: this.api.get<BrandListDTO[]>(`${urlBrand}/list`),
      st: this.api.get<AssetStatusListDTO[]>(`${urlAssetStatus}/list`),
      ct: this.api.get<AssetCategoryListDTO[]>(`${urlAssetCategory}/list`),
      lc: this.api.get<AssetLocationListDTO[]>(`${urlAssetLocation}/list`)
    }).subscribe({
      next: ({ br, st, ct, lc }) => {
        this.brandList.set(br);
        this.statusList.set(st);
        this.categoryList.set(ct);
        this.locationList.set(lc);
      },
    });
  }
}
