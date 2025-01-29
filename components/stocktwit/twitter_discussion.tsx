import { useDiscussionFeed } from "@/lib/state/symbol";
import { useGroupSymbol, useGroupSymbolSwitcher } from "@/lib/state/grouper";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { StockTwitFeed } from "@/types/stocktwits";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import he from "he";
import { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function TwitterDiscussion() {
  const symbol = useGroupSymbol();
  return symbol ? <SymbolDiscussion symbol={symbol} /> : null;
}

export function SymbolDiscussion({ symbol }: { symbol: string }) {
  type SymbolFeedType = "trending" | "popular";
  const [feed, setFeed] = useState<SymbolFeedType>("trending");
  const { data } = useDiscussionFeed({
    feed: "symbol",
    symbol,
    limit: 22,
    filter: feed,
  });

  console.log(data);
  const content = data?.pages?.[0]?.messages.map((m) => (
    <Message key={m.id} message={m} />
  ));

  return (
    <Tabs
      value={feed}
      onValueChange={(value) => setFeed(value as SymbolFeedType)}
      className="w-full h-full flex flex-col px-2"
    >
      <TabsList>
        <TabsTrigger value="trending">Trending</TabsTrigger>
        <TabsTrigger value="popular">Popular</TabsTrigger>
      </TabsList>
      <TabsContent value={"trending"} />
      <TabsContent value={"popular"} />
      <div className="flex-1 overflow-auto w-full">
        {/*trending Feed*/}
        <TabsContent value={"trending"}>
          <div>Trending</div>
          {feed === "trending" && content}
        </TabsContent>

        {/*popular Feed*/}
        <TabsContent value={"popular"}>
          <div>Popular</div>
          {feed === "popular" && content}
        </TabsContent>
      </div>
    </Tabs>
  );
}

interface MessageCardProps {
  message: StockTwitFeed["messages"][0];
}

export default function Message({ message }: MessageCardProps) {
  const { body, created_at, user, symbols, links, likes, entities } = message;
  const switchSymbol = useGroupSymbolSwitcher();
  // Decode HTML entities in the body
  const decodedBody = useMemo(() => (body ? he.decode(body) : ""), [body]);

  const parseLine = (line: string) => {
    const parts = line.split(/(\$\w+\.\w+)/g); // Splits the line into text and symbols
    return parts.map((part, index) => {
      if (part.startsWith("$")) {
        part = part.replace("$", "").split(".").reverse().join(":");
        return (
          <span
            key={index}
            className="mr-1 cursor-pointer hover:underline animate-out transition font-bold"
            onClick={() => {
              const symbol = part.split(".").reverse().join(":");
              switchSymbol(symbol);
            }}
          >
            {part}
          </span>
        );
      }
      // Render regular text
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <Card className="max-w-xl mx-auto my-4">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={user.avatar_url} alt={user.name} />
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg font-semibold">{user.name}</CardTitle>
            <CardDescription className="text-sm text-gray-500">
              @{user.username} - {new Date(created_at).toLocaleString()}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-4 ">{parseLine(decodedBody)}</p>
        {entities.chart && (
          <AspectRatio ratio={entities.chart.ratio ?? 16 / 9}>
            <Zoom>
              <Image
                src={entities.chart.url}
                alt="Chart"
                fill={true}
                className="rounded-md object-cover"
              />
            </Zoom>
          </AspectRatio>
        )}
        <div className="flex flex-wrap gap-2 my-4">
          {symbols.map((symbol) => (
            <Badge key={symbol.id}>{symbol.title}</Badge>
          ))}
        </div>
        <div className="flex items-center space-x-4">
          <Link
            href={links?.[0]?.url || "#"}
            target="_blank"
            className="text-blue-600"
          >
            {links?.[0]?.title || "Learn More"}
          </Link>
          <span className="text-sm text-gray-500">{likes?.total} Likes</span>
        </div>
      </CardContent>
    </Card>
  );
}
