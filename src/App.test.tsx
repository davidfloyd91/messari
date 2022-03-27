import { rest } from 'msw';
import { setupServer } from 'msw/node';
import '@testing-library/jest-dom';
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import App from "./App";
import { assetList, assetMetrics, assetTimeSeries } from './fixtures';

const handlers = [
  rest.get('https://data.messari.io/api/v1/assets', (req, res, ctx) => {
    return res(ctx.json({ data: assetList }));
  }),
  rest.get('https://data.messari.io/api/v1/assets/polygon/metrics', (req, res, ctx) => {
    return res(ctx.json({ data: assetMetrics }));
  }),
  rest.get('https://data.messari.io/api/v1/assets/polygon/metrics/price/time-series', (req, res, ctx) => {
    return res(ctx.json({ data: assetTimeSeries }));
  }),
];

const server = setupServer(...handlers);

global.window = Object.create(window);
Object.defineProperty(window, 'location', {
  value: {
    pathname: "/polygon",
  },
});

beforeAll(() => server.listen());

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => server.close());

test("renders AssetList", async () => {
  render(<App />);
  await waitFor(() => {
    const assetList = screen.queryByTestId('asset-list');
    expect(assetList).toBeInTheDocument();
    expect(screen.queryByText('Bitcoin')).toBeInTheDocument();
    expect(screen.queryByText('Avalanche')).toBeInTheDocument();
    expect(screen.queryByText('Dogecoin')).toBeInTheDocument();
  });
  cleanup();
});

test("renders Metrics", async () => {
  render(<App />);
  await waitFor(() => {
    const metrics = screen.queryByTestId('metrics');
    expect(metrics).toBeInTheDocument();
    // marketcap
    expect(screen.queryByText('$ 12.34 B')).toBeInTheDocument();
    // price usd
    expect(screen.queryByText('$ 1.6')).toBeInTheDocument();
    // 24 hour volume
    expect(screen.queryByText('147.13 M')).toBeInTheDocument();
  });
  cleanup();
});

test("renders MetricsHeader", async () => {
  render(<App />);
  await waitFor(() => {
    const metricsHeader = screen.queryByTestId('metrics-header');
    expect(metricsHeader).toHaveTextContent('Polygon');
  });
  cleanup();
});

test("renders Chart", async () => {
  render(<App />);
  await waitFor(() => {
    const chart = screen.queryByTestId('chart');
    expect(chart).toBeInTheDocument();
  });
  cleanup();
});
