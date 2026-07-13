import { Component, inject, signal } from '@angular/core';
import { Icon } from '../icon/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Button } from 'primeng/button';
import { AuthService } from '../../../core/services/auth.service';
import { DeviceService } from '../../../core/services/device.service';

interface MenuItem {
  label: string;
  icon: string;
  routerLink: string;
}

interface MenuGroup {
  label: string;
  items: MenuItem[];
}

@Component({
  selector: 'app-side-navbar',
  imports: [Icon, RouterLink, RouterLinkActive, Button],
  templateUrl: './side-navbar.html',
  styleUrl: './side-navbar.css',
})
export class SideNavbar {
  private auth = inject(AuthService);
  device = inject(DeviceService);

  openGroups = signal<string[]>(['INICIO', 'OPERACIONES', 'INFORMES', 'INVENTARIO']);

  groups: MenuGroup[] = [
    {
      label: 'INICIO',
      items: [
        {
          label: 'Dashboard',
          icon: 'LucideLayoutDashboard',
          routerLink: '/app/dashboard',
        },
      ],
    },
    {
      label: 'OPERACIONES',
      items: [
        {
          label: 'Ingresos',
          icon: 'LucideBanknoteArrowUp',
          routerLink: '/app/operation/ingreso',
        },
        {
          label: 'Egreso',
          icon: 'LucideBanknoteArrowDown',
          routerLink: '/app/operation/egreso',
        },
        {
          label: 'Períodos',
          icon: 'LucideCalendarCog',
          routerLink: '/app/operation/periodo',
        },
      ],
    },
    {
      label: 'INVENTARIO',
      items: [
        {
          label: 'Activo Fijo',
          icon: 'LucideBox',
          routerLink: '/app/inventory/asset',
        },
      ],
    },
    {
      label: 'INFORMES',
      items: [
        {
          label: 'Consolidado',
          icon: 'LucideBook',
          routerLink: '/app/report/consolidated',
        },
        {
          label: 'Libro Banco',
          icon: 'LucideBook',
          routerLink: '/app/report/bankingbook',
        },
      ],
    },
    {
      label: 'CATÁLOGOS',
      items: [
        {
          label: 'Bancos',
          icon: 'LucideLandmark',
          routerLink: '/app/config/bancos',
        },
        {
          label: 'Tipo Ingreso',
          icon: 'LucideBanknoteArrowUp',
          routerLink: '/app/config/tipo-ingreso',
        },
        {
          label: 'Tipo Egreso',
          icon: 'LucideBanknoteArrowDown',
          routerLink: '/app/config/tipo-egreso',
        },
        {
          label: 'Tipo Documento',
          icon: 'LucideFileCheck',
          routerLink: '/app/config/tipo-doc',
        },
        {
          label: 'Cuentas Bancarias',
          icon: 'LucideWalletMinimal',
          routerLink: '/app/config/cuentas-banco',
        },
        {
          label: 'Categoría Activo',
          icon: 'LucideFolderTree',
          routerLink: '/app/config/asset-category',
        },
        {
          label: 'Ubicación Activo',
          icon: 'LucideMapPin',
          routerLink: '/app/config/asset-location',
        },
        {
          label: 'Estado Activo',
          icon: 'LucideBadgeCheck',
          routerLink: '/app/config/asset-status',
        },
        {
          label: 'Marca',
          icon: 'LucideTag',
          routerLink: '/app/config/brand',
        },
      ],
    },
    {
      label: 'SOCIOS COMERCIALES',
      items: [
        {
          label: 'Socios',
          icon: 'LucideUsers',
          routerLink: '/app/partner',
        },
        {
          label: 'Categorías',
          icon: 'LucideSquareUser',
          routerLink: '/app/partner/category',
        },
        {
          label: 'Tipos',
          icon: 'LucideListTree',
          routerLink: '/app/partner/type',
        },
        {
          label: 'Roles',
          icon: 'LucideUserCog',
          routerLink: '/app/partner/role',
        },
      ],
    },
    {
      label: 'ADMINISTRACIÓN',
      items: [
        {
          label: 'Usuarios',
          icon: 'LucideUserRound',
          routerLink: '/app/admin/user',
        },
        {
          label: 'Roles',
          icon: 'LucideUserRoundKey',
          routerLink: '/app/admin/role',
        },
      ],
    },
  ];

  protected toggleGroup(label: string) {
    this.openGroups.update((open) =>
      open.includes(label) ? open.filter((l) => l !== label) : [...open, label],
    );
  }

  logOut() {
    this.auth.logout();
  }
}
