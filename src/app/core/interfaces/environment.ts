export interface Environment {
  production: boolean;

  cryptoSecretKey: string;

  apiUrl: string;

  supabaseUrl: string;
  supabaseSecretKey: string;
}
