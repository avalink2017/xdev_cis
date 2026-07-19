import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EndpointService {
  private env = environment;

  get apiUrl(): string {
    return this.env.apiUrl;
  }

  buildUrl(endpoint: string): string {
    const base = this.env.apiUrl.endsWith('/') ? this.env.apiUrl.slice(0, -1) : this.env.apiUrl;
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${base}${path}`;
  }
}

export const urlAccount = 'account';
export const urlBank = 'banco';
export const urlTpoIngreso = 'tipoingreso';
export const urlTpoEgreso = 'tipoegreso';
export const urlTpoDocumento = 'tipodocfin';
export const urlCuentaBanco = 'cuentabanco';
export const urlPartnerCategory = 'partnercategory';
export const urlPartnerType = 'partnertype';
export const urlPartnerRole = 'partnerrole';
export const urlPartner = 'partner';
export const urlCountry = 'country';
export const urlRegion = 'region';
export const urlCity = 'city';
export const urlDistrict = 'district';
export const urlIngreso = 'ingreso';
export const urlEgreso = 'egreso';
export const urlUser = 'user';
export const urlRole = 'role';
export const urlAssetCategory = 'assetcategory';
export const urlAssetLocation = 'assetlocation';
export const urlAssetStatus = 'assetstatus';
export const urlBrand = 'brand';
export const urlAsset = 'asset';
export const urlCierreMes = 'cierremes';
export const urlReportOperationConsolidated = 'operationconsolited';
export const urlReportOperationDetail = 'operationdetail';
export const urlReportBankingBook = 'bankingbook';
export const urlRolePermission = 'rolepermission';
export const urlPermissionMatrix = 'permissionmatrix';
export const urlAppSettings = 'appsettings'