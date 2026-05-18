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
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_KEY || "";

// Contenido que se escribirá en el archivo de Angular
const targetPath = "./src/environments/environment.ts";
const envConfigFile = `export const environment = {
  production: true,
  apiUrl: 'http://localhost:4000',
  supabaseUrl: '${supabaseUrl}',
  supabaseKey: '${supabaseKey}'
};
`;

// Escribir el archivo
writeFileSync(targetPath, envConfigFile, "utf8");
console.log(`✅ Entorno de desarrollo generado con éxito en ${targetPath}`);
