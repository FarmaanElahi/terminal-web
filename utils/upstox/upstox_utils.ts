import { LibrarySymbolInfo } from "@/components/chart/types";
import type { Symbol } from "@/types/symbol";
import { UserApi, GetProfileResponse } from "upstox-js-sdk";

export function toUpstoxInstrumentKey(symbol: LibrarySymbolInfo | Symbol) {
  const { type, exchange, isin, ticker } = symbol;

  switch (type) {
    case "index": {
      const instrumentKey = INDEX_MAPPINGS[ticker as string];
      if (!instrumentKey) {
        throw new Error("Unable to generate upstox instrument key");
      }
      return instrumentKey;
    }
    case "stock": {
      if (!isin) {
        throw new Error("Unable to generate upstox instrument key");
      }
      return [`${exchange}_EQ`, isin].join("|");
    }

    case "fund": {
      if (!isin) {
        throw new Error("Unable to generate upstox instrument key");
      }
      return [`${exchange}_EQ`, isin].join("|");
    }
    default:
      throw new Error("Not supported symbol type");
  }
}

const INDEX_MAPPINGS: Record<string, string> = {
  "BSE:SENSEX": "BSE_INDEX|SENSEX",
  "NSE:CNXENERGY": "NSE_INDEX|Nifty Energy",
  "NSE:NIFTY_INDIA_MFG": "NSE_INDEX|Nifty India Mfg",
  "NSE:CNXINFRA": "NSE_INDEX|Nifty Infra",
  "NSE:CNXFMCG": "NSE_INDEX|Nifty FMCG",
  "NSE:CNXAUTO": "NSE_INDEX|Nifty Auto",
  "NSE:CNXIT": "NSE_INDEX|Nifty IT",
  "NSE:CNXFINANCE": "NSE_INDEX|Nifty Fin Service",
  "NSE:BANKNIFTY": "NSE_INDEX|Nifty Bank",
  "NSE:CNX500": "NSE_INDEX|Nifty 500",
  "NSE:NIFTY": "NSE_INDEX|Nifty 50",
  "NSE:NIFTY_LARGEMID250": "NSE_INDEX|NIFTY LARGEMID250",
  // MISSING
  "NSE:NIFTY_IND_DIGITAL": "NSE_INDEX|",
  "NSE:CNXMNC": "NSE_INDEX|Nifty MNC",
  // MISSING
  "NSE:CNXSERVICE": "NSE_INDEX|",
  "NSE:NIFTY_TOTAL_MKT": "NSE_INDEX|NIFTY TOTAL MKT",
  "NSE:CPSE": "NSE_INDEX|Nifty CPSE",
  "NSE:NIFTY_MICROCAP250": "NSE_INDEX|NIFTY MICROCAP250",
  "NSE:CNXCOMMODITIES": "NSE_INDEX|Nifty Commodities",
  "NSE:NIFTYALPHA50": "NSE_INDEX|NIFTY Alpha 50",
  "NSE:CNXCONSUMPTION": "NSE_INDEX|Nifty Consumption",
  "NSE:NIFTYMIDCAP150": "NSE_INDEX|NIFTY MIDCAP 150",
  "NSE:CNX100": "NSE_INDEX|Nifty 100",
  // MISSING
  "NSE:NIFTYMIDSMAL400": "NSE_INDEX|",
  "NSE:CNXPSE": "NSE_INDEX|Nifty PSE",
  "NSE:NIFTYSMLCAP250": "NSE_INDEX|NIFTY SMLCAP 250",
  "NSE:NIFTYMIDCAP50": "NSE_INDEX|Nifty Midcap 50",
  "NSE:CNXMIDCAP": "NSE_INDEX|NIFTY MIDCAP 100",
  "NSE:CNXSMALLCAP": "NSE_INDEX|NIFTY SMLCAP 100",
  "NSE:NIFTY_MID_SELECT": "NSE_INDEX|NIFTY MID SELECT",
  "NSE:NIFTY_HEALTHCARE": "NSE_INDEX|NIFTY HEALTHCARE",
  "NSE:NIFTY_CONSR_DURL": "NSE_INDEX|NIFTY CONSR DURBL",
  "NSE:NIFTY_OIL_AND_GAS": "NSE_INDEX|NIFTY OIL AND GAS",
  "NSE:NIFTYPVTBANK": "NSE_INDEX|Nifty Pvt Bank",
  "NSE:CNXMEDIA": "NSE_INDEX|Nifty Media",
  "NSE:CNXREALTY": "NSE_INDEX|Nifty Realty",
  "NSE:CNX200": "NSE_INDEX|Nifty 200",
  "NSE:CNXMETAL": "NSE_INDEX|Nifty Metal",
  "NSE:CNXPSUBANK": "NSE_INDEX|Nifty PSU Bank",
  "NSE:CNXPHARMA": "NSE_INDEX|Nifty Pharma",
  "NSE:NIFTYJR": "NSE_INDEX|Nifty Next 50",
  "NSE:NIFTY_IND_DEFENCE": "NSE_INDEX|Nifty Ind Defence",
};

export function upstoxProfile(access_token: string) {
  const api = new UserApi();
  if (api.apiClient) {
    api.apiClient.authentications.OAUTH2.accessToken = access_token;
  }

  return (
    new Promise<GetProfileResponse>((resolve, reject) =>
      api.getProfile("v2", (err, data) => (err ? reject(err) : resolve(data))),
    )
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      .then((value) => value.data as Record<string, unknown>)
  );
}
