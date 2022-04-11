import React, { Fragment, useCallback, useMemo, useState, useRef, useEffect } from "react";
import { Trans } from "react-i18next";
import { BigNumber } from "bignumber.js";

import { getAccountUnit } from "@ledgerhq/live-common/lib/account";

import { openURL } from "~/renderer/linking";
import Box from "~/renderer/components/Box";
import ValidatorRow, { IconContainer } from "~/renderer/components/Delegation/ValidatorRow";
import ValidatorListHeader from "~/renderer/components/Delegation/ValidatorListHeader";
import ScrollLoadingList from "~/renderer/components/ScrollLoadingList";
import ValidatorSearchInput, {
  NoResultPlaceholder,
} from "~/renderer/components/Delegation/ValidatorSearchInput";
import FirstLetterIcon from "~/renderer/components/FirstLetterIcon";
import Text from "~/renderer/components/Text";
import { denominate } from "~/renderer/families/elrond/helpers";
import { constants } from "~/renderer/families/elrond/constants";

import estimateMaxSpendable from "@ledgerhq/live-common/lib/families/elrond/js-estimateMaxSpendable";

const ValidatorField = ({
  t,
  account,
  onChangeDelegations,
  status,
  bridgePending,
  delegations,
  validators,
  transaction,
}: Props) => {
  const [available, setAvailable] = useState(BigNumber(0));
  const [search, setSearch] = useState("");
  const [items, setItems] = useState(
    validators.map(validator => ({
      ...validator,
      searched: true,
    })),
  );

  const onSearch = useCallback(event => {
    setSearch(event.target.value);
    setItems(items =>
      items.map(validator => ({
        ...validator,
        searched:
          event.target.value === ""
            ? true
            : validator.identity.name
            ? validator.identity.name.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1
            : false,
      })),
    );
  }, []);

  const unit = getAccountUnit(account);
  const visibleItems = useMemo(() => items.filter(validator => validator.searched), [items]);
  const delegationsSelected = useMemo(() => (transaction.amount.gt(0) ? 1 : 0), [
    transaction.amount,
  ]);

  const maxText = useMemo(() => {
    const available = denominate({
      input: String(account.spendableBalance.minus(transaction.amount)),
    });

    return `${available} ${constants.egldLabel}`;
  }, [account.spendableBalance, transaction.amount]);

  const onUpdateDelegation = useCallback(
    (recipient, value) =>
      onChangeDelegations({
        recipient,
        amount: BigNumber(value),
        mode: "delegate",
      }),
    [onChangeDelegations],
  );

  const containerRef = useRef();

  useEffect(() => {
    if (containerRef && containerRef.current && containerRef.current.querySelector) {
      const firstInput = containerRef.current.querySelector("input");

      if (firstInput && firstInput.focus) {
        firstInput.focus();
      }
    }
  }, []);

  useEffect(() => {
    const fetchEstimation = async () => {
      const balance = await estimateMaxSpendable({ account, transaction });

      console.log({
        balance: String(balance),
        origina: String(account.spendableBalance),
        transaction,
        amounts: String(transaction.amount),
      });
    };

    fetchEstimation();
  }, [transaction, account]);

  const renderItem = useCallback(
    (validator, index) => {
      const [provider] = validator.providers || [];
      const delegation = delegations.find(delegation => delegation.contract === provider);
      const amount = BigNumber(delegation ? delegation.userActiveStake : 0);
      const selected = validator.providers.includes(transaction.recipient);
      const value = selected ? transaction.amount : null;
      const disabled = transaction.amount.gt(0) && !selected;

      const onMax = () => {
        onUpdateDelegation(provider, account.spendableBalance);
      };

      return (
        <ValidatorRow
          key={`SR_${validator.contract}_${index}`}
          validator={{ address: provider }}
          icon={
            <IconContainer isSR={true}>
              <FirstLetterIcon label={validator.name || provider} />
            </IconContainer>
          }
          title={`${index + 1}. ${validator.name || provider}`}
          subtitle={
            amount.gt(0) ? (
              <Trans
                i18nKey="cosmos.delegation.currentDelegation"
                values={{
                  amount: denominate({ input: String(amount), showLastNonZeroDecimal: true }),
                }}
              >
                <b style={{ marginLeft: 5 }}></b>
              </Trans>
            ) : null
          }
          sideInfo={
            <Box pr={1}>
              <Text textAlign="center" ff="Inter|SemiBold" fontSize={2}>
                {validator.apr ? `${validator.apr} %` : "N/A"}
              </Text>
              <Text textAlign="center" fontSize={1}>
                <Trans i18nKey="cosmos.delegation.estYield" />
              </Text>
            </Box>
          }
          onExternalLink={() =>
            openURL(`${constants.explorer}/providers/${provider}
          `)
          }
          value={value}
          unit={unit}
          onUpdateVote={onUpdateDelegation}
          onMax={onMax}
          shouldRenderMax={true}
          disabled={disabled}
        />
      );
    },
    [
      onUpdateDelegation,
      delegations,
      account.spendableBalance,
      transaction.recipient,
      transaction.amount,
      unit,
    ],
  );

  if (!status) return null;

  return (
    <Fragment>
      <ValidatorSearchInput id="delegate-search-bar" search={search} onSearch={onSearch} />
      <ValidatorListHeader
        votesSelected={delegationsSelected}
        maxText={maxText}
        maxVotes={items.length}
        totalValidators={items.length}
        notEnoughVotes={transaction.amount.gt(account.spendableBalance)}
        max={account.spendableBalance.minus(transaction.amount).toNumber()}
      />
      <Box id="delegate-list">
        <ScrollLoadingList
          data={visibleItems}
          style={{ flex: "1 0 240px" }}
          renderItem={renderItem}
          noResultPlaceholder={
            visibleItems.length <= 0 && search && <NoResultPlaceholder search={search} />
          }
        />
      </Box>
    </Fragment>
  );
};

export default ValidatorField;
