import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import * as schema from "@/src/db/schema";

function createDb() {
  const sql = neon(process.env.DATABASE_URL!);
  return drizzle(sql, { schema });
}

export type Db = ReturnType<typeof createDb>;

let instance: Db | undefined;

function getInstance(): Db {
  if (!instance) instance = createDb();
  return instance;
}

// `db` só chama neon()/drizzle() no primeiro acesso a uma propriedade,
// para que importar este módulo (repositories -> app/[code]/page.tsx) não
// exija DATABASE_URL durante o "Collecting page data" do `next build`,
// mesmo a rota sendo force-dynamic.
export const db: Db = new Proxy({} as Db, {
  get(_target, prop) {
    const real = getInstance();
    const value = Reflect.get(real, prop, real);
    return typeof value === "function" ? value.bind(real) : value;
  },
});

// Tipo aceito pelos repositórios: superclasse comum ao driver de produção
// (neon-http) e ao driver de teste (pglite), que têm TQueryResult diferente
// e por isso não são intercambiáveis como union type nas chains de query builder.
export type RepoDb = PgDatabase<PgQueryResultHKT, typeof schema>;
