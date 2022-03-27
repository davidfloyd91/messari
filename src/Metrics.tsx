import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getFormattedMetrics } from "./transformers";
import { LIGHT_PURPLE, COOL_GRAY, PURPLE, WHITE } from "./constants";
import { AssetMetrics, FormattedMetrics } from "./types";

const MetricsContainer = styled.div`
  border-top: 1px solid ${COOL_GRAY};
  display: grid;
  grid-template-columns: repeat(3, 1fr);
`;

const SingleMetricContainer = styled.div<{
  hideBorderRight: boolean;
}>`
  border-bottom: 1px solid ${COOL_GRAY};
  ${({ hideBorderRight }) =>
    !hideBorderRight && `border-right: 1px solid ${COOL_GRAY};`}
  display: grid;
  font-size: 11px;
  font-weight: 600;
  grid-template-rows: 24px 24px;
  padding: 8px 12px;
  height: 48px;

  div:first-of-type {
    color: ${LIGHT_PURPLE};
  }

  &:hover {
    background-color: ${PURPLE};

    div,
    div:first-of-type {
      color: ${WHITE};
    }
  }
`;

type MetricsProps = {
  assetMetrics: AssetMetrics;
  dataTestId: string;
};

export const Metrics = ({ assetMetrics, dataTestId }: MetricsProps) => {
  const [formattedMetrics, setFormattedMetrics] = useState(
    [] as FormattedMetrics
  );

  useEffect(() => {
    if (!assetMetrics?.name) return;
    const _formattedMetrics = getFormattedMetrics(assetMetrics);
    setFormattedMetrics(_formattedMetrics);
  }, [assetMetrics, setFormattedMetrics]);

  return (
    <MetricsContainer data-testid={dataTestId}>
      {formattedMetrics.map(({ name, value }, index) => {
        const hideBorderRight = (index + 1) % 3 === 0;
        return (
          <SingleMetricContainer hideBorderRight={hideBorderRight} key={index}>
            <div>{name}:</div>
            {value}
            <div></div>
          </SingleMetricContainer>
        );
      })}
    </MetricsContainer>
  );
};
