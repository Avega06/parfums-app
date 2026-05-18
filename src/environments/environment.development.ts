export interface Envs {
  production: boolean;
  apiUrl: string;
  supabaseUrl: string;
  supabaseKey: string;
}

export const environment = {
  production: false,
  apiUrl: 'http://localhost:4000',
  // Casteamos a 'any' para evitar el error de TypeScript
  supabaseUrl: (import.meta as any).env['SUPABASE_URL'] ?? '',
  supabaseKey: (import.meta as any).env['SUPABASE_KEY'] ?? '',
};
