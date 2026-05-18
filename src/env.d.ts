interface ImportMeta {
  readonly env: {
    readonly [key: string]: string | undefined;
    readonly SUPABASE_URL: string;
    readonly SUPABASE_KEY: string;
  };
}
