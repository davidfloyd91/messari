import styled from "styled-components";
import { LIGHT_PURPLE, PURPLE, COOL_GRAY } from "./constants";
import { Asset } from "./types";

const AssetListContainer = styled.div`
  max-height: 100%;
  overflow-y: scroll;
`;

const SingleAsssetContainer = styled.div<{
  isCurrent: boolean;
}>`
  border-bottom: 1px solid ${COOL_GRAY};
  border-right: 1px solid ${COOL_GRAY};
  cursor: pointer;
  font-size: 11px;
  font-weight: 600;
  padding: 8px 12px;
  ${({ isCurrent }) => isCurrent && `background-color: ${PURPLE};`}
  height: 15px;

  &:hover {
    ${({ isCurrent }) => !isCurrent && `color: ${LIGHT_PURPLE};`}
  }
`;

const AssetLink = styled.a`
  color: inherit;
  text-decoration: none;
`;

type AssetListProps = {
  assetList: Array<Asset>;
  currentAsset: string;
  dataTestId: string;
};

export const AssetList = ({
  assetList,
  currentAsset,
  dataTestId,
}: AssetListProps) => {
  return (
    <AssetListContainer data-testid={dataTestId}>
      {assetList.map((asset) => {
        const { id, name, slug } = asset;
        const isCurrent = currentAsset.toLowerCase() === slug;
        return (
          <AssetLink href={`/${slug}`} key={id}>
            <SingleAsssetContainer isCurrent={isCurrent}>
              {name}
            </SingleAsssetContainer>
          </AssetLink>
        );
      })}
    </AssetListContainer>
  );
};
