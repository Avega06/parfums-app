interface env {
  production: boolean;
  apiUrl: string;
}

export const environment: env = {
  production: true,
  apiUrl: 'https://parfums-api-production.up.railway.app/',
};
