"use client";

import { ColumnDef } from "@tanstack/react-table";
import type { Symbol } from "@/types/symbol";
import React from "react";
import { FormattedCell } from "@/components/symbols/symbol_column_formatted";

function agoCols(
  meta: Record<string, unknown>,
  metric: string,
  name_prefix: string,
  freq: "fq" | "fy",
  ago: number,
): ColumnDef<Symbol>[] {
  const freqNameMapping = { fq: "Qtr", fy: "Yr" } as Record<
    typeof freq,
    string
  >;
  const freqName = freqNameMapping[freq];

  const cols = [] as ColumnDef<Symbol>[];
  for (let i = 0; i <= ago; i++) {
    let hist =
      i === 0
        ? `Latest ${freqName}`
        : i === 1
          ? `Prior ${freqName}`
          : undefined;

    hist = hist ? hist : `${i} ${freqName}s Ago`;
    cols.push({
      accessorKey: [metric, freq, i].join("_"),
      header: [name_prefix, hist, meta.sign].filter((s) => s).join(" "),
      meta,
    });
  }
  return cols;
}

function forwardCols(
  meta: Record<string, unknown>,
  metric: string,
  name_prefix: string,
  freq: "fq" | "fy",
  ago: number,
): ColumnDef<Symbol>[] {
  const freqNameMapping = { fq: "Qtr", fy: "Yr" } as Record<
    typeof freq,
    string
  >;
  const freqName = freqNameMapping[freq];

  const cols = [] as ColumnDef<Symbol>[];
  for (let i = 0; i <= ago; i++) {
    let hist = i === 0 ? `Next ${freqName}` : undefined;
    hist = hist ? hist : `${i + 1} ${freqName}s Forward`;
    cols.push({
      accessorKey: [metric, freq, i].join("_"),
      header: [name_prefix, hist, meta.sign].filter((s) => s).join(" "),
      meta,
    });
  }
  return cols;
}

