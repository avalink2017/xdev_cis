import { EgresoDTO } from '../../features/operation/egreso/components/egreso.model.dto';
import { IngresoDTO } from '../../features/operation/ingreso/components/ingreso.model.dto';

export function Ingreso2FormData(dto: IngresoDTO): FormData {
  const formData = new FormData();

  if (dto.id > 0) formData.append('id', dto.id.toString());

  formData.append('fechaMovimiento', dto.fechaMovimiento.toISOString());
  formData.append('cuentaBancoId', dto.cuentaBancoId);
  formData.append('tipoIngresoId', dto.tipoIngresoId);
  formData.append('tipoDocumentoFinancieroId', dto.tipoDocumentoFinancieroId);
  formData.append('partnerId', dto.partnerId);
  formData.append('descripcion', dto.descripcion);
  formData.append('noDocumento', dto.noDocumento);
  formData.append('monto', dto.monto.toString());
  if (dto.urlDocument) formData.append('urlDocument', dto.urlDocument);
  formData.append('concurrencyStamp', dto.concurrencyStamp);

  return formData;
}

export function Egreso2FormData(dto: EgresoDTO): FormData {
  const formData = new FormData();

  if (dto.id > 0) formData.append('id', dto.id.toString());

  formData.append('fechaMovimiento', dto.fechaMovimiento.toISOString());
  formData.append('cuentaBancoId', dto.cuentaBancoId);
  formData.append('tipoEgresoId', dto.tipoEgresoId);
  formData.append('tipoDocumentoFinancieroId', dto.tipoDocumentoFinancieroId);
  formData.append('partnerId', dto.partnerId);
  formData.append('descripcion', dto.descripcion);
  formData.append('noDocumento', dto.noDocumento);
  formData.append('noCheque', dto.noCheque);
  formData.append('monto', dto.monto.toString());
  if (dto.urlDocument) formData.append('urlDocument', dto.urlDocument);
  formData.append('concurrencyStamp', dto.concurrencyStamp);

  return formData;
}