export interface StockTwitFeed {
  symbol: Symbol;
  cursor: Cursor;
  regions: string[];
  filters: string[];
  messages: Message[];
  response: Response;
}

interface Symbol {
  id: number;
  symbol: string;
  symbol_mic: string;
  title: string;
  aliases: unknown[];
  is_following: boolean;
  watchlist_count: number;
  has_pricing: boolean;
  instrument_class: string;
  live_event: boolean;
}

interface Cursor {
  more: boolean;
  since: number;
  max: number;
}

interface Message {
  id: number;
  body: string;
  created_at: string;
  user: User;
  source: Source;
  symbols: Symbol2[];
  conversation?: Conversation;
  links?: Link[];
  likes?: Likes;
  mentioned_users: unknown[];
  entities: Entities;
  structurable?: Structurable;
}

interface User {
  id: number;
  username: string;
  name: string;
  avatar_url: string;
  avatar_url_ssl: string;
  join_date: string;
  official: boolean;
  identity: string;
  classification: string[];
  home_country: string;
  search_regions: string[];
  followers: number;
  following: number;
  ideas: number;
  watchlist_stocks_count: number;
  like_count: number;
  plus_tier: string;
  premium_room: string;
  trade_app: boolean;
  trade_status: string;
  company_representative?: CompanyRepresentative;
}

interface CompanyRepresentative {
  symbol: string;
}

interface Source {
  id: number;
  title: string;
  url: string;
}

interface Symbol2 {
  id: number;
  symbol: string;
  symbol_mic: string;
  title: string;
  aliases: unknown[];
  is_following: boolean;
  watchlist_count: number;
  has_pricing: boolean;
  instrument_class: string;
  live_event: boolean;
}

interface Conversation {
  parent_message_id: number;
  in_reply_to_message_id: unknown;
  parent: boolean;
  replies: number;
  discussion: boolean;
}

interface Link {
  title: string;
  url: string;
  shortened_url: string;
  shortened_expanded_url: string;
  description: string;
  image: string;
  created_at: string;
  video_url: unknown;
  source: Source2;
}

interface Source2 {
  name: string;
  website: string;
}

interface Likes {
  total: number;
  user_ids: number[];
}

interface Entities {
  media: Medum[];
  chart?: Chart;
  sentiment?: Sentiment;
  discussable: unknown;
}

interface Medum {
  id?: number;
  type: string;
  thumb: string;
  medium: string;
  large: string;
  original: string;
  url: string;
  height?: number;
  width?: number;
  ratio?: number;
  provider: unknown;
  provider_id: unknown;
}

interface Chart {
  id?: number;
  type?: string;
  thumb: string;
  medium?: string;
  large: string;
  original: string;
  url: string;
  height: number;
  width: number;
  ratio: number;
}

interface Sentiment {
  basic: string;
}

interface Structurable {
  id: number;
  user_id: number;
  stock_id: number;
  target_date: string;
  target_datetime: string;
  initial_price: number;
  target_price: number;
  final_price: unknown;
  final_price_change: unknown;
  final_price_change_percent: unknown;
  adjustment_value: number;
  adjustment_after_value: number;
  target_accuracy: unknown;
  is_hit: unknown;
  prediction_sentiment: string;
  prediction_type: string;
  status: string;
  created_at: string;
  symbol: string;
  symbol_mic: string;
  exchange: string;
  title: string;
  current_price: number;
  percent_change_since_created: number;
  type: string;
}

interface Response {
  status: number;
}
