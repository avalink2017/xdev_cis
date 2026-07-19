export interface ActionColumnDTO {
  actionKey: string;
  displayName: string;
  displayOrder: number;
}

export interface ActionPermissionView {
  actionId: string;
  actionKey: string;
  displayName: string;
  displayOrder: number;
  allowed: boolean;
}

export interface EntityPermissionView {
  entityId: string;
  entityName: string;
  displayName: string;
  displayOrder: number;
  actions: ActionPermissionView[];
}

export interface ModulePermissionView {
  moduleId: string;
  moduleName: string;
  icon?: string;
  displayOrder: number;
  entities: EntityPermissionView[];
}

export interface PermissionMatrixDTO {
  columns: ActionColumnDTO[];
  modules: ModulePermissionView[];
}

export interface RolePermissionAssignDTO {
  roleId: string;
  actionIds: string[];
}

export interface MatrixNodeData {
  type: 'module' | 'entity';
  id: string;
  displayName: string;
  icon?: string;
  actionsMap: Record<string, string>;
}
