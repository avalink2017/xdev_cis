export interface AssetListDTO {
  id: string;
  inventoryCode: string;
  description: string;
  brandId: string;
  brandName: string;
  serialNumber: string;
  model: string;
  purchaseDate: Date;
  fechaDescargo: Date;
  lastUpdatedAt:Date;
  assetStatusId: string;
  assetStatusName: string;
  assetCategoryId: string;
  assetCategoryName: string;
  active: boolean;
}

export interface AssetDTO {
  id: string;
  inventoryCode: string;
  description: string;
  brandId: string;
  serialNumber: string;
  model: string;
  color: string;
  price: number;
  supplierId: string;
  invoiceNumber: string;
  purchaseDate: Date;
  fechaDescargo: Date|null;
  lastUpdatedAt: Date|null;
  assetStatusId: string;
  assetCategoryId: string;
  assetLocationId: string;
  active: boolean;
  notes: string;
  concurrencyStamp: string;
}
