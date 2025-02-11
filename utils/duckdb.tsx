"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { initializeDuckDb } from "duckdb-wasm-kit";
import {
  AsyncDuckDB,
  AsyncDuckDBConnection,
  DuckDBConfig,
} from "@duckdb/duckdb-wasm";

const TABLES = {
  symbols:
    "https://raw.githubusercontent.com/FarmaanElahi/terminal-data/refs/heads/main/data/scan/symbols.parquet",
  columns:
    "https://raw.githubusercontent.com/FarmaanElahi/terminal-data/refs/heads/main/data/scan/cols.parquet",
};

interface QueryProps {
  columns?: string[];
  where?: string;
  order?: [{ field: string; sort: "DESC" | "ASC"; nullLast?: boolean }];
  limit?: number;
}

async function simpleQuery(
  db: AsyncDuckDB,
  table: keyof typeof TABLES,
  props?: QueryProps,
) {
  let conn: AsyncDuckDBConnection | null = null;
  const { columns = [], where, order = [], limit = 500 } = props ?? {};
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

  const limitString = `LIMIT ${limit}`;
  const tableString = `'${TABLES[table]}'`;
  const query = [
    `SELECT`,
    colsString,
    `FROM`,
    tableString,
    whereString,
    orderString,
    limitString,
  ]
    .filter((p) => p)
    .join(" ");
  if (process.env.NODE_ENV !== "production") {
    console.log("QUERY:", query);
  }
  try {
    conn = await db.connect();
    return await conn.query(query);
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
      reliableHeadRequests: true,
    },
  };
  return await initializeDuckDb({ config, debug: true });
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
      ) => ReturnType<AsyncDuckDBConnection["query"]>;
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

export function DuckDBProvider({ children }: { children: ReactNode }) {
  const [db, setDb] = useState<DuckDBContextProps>(() => ({
    status: "loading",
  }));
  useEffect(() => {
    init()
      .then((db) => setDb({ status: "loaded", db, runQuery: buildQuery(db) }))
      .catch((err) => {
        console.error(err);
        setDb({ status: "error", error: err });
      });
  }, []);

  return <DuckDBContext.Provider value={db}>{children}</DuckDBContext.Provider>;
}
