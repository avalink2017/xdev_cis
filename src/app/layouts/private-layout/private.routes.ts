import { Routes } from '@angular/router';

export const PRIVATE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./private-layout').then((m) => m.PrivateLayout),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('../../pages/private/dashboard/dashboard').then((m) => m.default),
      },
      {
        path: 'config/bancos',
        loadComponent: () =>
          import('../../features/configuration/bank/page/bank/bank').then((m) => m.Bank),
      },
      {
        path: 'config/tipo-ingreso',
        loadComponent: () =>
          import('../../features/configuration/tipo-ingreso/page/tipo-ingreso/tipo-ingreso').then(
            (m) => m.TipoIngreso,
          ),
      },
      {
        path: 'config/tipo-egreso',
        loadComponent: () =>
          import('../../features/configuration/tipo-egreso/page/tipo-egreso/tipo-egreso').then(
            (m) => m.TipoEgreso,
          ),
      },
      {
        path: 'config/tipo-doc',
        loadComponent: () =>
          import('../../features/configuration/tipo-documento/page/tipo-documento/tipo-documento').then(
            (m) => m.TipoDocumento,
          ),
      },
      {
        path: 'config/cuentas-banco',
        loadComponent: () =>
          import('../../features/configuration/bank-account/page/bank-account/bank-account').then(
            (m) => m.BankAccount,
          ),
      },
      {
        path: 'config/asset-category',
        loadComponent: () =>
          import('../../features/configuration/asset-category/page/asset-category/asset-category').then(
            (m) => m.AssetCategory,
          ),
      },
      {
        path: 'config/asset-location',
        loadComponent: () =>
          import('../../features/configuration/asset-location/page/asset-location/asset-location').then(
            (m) => m.AssetLocation,
          ),
      },
      {
        path: 'config/asset-status',
        loadComponent: () =>
          import('../../features/configuration/asset-status/page/asset-status/asset-status').then(
            (m) => m.AssetStatus,
          ),
      },
      {
        path: 'config/brand',
        loadComponent: () =>
          import('../../features/configuration/brand/page/brand/brand').then((m) => m.Brand),
      },

      {
        path: 'partner/category',
        loadComponent: () =>
          import('../../features/partner/pages/partner-category/partner-category').then(
            (m) => m.PartnerCategory,
          ),
      },
      {
        path: 'partner/type',
        loadComponent: () =>
          import('../../features/partner/pages/partner-type/partner-type').then(
            (m) => m.PartnerType,
          ),
      },
      {
        path: 'partner/role',
        loadComponent: () =>
          import('../../features/partner/pages/partner-role/partner-role').then(
            (m) => m.PartnerRole,
          ),
      },
      {
        path: 'partner',
        loadComponent: () =>
          import('../../features/partner/pages/partner/partner').then((m) => m.Partner),
      },

      // Operaciones
      {
        path: 'operation/periodo',
        loadComponent: () =>
          import('../../features/operation/periodo/page/periodo/periodo').then((m) => m.Periodo),
      },
      {
        path: 'operation/ingreso',
        loadComponent: () =>
          import('../../features/operation/ingreso/page/ingreso/ingreso').then((m) => m.Ingreso),
      },
      {
        path: 'operation/ingreso/create',
        loadComponent: () =>
          import('../../features/operation/ingreso/page/ingreso-edit/ingreso-edit').then(
            (m) => m.IngresoEdit,
          ),
      },
      {
        path: 'operation/ingreso/edit/:inid',
        loadComponent: () =>
          import('../../features/operation/ingreso/page/ingreso-edit/ingreso-edit').then(
            (m) => m.IngresoEdit,
          ),
      },

      {
        path: 'operation/egreso',
        loadComponent: () =>
          import('../../features/operation/egreso/pages/egreso/egreso').then((m) => m.Egreso),
      },
      {
        path: 'operation/egreso/create',
        loadComponent: () =>
          import('../../features/operation/egreso/pages/egreso-edit/egreso-edit').then(
            (m) => m.EgresoEdit,
          ),
      },
      {
        path: 'operation/egreso/edit/:egid',
        loadComponent: () =>
          import('../../features/operation/egreso/pages/egreso-edit/egreso-edit').then(
            (m) => m.EgresoEdit,
          ),
      },

      {
        path: 'admin/user',
        loadComponent: () =>
          import('../../features/administration/user/page/user/user').then((m) => m.User),
      },

      {
        path: 'inventory/asset',
        loadComponent: () =>
          import('../../features/inventory/asset/page/asset/asset').then((m) => m.Asset),
      },

      {
        path: 'report/consolidated',
        loadComponent: () =>
          import('../../features/reports/consolidated-report/consolidated-report').then((m) => m.ConsolidatedReport),
      },
    ],
  },
];
