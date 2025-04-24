import { KiteConnect } from "kiteconnect";

const api_key = process.env.NEXT_KITE_API_KEY as string;
const api_secret = process.env.NEXT_KITE_API_SECRET as string;

export function createKiteConnect(access_token: string) {
  return KiteConnect({ api_key, access_token });
}

export function kiteLoginUrl() {
  return new KiteConnect({ api_key }).getLoginURL();
}

export function kiteGenerateSession(request_token: string) {
  return new KiteConnect({ api_key }).generateSession(
    request_token,
    api_secret,
  );
}

export async function kiteProfile(access_token: string) {
  return await createKiteConnect(access_token).getProfile();
}
