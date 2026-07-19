import { Component, inject, model, OnInit, signal } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { ApiService } from '../../../../../core/services/api.service';
import { urlPermissionMatrix, urlRole, urlRolePermission } from '../../../../../core/services/endpoint.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { RoleListDTO } from '../../../role/component/role.model.dto';
import { ActionColumnDTO, MatrixNodeData, PermissionMatrixDTO, RolePermissionAssignDTO } from '../permission-matrix.model.dto';
import { Select } from "primeng/select";
import { Button } from "primeng/button";
import { ProgressSpinner } from "primeng/progressspinner";
import { FormsModule } from '@angular/forms';
import { Checkbox } from 'primeng/checkbox';
import { TreeTableModule } from 'primeng/treetable';
import { Router } from '@angular/router';

@Component({
  selector: 'app-role-permission-view',
  imports: [FormsModule, TreeTableModule, Select, Checkbox, Button, ProgressSpinner],
  templateUrl: './role-permission-view.html',
  styleUrl: './role-permission-view.css',
})
export class RolePermissionView implements OnInit {
  refresh = model<boolean>(false);
  private api = inject(ApiService);
  private nt = inject(NotificationService);
  private router = inject(Router)

  // ── Estado ────────────────────────────────────────────────────
  roles = signal<RoleListDTO[]>([]);
  columns = signal<ActionColumnDTO[]>([]);
  nodes = signal<TreeNode<MatrixNodeData>[]>([]);
  frozenColumns = signal([{ actionKey: '', displayName: 'Modulo / Entidad', displayOrder: 0 }]);

  // Propiedad plana para [(ngModel)] del p-select — signals no son compatibles con ngModel
  selectedRoleId: string | null = null;

  // Fuente de verdad para permisos: Set de actionIds actualmente permitidos
  allowedActionIds = signal<Set<string>>(new Set());

  isLoadingRoles = signal(false);
  isLoadingMatrix = signal(false);
  isSaving = signal(false);

  // ── Ciclo de vida ─────────────────────────────────────────────
  ngOnInit(): void {
    this.loadRoles();
  }

  // ── Carga de datos ────────────────────────────────────────────
  loadRoles(): void {
    this.isLoadingRoles.set(true);
    this.api.get<RoleListDTO[]>(`${urlRole}/list`).subscribe({
      next: (res) => {
        this.roles.set(res);
        this.isLoadingRoles.set(false);
      },
      error: () => 
        this.isLoadingRoles.set(false)        
      ,
    });
  }

  onRoleChange(roleId: string | null): void {
    this.selectedRoleId = roleId;
    if (!roleId) {
      this.columns.set([]);
      this.nodes.set([]);
      this.allowedActionIds.set(new Set());
      return;
    }
    this.loadMatrix(roleId);
  }

  loadMatrix(roleId: string): void {
    this.isLoadingMatrix.set(true);
    this.api.get<PermissionMatrixDTO>(`${urlPermissionMatrix}/${roleId}`).subscribe({
      next: (res) => {
        const data = res!;
        this.columns.set(data.columns);

        const granted = new Set<string>();
        data.modules.forEach((mod) =>
          mod.entities.forEach((ent) =>
            ent.actions.filter((a) => a.allowed).forEach((a) => granted.add(a.actionId)),
          ),
        );
        this.allowedActionIds.set(granted);

        this.nodes.set(
          data.modules.map((mod) => ({
            data: {
              type: 'module',
              id: mod.moduleId,
              displayName: mod.moduleName,
              icon: mod.icon,
              actionsMap: mod.entities.reduce(
                (acc, ent) => {
                  ent.actions.forEach((a) => {
                    acc[a.actionKey] = a.actionId;
                  });
                  return acc;
                },
                {} as Record<string, string>,
              ),
            } as MatrixNodeData,
            expanded: true,
            children: mod.entities.map((ent) => ({
              data: {
                type: 'entity',
                id: ent.entityId,
                displayName: ent.displayName,
                actionsMap: ent.actions.reduce(
                  (acc, a) => {
                    acc[a.actionKey] = a.actionId;
                    return acc;
                  },
                  {} as Record<string, string>,
                ),
              } as MatrixNodeData,
              leaf: true,
            })),
          })),
        );

        this.isLoadingMatrix.set(false);
      },
      error: () => {this.isLoadingMatrix.set(false); this.router.navigate(['/app/notaccess']);},
    });
  }

  // ── Lógica de checkboxes ──────────────────────────────────────

  isModuleIndeterminate(node: TreeNode<MatrixNodeData>, actionKey: string): boolean {
    const children = node.children ?? [];
    const current = this.allowedActionIds();
    let allowed = 0,
      total = 0;
    children.forEach((child) => {
      const id = child.data?.actionsMap[actionKey];
      if (id) {
        total++;
        if (current.has(id)) allowed++;
      }
    });
    return total > 0 && allowed > 0 && allowed < total;
  }

  isModuleChecked(node: TreeNode<MatrixNodeData>, actionKey: string): boolean {
    const children = node.children ?? [];
    if (!children.length) return false;
    const current = this.allowedActionIds();
    return children.every((child) => {
      const id = child.data?.actionsMap[actionKey];
      return !id || current.has(id);
    });
  }

  isEntityChecked(node: TreeNode<MatrixNodeData>, actionKey: string): boolean {
    const id = node.data?.actionsMap[actionKey];
    return id ? this.allowedActionIds().has(id) : false;
  }

  toggleEntityAction(node: TreeNode<MatrixNodeData>, actionKey: string): void {
    const id = node.data?.actionsMap[actionKey];
    if (!id) return;
    const current = new Set(this.allowedActionIds());
    current.has(id) ? current.delete(id) : current.add(id);
    this.allowedActionIds.set(current);
  }

  toggleModuleAction(node: TreeNode<MatrixNodeData>, actionKey: string): void {
    const children = node.children ?? [];
    const current = new Set(this.allowedActionIds());
    const allChecked = this.isModuleChecked(node, actionKey);
    children.forEach((child) => {
      const id = child.data?.actionsMap[actionKey];
      if (!id) return;
      allChecked ? current.delete(id) : current.add(id);
    });
    this.allowedActionIds.set(current);
  }

  // ── Guardar ───────────────────────────────────────────────────
  savePermissions(): void {
    if (!this.selectedRoleId) return;

    const payload: RolePermissionAssignDTO = {
      roleId: this.selectedRoleId,
      actionIds: Array.from(this.allowedActionIds()),
    };

    this.isSaving.set(true);
    this.api.post<void>(`${urlRolePermission}/assign`, payload).subscribe({
      next: () => {
        this.nt.showSuccess('Permisos', 'Permisos guardados correctamente');
        this.isSaving.set(false);
      },
      error: () => {
        this.nt.showError('Error', 'No se pudieron guardar los permisos');
        this.isSaving.set(false);
      },
    });
  }
}
