"use client";

import {
  Check,
  ChevronsUpDown,
  Copy,
  Edit,
  Loader2,
  Plus,
  Trash,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button, buttonVariants } from "@/components/ui/button";
import React, { ReactNode, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  useCreateScanner,
  useDeleteScanner,
  useScanners,
  useScreens,
  useSymbolSearch,
} from "@/lib/state/symbol";
import { toast } from "sonner";
import { Json, Scanner, Watchlist } from "@/types/supabase";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { WatchlistSymbol } from "@/components/scanner/watchlist-symbol";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useCurrentScanner } from "@/hooks/use-active-scanner";

export function ScannerSelector() {
  const { scannerId, setScannerId, types, type } = useCurrentScanner();
  const { data: scanners = [] } = useScanners(types, type);
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openSymbolDialog, setOpenSymbolDialog] = useState(false);
  const [newWatchlistDefault, setNewWatchlistDefault] =
    useState<Pick<Watchlist, "name" | "state" | "symbols">>();
  const activeScanner = scanners?.find((s) => s.id === scannerId);

  return (
    <div className="flex gap-1">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            size="sm"
            aria-expanded={open}
            className="w-[200px] justify-between font-bold"
            onClick={() => {
              if (!activeScanner) setOpen(!open);
            }}
          >
            {activeScanner?.name || `Select ${type}...`}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder={`Search ${type}...`} className="h-9" />
            <CommandList>
              <CommandEmpty>No watchlist found.</CommandEmpty>
              <CommandGroup>
                {scanners.map((scanner) => (
                  <CommandItem
                    key={scanner.id}
                    className="font-bold group relative"
                    value={scanner.id}
                    onSelect={(currentValue) => {
                      setScannerId(
                        currentValue === scannerId ? null : currentValue,
                      );
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        scannerId === scanner.id ? "opacity-100" : "opacity-0",
                      )}
                    />
                    <span className="flex-1">{scanner.name}</span>
                    <Button
                      className="opacity-0 group-hover:opacity-100 h-7 w-7"
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setScannerId(scanner.id);
                        setOpenSymbolDialog(true);
                      }}
                    >
                      <Edit size="3" />
                    </Button>
                    <Button
                      className="opacity-0 group-hover:opacity-100 h-7 w-7"
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setNewWatchlistDefault({
                          name: `${scanner.name} (Copy)`,
                          state: scanner.state,
                          symbols: scanner.symbols,
                        });
                        setOpenDialog(true);
                      }}
                    >
                      <Copy size="3" />
                    </Button>
                    <DeleteWatchlist scanner={scanner}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 h-7 w-7"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Trash size="3" />
                      </Button>
                    </DeleteWatchlist>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          setNewWatchlistDefault(undefined);
          setOpenDialog(true);
        }}
      >
        <Plus className="size-4" />
      </Button>

      {type === "Watchlist" && (
        <WatchlistCreatorDialog
          open={openDialog}
          setOpen={setOpenDialog}
          default={newWatchlistDefault}
        />
      )}

      {type === "Watchlist" && activeScanner && (
        <WatchlistSymbol
          open={openSymbolDialog}
          setOpen={setOpenSymbolDialog}
          watchlist={activeScanner}
        />
      )}
    </div>
  );
}