export const defaultSymbolColumns: ColumnDef<Symbol>[] = (
  [
    // #############################  Generals  ################################
    {
      accessorKey: "name",
      header: "Symbol",
      enableHiding: false,
      meta: {
        format: "symbol",
        category: "General",
        pinLeft: true,
        cols: ["logo", "earnings_release_next_date"],
      },
    },
    { accessorKey: "isin", header: "ISIN", meta: { category: "General" } },
    {
      accessorKey: "day_open",
      header: "Open",
      meta: { format: "numeric", category: "General" },
    },
    {
      accessorKey: "day_high",
      header: "High",
      meta: { format: "numeric", category: "General" },
    },
    {
      accessorKey: "day_low",
      header: "Low",
      meta: { format: "numeric", category: "General" },
    },
    {
      accessorKey: "day_close",
      header: "Last",
      meta: { format: "numeric", category: "General" },
    },
    {
      accessorKey: "day_volume",
      header: "Volume",
      meta: { format: "numeric", category: "General" },
    },
    {
      accessorKey: "week_open",
      header: "Week Open",
      meta: { format: "numeric", category: "General" },
    },
    {
      accessorKey: "week_high",
      header: "Week High",
      meta: { format: "numeric", category: "General" },
    },
    {
      accessorKey: "week_low",
      header: "Week Low",
      meta: { format: "numeric", category: "General" },
    },
    {
      accessorKey: "week_close",
      header: "Week Close",
      meta: { format: "numeric", category: "General" },
    },
    {
      accessorKey: "week_volume",
      header: "Week Volume",
      meta: { format: "numeric", category: "General" },
    },
    {
      accessorKey: "month_open",
      header: "Month Open",
      meta: { format: "numeric", category: "General" },
    },
    {
      accessorKey: "month_high",
      header: "Month High",
      meta: { format: "numeric", category: "General" },
    },
    {
      accessorKey: "month_low",
      header: "Month Low",
      meta: { format: "numeric", category: "General" },
    },
    {
      accessorKey: "month_close",
      header: "Month Close",
      meta: { format: "numeric", category: "General" },
    },
    {
      accessorKey: "month_volume",
      header: "Month Volume",
      meta: { format: "numeric", category: "General" },
    },
    {
      accessorKey: "description",
      header: "Name",
      meta: { category: "General" },
    },
    {
      accessorKey: "website",
      header: "Website",
      meta: { category: "General" },
    },
    {
      accessorKey: "ceo",
      header: "CEO",
      meta: { category: "General" },
    },
    {
      accessorKey: "employees",
      header: "Employee Count",
      meta: { category: "General" },
    },
    {
      accessorKey: "country",
      header: "Country",
      meta: {
        format: "textlogo",
        logoCol: "country_code",
        logoPrefix: "country",
        category: "General",
      },
    },
    { accessorKey: "location", header: "City", meta: { category: "General" } },
    {
      accessorKey: "ipo_date",
      header: "IPO Date",
      meta: { format: "date", category: "General" },
    },
    {
      accessorKey: "most_recent_split",
      header: "Recent Split",
      meta: { format: "date", category: "General" },
    },
    { accessorKey: "type", header: "Type", meta: { category: "General" } },
    {
      accessorKey: "exchange",
      header: "Exchange",
      meta: {
        format: "textlogo",
        logoCol: "exchange_logo",
        category: "General",
      },
    },
    {
      accessorKey: "mcap",
      header: "Market Cap",
      meta: { format: "currency", category: "General" },
    },
    {
      accessorKey: "shares_float",
      header: "Shares Float",
      meta: {
        format: "numeric",
        maximumFractionDigits: 0,
        category: "General",
      },
    },
    {
      // Weighted Shares Outstanding.
      accessorKey: "total_shares_outstanding",
      header: "Total Outstanding Shares",
      meta: {
        format: "numeric",
        maximumFractionDigits: 0,
        category: "General",
      },
    },
    // TODO: Add Non-Weighted Shares Outstanding
    {
      accessorKey: "timezone",
      header: "Timezone",
      meta: { category: "General" },
    },
    {
      accessorKey: "currency",
      header: "Currency",
      meta: {
        format: "textlogo",
        logoCol: "currency_logo",
        category: "General",
      },
    },
    // #############################  Generals  ################################

    // ##############################  Earnings  ###############################
    {
      accessorKey: "earnings_release_date",
      header: "Earnings Date",
      meta: { format: "date", category: "Earnings" },
    },
    {
      accessorKey: "earnings_release_next_date",
      header: "Next Earnings Date",
      meta: { format: "date", category: "Earnings" },
    },
    {
      accessorKey: "days_since_latest_earning",
      header: "Days since last earning",
      meta: { format: "numeric", category: "Earnings" },
    },
    {
      accessorKey: "earnings_per_share_ttm",
      header: "EPS TTM",
      meta: { format: "numeric", category: "Earnings" },
    },

    ...agoCols(
      { format: "numeric", category: "Earnings" },
      "eps",
      "EPS",
      "fq",
      9,
    ),
    ...agoCols(
      { format: "numeric", category: "Earnings" },
      "eps",
      "EPS",
      "fy",
      3,
    ),

    ...agoCols(
      { format: "numeric", sign: "%", category: "Earnings" },
      "earning_surprise",
      "EPS Surprise",
      "fq",
      9,
    ),
    ...agoCols(
      { format: "numeric", sign: "%", category: "Earnings" },
      "earning_surprise",
      "EPS Surprise",
      "fy",
      3,
    ),
    ...forwardCols(
      { format: "numeric", category: "Earnings" },
      "eps_estimated",
      "EPS Estimate",
      "fq",
      3,
    ),
    ...forwardCols(
      { format: "numeric", category: "Earnings" },
      "eps_estimated",
      "EPS Estimate",
      "fy",
      2,
    ),
    ...agoCols(
      { format: "numeric", sign: "%", category: "Earnings" },
      "eps_growth",
      "EPS Growth",
      "fq",
      9,
    ),
    ...agoCols(
      { format: "numeric", sign: "%", category: "Earnings" },
      "eps_growth",
      "EPS Growth",
      "fy",
      3,
    ),
    {
      accessorKey: "eps_avg_growth_fq_2",
      header: "Average Quarterly EPS Growth Last 2 Qtrs",
      meta: { format: "numeric", sign: "%", category: "Earnings" },
    },
    {
      accessorKey: "eps_avg_growth_fq_3",
      header: "Average Quarterly EPS Growth Last 3 Qtrs",
      meta: { format: "numeric", sign: "%", category: "Earnings" },
    },
    {
      accessorKey: "eps_avg_growth_fy_2",
      header: "Average Annual EPS Growth Last 2 Yrs",
      meta: { format: "numeric", sign: "%", category: "Earnings" },
    },
    {
      accessorKey: "eps_avg_growth_fy_3",
      header: "Average Annual EPS Growth Last 3 Yrs",
      meta: { format: "numeric", sign: "%", category: "Earnings" },
    },
    // TODO: Quarterly Earnings Acceleration
    // TODO: Quarter Over Quarter EPS $ Growth
    ...forwardCols(
      { format: "numeric", sign: "%", category: "Earnings" },
      "eps_estimated_growth",
      "Quarterly EPS Estimated Growth",
      "fq",
      3,
    ),
    ...forwardCols(
      { format: "numeric", sign: "%", category: "Earnings" },
      "eps_estimated_growth",
      "Annual EPS Estimated Growth",
      "fy",
      2,
    ),
    {
      accessorKey: "eps_estimated_growth_avg_fq_2",
      header: "Average Quarterly Estimated EPS Growth 2 Qtrs Forward",
      meta: { format: "numeric", sign: "%", category: "Earnings" },
    },
    {
      accessorKey: "eps_estimated_growth_avg_fq_3",
      header: "Average Quarterly Estimated EPS Growth 3 Qtrs Forward",
      meta: { format: "numeric", sign: "%", category: "Earnings" },
    },
    {
      accessorKey: "eps_estimated_growth_avg_fy_2",
      header: "Average Annual Estimated EPS Growth 2 Yrs Forward",
      meta: { format: "numeric", sign: "%", category: "Earnings" },
    },
    {
      accessorKey: "eps_estimated_growth_avg_fy_3",
      header: "Average Annual Estimated EPS Growth 3 Yrs Forward",
      meta: { format: "numeric", sign: "%", category: "Earnings" },
    },
    // ##############################  Earnings  ###############################

    // ##############################  Sales  ##################################
    ...agoCols(
      { format: "currency", category: "Fundamentals" },
      "ebitda",
      "EBITDA",
      "fq",
      9,
    ),
    ...agoCols(
      { format: "currency", category: "Fundamentals" },
      "ebit",
      "EBIT",
      "fq",
      9,
    ),
    ...agoCols(
      { format: "currency", category: "Sales" },
      "revenue",
      "Sales",
      "fq",
      9,
    ),
    ...agoCols(
      { format: "currency", category: "Sales" },
      "revenue",
      "Sales",
      "fy",
      3,
    ),
    ...forwardCols(
      { format: "currency", category: "Sales" },
      "revenue_forecast",
      "Sales Estimate",
      "fq",
      3,
    ),
    ...forwardCols(
      { format: "currency", category: "Sales" },
      "revenue_forecast",
      "Sales Estimate ",
      "fy",
      2,
    ),
    // TODO: Quarterly Estimated Sales – Latest Reported
    // TODO: Annual Estimated Sales – Latest Reported Year
    ...agoCols(
      { format: "numeric", sign: "%", category: "Sales" },
      "revenue_growth",
      "Sales Growth",
      "fq",
      9,
    ),
    ...agoCols(
      { format: "numeric", sign: "%", category: "Sales" },
      "revenue_growth",
      "Sales Growth",
      "fy",
      3,
    ),
    {
      accessorKey: "revenue_avg_growth_fq_2",
      header: "Average Quarterly Sales Growth 2 Qtrs",
      meta: { format: "numeric", sign: "%", category: "Sales" },
    },
    {
      accessorKey: "revenue_avg_growth_fq_3",
      header: "Average Quarterly Sales Growth 3 Qtrs",
      meta: { format: "numeric", sign: "%", category: "Sales" },
    },
    {
      accessorKey: "revenue_avg_growth_fy_2",
      header: "Average Annual Sales Growth 2 Yrs",
      meta: { format: "numeric", sign: "%", category: "Sales" },
    },
    {
      accessorKey: "revenue_avg_growth_fy_3",
      header: "Average Annual Sales Growth 3 Yrs",
      meta: { format: "numeric", sign: "%", category: "Sales" },
    }, // TODO: Quarterly Sales Acceleration

    ...agoCols(
      { format: "numeric", sign: "%", category: "Sales" },
      "revenue_growth_yoy",
      "QoQ Sales Growth",
      "fq",
      9,
    ),

    ...forwardCols(
      { format: "number", sign: "%", category: "Sales" },
      "revenue_forecast_growth",
      "Sales Growth Estimated",
      "fq",
      3,
    ),
    ...forwardCols(
      { format: "number", sign: "%", category: "Sales" },
      "revenue_forecast_growth",
      "Sales Growth Estimated",
      "fy",
      2,
    ),
    {
      accessorKey: "revenue_forecast_growth_avg_fq_2",
      header: "Average Quarterly Estimated Sales Growth 2 Qtrs",
      meta: { format: "numeric", sign: "%", category: "Sales" },
    },
    {
      accessorKey: "revenue_forecast_growth_avg_fq_3",
      header: "Average Quarterly Estimated Sales Growth 3 Qtrs",
      meta: { format: "numeric", sign: "%", category: "Sales" },
    },

    {
      accessorKey: "revenue_forecast_growth_avg_fy_2",
      header: "Average Quarterly Estimated Sales Growth 2 Yrs",
      meta: { format: "numeric", sign: "%", category: "Sales" },
    },
    {
      accessorKey: "revenue_forecast_growth_avg_fy_3",
      header: "Average Quarterly Estimated Sales Growth 3 Yrs",
      meta: { format: "numeric", sign: "%", category: "Sales" },
    },
    // TODO: Quarterly Sales Acceleration
    ...agoCols(
      { format: "numeric", sign: "%", category: "Sales" },
      "revenue_surprise",
      "Sales Surprise",
      "fq",
      9,
    ),
    ...agoCols(
      { format: "numeric", sign: "%", category: "Sales" },
      "revenue_surprise",
      "Sales Surprise",
      "fy",
      3,
    ),

    // ##############################  Sales  ##################################

    // ##########################  Sector & Industry  ##########################
    {
      accessorKey: "sector",
      header: "Sector",
      meta: { category: "Sector & Industry" },
      size: 200,
    },
    {
      accessorKey: "group",
      header: "Group",
      meta: { category: "Sector & Industry" },
      size: 200,
    },
    {
      accessorKey: "industry",
      header: "Industry",
      meta: { category: "Sector & Industry" },
      size: 250,
    },
    {
      accessorKey: "sub_industry",
      header: "Sub Industry",
      meta: { category: "Sector & Industry" },
      size: 200,
    },
    // ##########################  Sector & Industry  ##########################

    // ##############################  Fundamental  ############################
    {
      accessorKey: "price_revenue_ttm",
      header: "Price Revenue TTM",
      meta: { format: "numeric", category: "Sales" },
    },

    {
      accessorKey: "dividend_amount",
      header: "Last Dividend Amount",
      meta: { format: "currency", category: "Fundamentals" },
    },
    // TODO: Missing Dividend Declaration Date
    //Declaration Date - Date on which dividend is declared
    //Ex Date - Date before which an investor must have purchased the stock to receive the upcoming dividend
    //Record Date- This date determines all shareholders of record who are entitled to the dividend payment and it usually occurs two days after the ex-date. Date -This is when dividend payments are issued to shareholders and it's usually about one month after the record date
    //Payment Date -This is when dividend payments are issued to shareholders and it's usually about one month after the record date
    {
      accessorKey: "divided_ex_date",
      header: "Last Dividend Ex Date",
      meta: { format: "date", category: "Fundamentals" },
    },
    {
      accessorKey: "dividend_yield",
      header: "Dividend Yield",
      meta: { format: "numeric", category: "Fundamentals" },
    },
    {
      accessorKey: "price_earnings_ttm",
      header: "Price Earning",
      meta: { format: "numeric", category: "Fundamentals" },
    },
    {
      accessorKey: "price_earnings_run_rate",
      header: "Price Earning Run Rate",
      meta: { format: "numeric", category: "Fundamentals" },
    },
    {
      accessorKey: "forward_price_earnings",
      header: "Forward Price Earnings",
      meta: { format: "numeric", category: "Fundamentals" },
    },

    ...agoCols(
      { format: "currency", category: "Fundamentals" },
      "net_income",
      "Net Income",
      "fy",
      2,
    ),
    ...agoCols(
      { format: "currency", category: "Fundamentals" },
      "total_assets",
      "Total Assets",
      "fq",
      3,
    ),
    ...agoCols(
      { format: "currency", category: "Fundamentals" },
      "total_liabilities",
      "Total Liabilities",
      "fq",
      3,
    ),
    ...agoCols(
      { format: "numeric", category: "Fundamentals" },
      "current_ratio",
      "Current Ratio",
      "fq",
      3,
    ),
    {
      accessorKey: "net_income_ttm_0",
      header: "Net Income TTM",
      meta: { format: "currency", category: "Fundamentals" },
    },

    {
      accessorKey: "price_earnings_growth_ttm",
      header: "Price Earning Growth",
      meta: { format: "numeric", category: "Fundamentals" },
    },
    {
      accessorKey: "price_sales_ttm",
      header: "Price Sales",
      meta: { format: "numeric", category: "Fundamentals" },
    },
    ...agoCols(
      { format: "numeric", category: "Fundamentals" },
      "price_earnings",
      "Price Earning",
      "fq",
      3,
    ),
    ...agoCols(
      { format: "numeric", category: "Fundamentals" },
      "debt_to_equity",
      "Debt to Equity",
      "fq",
      3,
    ),
    ...agoCols(
      { format: "numeric", category: "Fundamentals" },
      "price_book",
      "Price Book",
      "fq",
      3,
    ),
    ...agoCols(
      { format: "numeric", category: "Fundamentals" },
      "price_sales",
      "Price Sales",
      "fy",
      3,
    ),
    // ##############################  Fundamental  ############################

    // ######################  Price and Volume  #######################
    {
      accessorKey: "price_change_today_abs",
      header: "Price Change Today",
      meta: { format: "price", category: "Price & Volume" },
    },
    {
      accessorKey: "price_change_from_open_abs",
      header: "Price Change from Open",
      meta: { format: "price", category: "Price & Volume" },
    },
    {
      accessorKey: "price_change_from_high_abs",
      header: "Price Change from High",
      meta: { format: "price", category: "Price & Volume" },
    },
    {
      accessorKey: "price_change_from_low_abs",
      header: "Price Change from Low",
      meta: { format: "price", category: "Price & Volume" },
    },
    {
      accessorKey: "price_change_today_pct",
      header: "Price % Change Today",
      meta: {
        format: "numeric",
        sign: "%",
        colorize: true,
        category: "Price & Volume",
      },
    },
    {
      accessorKey: "price_change_from_open_pct",
      header: "Price % Change from Open",
      meta: {
        format: "numeric",
        sign: "%",
        colorize: true,
        category: "Price & Volume",
      },
    },
    {
      accessorKey: "price_change_from_high_pct",
      header: "Price % Change from High",
      meta: {
        format: "numeric",
        sign: "%",
        colorize: true,
        category: "Price & Volume",
      },
    },
    // TODO: Missing field
    {
      accessorKey: "price_change_from_low_pct",
      header: "Price % Change from Low",
      meta: {
        format: "numeric",
        sign: "%",
        colorize: true,
        category: "Price & Volume",
      },
    },
    {
      accessorKey: "dcr",
      header: "DCR",
      meta: {
        format: "candlestick",
        category: "Price & Volume",
        cols: ["day_open", "day_high", "day_low", "day_close"],
      },
    },
    {
      accessorKey: "wcr",
      header: "WCR",
      meta: {
        format: "candlestick",
        category: "Price & Volume",
        cols: ["week_open", "week_high", "week_low", "week_close"],
      },
    },
    {
      accessorKey: "mcr",
      header: "MCR",
      meta: {
        format: "candlestick",
        category: "Price & Volume",
        cols: ["month_open", "month_high", "month_low", "month_close"],
      },
    },
    {
      accessorKey: "away_from_daily_vwap_pct",
      header: "Away From Daily VWAP",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Price & Volume",
        colorize: true,
        bold: true,
      },
    },
    {
      accessorKey: "away_from_weekly_vwap_pct",
      header: "Away From Weekly VWAP",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Price & Volume",
        colorize: true,
        bold: true,
      },
    },
    {
      accessorKey: "away_from_monthly_vwap_pct",
      header: "Away From Monthly VWAP",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Price & Volume",
        colorize: true,
        bold: true,
      },
    },
    {
      accessorKey: "away_from_yearly_vwap_pct",
      header: "Away From YTD VWAP",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Price & Volume",
        colorize: true,
        bold: true,
      },
    },
    {
      accessorKey: "price_above_daily_vwap",
      header: "Price Above Daily VWAP",
      meta: {
        format: "boolean",
        category: "Price & Volume",
      },
    },
    {
      accessorKey: "price_above_weekly_vwap",
      header: "Price Above Weekly VWAP",
      meta: {
        format: "boolean",
        category: "Price & Volume",
      },
    },
    {
      accessorKey: "price_above_monthly_vwap",
      header: "Price Above Monthly VWAP",
      meta: {
        format: "boolean",
        category: "Price & Volume",
      },
    },
    {
      accessorKey: "price_above_yearly_vwap",
      header: "Price Above Yearly VWAP",
      meta: {
        format: "boolean",
        category: "Price & Volume",
      },
    },

    {
      accessorKey: "daily_vwap",
      header: "Daily VWAP",
      meta: {
        format: "price",
        category: "Price & Volume",
      },
    },
    {
      accessorKey: "weekly_vwap",
      header: "Weekly VWAP",
      meta: {
        format: "price",
        category: "Price & Volume",
      },
    },
    {
      accessorKey: "monthly_vwap",
      header: "Monthly VWAP",
      meta: {
        format: "price",
        category: "Price & Volume",
      },
    },
    {
      accessorKey: "yearly_vwap",
      header: "YTD VWAP",
      meta: {
        format: "price",
        category: "Price & Volume",
      },
    },
    {
      accessorKey: "gap_dollar_D",
      header: "Gap $ Daily",
      meta: {
        format: "price",
        category: "Price & Volume",
        colorize: true,
        bold: true,
      },
    },
    {
      accessorKey: "gap_dollar_W",
      header: "Gap $ Weekly",
      meta: {
        format: "price",
        category: "Price & Volume",
        colorize: true,
        bold: true,
      },
    },
    {
      accessorKey: "gap_dollar_M",
      header: "Gap $ Monthly",
      meta: {
        format: "price",
        category: "Price & Volume",
        colorize: true,
        bold: true,
      },
    },
    {
      accessorKey: "gap_pct_D",
      header: "Gap % Daily",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Price & Volume",
        colorize: true,
        bold: true,
      },
    },
    {
      accessorKey: "gap_pct_W",
      header: "Gap % Weekly",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Price & Volume",
        colorize: true,
        bold: true,
      },
    },
    {
      accessorKey: "gap_pct_M",
      header: "Gap % Monthly",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Price & Volume",
        colorize: true,
        bold: true,
      },
    },
    {
      accessorKey: "unfilled_gap_D",
      header: "Unfilled Gap $ Daily",
      meta: {
        format: "price",
        category: "Price & Volume",
        colorize: true,
        bold: true,
      },
    },
    {
      accessorKey: "unfilled_gap_W",
      header: "Unfilled Gap $ Weekly",
      meta: {
        format: "price",
        category: "Price & Volume",
        colorize: true,
        bold: true,
      },
    },
    {
      accessorKey: "unfilled_gap_M",
      header: "Unfilled Gap $ Monthly",
      meta: {
        format: "price",
        category: "Price & Volume",
        colorize: true,
        bold: true,
      },
    },
    {
      accessorKey: "unfilled_gap_pct_D",
      header: "Unfilled Gap % Daily",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Price & Volume",
        colorize: true,
        bold: true,
      },
    },
    {
      accessorKey: "unfilled_gap_pct_W",
      header: "Unfilled Gap % Weekly",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Price & Volume",
        colorize: true,
        bold: true,
      },
    },
    {
      accessorKey: "unfilled_gap_pct_M",
      header: "Unfilled Gap % Monthly",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Price & Volume",
        colorize: true,
        bold: true,
      },
    },
    {
      accessorKey: "high_52_week",
      header: "High 52W",
      meta: {
        format: "price",
        category: "Price & Volume",
      },
    },
    {
      accessorKey: "low_52_week",
      header: "Low 52W",
      meta: {
        format: "price",
        category: "Price & Volume",
      },
    },
    {
      accessorKey: "high_52_week_today",
      header: "High 52W Today",
      meta: {
        format: "boolean",
        category: "Price & Volume",
      },
    },
    {
      accessorKey: "low_52_week_today",
      header: "Low 52W Today",
      meta: {
        format: "boolean",
        category: "Price & Volume",
      },
    },
    {
      accessorKey: "away_from_52_week_high_pct",
      header: "Away from 52W High",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Price & Volume",
      },
    },
    {
      accessorKey: "away_from_52_week_low_pct",
      header: "Away from 52W Low",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Price & Volume",
      },
    },
    {
      accessorKey: "all_time_high",
      header: "All Time High",
      meta: {
        format: "price",
        category: "Price & Volume",
      },
    },
    {
      accessorKey: "all_time_low",
      header: "All Time Low",
      meta: {
        format: "price",
        category: "Price & Volume",
      },
    },
    {
      accessorKey: "all_time_high_today",
      header: "All Time High Today",
      meta: {
        format: "boolean",
        category: "Price & Volume",
      },
    },
    {
      accessorKey: "all_time_low_today",
      header: "All Time Low Today",
      meta: {
        format: "boolean",
        category: "Price & Volume",
      },
    },
    {
      accessorKey: "away_from_all_time_high_pct",
      header: "Away from All Time High",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Price & Volume",
      },
    },
    {
      accessorKey: "away_from_all_time_low_pct",
      header: "Away from All Time Low",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Price & Volume",
      },
    },
    {
      accessorKey: "price_change_since_earning_pct",
      header: "Price Change % Last Earning",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Price & Volume",
        colorize: true,
        bold: true,
      },
    },
    {
      accessorKey: "price_change_pct_1W",
      header: "Price Change % Current Week",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Price & Volume",
        colorize: true,
        bold: true,
      },
    },
    {
      accessorKey: "price_change_curr_week_open_pct",
      header: "Price Change % Current Week Open",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Price & Volume",
        colorize: true,
        bold: true,
      },
    },
    {
      accessorKey: "price_change_pct_2D",
      header: "Price Change % 2D",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Price & Volume",
        colorize: true,
        bold: true,
      },
    },
    {
      accessorKey: "price_change_pct_3D",
      header: "Price Change % 3D",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Price & Volume",
        colorize: true,
        bold: true,
      },
    },
    {
      accessorKey: "price_change_pct_4D",
      header: "Price Change % 4D",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Price & Volume",
        colorize: true,
        bold: true,
      },
    },
    {
      accessorKey: "price_change_pct_1M",
      header: "Price Change % MTD",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Price & Volume",
        colorize: true,
        bold: true,
      },
    },
    {
      accessorKey: "price_change_pct_2M",
      header: "Price Change % 2M",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Price & Volume",
        colorize: true,
        bold: true,
      },
    },
    {
      accessorKey: "price_change_pct_3M",
      header: "Price Change % 3M",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Price & Volume",
        colorize: true,
        bold: true,
      },
    },
    {
      accessorKey: "price_change_pct_4M",
      header: "Price Change % 4M",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Price & Volume",
        colorize: true,
        bold: true,
      },
    },
    {
      accessorKey: "price_change_pct_5M",
      header: "Price Change % 5M",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Price & Volume",
        colorize: true,
        bold: true,
      },
    },
    {
      accessorKey: "price_change_pct_6M",
      header: "Price Change % 6M",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Price & Volume",
        colorize: true,
        bold: true,
      },
    },
    {
      accessorKey: "price_change_pct_7M",
      header: "Price Change % 7M",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Price & Volume",
        colorize: true,
        bold: true,
      },
    },
    {
      accessorKey: "price_change_pct_8M",
      header: "Price Change % 8M",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Price & Volume",
        colorize: true,
        bold: true,
      },
    },
    {
      accessorKey: "price_change_pct_9M",
      header: "Price Change % 9M",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Price & Volume",
        colorize: true,
        bold: true,
      },
    },
    {
      accessorKey: "price_change_pct_10M",
      header: "Price Change % 10M",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Price & Volume",
        colorize: true,
        bold: true,
      },
    },
    {
      accessorKey: "price_change_pct_11M",
      header: "Price Change % 11M",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Price & Volume",
        colorize: true,
        bold: true,
      },
    },
    {
      accessorKey: "price_change_pct_1Y",
      header: "Price Change % YTD",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Price & Volume",
        colorize: true,
        bold: true,
      },
    },
    {
      accessorKey: "price_change_pct_2Y",
      header: "Price Change % 2Y",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Price & Volume",
        colorize: true,
        bold: true,
      },
    },
    {
      accessorKey: "price_change_pct_3Y",
      header: "Price Change % 3Y",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Price & Volume",
        colorize: true,
        bold: true,
      },
    },
    {
      accessorKey: "price_change_pct_4Y",
      header: "Price Change % 4Y",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Price & Volume",
        colorize: true,
        bold: true,
      },
    },
    {
      accessorKey: "price_vs_price_sma_5D",
      header: "Price vs SMA 5D",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Price & Volume",
        colorize: true,
        bold: true,
      },
    },
    {
      accessorKey: "price_vs_price_sma_10D",
      header: "Price vs SMA 10D",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Price & Volume",
        colorize: true,
        bold: true,
      },
    },
    {
      accessorKey: "price_vs_price_sma_20D",
      header: "Price vs SMA 20D",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Price & Volume",
        colorize: true,
        bold: true,
      },
    },
    {
      accessorKey: "price_vs_price_sma_30D",
      header: "Price vs SMA 30D",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Price & Volume",
        colorize: true,
        bold: true,
      },
    },
    {
      accessorKey: "price_vs_price_sma_40D",
      header: "Price vs SMA 40D",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Price & Volume",
        colorize: true,
        bold: true,
      },
    },
    {
      accessorKey: "price_vs_price_sma_50D",
      header: "Price vs SMA 50D",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Price & Volume",
        colorize: true,
        bold: true,
      },
    },
    {
      accessorKey: "price_vs_price_sma_100D",
      header: "Price vs SMA 100D",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Price & Volume",
        colorize: true,
        bold: true,
      },
    },
    {
      accessorKey: "price_vs_price_sma_200D",
      header: "Price vs SMA 200D",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Price & Volume",
        colorize: true,
        bold: true,
      },
    },
    {
      accessorKey: "price_vs_price_sma_10W",
      header: "Price vs SMA 10W",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Price & Volume",
        colorize: true,
        bold: true,
      },
    },
    {
      accessorKey: "price_vs_price_sma_20W",
      header: "Price vs SMA 20W",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Price & Volume",
        colorize: true,
        bold: true,
      },
    },
    {
      accessorKey: "price_vs_price_sma_30W",
      header: "Price vs SMA 30W",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Price & Volume",
        colorize: true,
        bold: true,
      },
    },
    {
      accessorKey: "price_vs_price_sma_40W",
      header: "Price vs SMA 40W",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Price & Volume",
        colorize: true,
        bold: true,
      },
    },
    {
      accessorKey: "price_vs_price_sma_50W",
      header: "Price vs SMA 50W",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Price & Volume",
        colorize: true,
        bold: true,
      },
    },
    {
      accessorKey: "relative_vol_5D",
      header: "RV 5D",
      meta: {
        format: "volume",
        category: "Price & Volume",
        bold: true,
        activityLevel: 1.5,
      },
    },
    {
      accessorKey: "relative_vol_10D",
      header: "RV 10D",
      meta: {
        format: "volume",
        category: "Price & Volume",
        bold: true,
        activityLevel: 1.5,
      },
    },
    {
      accessorKey: "relative_vol_20D",
      header: "RV 20D",
      meta: {
        format: "volume",
        category: "Price & Volume",
        bold: true,
        activityLevel: 1.5,
      },
    },
    {
      accessorKey: "relative_vol_30D",
      header: "RV 30D",
      meta: {
        format: "volume",
        category: "Price & Volume",
        bold: true,
        activityLevel: 1.5,
      },
    },
    {
      accessorKey: "relative_vol_40D",
      header: "RV 40D",
      meta: {
        format: "volume",
        category: "Price & Volume",
        bold: true,
        activityLevel: 1.5,
      },
    },
    {
      accessorKey: "relative_vol_50D",
      header: "RV 50D",
      meta: {
        format: "volume",
        category: "Price & Volume",
        bold: true,
        activityLevel: 1.5,
      },
    },
    {
      accessorKey: "relative_vol_100D",
      header: "RV 100D",
      meta: {
        format: "volume",
        category: "Price & Volume",
        bold: true,
        activityLevel: 1.5,
      },
    },
    {
      accessorKey: "relative_vol_200D",
      header: "RV 200D",
      meta: {
        format: "volume",
        category: "Price & Volume",
        bold: true,
        activityLevel: 1.5,
      },
    },
    {
      accessorKey: "run_rate_vol_5D",
      header: "Run Rate 5D",
      meta: {
        format: "volume",
        category: "Price & Volume",
        bold: true,
        activityLevel: 150,
      },
    },
    {
      accessorKey: "run_rate_vol_10D",
      header: "Run Rate 10D",
      meta: {
        format: "volume",
        category: "Price & Volume",
        bold: true,
        activityLevel: 150,
      },
    },
    {
      accessorKey: "run_rate_vol_20D",
      header: "Run Rate 20D",
      meta: {
        format: "volume",
        category: "Price & Volume",
        bold: true,
        activityLevel: 150,
      },
    },
    {
      accessorKey: "run_rate_vol_30D",
      header: "Run Rate 30D",
      meta: {
        format: "volume",
        category: "Price & Volume",
        bold: true,
        activityLevel: 150,
      },
    },
    {
      accessorKey: "run_rate_vol_40D",
      header: "Run Rate 40D",
      meta: {
        format: "volume",
        category: "Price & Volume",
        bold: true,
        activityLevel: 150,
      },
    },
    {
      accessorKey: "run_rate_vol_50D",
      header: "Run Rate 50D",
      meta: {
        format: "volume",
        category: "Price & Volume",
        bold: true,
        activityLevel: 150,
      },
    },
    {
      accessorKey: "run_rate_vol_100D",
      header: "Run Rate 100D",
      meta: {
        format: "volume",
        category: "Price & Volume",
        bold: true,
        activityLevel: 150,
      },
    },
    {
      accessorKey: "run_rate_vol_200D",
      header: "Run Rate 200D",
      meta: {
        format: "volume",
        category: "Price & Volume",
        bold: true,
        activityLevel: 150,
      },
    },
    {
      accessorKey: "up_down_day_20D",
      header: "U/D 20D",
      meta: {
        format: "numeric",
        category: "Price & Volume",
      },
    },
    {
      accessorKey: "up_down_day_50D",
      header: "U/D 50D",
      meta: {
        format: "numeric",
        category: "Price & Volume",
      },
    },
    // TODO: Check this
    {
      accessorKey: "highest_vol_since_earning",
      header: "Highest Volume Since Earning",
      meta: {
        format: "boolean",
        category: "Price & Volume",
      },
    },
    {
      accessorKey: "highest_vol_in_1_year",
      header: "Highest Volume 1Y",
      meta: {
        format: "boolean",
        category: "Price & Volume",
      },
    },
    {
      accessorKey: "highest_vol_ever",
      header: "Highest Volume Ever",
      meta: {
        format: "boolean",
        category: "Price & Volume",
      },
    },
    {
      accessorKey: "price_volume",
      header: "Dollar Volume",
      meta: {
        format: "price",
        category: "Price & Volume",
      },
    },
    {
      accessorKey: "price_volume_sma_20D",
      header: "Dollar Volume 20D",
      meta: {
        format: "numeric",
        category: "Price & Volume",
      },
    },
    {
      accessorKey: "price_volume_sma_50D",
      header: "Dollar Volume 50D",
      meta: {
        format: "numeric",
        category: "Price & Volume",
      },
    },
    {
      accessorKey: "vol_sma_5D",
      header: "Vol SMA 5D",
      meta: {
        format: "volume",
        category: "Price & Volume",
      },
    },
    {
      accessorKey: "vol_sma_10D",
      header: "Vol SMA 10D",
      meta: {
        format: "volume",
        category: "Price & Volume",
      },
    },
    {
      accessorKey: "vol_sma_20D",
      header: "Vol SMA 20D",
      meta: {
        format: "volume",
        category: "Price & Volume",
      },
    },
    {
      accessorKey: "vol_sma_30D",
      header: "Vol SMA 30D",
      meta: {
        format: "volume",
        category: "Price & Volume",
      },
    },
    {
      accessorKey: "vol_sma_40D",
      header: "Vol SMA 40D",
      meta: {
        format: "volume",
        category: "Price & Volume",
      },
    },
    {
      accessorKey: "vol_sma_50D",
      header: "Vol SMA 50D",
      meta: {
        format: "volume",
        category: "Price & Volume",
      },
    },
    {
      accessorKey: "vol_sma_100D",
      header: "Vol SMA 100D",
      meta: {
        format: "volume",
        category: "Price & Volume",
      },
    },
    {
      accessorKey: "vol_sma_200D",
      header: "Vol SMA 200D",
      meta: {
        format: "volume",
        category: "Price & Volume",
      },
    },
    {
      accessorKey: "vol_sma_10W",
      header: "Vol SMA 10W",
      meta: {
        format: "volume",
        category: "Price & Volume",
      },
    },
    {
      accessorKey: "vol_sma_20W",
      header: "Vol SMA 20W",
      meta: {
        format: "volume",
        category: "Price & Volume",
      },
    },
    {
      accessorKey: "vol_sma_30W",
      header: "Vol SMA 30W",
      meta: {
        format: "volume",
        category: "Price & Volume",
      },
    },
    {
      accessorKey: "vol_sma_40W",
      header: "Vol SMA 40W",
      meta: {
        format: "volume",
        category: "Price & Volume",
      },
    },
    {
      accessorKey: "vol_sma_50W",
      header: "Vol SMA 50W",
      meta: {
        format: "volume",
        category: "Price & Volume",
      },
    },
    {
      accessorKey: "vol_vs_yesterday_vol",
      header: "Vol vs Yesterday Vol",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Price & Volume",
        colorize: true,
        bold: true,
      },
    },
    {
      accessorKey: "week_vol_vs_prev_week_vol",
      header: "Week Vol vs Last Week Vol",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Price & Volume",
        colorize: true,
        bold: true,
      },
    },

    {
      accessorKey: "vol_vs_vol_sma_5D",
      header: "Vol vs SMA 5D",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Price & Volume",
        colorize: true,
        bold: true,
      },
    },
    {
      accessorKey: "vol_vs_vol_sma_10D",
      header: "Vol vs SMA 10D",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Price & Volume",
        colorize: true,
        bold: true,
      },
    },
    {
      accessorKey: "vol_vs_vol_sma_20D",
      header: "Vol vs SMA 20D",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Price & Volume",
        colorize: true,
        bold: true,
      },
    },
    {
      accessorKey: "vol_vs_vol_sma_30D",
      header: "Vol vs SMA 30D",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Price & Volume",
        colorize: true,
        bold: true,
      },
    },
    {
      accessorKey: "vol_vs_vol_sma_40D",
      header: "Vol vs SMA 40D",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Price & Volume",
        colorize: true,
        bold: true,
      },
    },
    {
      accessorKey: "vol_vs_vol_sma_50D",
      header: "Vol vs SMA 50D",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Price & Volume",
        colorize: true,
        bold: true,
      },
    },
    {
      accessorKey: "vol_vs_vol_sma_100D",
      header: "Vol vs SMA 100D",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Price & Volume",
        colorize: true,
        bold: true,
      },
    },
    {
      accessorKey: "vol_vs_vol_sma_200D",
      header: "Vol vs SMA 200D",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Price & Volume",
        colorize: true,
        bold: true,
      },
    },
    {
      accessorKey: "vol_vs_vol_sma_10W",
      header: "Vol vs SMA 10W",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Price & Volume",
        colorize: true,
        bold: true,
      },
    },
    {
      accessorKey: "vol_vs_vol_sma_20W",
      header: "Vol vs SMA 20W",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Price & Volume",
        colorize: true,
        bold: true,
      },
    },
    {
      accessorKey: "vol_vs_vol_sma_30W",
      header: "Vol vs SMA 30W",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Price & Volume",
        colorize: true,
        bold: true,
      },
    },
    {
      accessorKey: "vol_vs_vol_sma_40W",
      header: "Vol vs SMA 40W",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Price & Volume",
        colorize: true,
        bold: true,
      },
    },
    {
      accessorKey: "vol_vs_vol_sma_50W",
      header: "Vol vs SMA 50W",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Price & Volume",
        colorize: true,
        bold: true,
      },
    },
    {
      accessorKey: "float_turnover",
      header: "Float Turnover",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Price & Volume",
      },
    },
    {
      accessorKey: "float_turnover_sma_20D",
      header: "Float Turnover SMA 20D",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Price & Volume",
      },
    },
    {
      accessorKey: "float_turnover_sma_50D",
      header: "Float Turnover SMA 50D",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Price & Volume",
      },
    },

    // ######################  Price and Volume  #######################

    // ##########################  Technical  ##########################

    {
      accessorKey: "beta_1_year",
      header: "Beta 1Y",
      meta: { format: "numeric", category: "Technicals" },
    },
    {
      accessorKey: "beta_3_year",
      header: "Beta 3 Yrs",
      meta: { format: "numeric", category: "Technicals" },
    },
    {
      accessorKey: "beta_5_year",
      header: "Beta 5Y",
      meta: { format: "numeric", category: "Technicals" },
    },

    {
      accessorKey: "day_open_gt_prev_open",
      header: "Day Open > Prev Day Open",
      meta: {
        format: "boolean",
        category: "Technicals",
      },
    },
    {
      accessorKey: "day_high_gt_prev_high",
      header: "Day High > Prev Day High",
      meta: {
        format: "boolean",
        category: "Technicals",
      },
    },
    {
      accessorKey: "day_low_gt_prev_low",
      header: "Day Low > Prev Day Low",
      meta: {
        format: "boolean",
        category: "Technicals",
      },
    },
    {
      accessorKey: "day_close_gt_prev_close",
      header: "Day Close > Prev Day Close",
      meta: {
        format: "boolean",
        category: "Technicals",
      },
    },
    {
      accessorKey: "day_open_lt_prev_open",
      header: "Day Open < Prev Day Open",
      meta: {
        format: "boolean",
        category: "Technicals",
      },
    },
    {
      accessorKey: "day_high_lt_prev_high",
      header: "Day High < Prev Day High",
      meta: {
        format: "boolean",
        category: "Technicals",
      },
    },
    {
      accessorKey: "day_low_lt_prev_low",
      header: "Day Low < Prev Day Low",
      meta: {
        format: "boolean",
        category: "Technicals",
      },
    },
    {
      accessorKey: "day_close_lt_prev_close",
      header: "Day Close < Prev Day Close",
      meta: {
        format: "boolean",
        category: "Technicals",
      },
    },
    {
      accessorKey: "day_open_eq_high",
      header: "Day Open = Day High",
      meta: {
        format: "boolean",
        category: "Technicals",
      },
    },
    {
      accessorKey: "day_open_eq_low",
      header: "Day Open = Day Low",
      meta: {
        format: "boolean",
        category: "Technicals",
      },
    },
    {
      accessorKey: "inside_day",
      header: "Inside Day",
      meta: {
        format: "boolean",
        category: "Technicals",
      },
    },
    {
      accessorKey: "double_inside_day",
      header: "Double Inside Day",
      meta: {
        format: "boolean",
        category: "Technicals",
      },
    },
    {
      accessorKey: "inside_week",
      header: "Inside Week",
      meta: {
        format: "boolean",
        category: "Technicals",
      },
    },
    {
      accessorKey: "double_inside_week",
      header: "Double Inside Week",
      meta: {
        format: "boolean",
        category: "Technicals",
      },
    },
    {
      accessorKey: "outside_day",
      header: "Outside Day",
      meta: {
        format: "boolean",
        category: "Technicals",
      },
    },
    {
      accessorKey: "outside_week",
      header: "Outside Week",
      meta: {
        format: "boolean",
        category: "Technicals",
      },
    },
    {
      accessorKey: "outside_bullish_day",
      header: "Outside Bullish Day",
      meta: {
        format: "boolean",
        category: "Technicals",
      },
    },
    {
      accessorKey: "outside_bearish_day",
      header: "Outside Bearish Day",
      meta: {
        format: "boolean",
        category: "Technicals",
      },
    },
    {
      accessorKey: "outside_bullish_week",
      header: "Outside Bullish Week",
      meta: {
        format: "boolean",
        category: "Technicals",
      },
    },
    {
      accessorKey: "outside_bearish_week",
      header: "Outside Bearish Week",
      meta: {
        format: "boolean",
        category: "Technicals",
      },
    },
    {
      accessorKey: "wick_play",
      header: "Wick Play",
      meta: {
        format: "boolean",
        category: "Technicals",
      },
    },
    {
      accessorKey: "in_the_wick",
      header: "In the Wick",
      meta: {
        format: "boolean",
        category: "Technicals",
      },
    },
    {
      accessorKey: "3_line_strike_bearish",
      header: "3 Line Strike Bearish",
      meta: {
        format: "boolean",
        category: "Technicals",
      },
    },
    {
      accessorKey: "3_line_strike_bullish",
      header: "3 Line Strike Bullish",
      meta: {
        format: "boolean",
        category: "Technicals",
      },
    },
    {
      accessorKey: "3_bar_break",
      header: "3 Bar Break",
      meta: {
        format: "boolean",
        category: "Technicals",
      },
    },
    {
      accessorKey: "bullish_reversal",
      header: "Bullish Reversal",
      meta: {
        format: "boolean",
        category: "Technicals",
      },
    },
    {
      accessorKey: "upside_reversal",
      header: "Upside Reversal",
      meta: {
        format: "boolean",
        category: "Technicals",
      },
    },
    {
      accessorKey: "oops_reversal",
      header: "Oops Reversal",
      meta: {
        format: "boolean",
        category: "Technicals",
      },
    },
    {
      accessorKey: "key_reversal",
      header: "Key Reversal",
      meta: {
        format: "boolean",
        category: "Technicals",
      },
    },
    {
      accessorKey: "pocket_pivot",
      header: "Pocket Pivot",
      meta: {
        format: "boolean",
        category: "Technicals",
      },
    },
    {
      accessorKey: "volume_dry_up",
      header: "Volume Dry Up Day",
      meta: {
        format: "boolean",
        category: "Technicals",
      },
    },
    {
      accessorKey: "slingshot",
      header: "Slingshot",
      meta: {
        format: "boolean",
        category: "Technicals",
      },
    },
    {
      accessorKey: "minicoil",
      header: "Slingshot",
      meta: {
        format: "boolean",
        category: "Technicals",
      },
    },
    {
      accessorKey: "3_week_tight",
      header: "3 Week Tight",
      meta: {
        format: "boolean",
        category: "Technicals",
      },
    },
    {
      accessorKey: "5_week_up",
      header: "5 Week Tight",
      meta: {
        format: "boolean",
        category: "Technicals",
      },
    },
    {
      accessorKey: "high_tight_flag",
      header: "High Tight Flag",
      meta: {
        format: "boolean",
        category: "Technicals",
      },
    },
    {
      accessorKey: "ants",
      header: "Ants",
      meta: {
        format: "boolean",
        category: "Technicals",
      },
    },
    {
      accessorKey: "power_trend",
      header: "Power Trend",
      meta: {
        format: "boolean",
        category: "Technicals",
      },
    },
    {
      accessorKey: "launchpad",
      header: "Launchpad",
      meta: {
        format: "boolean",
        category: "Technicals",
      },
    },
    {
      accessorKey: "launchpad_weekly",
      header: "Weekly Launchpad",
      meta: {
        format: "boolean",
        category: "Technicals",
      },
    },
    // TODO: Missing  Green Line Breakout
    {
      accessorKey: "doji",
      header: "Doji",
      meta: {
        format: "boolean",
        category: "Technicals",
      },
    },
    {
      accessorKey: "morning_star",
      header: "Morning Star",
      meta: {
        format: "boolean",
        category: "Technicals",
      },
    },
    {
      accessorKey: "evening_star",
      header: "Evening Star",
      meta: {
        format: "boolean",
        category: "Technicals",
      },
    },
    {
      accessorKey: "shooting_star",
      header: "Shooting Star",
      meta: {
        format: "boolean",
        category: "Technicals",
      },
    },
    {
      accessorKey: "hammer",
      header: "Hammer",
      meta: {
        format: "boolean",
        category: "Technicals",
      },
    },
    {
      accessorKey: "inverted_hammer",
      header: "Inverted Hammer",
      meta: {
        format: "boolean",
        category: "Technicals",
      },
    },
    {
      accessorKey: "bearish_harami",
      header: "Bearish Hammer",
      meta: {
        format: "boolean",
        category: "Technicals",
      },
    },
    {
      accessorKey: "bullish_harami",
      header: "Bullish Hammer",
      meta: {
        format: "boolean",
        category: "Technicals",
      },
    },
    // TODO: Missing  Engulfing, Kicker
    {
      accessorKey: "piercing_line",
      header: "Piercing Line",
      meta: {
        format: "boolean",
        category: "Technicals",
      },
    },
    {
      accessorKey: "hanging_man",
      header: "Hanging Man",
      meta: {
        format: "boolean",
        category: "Technicals",
      },
    },
    {
      accessorKey: "dark_cloud_cover",
      header: "Dark Cloud Cover",
      meta: {
        format: "boolean",
        category: "Technicals",
      },
    },
    {
      accessorKey: "gravestone_doji",
      header: "Gravestone Doji",
      meta: {
        format: "boolean",
        category: "Technicals",
      },
    },
    {
      accessorKey: "3_back_crows",
      header: "3 Black Crows",
      meta: {
        format: "boolean",
        category: "Technicals",
      },
    },
    {
      accessorKey: "dragonfly_doji",
      header: "Dragonfly Doji",
      meta: {
        format: "boolean",
        category: "Technicals",
      },
    },
    {
      accessorKey: "3_white_soldiers",
      header: "3 White Soldier",
      meta: {
        format: "boolean",
        category: "Technicals",
      },
    },
    {
      accessorKey: "sigma_spike",
      header: "Sigma Spike",
      meta: {
        format: "numeric",
        category: "Technicals",
      },
    },
    {
      accessorKey: "stan_weinstein_stage",
      header: "Stan Weinstein Stage",
      meta: {
        category: "Technicals",
      },
    },
    {
      accessorKey: "sma_200_vs_sma_200_1M_ago",
      header: "200D SMA > 200SMA 1M Ago",
      meta: {
        format: "boolean",
        category: "Technicals",
      },
    },
    {
      accessorKey: "sma_200_vs_sma_200_2M_ago",
      header: "200D SMA > 200SMA 2M Ago",
      meta: {
        format: "boolean",
        category: "Technicals",
      },
    },
    {
      accessorKey: "sma_200_vs_sma_200_3M_ago",
      header: "200D SMA > 200SMA 3M Ago",
      meta: {
        format: "boolean",
        category: "Technicals",
      },
    },
    {
      accessorKey: "sma_200_vs_sma_200_4M_ago",
      header: "200D SMA > 200SMA 4M Ago",
      meta: {
        format: "boolean",
        category: "Technicals",
      },
    },
    {
      accessorKey: "sma_200_vs_sma_200_5M_ago",
      header: "200D SMA > 200SMA 5M Ago",
      meta: {
        format: "boolean",
        category: "Technicals",
      },
    },
    {
      accessorKey: "sma_200_vs_sma_200_6M_ago",
      header: "200D SMA > 200SMA 6M Ago",
      meta: {
        format: "boolean",
        category: "Technicals",
      },
    },
    {
      accessorKey: "alpha_6M",
      header: "Alpha 6M",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Technicals",
      },
    },
    {
      accessorKey: "10Dsma_vs_ema_slope_pct",
      header: "10D SMA Vs EMA Slope %",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Technicals",
      },
    },
    {
      accessorKey: "20Dsma_vs_ema_slope_pct",
      header: "20D SMA Vs EMA Slope %",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Technicals",
      },
    },
    {
      accessorKey: "30Dsma_vs_ema_slope_pct",
      header: "30D SMA Vs EMA Slope %",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Technicals",
      },
    },
    {
      accessorKey: "40Dsma_vs_ema_slope_pct",
      header: "40D SMA Vs EMA Slope %",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Technicals",
      },
    },
    {
      accessorKey: "50Dsma_vs_ema_slope_pct",
      header: "50D SMA Vs EMA Slope %",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Technicals",
      },
    },
    {
      accessorKey: "100Dsma_vs_ema_slope_pct",
      header: "100D SMA Vs EMA Slope %",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Technicals",
      },
    },
    {
      accessorKey: "200Dsma_vs_ema_slope_pct",
      header: "200D SMA Vs EMA Slope %",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Technicals",
      },
    },

    {
      accessorKey: "10Dsma_vs_ema_slope_adr",
      header: "10D SMA Vs EMA Slope ADR",
      meta: {
        format: "numeric",
        category: "Technicals",
      },
    },
    {
      accessorKey: "20Dsma_vs_ema_slope_adr",
      header: "20D SMA Vs EMA Slope ADR",
      meta: {
        format: "numeric",
        category: "Technicals",
      },
    },
    {
      accessorKey: "30Dsma_vs_ema_slope_adr",
      header: "30D SMA Vs EMA Slope ADR",
      meta: {
        format: "numeric",
        category: "Technicals",
      },
    },
    {
      accessorKey: "40Dsma_vs_ema_slope_adr",
      header: "40D SMA Vs EMA Slope ADR",
      meta: {
        format: "numeric",
        category: "Technicals",
      },
    },
    {
      accessorKey: "50Dsma_vs_ema_slope_adr",
      header: "50D SMA Vs EMA Slope ADR",
      meta: {
        format: "numeric",
        category: "Technicals",
      },
    },
    {
      accessorKey: "100Dsma_vs_ema_slope_adr",
      header: "100D SMA Vs EMA Slope ADR",
      meta: {
        format: "numeric",
        category: "Technicals",
      },
    },
    {
      accessorKey: "200Dsma_vs_ema_slope_adr",
      header: "200D SMA Vs EMA Slope ADR",
      meta: {
        format: "numeric",
        category: "Technicals",
      },
    },
    {
      accessorKey: "RS_5D",
      header: "RS 5D",
      meta: {
        format: "numeric",
        category: "Technicals",
      },
    },
    {
      accessorKey: "RS_10D",
      header: "RS 10D",
      meta: {
        format: "numeric",
        category: "Technicals",
      },
    },
    {
      accessorKey: "RS_15D",
      header: "RS 15D",
      meta: {
        format: "numeric",
        category: "Technicals",
      },
    },
    {
      accessorKey: "RS_20D",
      header: "RS 20D",
      meta: {
        format: "numeric",
        category: "Technicals",
      },
    },
    {
      accessorKey: "RS_25D",
      header: "RS 25D",
      meta: {
        format: "numeric",
        category: "Technicals",
      },
    },
    {
      accessorKey: "RS_30D",
      header: "RS 30D",
      meta: {
        format: "numeric",
        category: "Technicals",
      },
    },
    {
      accessorKey: "RS_60D",
      header: "RS 60D",
      meta: {
        format: "numeric",
        category: "Technicals",
      },
    },
    {
      accessorKey: "RS_90D",
      header: "RS 90D",
      meta: {
        format: "numeric",
        category: "Technicals",
      },
    },

    {
      accessorKey: "RS_5D_pct",
      header: "RS 5D %",
      meta: {
        format: "numeric",
        category: "Technicals",
        sign: "%",
      },
    },
    {
      accessorKey: "RS_10D_pct",
      header: "RS 10D %",
      meta: {
        format: "numeric",
        category: "Technicals",
        sign: "%",
      },
    },
    {
      accessorKey: "RS_15D_pct",
      header: "RS 15D %",
      meta: {
        format: "numeric",
        category: "Technicals",
        sign: "%",
      },
    },
    {
      accessorKey: "RS_20D_pct",
      header: "RS 20D %",
      meta: {
        format: "numeric",
        category: "Technicals",
        sign: "%",
      },
    },
    {
      accessorKey: "RS_25D_pct",
      header: "RS 25D %",
      meta: {
        format: "numeric",
        category: "Technicals",
        sign: "%",
      },
    },
    {
      accessorKey: "RS_30D_pct",
      header: "RS 30D %",
      meta: {
        format: "numeric",
        category: "Technicals",
        sign: "%",
      },
    },
    {
      accessorKey: "RS_60D_pct",
      header: "RS 60D %",
      meta: {
        format: "numeric",
        category: "Technicals",
        sign: "%",
      },
    },
    {
      accessorKey: "RS_90D_pct",
      header: "RS 90D %",
      meta: {
        format: "numeric",
        category: "Technicals",
        sign: "%",
      },
    },
    {
      accessorKey: "RSNH_1M",
      header: "RSNH 1M",
      meta: {
        format: "boolean",
        category: "Technicals",
      },
    },
    {
      accessorKey: "RSNH_3M",
      header: "RSNH 3M",
      meta: {
        format: "boolean",
        category: "Technicals",
      },
    },
    {
      accessorKey: "RSNH_6M",
      header: "RSNH 6M",
      meta: {
        format: "boolean",
        category: "Technicals",
      },
    },
    {
      accessorKey: "RSNH_9M",
      header: "RSNH 9M",
      meta: {
        format: "boolean",
        category: "Technicals",
      },
    },
    {
      accessorKey: "RSNH_12M",
      header: "RSNH 12M",
      meta: {
        format: "boolean",
        category: "Technicals",
      },
    },
    {
      accessorKey: "RSNHBP_1M",
      header: "RSNHBP 1M",
      meta: {
        format: "boolean",
        category: "Technicals",
      },
    },
    {
      accessorKey: "RSNHBP_3M",
      header: "RSNHBP 3M",
      meta: {
        format: "boolean",
        category: "Technicals",
      },
    },
    {
      accessorKey: "RSNHBP_6M",
      header: "RSNHBP 6M",
      meta: {
        format: "boolean",
        category: "Technicals",
      },
    },
    {
      accessorKey: "RSNHBP_9M",
      header: "RSNHBP 9M",
      meta: {
        format: "boolean",
        category: "Technicals",
      },
    },
    {
      accessorKey: "RSNHBP_12M",
      header: "RSNHBP 12M",
      meta: {
        format: "boolean",
        category: "Technicals",
      },
    },
    {
      accessorKey: "ADR_1D",
      header: "ADR 1D $",
      meta: {
        format: "numeric",
        category: "Technicals",
      },
    },
    {
      accessorKey: "ADR_2D",
      header: "ADR 2D $",
      meta: {
        format: "numeric",
        category: "Technicals",
      },
    },
    {
      accessorKey: "ADR_5D",
      header: "ADR 5D $",
      meta: {
        format: "numeric",
        category: "Technicals",
      },
    },
    {
      accessorKey: "ADR_10D",
      header: "ADR 10D $",
      meta: {
        format: "numeric",
        category: "Technicals",
      },
    },
    {
      accessorKey: "ADR_14D",
      header: "ADR 14D $",
      meta: {
        format: "numeric",
        category: "Technicals",
      },
    },
    {
      accessorKey: "ADR_20D",
      header: "ADR 20D $",
      meta: {
        format: "numeric",
        category: "Technicals",
      },
    },

    {
      accessorKey: "ADR_pct_1D",
      header: "ADR 1D %",
      meta: {
        format: "numeric",
        category: "Technicals",
      },
    },
    {
      accessorKey: "ADR_pct_2D",
      header: "ADR 2D %",
      meta: {
        format: "numeric",
        category: "Technicals",
      },
    },
    {
      accessorKey: "ADR_pct_5D",
      header: "ADR 5D %",
      meta: {
        format: "numeric",
        category: "Technicals",
      },
    },
    {
      accessorKey: "ADR_pct_10D",
      header: "ADR 10D %",
      meta: {
        format: "numeric",
        category: "Technicals",
      },
    },
    {
      accessorKey: "ADR_pct_14D",
      header: "ADR 14D %",
      meta: {
        format: "numeric",
        category: "Technicals",
      },
    },
    {
      accessorKey: "ADR_pct_20D",
      header: "ADR 20D %",
      meta: {
        format: "numeric",
        category: "Technicals",
      },
    },
    {
      accessorKey: "ATR_2D",
      header: "ATR 2D %",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Technicals",
      },
    },
    {
      accessorKey: "ATR_5D",
      header: "ATR 5D %",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Technicals",
      },
    },
    {
      accessorKey: "ATR_10D",
      header: "ATR 10D %",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Technicals",
      },
    },
    {
      accessorKey: "ATR_14D",
      header: "ATR 14D %",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Technicals",
      },
    },
    {
      accessorKey: "ATR_20D",
      header: "ATR 20D %",
      meta: {
        format: "numeric",
        sign: "%",
        category: "Technicals",
      },
    },

    // ##########################  Technical  ##########################
  ] satisfies ColumnDef<Symbol>[]
).map((c) => {
  return {
    ...c,
    cell: (props) => <FormattedCell cell={props} />,
    // eslint-disable-next-line
    // @ts-ignore
    id: c.id ?? c.accessorKey,
  } as ColumnDef<Symbol>;
});
