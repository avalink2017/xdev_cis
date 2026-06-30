import { HttpParams } from '@angular/common/http';

export function round2(n: number) {
  return parseFloat(
    n.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: false,
    }),
  );
}

export const toCents = (n: number) => Math.round(round2(n) * 100);

export function CreateQueryParams(obj: any): HttpParams {
  let queryParams = new HttpParams();

  for (const property in obj) {
    queryParams = queryParams.append(property, obj[property]);
  }

  return queryParams;
}

export function GetInitials(n: string) {
  return n
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

export default function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}
