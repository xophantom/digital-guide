import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import * as schema from "@/src/db/schema";

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
export type Db = typeof db;

// Tipo aceito pelos repositórios: superclasse comum ao driver de produção
// (neon-http) e ao driver de teste (pglite), que têm TQueryResult diferente
// e por isso não são intercambiáveis como union type nas chains de query builder.
export type RepoDb = PgDatabase<PgQueryResultHKT, typeof schema>;
