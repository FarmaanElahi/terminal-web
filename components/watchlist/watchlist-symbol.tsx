import React, { useMemo, useRef } from "react";
import { useSymbolSearch, useUpdateWatchlist } from "@/lib/state/symbol";
import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import Image from "next/image";
import { Watchlist } from "@/types/supabase";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";

export function WatchlistSymbol({
  watchlist,
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  watchlist: Watchlist;
}) {
  const [q, setQ] = React.useState("");
  const commandInputRef = useRef<HTMLInputElement>(null);
  const { data, isLoading } = useSymbolSearch(q);
  const symbolSet = useMemo(
    () => new Set(watchlist.symbols),
    [watchlist.symbols],
  );

  const { mutate: updateWatchlist } = useUpdateWatchlist();

  const items = data?.map((s) => (
    <CommandItem key={s.name} value={s.ticker!} className="m-2">
      {s.logo ? (
        <Image
          src={[process.env.NEXT_PUBLIC_LOGO_BASE_URL, s.logo + ".svg"].join(
            "/",
          )}
          alt="Logo"
          width={24}
          height={24}
          className="rounded-full"
        />
      ) : undefined}
      <span className="flex-1">
        {s.name} - {s.description}
      </span>
      {symbolSet.has(s.ticker!) ? (
        <Button
          size={"sm"}
          variant="destructive"
          className="h-6 w-6 p-0"
          onClick={() =>
            updateWatchlist({
              id: watchlist.id,
              payload: {
                symbols: watchlist.symbols.filter((ws) => ws !== s.ticker!),
              },
            })
          }
        >
          <Trash size={2} />
        </Button>
      ) : (
        <Button
          size={"sm"}
          variant="ghost"
          className="h-6 w-6 p-0"
          onClick={() =>
            updateWatchlist({
              id: watchlist.id,
              payload: { symbols: [...watchlist.symbols, s.ticker!] },
            })
          }
        >
          <Plus size={2} />
        </Button>
      )}
    </CommandItem>
  ));

  return (
    <CommandDialog open={open} onOpenChange={setOpen} modal={false}>
      <CommandInput
        ref={commandInputRef}
        placeholder="Type a symbol or search..."
        value={q}
        onValueChange={setQ}
        autoFocus={true}
      />
      <CommandList className="h-96 my-2">
        {!isLoading && <CommandEmpty>No symbols found</CommandEmpty>}
        {items && items.length > 0 && items}
      </CommandList>
    </CommandDialog>
  );
}
