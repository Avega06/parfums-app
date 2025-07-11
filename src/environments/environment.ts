export interface Envs {
  production: boolean;
  apiUrl: string;
}

export const environment: Envs = {
  production: false,
  apiUrl: 'http://localhost:4000',
};
