import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { getAllTradingAccounts } from "@/server/integration";

export default async function IntegrationsPage() {
  const integrations = await getAllTradingAccounts();

  // Group integrations by type
  const groupedIntegrations = {
    kite: integrations.filter((i) => i.type === "kite"),
    upstox: integrations.filter((i) => i.type === "upstox"),
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Trading Integrations</h1>
        <div className="space-x-4">
          <Button asChild>
            <a href="/integration/kite/connect">Add Kite Account</a>
          </Button>
          <Button asChild>
            <a href="/integration/upstox/connect">Add Upstox Account</a>
          </Button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Kite Integrations */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Kite Accounts</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {groupedIntegrations.kite.map((integration, index) => (
              <Card key={`kite-${index}`}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Zerodha Kite
                    {integration.active ? (
                      <Check className="text-green-500 h-6 w-6" />
                    ) : (
                      <X className="text-red-500 h-6 w-6" />
                    )}
                  </CardTitle>
                  <CardDescription>
                    Zerodha Kite Trading Account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {integration.active ? (
                    <Button variant="outline" className="w-full" disabled>
                      Connected as {integration.name}
                    </Button>
                  ) : (
                    <Button variant="destructive" className="w-full">
                      Disconnected
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Upstox Integrations */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Upstox Accounts</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {groupedIntegrations.upstox.map((integration, index) => (
              <Card key={`upstox-${index}`}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Upstox
                    {integration.active ? (
                      <Check className="text-green-500 h-6 w-6" />
                    ) : (
                      <X className="text-red-500 h-6 w-6" />
                    )}
                  </CardTitle>
                  <CardDescription>Upstox Trading Account</CardDescription>
                </CardHeader>
                <CardContent>
                  {integration.active ? (
                    <Button variant="outline" className="w-full" disabled>
                      Connected as {integration.name}
                    </Button>
                  ) : (
                    <Button variant="destructive" className="w-full">
                      Disconnected
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
