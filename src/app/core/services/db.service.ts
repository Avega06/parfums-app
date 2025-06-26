import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// @ts-ignore
import initSqlJs, { Database, SqlJsStatic } from 'sql.js';
// @ts-ignore
import Papa from 'papaparse';

@Injectable({ providedIn: 'root' })
export class DbService {
  private db!: Database;
  private SQL!: SqlJsStatic;
  private readonly STORAGE_KEY = 'parfums-db';
  private initialized = false;

  constructor(private http: HttpClient) {}

  async init(): Promise<void> {
    if (this.initialized) return;

    this.SQL = await initSqlJs({
      locateFile: (file: any) => `https://sql.js.org/dist/${file}`,
    });

    const savedDb = localStorage.getItem(this.STORAGE_KEY);

    if (savedDb) {
      // Restaurar desde localStorage
      const binary = Uint8Array.from(atob(savedDb), (c) => c.charCodeAt(0));
      this.db = new this.SQL.Database(binary);
    } else {
      // Crear nueva base y cargar CSV desde public/
      this.db = new this.SQL.Database();
      this.createTable();

      const csvText = await this.http
        .get('/shops.csv', { responseType: 'text' })
        .toPromise();
      await this.importCsv(csvText!);

      this.saveToLocalStorage();
    }

    this.initialized = true;
  }

  private createTable() {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS shops (
        shop_id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        address TEXT,
        is_deleted INTEGER NOT NULL,
        deleted_at TEXT
      );
    `);
  }

  private async importCsv(csvText: string) {
    const result = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
    });

    const insert = this.db.prepare(`INSERT INTO shops VALUES (?, ?, ?, ?, ?)`);

    for (const row of result.data as any[]) {
      insert.run([
        row.shop_id,
        row.name,
        row.address || null,
        row.is_deleted ? 1 : 0,
        row.deleted_at || null,
      ]);
    }

    insert.free();
  }

  private saveToLocalStorage() {
    const binaryArray = this.db.export();
    const base64 = btoa(String.fromCharCode(...binaryArray));
    localStorage.setItem(this.STORAGE_KEY, base64);
  }
  queryShopsByName(name: string) {
    if (!this.db) return [];

    const shops: any[] = [];
    const stmt = this.db.prepare(`
      SELECT * FROM shops WHERE name = ?
    `);

    stmt.bind([name]);

    while (stmt.step()) {
      shops.push(stmt.getAsObject());
    }

    stmt.free();
    return shops;
  }

  queryAllShops() {
    if (!this.db) return [];
    const stmt = this.db.prepare(`SELECT * FROM shops`);
    const shops = [];

    while (stmt.step()) {
      shops.push(stmt.getAsObject());
    }

    stmt.free();
    return shops;
  }

  // 👇 Extra: limpiar localStorage manualmente
  clearLocalDb() {
    localStorage.removeItem(this.STORAGE_KEY);
    this.initialized = false;
  }
}
