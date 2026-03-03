import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';
import fs from 'fs';

let dbPromise: Promise<Database<sqlite3.Database, sqlite3.Statement>> | null = null;

async function getDb() {
  if (!dbPromise) {
    const dbDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    const dbPath = path.join(dbDir, 'respostas.sqlite');

    dbPromise = open({
      filename: dbPath,
      driver: sqlite3.Database
    }).then(async (db) => {
      await db.exec(`
        CREATE TABLE IF NOT EXISTS respostas (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          dataEnvio TEXT,
          nome TEXT,
          email TEXT,
          telefone TEXT,
          idade INTEGER,
          genero TEXT,
          filhos TEXT,
          estado TEXT,
          trabalha TEXT,
          formacao TEXT,
          equipamentos TEXT,
          disponibilidadeAulas TEXT,
          horarioAulas TEXT,
          aprendizado TEXT,
          nivel TEXT,
          motivacao TEXT,
          disponibilidade TEXT,
          salario TEXT,
          linkedin TEXT,
          curriculo TEXT
        )
      `);
      try {
        await db.exec(`ALTER TABLE respostas ADD COLUMN curriculo TEXT`);
      } catch (err) {
        // Ignora se a coluna já existir no banco sqlite montado
      }
      return db;
    });
  }
  return dbPromise;
}

export async function salvarResposta(data: any) {
  const db = await getDb();
  const dataEnvio = new Date().toISOString();

  await db.run(`
    INSERT INTO respostas (
      dataEnvio, nome, email, telefone, idade, genero, filhos, estado, trabalha,
      formacao, equipamentos, disponibilidadeAulas, horarioAulas, aprendizado,
      nivel, motivacao, disponibilidade, salario, linkedin, curriculo
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?
    )
  `, [
    dataEnvio, data.nome || null, data.email || null, data.telefone || null, data.idade || null, data.genero || null, data.filhos || null, data.estado || null, data.trabalha || null,
    data.formacao || null, data.equipamentos || null, data.disponibilidadeAulas || null, data.horarioAulas || null, data.aprendizado || null,
    data.nivel || null, data.motivacao || null, data.disponibilidade || null, data.salario || null, data.linkedin || null, data.curriculo || null
  ]);
}

export async function lerRespostas() {
  const db = await getDb();
  return db.all('SELECT * FROM respostas ORDER BY id DESC');
}
