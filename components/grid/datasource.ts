import {
  type AdvancedFilterModel,
  ColumnAdvancedFilterModel,
  IServerSideDatasource,
  IServerSideGetRowsParams,
  IServerSideGetRowsRequest,
  SortModelItem,
} from "ag-grid-community";
import { runRawSymbolCount, runRawSymbolQuery } from "@/utils/duckdb";

export function buildDataSource(allowedTickers?: () => string[]) {
  const mandatoryColumn = ["ticker", "logo", "earnings_release_date"];

  function buildSql(
    params: IServerSideGetRowsParams,
    tableName: string,
  ): string {
    const request = params.request;
    const columns = selectSql(params);
    const where = whereSql(request);
    const order = orderBySql(request);
    const limit = limitSql(request);

    return `SELECT ${columns} FROM ${tableName}${where}${order}${limit};`;
  }

  function selectSql(params: IServerSideGetRowsParams): string {
    const visibleCols =
      params.api
        .getColumns()
        ?.filter((c) => c.isVisible())
        ?.flatMap((c) => [
          c.getColId(),
          ...(c.getColDef().context?.dependencyColumns ?? []),
        ]) ?? [];
    visibleCols.push(...mandatoryColumn);

    return visibleCols.map((col) => `${col}`).join(",");
  }

  function whereSql(request: IServerSideGetRowsRequest): string {
    const filterModel = request.filterModel;
    const clauses: string[] = [];

    // Optional subset filter
    const allowed = allowedTickers?.();
    if (allowed && allowed.length > 0) {
      const tickers = allowed
        .map((t) => `'${t.replace(/'/g, "''")}'`)
        .join(", ");
      clauses.push(`"ticker" IN (${tickers})`);
    }

    // AG Grid dynamic filter
    if (filterModel && filterModel.type) {
      const gridClause = generateWhereClauseFromAdvancedFilter(
        filterModel as unknown as AdvancedFilterModel,
      );
      if (gridClause) clauses.push(gridClause);
    }

    return clauses.length > 0 ? ` WHERE ${clauses.join(" AND ")}` : "";
  }

  function generateWhereClauseFromAdvancedFilter(
    filterModel: AdvancedFilterModel,
  ): string {
    if (filterModel.filterType === "join") {
      const parts = filterModel.conditions
        .map(generateWhereClauseFromAdvancedFilter)
        .filter(Boolean);
      return `(${parts.join(` ${filterModel.type} `)})`;
    }
    return baseFilterToSQL(filterModel);
  }

  function baseFilterToSQL(filter: ColumnAdvancedFilterModel): string {
    const col = `"${filter.colId}"`;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const val = escapeValue(filter.filter);

    switch (filter.type) {
      case "contains":
        return `${col} LIKE '%' || ${val} || '%'`;
      case "notContains":
        return `${col} NOT LIKE '%' || ${val} || '%'`;
      case "equals":
        return `${col} = ${val}`;
      case "notEqual":
        return `${col} != ${val}`;
      case "startsWith":
        return `${col} LIKE ${val} || '%'`;
      case "endsWith":
        return `${col} LIKE '%' || ${val}`;
      case "blank":
        return `(${col} IS NULL OR ${col} = '')`;
      case "notBlank":
        return `(${col} IS NOT NULL AND ${col} != '')`;
      case "greaterThan":
        return `${col} > ${val}`;
      case "greaterThanOrEqual":
        return `${col} >= ${val}`;
      case "lessThan":
        return `${col} < ${val}`;
      case "lessThanOrEqual":
        return `${col} <= ${val}`;
      case "true":
        return `${col} = TRUE`;
      case "false":
        return `${col} = FALSE`;
      default:
        throw new Error(`Unsupported filter type: ${filter}`);
    }
  }

  function escapeValue(value: unknown): string {
    if (typeof value === "string") return `'${value.replace(/'/g, "''")}'`;
    if (value === null || value === undefined) return "NULL";
    return value.toString();
  }

  function orderBySql(request: IServerSideGetRowsRequest): string {
    if (!request.sortModel || request.sortModel.length === 0) return "";
    const sorts = request.sortModel.map(
      (s: SortModelItem) => `"${s.colId}" ${s.sort.toUpperCase()}`,
    );
    return " ORDER BY " + sorts.join(", ");
  }

  function limitSql(request: IServerSideGetRowsRequest): string {
    if (request.startRow == null || request.endRow == null) return "";
    const limit = request.endRow - request.startRow;
    const offset = request.startRow;
    return ` LIMIT ${limit} OFFSET ${offset}`;
  }

  return {
    getRows: async (params: IServerSideGetRowsParams) => {
      const rowData = await runRawSymbolQuery((tbl) => buildSql(params, tbl));
      const lastRowCount = await runRawSymbolCount(whereSql(params.request));
      try {
        params.success({
          rowData,
          rowCount: lastRowCount,
        });
      } catch (e) {
        console.error(`Failed to run query`, e);
        params.fail();
      }
    },
    destroy() {},
  } satisfies IServerSideDatasource;
}
