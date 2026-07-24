import { StatusItem } from "../../shared/custom/status-bar-ng/statusbar.model.dto";

export const Actives = [
  { label: 'Activo', value: true },
  { label: 'Inactivo', value: false },
];

export const FilterObservation = [
  { label: 'Observado', value: true },
  { label: 'Sin Observación', value: false },
];

export const IS_ADMIN = [
  { label: 'Es Administrador', value: true },
  { label: 'No es Administrador', value: false },
];

export const severityNG:
  | 'success'
  | 'secondary'
  | 'info'
  | 'warn'
  | 'danger'
  | 'contrast'
  | undefined
  | null = 'secondary';

  export const Months = [
    { label: 'Enero', value: '1' },
    { label: 'Febrero', value: '2' },
    { label: 'Marzo', value: '3' },
    { label: 'Abril', value: '4' },
    { label: 'Mayo', value: '5' },
    { label: 'Junio', value: '6' },
    { label: 'Julio', value: '7' },
    { label: 'Agosto', value: '8' },
    { label: 'Septiembre', value: '9' },
    { label: 'Octubre', value: '10' },
    { label: 'Noviembre', value: '11' },
    { label: 'Diciembre', value: '12' },
  ];

  export const statusOperation: StatusItem[] = [
    {
      id: 'draft',
      label: 'Borrador',
      icon: 'LucideEraser',
      classes: 'bg-orange-300 dark:bg-orange-500',
    },
    {
      id: 'confirmed',
      label: 'Confirmado',
      icon: 'LucideCircleCheckBig',
      classes: 'bg-green-300 dark:bg-green-700',
    },
    {
      id: 'canceled',
      label: 'Anulado',
      icon: 'LucideCircleX',
      classes: 'bg-red-600 text-white',
    },
  ];
