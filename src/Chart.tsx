import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import { getChartOptions } from "./transformers";
import { AssetTimeSeries } from "./types";

const ChartContainer = styled.div``;

type ChartProps = {
  assetTimeSeries: AssetTimeSeries;
  dataTestId: string;
};

export const Chart = ({ assetTimeSeries, dataTestId }: ChartProps) => {
  const [options, setOptions] = useState({});

  useEffect(() => {
    const _options = getChartOptions(assetTimeSeries);
    setOptions(_options);
  }, [assetTimeSeries, setOptions]);

  const ref = useRef<HighchartsReact.RefObject>(null);

  return (
    <ChartContainer data-testid={dataTestId}>
      {options && (
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          ref={ref}
          constructorType={"stockChart"}
        />
      )}
    </ChartContainer>
  );
};
