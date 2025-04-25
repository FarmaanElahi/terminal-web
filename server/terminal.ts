"use server";

import { createKiteConnect } from "@/utils/kite/client";
import { getIntegrationToken } from "@/server/integration";

async function getClient(accountId: string) {
  const token = await getIntegrationToken("kite", accountId);
  return createKiteConnect(token);
}

export async function kiteAccount(accountId: string) {
  const client = await getClient(accountId);
  return client.getProfile();
}

export async function kiteMargin(accountId: string) {
  const client = await getClient(accountId);
  return await client.getMargins().then((value) => value.equity);
}

export async function kitePosition(accountId: string) {
  const client = await getClient(accountId);
  return await client.getPositions();
}

export async function kiteHolding(accountId: string) {
  const client = await getClient(accountId);
  return await client.getHoldings();
}

export async function kiteOrder(accountId: string) {
  const client = await getClient(accountId);
  return await client.getOrders();
}
