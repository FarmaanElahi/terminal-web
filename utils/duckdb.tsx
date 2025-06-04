"use client";

const TABLES = {
  symbols: "symbols",
};

const API_BASE_URL =
  typeof window !== "undefined"
    ? localStorage.getItem("BASE_API_URL") || process.env.NEXT_PUBLIC_API_URL
    : process.env.NEXT_PUBLIC_API_URL;

interface QueryProps {
  columns?: (string | { column: string; distinct?: boolean; alias?: string })[];
  where?: string;
  order?: { field: string; sort: "DESC" | "ASC"; nullLast?: boolean }[];
  limit?: number;
  offset?: number;
}

async function simpleQuery(table: keyof typeof TABLES, props?: QueryProps) {
  const { columns = [], where, order = [], limit, offset } = props ?? {};
  if (columns.length === 0) {
  }

  // Columns Builder
  let colsString = columns
    .map((c) => {
      if (typeof c === "string") return `"${c}"`;
      return `${c.distinct ? "DISTINCT " : ""}${c.alias ? `"${c.column}" AS "${c.alias}"` : `${c.column}`}`;
    })
    .join(", ")
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

  return await fetch(`${API_BASE_URL}/scanner/scan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
}

export async function queryDuckDB<T>(
  table: keyof typeof TABLES,
  props?: QueryProps,
) {
  return await simpleQuery(table, props).then((r) => r.json() as Promise<T[]>);
}

export async function runRawSymbolQuery(queryBuilder: (tbl: string) => string) {
  // let conn: AsyncDuckDBConnection | null = null;
  try {
    // const db = await getDuckDB();
    // conn = await db.connect();
    const rows = await fetch(`${API_BASE_URL}/scanner/scan`, {
      method: "POST",
      mode: "cors",
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
  try {
    const rows = await fetch(`${API_BASE_URL}/scanner/scan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: sql }),
    });

    const data = await rows.json();
    return data[0].total as number;
  } catch (e) {
    console.error("Failed to get the row count", e);
    return 0;
  }
}
