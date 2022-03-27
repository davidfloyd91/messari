type MarketData = {
  price_usd: number;
  volume_last_24_hours: number;
  price_eth: number;
};

type Marketcap = {
  rank: number;
  current_marketcap_usd: number;
  y_2050_marketcap_usd: number;
};

type Supply = {
  y_2050_issued_percent: number;
  annual_inflation_percent: number;
};

type BlockchainStats24Hours = {
  count_of_active_addresses: number;
  transaction_volume: number;
};

type AllTimeHigh = {
  price: number;
  days_since: number;
  percent_down: number;
};

export type AssetMetrics = {
  name: string;
  slug: string;
  market_data: MarketData;
  marketcap: Marketcap;
  supply: Supply;
  blockchain_stats_24_hours: BlockchainStats24Hours;
  all_time_high: AllTimeHigh;
};

export type Asset = {
  id: string;
  name: string;
  slug: string;
  symbol: string;
};

export type FormattedMetrics = Array<{ name: string; value: string }>;

export type TimeSeriesValue = [number, number, number, number, number, number];

export type AssetTimeSeries = {
  name: string;
  slug: string;
  symbol: string;
  values: Array<TimeSeriesValue>;
};