export function WatchlistCreatorDialog({
  open,
  setOpen,
  default: defaultState,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  default?: { name: string; state: Json; symbols: string[] };
}) {
  const { types, setScannerId, type } = useCurrentScanner();
  const { data: watchlists = [] } = useScanners(types, type);

  const [listType, setListType] = useState<"simple" | "combo">("simple");
  const [selectedWatchlists, setSelectedWatchlists] = useState<string[]>([]);
  const [selectedScreeners, setSelectedScreeners] = useState<string[]>([]);
  const [symbolInput, setSymbolInput] = useState("");
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>([]);
  const { data: symbolResults = [], isLoading: isSearching } =
    useSymbolSearch(symbolInput);

  const { mutate: createWatchlist, isPending } = useCreateScanner(
    type,
    (watchlist) => {
      setOpen(false);
      toast(`${watchlist.name} watchlist created!`);
      setScannerId(watchlist.id);
    },
  );

  const [watchlistName, setNewWatchlistName] = useState<string>("");

  useEffect(() => {
    if (open) {
      setNewWatchlistName(defaultState?.name || "");
      setListType("simple");
      setSelectedWatchlists([]);
      setSelectedScreeners([]);
      setSelectedSymbols(defaultState?.symbols || []);
      setSymbolInput("");
    }
  }, [defaultState, open]);

  // Mock screener data - in a real implementation, you would fetch this data
  const { data: screeners = [] } = useScreens();

  const handleCreateWatchlist = () => {
    if (listType === "simple") {
      createWatchlist({
        type: "simple",
        name: watchlistName,
        state: defaultState?.state,
        symbols: selectedSymbols,
      });
    } else {
      // Create a combo list with the selected watchlists and screeners
      createWatchlist({
        type: "combo",
        name: watchlistName,
        state: defaultState?.state,
        combo_lists: [...selectedWatchlists, ...selectedScreeners],
        symbols: [],
      });
    }
    setOpen(false);
  };

  const handleWatchlistSelection = (watchlistId: string) => {
    setSelectedWatchlists((prevSelected) =>
      prevSelected.includes(watchlistId)
        ? prevSelected.filter((id) => id !== watchlistId)
        : [...prevSelected, watchlistId],
    );
  };

  const handleScreenerSelection = (screenerId: string) => {
    setSelectedScreeners((prevSelected) =>
      prevSelected.includes(screenerId)
        ? prevSelected.filter((id) => id !== screenerId)
        : [...prevSelected, screenerId],
    );
  };

  const addSymbol = (symbol: string) => {
    if (!selectedSymbols.includes(symbol)) {
      setSelectedSymbols([...selectedSymbols, symbol]);
      setSymbolInput("");
    }
  };

  const removeSymbol = (symbol: string) => {
    setSelectedSymbols(selectedSymbols.filter((s) => s !== symbol));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {defaultState?.name ? "Clone Watchlist" : "Create New Watchlist"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Watchlist Name</Label>
            <Input
              id="name"
              value={watchlistName}
              onChange={(e) => setNewWatchlistName(e.target.value)}
              placeholder="Enter watchlist name"
            />
          </div>

          <div className="grid gap-2">
            <Label>List Type</Label>
            <Tabs
              defaultValue="simple"
              value={listType}
              onValueChange={(value) =>
                setListType(value as "simple" | "combo")
              }
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="simple">Simple List</TabsTrigger>
                <TabsTrigger value="combo">Combo List</TabsTrigger>
              </TabsList>

              <TabsContent value="simple">
                <div className="py-2 space-y-4">
                  <div className="text-sm text-muted-foreground">
                    A simple list contains individual symbols only.
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="symbol-search">Add Symbols</Label>

                    {/* Symbol search input with integrated tag management */}
                    <div className="flex flex-wrap min-h-10 px-3 py-2 border rounded-md gap-1 focus-within:ring-1 focus-within:ring-ring">
                      {selectedSymbols.map((symbol) => (
                        <Badge
                          key={symbol}
                          variant="secondary"
                          className="flex items-center gap-1 h-6"
                        >
                          {symbol}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 p-0 hover:bg-transparent"
                            onClick={() => removeSymbol(symbol)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}

                      <div className="flex-1 min-w-[8rem]">
                        <Input
                          id="symbol-search"
                          value={symbolInput}
                          onChange={(e) => setSymbolInput(e.target.value)}
                          placeholder={
                            selectedSymbols.length === 0
                              ? "Search for symbols (e.g., AAPL, MSFT)"
                              : "Add more symbols..."
                          }
                          className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-6 p-0"
                        />
                      </div>
                    </div>

                    {/* Symbol search results dropdown */}
                    {symbolInput.trim() !== "" && (
                      <div className="relative">
                        {isSearching ? (
                          <div className="absolute top-0 w-full border rounded-md p-3 flex items-center justify-center bg-background z-10">
                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground mr-2" />
                            <span className="text-sm text-muted-foreground">
                              Searching...
                            </span>
                          </div>
                        ) : symbolResults.length > 0 ? (
                          <div className="absolute top-0 w-full border rounded-md max-h-[200px] overflow-y-auto bg-background z-10">
                            <Command>
                              <CommandList>
                                <CommandGroup>
                                  {symbolResults.map((result) => (
                                    <CommandItem
                                      key={result.ticker}
                                      onSelect={() => {
                                        addSymbol(result.ticker as string);
                                      }}
                                      className="flex justify-between cursor-pointer"
                                    >
                                      <div className="flex items-center">
                                        <span className="font-medium mr-2">
                                          {result.name}
                                        </span>
                                        <span className="text-sm text-muted-foreground truncate">
                                          {result.description || result.name}
                                        </span>
                                      </div>
                                      <Plus className="h-4 w-4 opacity-70" />
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </div>
                        ) : (
                          <div className="absolute top-0 w-full border rounded-md p-3 bg-background z-10">
                            <p className="text-sm text-muted-foreground">
                              No matching symbols found
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Help text for selected symbols */}
                    <div className="text-xs text-muted-foreground mt-1">
                      {selectedSymbols.length === 0
                        ? "Search and select symbols to add to your watchlist"
                        : `${selectedSymbols.length} symbol${selectedSymbols.length > 1 ? "s" : ""} selected`}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="combo">
                <div className="py-2 space-y-4">
                  <div className="text-sm text-muted-foreground mb-2">
                    A combo list can include multiple watchlists and screeners.
                  </div>

                  <div className="space-y-2">
                    <Label>Select Watchlists</Label>
                    <div className="border rounded-md p-3 max-h-[150px] overflow-y-auto">
                      {watchlists.length > 0 ? (
                        watchlists.map((list) => (
                          <div
                            key={list.id}
                            className="flex items-center space-x-2 py-1"
                          >
                            <Checkbox
                              id={`watchlist-${list.id}`}
                              checked={selectedWatchlists.includes(list.id)}
                              onCheckedChange={() =>
                                handleWatchlistSelection(list.id)
                              }
                            />
                            <Label
                              htmlFor={`watchlist-${list.id}`}
                              className="cursor-pointer"
                            >
                              {list.name}
                            </Label>
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-muted-foreground py-1">
                          No watchlists available
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Select Screeners</Label>
                    <div className="border rounded-md p-3 max-h-[150px] overflow-y-auto">
                      {screeners.map((screener) => (
                        <div
                          key={screener.id}
                          className="flex items-center space-x-2 py-1"
                        >
                          <Checkbox
                            id={`screener-${screener.id}`}
                            checked={selectedScreeners.includes(screener.id)}
                            onCheckedChange={() =>
                              handleScreenerSelection(screener.id)
                            }
                          />
                          <Label
                            htmlFor={`screener-${screener.id}`}
                            className="cursor-pointer"
                          >
                            {screener.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <DialogFooter>
          <Button
            disabled={
              !watchlistName ||
              (listType === "combo" &&
                selectedWatchlists.length === 0 &&
                selectedScreeners.length === 0) ||
              (listType === "simple" && selectedSymbols.length === 0)
            }
            onClick={handleCreateWatchlist}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {defaultState?.name ? "Clone" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeleteWatchlist({
  scanner,
  children,
}: {
  scanner: Scanner;
  children: ReactNode;
}) {
  const { type } = useCurrentScanner();
  const { mutate: deleteScanner } = useDeleteScanner(type, () =>
    toast(`Deleted ${scanner.name}`),
  );

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {type}</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete
            <span className="font-bold text-destructive">
              {" "}
              {scanner.name}
            </span>{" "}
            watchlist
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: "destructive" })}
            onClick={() => deleteScanner(scanner.id)}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

//
// export function ScreenSelector() {
//   const { activeScreenId, setActiveScreenId } = useActiveScreenerId();
//   const { data: screens = [] } = useScreens();
//   const [open, setOpen] = useState(false);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [newScreenDefault, setNewScreenDefault] =
//     useState<Pick<Screen, "name" | "state">>();
//   const activeScreen = screens?.find((s) => s.id === activeScreenId);
//
//   return (
//     <div className="flex gap-1">
//       <Popover open={open} onOpenChange={setOpen}>
//         <PopoverTrigger asChild>
//           <Button
//             variant="outline"
//             role="combobox"
//             size="sm"
//             aria-expanded={open}
//             className="w-[200px] justify-between font-bold"
//             onClick={() => {
//               if (!activeScreen) setOpen(!open);
//             }}
//           >
//             {activeScreen?.name || "My Screens"}
//             <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//           </Button>
//         </PopoverTrigger>
//         <PopoverContent className="w-[300px] p-0">
//           <Command>
//             <CommandInput placeholder="Search screens..." className="h-9" />
//             <CommandList>
//               <CommandEmpty>No screen found.</CommandEmpty>
//               <CommandGroup>
//                 {screens.map((screen) => (
//                   <CommandItem
//                     key={screen.id}
//                     className="font-bold group relative"
//                     value={screen.id}
//                     onSelect={(currentValue) => {
//                       setActiveScreenId(
//                         currentValue === activeScreenId ? null : currentValue,
//                       );
//                     }}
//                   >
//                     <Check
//                       className={cn(
//                         "mr-2 h-4 w-4",
//                         activeScreenId === screen.id
//                           ? "opacity-100"
//                           : "opacity-0",
//                       )}
//                     />
//                     <span className="flex-1">{screen.name}</span>
//                     <Button
//                       className="opacity-0 group-hover:opacity-100 h-7 w-7"
//                       variant="ghost"
//                       size="icon"
//                       onClick={() => {
//                         setNewScreenDefault({
//                           name: `${screen.name} (Copy)`,
//                           state: screen.state,
//                         });
//                         setOpenDialog(true);
//                       }}
//                     >
//                       <Copy size="3" />
//                     </Button>
//                     <DeleteScreen screen={screen}>
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         className="opacity-0 group-hover:opacity-100 h-7 w-7"
//                       >
//                         <Trash size="3" />
//                       </Button>
//                     </DeleteScreen>
//                   </CommandItem>
//                 ))}
//               </CommandGroup>
//             </CommandList>
//           </Command>
//         </PopoverContent>
//       </Popover>
//
//       <Button
//         variant="outline"
//         size="sm"
//         onClick={() => {
//           setNewScreenDefault(undefined);
//           setOpenDialog(true);
//         }}
//       >
//         <Plus className="size-4" />
//       </Button>
//
//       <ScreenCreatorDialog
//         open={openDialog}
//         setOpen={setOpenDialog}
//         default={newScreenDefault}
//       />
//     </div>
//   );
// }
//
// function ScreenCreatorDialog({
//                                open,
//                                setOpen,
//                                default: defaultState,
//                              }: {
//   open: boolean;
//   setOpen: (open: boolean) => void;
//   default?: { name: string; state: Json };
//   cloneFromId?: string;
// }) {
//   const { mutate: createScreen, isPending } = useCreateScreen((screen) => {
//     setOpen(false);
//     toast(`${screen.name} screen created!`);
//   });
//   const [screenName, setNewScreenName] = useState<string>();
//   useEffect(() => setNewScreenName(defaultState?.name), [defaultState]);
//
//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>
//             {defaultState?.name ? "Clone Screen" : "Create New Screen"}
//           </DialogTitle>
//         </DialogHeader>
//         <div className="grid gap-4 py-4">
//           <div className="grid gap-2">
//             <Label htmlFor="name">Screen Name</Label>
//             <Input
//               id="name"
//               value={screenName}
//               onChange={(e) => setNewScreenName(e.target.value)}
//               placeholder="Enter screen name"
//             />
//           </div>
//         </div>
//         <DialogFooter>
//           <Button
//             disabled={!screenName}
//             onClick={(e) => {
//               e.stopPropagation();
//               createScreen({ name: screenName!, state: defaultState?.state });
//               setOpen(false);
//             }}
//           >
//             {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//             {defaultState?.name ? "Clone" : "Create"}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }
//
// function DeleteScreen({
//                         screen,
//                         children,
//                       }: {
//   screen: Screen;
//   children: ReactNode;
// }) {
//   const { mutate: deleteScreen } = useDeleteScreen(() =>
//     toast(`Deleted ${screen.name}`),
//   );
//
//   return (
//     <AlertDialog>
//       <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
//       <AlertDialogContent>
//         <AlertDialogHeader>
//           <AlertDialogTitle>Delete Screener</AlertDialogTitle>
//           <AlertDialogDescription>
//             This action cannot be undone. This will permanently delete
//             <span className="font-bold text-destructive">
//               {" "}
//               {screen.name}
//             </span>{" "}
//             screener
//           </AlertDialogDescription>
//         </AlertDialogHeader>
//         <AlertDialogFooter>
//           <AlertDialogCancel>Cancel</AlertDialogCancel>
//           <AlertDialogAction
//             className={buttonVariants({ variant: "destructive" })}
//             onClick={() => deleteScreen(screen.id)}
//           >
//             Continue
//           </AlertDialogAction>
//         </AlertDialogFooter>
//       </AlertDialogContent>
//     </AlertDialog>
//   );
// }
