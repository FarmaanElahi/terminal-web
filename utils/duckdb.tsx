"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { getDuckDB, initializeDuckDb } from "duckdb-wasm-kit";
import {
  AsyncDuckDB,
  AsyncDuckDBConnection,
  DuckDBConfig,
} from "@duckdb/duckdb-wasm";

const TABLES = {
  symbols:
    "https://objectstorage.ap-hyderabad-1.oraclecloud.com/n/axbaetdfzydd/b/terminal-files/o/symbols-full-v2.parquet",
  columns:
    "https://raw.githubusercontent.com/FarmaanElahi/terminal-data/refs/heads/main/data/scan/cols.parquet",
};

interface QueryProps {
  columns?: string[];
  where?: string;
  order?: { field: string; sort: "DESC" | "ASC"; nullLast?: boolean }[];
  limit?: number;
  offset?: number;
}

async function simpleQuery(
  db: AsyncDuckDB,
  table: keyof typeof TABLES,
  props?: QueryProps,
) {
  let conn: AsyncDuckDBConnection | null = null;
  const { columns = [], where, order = [], limit, offset } = props ?? {};
  if (columns.length === 0) {
  }

  // Columns Builder
  let colsString = columns
    .map((c) => `"${c}"`)
    .join(",")
    .trim();
  if (!colsString) colsString = "*";

  // Filter Builder
  const whereString = where ? ["WHERE", where].join(" ") : "";

  // Sort Builder
  const orderClause = order
    .map((o) => {
      const { field, sort, nullLast } = o;
      return `"${field}" ${sort} ${nullLast ? "NULLS LAST" : ""}`;
    })
    .join(",")
    .trim();
  const orderString = orderClause ? `ORDER BY ${orderClause}` : "";

  const limitClause =
    typeof limit === "number" && limit > 0 ? `LIMIT ${limit}` : undefined;

  const offsetClause =
    typeof offset === "number" && offset > 0 ? `OFFSET ${offset}` : undefined;

  const tableString = `'${TABLES[table]}'`;
  const query = [
    `SELECT`,
    colsString,
    `FROM`,
    tableString,
    whereString,
    orderString,
    limitClause,
    offsetClause,
  ]
    .filter((p) => p)
    .join(" ");
  try {
    conn = await db.connect();
    return await fetch("http://localhost:8000/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
  } finally {
    await conn?.close();
  }
}

async function init() {
  const config: DuckDBConfig = {
    query: {
      /**
       * By default, int values returned by DuckDb are Int32Array(2).
       * This setting tells DuckDB to cast ints to double instead,
       * so they become JS numbers.
       */
      castBigIntToDouble: true,
      castDecimalToDouble: true,
      castTimestampToDate: true,
    },
    filesystem: {
      allowFullHTTPReads: true,
      reliableHeadRequests: false,
    },
  };
  const db = await initializeDuckDb({
    config,
    // debug: process.env.NEXT_PUBLIC_ENVIRONMENT === "development",
    debug: false,
  });
  await initTables(db);
  return db;
}

async function initTables(db: AsyncDuckDB) {
  let conn: AsyncDuckDBConnection | null = null;
  try {
    conn = await db.connect();
    await conn?.query("SET default_null_order = 'nulls_last';");
  } finally {
    await conn?.close();
  }
}

function buildQuery(db: AsyncDuckDB) {
  return async (table: keyof typeof TABLES, props?: QueryProps) => {
    let conn: AsyncDuckDBConnection | null = null;
    try {
      conn = await db.connect();
      return await simpleQuery(db, table, props);
    } finally {
      await conn?.close();
    }
  };
}

type DuckDBContextProps =
  | { status: "loading" }
  | {
      status: "loaded";
      db: AsyncDuckDB;
      runQuery: (
        table: keyof typeof TABLES,
        props?: QueryProps,
      ) => Promise<Response>;
    }
  | { status: "error"; error: unknown };

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const DuckDBContext = createContext<DuckDBContextProps>();

export function useDuckDB() {
  const data = useContext(DuckDBContext);
  if (!data) {
    throw new Error("Please specify a duckDB context.");
  }
  return data;
}

export async function queryDuckDB<T>(
  table: keyof typeof TABLES,
  props?: QueryProps,
) {
  const db = await getDuckDB();
  let conn: AsyncDuckDBConnection | null = null;
  try {
    conn = await db.connect();
    return await simpleQuery(db, table, props).then(
      (r) => r.json() as Promise<T[]>,
    );
  } finally {
    await conn?.close();
  }
}

export function DuckDBProvider({ children }: { children: ReactNode }) {
  const [db, setDb] = useState<DuckDBContextProps>(() => ({
    status: "loading",
  }));
  useEffect(() => {
    init()
      .then((db) =>
        setDb({
          status: "loaded",
          db,
          runQuery: buildQuery(db),
        }),
      )
      .catch((err) => {
        console.error(err);
        setDb({ status: "error", error: err });
      });
  }, []);

  return <DuckDBContext.Provider value={db}>{children}</DuckDBContext.Provider>;
}

export async function runRawSymbolQuery(queryBuilder: (tbl: string) => string) {
  // let conn: AsyncDuckDBConnection | null = null;
  try {
    // const db = await getDuckDB();
    // conn = await db.connect();
    const rows = await fetch("http://localhost:8000/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: queryBuilder(`'${TABLES.symbols}'`) }),
    });
    return rows.json();
  } finally {
    // await conn?.close();
  }
}

export async function runRawSymbolCount(filterSql: string) {
  const sql = `SELECT COUNT(*) as total FROM '${TABLES.symbols}' ${filterSql}`;
  // let conn: AsyncDuckDBConnection | null = null;
  try {
    // const db = await getDuckDB();
    // conn = await db.connect();
    // const res = await conn.query(sql);
    const rows = await fetch("http://localhost:8000/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: sql }),
    });

    const data = await rows.json();
    return data[0].total as number;
  } catch (e) {
    console.error("Failed to get the row count", e);
    return undefined;
  } finally {
    // await conn?.close();
  }
}
