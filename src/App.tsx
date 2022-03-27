import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { AssetList } from "./AssetList";
import { Chart } from "./Chart";
import { Metrics } from "./Metrics";
import { API_URL } from "./constants";
import { AssetMetrics, AssetTimeSeries } from "./types";
import { COOL_GRAY, WARM_GRAY } from "./constants";

const AppContainer = styled.div``;

const TopContainer = styled.div`
  display: grid;
  grid-template-columns: calc(100% / 3) calc(200% / 3);
  height: 400px;
  width: 100%;
`;

const MetricsHeader = styled.div`
  border-top: 1px solid ${COOL_GRAY};
  color: ${WARM_GRAY};
  font-size: 32px;
  padding: 8px 0;
  text-align: center;
`;

const START_DATE = "2021-03-25";
const END_DATE = "2022-03-25";

const useIsMounted = () => {
  const isMounted = useRef(false);
  useEffect((): (() => void) => {
    isMounted.current = true;
    return () => (isMounted.current = false);
  }, []);
  return isMounted;
};

const App = () => {
  const isMounted = useIsMounted();
  const [assetList, setAssetList] = useState([]);
  const [currentAsset, setCurrentAsset] = useState("");
  const [assetMetrics, setAssetMetrics] = useState({} as AssetMetrics);
  const [assetTimeSeries, setAssetTimeSeries] = useState({} as AssetTimeSeries);
  const [assetName, setAssetName] = useState("");

  const getAssetList = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}assets`);
      const { data } = await res.json();
      if (isMounted.current) setAssetList(data);
    } catch (error) {
      console.error(error);
    }
  }, [setAssetList]);

  const getCurrentAsset = useCallback(() => {
    const pathname = window.location.pathname;
    const assetSlug = pathname.length > 1 ? pathname.slice(1) : "bitcoin";
    return assetSlug;
  }, []);

  const getAsssetMetrics = useCallback(async () => {
    try {
      const res = await fetch(
        `${API_URL}assets/${currentAsset.toLowerCase()}/metrics`
      );
      const { data } = await res.json();
      if (isMounted.current) {
        setAssetMetrics(data);
        const { name } = data;
        setAssetName(name);
      }
    } catch (error) {
      console.error(error);
    }
  }, [currentAsset, setAssetMetrics, setAssetName]);

  const getAssetTimeSeries = useCallback(async () => {
    try {
      const res = await fetch(
        `${API_URL}assets/${currentAsset.toLowerCase()}/metrics/price/time-series?start=${START_DATE}&end=${END_DATE}&interval=1d`
      );
      const { data } = await res.json();
      if (isMounted.current) setAssetTimeSeries(data);
    } catch (error) {
      console.error(error);
    }
  }, [currentAsset, setAssetTimeSeries]);

  useEffect(() => {
    const _currentAsset = getCurrentAsset();
    if (isMounted.current) setCurrentAsset(_currentAsset);
    getAssetList();
  }, []);

  useEffect(() => {
    if (!currentAsset) return;
    getAsssetMetrics();
    getAssetTimeSeries();
  }, [currentAsset]);

  return (
    <AppContainer>
      <TopContainer>
        <AssetList
          assetList={assetList}
          currentAsset={currentAsset}
          dataTestId={"asset-list"}
        />
        <Chart assetTimeSeries={assetTimeSeries} dataTestId={"chart"} />
      </TopContainer>
      <MetricsHeader data-testid={"metrics-header"}>{assetName}</MetricsHeader>
      <Metrics assetMetrics={assetMetrics} dataTestId={"metrics"} />
    </AppContainer>
  );
};

export default App;
