import { AssetMetrics, AssetTimeSeries, FormattedMetrics } from "./types";

const CANDLESTICK_Y_AXIS = [
  {
    height: "80%",
  },
  {
    top: "80%",
    height: "20%",
    offset: 0,
    visible: false,
  },
];

const getChartOptions = (
  assetTimeSeries: AssetTimeSeries
): Highcharts.Options => {
  const { name, slug, symbol, values } = assetTimeSeries;
  if (!name || !values || !slug || !symbol) return {};

  const ohlc = [];
  const volume = [];

  for (const item of values) {
    ohlc.push([item[0], item[1], item[2], item[3], item[4]]);
    volume.push([item[0], item[5]]);
  }

  return {
    title: {
      text: name,
    },
    yAxis: CANDLESTICK_Y_AXIS,
    xAxis: {
      type: "datetime",
    },
    tooltip: {
      split: true,
    },
    series: [
      {
        type: "candlestick",
        id: `${slug}-ohlc`,
        name,
        data: ohlc,
      },
      {
        type: "column",
        id: `${slug}-volume`,
        name: `${symbol} volume`,
        data: volume,
        yAxis: 1,
      },
    ],
  };
};

const round = (raw: number, decimals: number): number => {
  const factorOfTen = Math.pow(10, decimals);
  return Math.round(raw * factorOfTen) / factorOfTen;
};

const formatNumber = ({
  raw,
  decimals = 1,
  prefix = "",
  suffix = "",
}: {
  raw: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}) => {
  if (!raw) return "?";

  let transformedNumber = raw;
  let formattedNumber = `${raw}`;

  const isTrillions = transformedNumber / 1_000_000_000_000 > 1;
  const isBillions = transformedNumber / 1_000_000_000 > 1;
  const isMillions = transformedNumber / 1_000_000 > 1;

  if (isTrillions) {
    transformedNumber = transformedNumber / 1_000_000_000_000;
    transformedNumber = round(transformedNumber, decimals);
    formattedNumber = `${transformedNumber} T`;
  } else if (isBillions) {
    transformedNumber = transformedNumber / 1_000_000_000;
    transformedNumber = round(transformedNumber, decimals);
    formattedNumber = `${transformedNumber} B`;
  } else if (isMillions) {
    transformedNumber = transformedNumber / 1_000_000;
    transformedNumber = round(transformedNumber, decimals);
    formattedNumber = `${transformedNumber} M`;
  } else {
    transformedNumber = round(transformedNumber, decimals);
    formattedNumber = `${transformedNumber}`;
  }

  return `${prefix} ${formattedNumber} ${suffix}`;
};

const getFormattedMetrics = (assetMetrics: AssetMetrics): FormattedMetrics => {
  const {
    name,
    slug,
    market_data: marketData,
    marketcap,
    supply,
    blockchain_stats_24_hours: blockchainStats24Hours,
    all_time_high: allTimeHigh,
  } = assetMetrics;

  const {
    price_usd: priceUsd,
    volume_last_24_hours: volume24Hours,
    price_eth: priceEth,
  } = marketData || {};

  const {
    rank: rankByMarketcap,
    current_marketcap_usd: currentMarketcapUsd,
    y_2050_marketcap_usd: y2050MarketcapUsd,
  } = marketcap || {};

  const {
    y_2050_issued_percent: y2050IssuedPercent,
    annual_inflation_percent: annualInflationPercent,
  } = supply || {};

  const {
    count_of_active_addresses: countOfActiveAddresses24Hours,
    transaction_volume: transactionVolume24Hours,
  } = blockchainStats24Hours || {};

  const {
    price: allTimeHighPrice,
    days_since: daysSinceAllTimeHigh,
    percent_down: percentDownFromAllTimeHigh,
  } = allTimeHigh || {};

  return [
    {
      name: "Name",
      value: name,
    },
    {
      name: "Slug",
      value: slug,
    },
    {
      name: "Price (USD)",
      value: formatNumber({ raw: priceUsd, prefix: "$", decimals: 2 }),
    },
    {
      name: "Volume (24 hours)",
      value: formatNumber({ raw: volume24Hours, decimals: 2 }),
    },
    {
      name: "Price (ETH)",
      value: formatNumber({ raw: priceEth, suffix: "Ξ", decimals: 4 }),
    },
    {
      name: "Rank (marketcap)",
      value: `${rankByMarketcap}`,
    },
    {
      name: "Marketcap (USD)",
      value: formatNumber({
        raw: currentMarketcapUsd,
        prefix: "$",
        decimals: 2,
      }),
    },
    {
      name: "2050 marketcap (USD)",
      value: formatNumber({ raw: y2050MarketcapUsd, prefix: "$", decimals: 2 }),
    },
    {
      name: "2050 issuance (percent)",
      value: formatNumber({
        raw: y2050IssuedPercent,
        suffix: "%",
        decimals: 1,
      }),
    },
    {
      name: "Annual inflation (percent)",
      value: formatNumber({
        raw: annualInflationPercent,
        suffix: "%",
        decimals: 1,
      }),
    },
    {
      name: "Active addresses (24 hours)",
      value: formatNumber({ raw: countOfActiveAddresses24Hours, decimals: 0 }),
    },
    {
      name: "Transaction volume (24 hours)",
      value: formatNumber({ raw: transactionVolume24Hours, decimals: 2 }),
    },
    {
      name: "All-time high (USD)",
      value: formatNumber({ raw: allTimeHighPrice, prefix: "$", decimals: 2 }),
    },
    {
      name: "Days since all-time high",
      value: `${daysSinceAllTimeHigh}`,
    },
    {
      name: "Percent down from all-time high",
      value: formatNumber({
        raw: percentDownFromAllTimeHigh,
        suffix: "%",
        decimals: 1,
      }),
    },
  ];
};

export { getChartOptions, getFormattedMetrics };
