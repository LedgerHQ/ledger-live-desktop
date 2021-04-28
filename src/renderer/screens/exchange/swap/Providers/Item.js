// @flow

import React, { useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Trans } from "react-i18next";
import Box from "~/renderer/components/Box";
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

import { swapKYCSelector } from "~/renderer/reducers/settings";
import { setSwapKYCStatus } from "~/renderer/actions/settings";
import { getKYCStatus } from "@ledgerhq/live-common/lib/exchange/swap";

import Alert from "~/renderer/components/Alert";
import CardButton from "~/renderer/components/CardButton";
import BulletList from "~/renderer/components/BulletList";

const GridItem: ThemedComponent<{}> = styled.div`
  margin: 12px;
  > * {
    height: 100%;
  }
`;

const Item = ({
  id,
  selected,
  onSelect,
  icon,
  title,
  bullets,
  kyc,
  notAvailable,
  description,
  disabled,
}: {
  id: string,
  selected?: string,
  onSelect?: string => void,
  icon: any,
  title: string,
  bullets: Array<string>,
  kyc?: boolean,
  notAvailable?: boolean,
  description?: string,
  disabled?: boolean,
}) => {
  const swapKYC = useSelector(swapKYCSelector);
  const dispatch = useDispatch();
  const providerKYC = swapKYC[id];

  const onUpdateKYCStatus = useCallback(() => {
    let cancelled = false;
    async function updateKYCStatus() {
      if (!providerKYC?.id) return;
      const res = await getKYCStatus(id, providerKYC.id);
      if (cancelled || res?.status === providerKYC?.status) return;
      dispatch(setSwapKYCStatus({ provider: id, id: res?.id, status: res?.status }));
    }
    updateKYCStatus();
    return () => {
      cancelled = true;
    };
  }, [dispatch, id, providerKYC]);

  useEffect(() => {
    if (providerKYC && providerKYC.status !== "approved") {
      onUpdateKYCStatus();
    }
  }, [onUpdateKYCStatus, providerKYC]);

  const status = providerKYC?.status || "required";

  return (
    <GridItem>
      <CardButton
        id={`swap-providers-item-${id}`}
        disabled={disabled}
        title={title}
        icon={icon}
        footer={
          kyc ? (
            <Alert type="secondary" small>
              <Trans i18nKey={`swap.providers.kyc.status.${status}`} />
            </Alert>
          ) : disabled ? (
            <Alert type="secondary" small>
              <Trans i18nKey={"swap.providers.kyc.notAvailable"} values={{ provider: title }} />
            </Alert>
          ) : null
        }
        onClick={() => onSelect && onSelect(id)}
        isActive={id === selected}
      >
        {description && <Box mb={4}>{description}</Box>}
        {!!bullets.length && <BulletList centered bullets={bullets} />}
      </CardButton>
    </GridItem>
  );
};

export default Item;
