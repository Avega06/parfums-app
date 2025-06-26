const fs = require("fs");
const path = require("path");
require("dotenv").config();

const targetPath = path.join(
  __dirname,
  "src",
  "environments",
  "environment.ts"
);

const isProduction = process.env.STAGE === "production";
const apiUrlFromVercel = process.env.API_URL || "http://localhost:4000"; // Accedes a process.env aquí

const envContent = `
export const environment = {
  production: ${isProduction},
  apiUrl: '${apiUrlFromVercel}'
};
`;

fs.writeFileSync(targetPath, envContent);
console.log("Environment file generated with Vercel variables.");
