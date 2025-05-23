import React, { useCallback, useRef } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useSymbolSearch } from "@/lib/state/symbol";
import Image from "next/image";
import { useGroupSymbolSwitcher } from "@/lib/state/grouper";

export function SymbolSearch() {
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState("");
  const commandInputRef = useRef<HTMLInputElement>(null);
  const switcher = useGroupSymbolSwitcher();
  const { data, isLoading } = useSymbolSearch(q);
  const handleSelect = useCallback(
    (ticker: string) => {
      switcher(ticker);
      setOpen(false);
      setQ("");
    },
    [switcher, setQ, setOpen],
  );

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const activeElement = document.activeElement as HTMLElement;

      // Prevent triggering if the user is typing in an input, textarea, or contenteditable
      if (
        activeElement &&
        (activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA" ||
          activeElement.isContentEditable)
      ) {
        return;
      }

      if (open) return;
      if (!e.metaKey && e.key.length === 1 && /^[a-zA-Z]$/.test(e.key)) {
        e.preventDefault();
        setQ(e.key);
        setOpen(true);
        commandInputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setQ, open]);

  const items = data?.map((s) => (
    <CommandItem
      key={s.name}
      onSelect={handleSelect}
      value={s.ticker!}
      className="m-2"
    >
      {s.logo ? (
        <Image
          src={["/external/logos/", s.logo + ".svg"].join("/")}
          alt="Logo"
          width={24}
          height={24}
          className="rounded-full"
        />
      ) : undefined}
      {s.name} - {s.description}
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
