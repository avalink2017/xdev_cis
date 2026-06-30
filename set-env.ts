import { writeFileSync } from 'fs';
import { join } from 'path';

const targetPath = join(process.cwd(), 'src/environments/environment.ts');

const envConfigFile = `
export const environment = {
  production: true,
  apiUrl: '${process.env['API_URL'] || 'PLACEHOLDER_API_URL'}',
  apiKey: '${process.env['API_KEY'] || ''}',
};
`;

writeFileSync(targetPath, envConfigFile);
