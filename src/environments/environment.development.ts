export interface Envs {
  production: boolean;
  apiUrl: string;
  supabaseUrl: string;
  supabaseKey: string;
}

export const environment: Envs = {
  production: false,
  apiUrl: 'http://localhost:4000',
  supabaseUrl: '',
  supabaseKey: '',
};
