import React from "react";
import { Trans } from "react-i18next";
import {
  OpDetailsTitle,
  OpDetailsData,
  OpDetailsSection,
  HashContainer,
} from "~/renderer/drawers/OperationDetails/styledComponents";
import Ellipsis from "~/renderer/components/Ellipsis";
import { SplitAddress } from "~/renderer/components/OperationsList/AddressCell";

type OperationDetailsExtraProps = {
  extra: { [key: string]: any },
  type: string,
  account: Account,
};

const OperationDetailsExtra = ({ extra, type, account }: OperationDetailsExtraProps) => {
  return (
    <>
      {Object.keys(extra).map(key => {
        if (key === "pagingToken") {
          return null;
        }

        return (
          <OpDetailsSection key={key}>
            <OpDetailsTitle>
              <Trans i18nKey={`families.stellar.${key}`} defaults={key} />
            </OpDetailsTitle>
            <OpDetailsData>
              {key === "assetIssuer" ? (
                <HashContainer>
                  <SplitAddress value={extra[key]} />
                </HashContainer>
              ) : (
                <Ellipsis>{extra[key]}</Ellipsis>
              )}
            </OpDetailsData>
          </OpDetailsSection>
        );
      })}
    </>
  );
};

export default {
  OperationDetailsExtra,
};
