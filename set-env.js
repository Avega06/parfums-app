const { writeFileSync } = require("node:fs");
const { loadEnvFile } = require("node:process");

// Cargar el archivo .env usando la nueva característica de Node
try {
  loadEnvFile(".env");
} catch (e) {
  console.log(
    "⚠️ No se encontró el archivo .env, se usarán las variables del sistema.",
  );
}

// Obtener las variables
const apiUrl = process.env.API_URL || "";
const supabaseUrl = process.env.NG_SUPABASE_URL || "";
const supabaseKey = process.env.NG_SUPABASE_KEY || "";

const supabaseCallback = process.env.SUPABASE_CALLBACK;

// Contenido que se escribirá en el archivo de Angular
const targetPath = "./src/environments/environment.ts";
const envConfigFile = `export const environment = {
  production: true,
  apiUrl: '${apiUrl}',
  supabaseUrl: '${supabaseUrl}',
  supabaseKey: '${supabaseKey}',
  supabaseCallback: '${supabaseCallback}'
};
`;

// Escribir el archivo
writeFileSync(targetPath, envConfigFile, "utf8");
console.log(`✅ Entorno de desarrollo generado con éxito en ${targetPath}`);
