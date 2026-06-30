export interface PartnerDTO {  
  id: string;
  code: string;
  name: string;
  tradeName: string;
  partnerTypeId: string;
  partnerCategoryId:string;
  email:string;
  phone:string;
  active:boolean;
  address:string;
  countryId:string;
  regionId:string;
  cityId:string;
  districtId:string;
  nit:string;
  nrc:string;
  dui:string;
  passport:string;
  roles: string[];
  concurrencyStamp: string;
}

export interface PartnerListDTO {
  id: string;
  code: string;
  name: string;
  partnerTypeId: string;
  partnerTypeName: string;
  partnerCategoryId: string;
  partnerCategoryName: string;
  email: string;
  active: boolean;
  nit: string;  
  dui: string;
}
