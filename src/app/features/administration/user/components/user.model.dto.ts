export interface UserListDTO{
    id:string;
    email:string;
    name:string;
    active:string;
}

export interface UserDTO {
  id: string;
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
  active: boolean;
  roles:string[];
  concurrencyStamp:string;
}