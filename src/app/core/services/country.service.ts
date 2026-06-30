import { inject, Injectable, signal } from '@angular/core';
import { firstValueFrom, Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { urlCity, urlCountry, urlDistrict, urlRegion } from './endpoint.service';

export interface CountryListDTO {
  id: string;
  code: string;
  name: string;
}

export interface RegionListDTO {
  id: string;
  code: string;
  name: string;
  countryId: string;
}

export interface CityListDTO {
  id: string;
  code: string;
  name: string;
  regionId: string;
}

export interface DistrictListDTO {
  id: string;
  code: string;
  name: string;
  cityId: string;
}

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private api = inject(ApiService);

  countryList = signal<CountryListDTO[]>([]);
  regionList = signal<RegionListDTO[]>([]);
  cityList = signal<CityListDTO[]>([]);
  districtList = signal<DistrictListDTO[]>([]);

  selectedCountryId = signal<string>('');
  selectedRegionId = signal<string | null>(null);
  selectedCityId = signal<string | null>(null);
  selectedDistrictId = signal<string | null>(null);

  constructor() {
    this.getCountry();
  }

  onCountryChange(countryId: string) {
    this.selectedCountryId.set(countryId);
    this.selectedRegionId.set(null);
    this.selectedCityId.set(null);
    this.selectedDistrictId.set(null);
    this.regionList.set([]);
    this.cityList.set([]);
    this.districtList.set([]);
    this.loadRegions().subscribe();
  }

  onRegionChange(regionId: string) {
    this.selectedRegionId.set(regionId);
    this.selectedCityId.set(null);
    this.selectedDistrictId.set(null);
    this.cityList.set([]);
    this.districtList.set([]);
    this.loadCities().subscribe();
  }

  onCityChange(cityId: string) {
    this.selectedCityId.set(cityId);
    this.selectedDistrictId.set(null);
    this.districtList.set([]);
    this.loadDistricts().subscribe();
  }

  async initForEdit(
    countryId: string,
    regionId: string | null,
    cityId: string | null,
    districtId: string | null,
  ) {
    if (this.countryList().length === 0) {
      await firstValueFrom(
        this.api
          .get<CountryListDTO[]>(`${urlCountry}/list`)
          .pipe(tap((res) => this.countryList.set(res))),
      );
    }

    this.selectedCountryId.set(countryId);
    this.regionList.set([]);
    this.cityList.set([]);
    this.districtList.set([]);
    this.selectedRegionId.set(null);
    this.selectedCityId.set(null);
    this.selectedDistrictId.set(null);

    const regions = await firstValueFrom(this.loadRegions());

    if (!regionId) return;

    this.selectedRegionId.set(regionId);
    this.cityList.set([]);
    this.districtList.set([]);
    this.selectedCityId.set(null);
    this.selectedDistrictId.set(null);

    const cities = await firstValueFrom(this.loadCities());

    if (!cityId) return;

    this.selectedCityId.set(cityId);
    this.districtList.set([]);
    this.selectedDistrictId.set(null);

    const districts = await firstValueFrom(this.loadDistricts());

    if (districtId) {
      this.selectedDistrictId.set(districtId);
    }
  }

  private getCountry() {
    this.api
      .get<CountryListDTO[]>(`${urlCountry}/list`)
      .subscribe({ next: (res) => this.countryList.set(res) });
  }

  private loadRegions(): Observable<RegionListDTO[]> {
    return this.api
      .get<RegionListDTO[]>(`${urlRegion}/list?countryid=${this.selectedCountryId()}`)
      .pipe(tap((res) => this.regionList.set(res)));
  }

  private loadCities(): Observable<CityListDTO[]> {
    return this.api
      .get<CityListDTO[]>(`${urlCity}/list?regionid=${this.selectedRegionId()}`)
      .pipe(tap((res) => this.cityList.set(res)));
  }

  private loadDistricts(): Observable<DistrictListDTO[]> {
    return this.api
      .get<DistrictListDTO[]>(`${urlDistrict}/list?cityid=${this.selectedCityId()}`)
      .pipe(tap((res) => this.districtList.set(res)));
  }
}
