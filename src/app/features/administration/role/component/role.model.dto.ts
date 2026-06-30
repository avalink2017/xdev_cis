export interface RoleListDTO {
  id: string;  
  name: string;
  roleName:string;
  isAdmin: boolean;
}

export interface RoleDTO {
  id: string;  
  name: string;
  roleName: string;
  isAdmin: boolean;
  concurrencyStamp: string;
}
