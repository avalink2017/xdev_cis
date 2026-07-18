export interface AppSettingsDTO {
  id: string;  
  emailProvider: string;
  smtpHost: string;
  smtpPort: number;
  smtpUserName: string;
  smtpUserPassword: string;
  smtpEnableSsl: boolean;
  sender: string;
  apiKey: string;
  apiEmail: string;
  concurrencyStamp: string;
}