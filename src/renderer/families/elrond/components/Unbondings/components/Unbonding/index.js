import React, { FC, useState, useCallback, useMemo, useEffect } from "react";
import { Trans } from "react-i18next";
import { useDispatch } from "react-redux";
import moment from "moment";

import Box from "~/renderer/components/Box/Box";
import ExclamationCircleThin from "~/renderer/icons/ExclamationCircleThin";
import ToolTip from "~/renderer/components/Tooltip";
import FirstLetterIcon from "~/renderer/components/FirstLetterIcon";
import { UnbondingType } from "~/renderer/families/elrond/types";
import { denominate } from "~/renderer/families/elrond/helpers";
import { constants } from "~/renderer/families/elrond/constants";
import { openURL } from "~/renderer/linking";
import { Ellipsis, Column, Wrapper, Withdraw } from "~/renderer/families/elrond/blocks/Delegation";
import { openModal } from "~/renderer/actions/modals";

const Unbonding: FC = ({
  account,
  contract,
  seconds,
  validator,
  amount,
  unbondings,
}: UnbondingType) => {
  const [counter, setCounter] = useState(seconds);

  const name = validator?.name ?? contract;
  const balance = useMemo(
    () =>
      denominate({
        input: amount,
        showLastNonZeroDecimal: true,
      }),
    [amount],
  );

  const dispatch = useDispatch();
  const getTime = useCallback(() => {
    const duration = moment.duration(counter, "seconds");
    const formatters = {
      d: [duration.asDays(), Math.floor(duration.asDays())],
      h: [duration.asHours(), "H"],
      m: [duration.asMinutes(), "m"],
      s: [duration.asSeconds(), "s"],
    };

    const format = Object.keys(formatters).reduce((total, key) => {
      const [time, label] = formatters[key];

      if (Math.floor(time) > 0) {
        return total === "" ? `${label}[${key}]` : `${total} : ${label}[${key}]`;
      }

      return total;
    }, "");

    return moment.utc(moment.duration(counter, "seconds").asMilliseconds()).format(format);
  }, [counter]);

  const handleCounter = () => {
    const interval = setInterval(() => setCounter(timer => timer - 1), 1000);

    return () => {
      clearInterval(interval);
      setCounter(seconds);
    };
  };

  const onWithdraw = useCallback(() => {
    dispatch(
      openModal(constants.modals.withdraw, {
        account,
        unbondings,
        contract,
        amount,
      }),
    );
  }, [account, contract, unbondings, amount, dispatch]);

  useEffect(handleCounter, [seconds]);

  return (
    <Wrapper>
      <Column
        strong={true}
        clickable={true}
        onClick={() => openURL(`${constants.explorer}/providers/${contract}`)}
      >
        <Box mr={2}>
          <FirstLetterIcon label={name} />
        </Box>

        <Ellipsis>{name}</Ellipsis>
      </Column>

      <Column>
        <Box color="alertRed" pl={2}>
          <ToolTip content={<Trans i18nKey="elrond.undelegation.inactiveTooltip" />}>
            <ExclamationCircleThin size={14} />
          </ToolTip>
        </Box>
      </Column>

      <Column>
        {balance} {constants.egldLabel}
      </Column>

      <Column>
        {counter > 0 ? (
          getTime()
        ) : (
          <Withdraw onClick={onWithdraw}>
            <Trans i18nKey="elrond.undelegation.withdraw.cta" />
          </Withdraw>
        )}
      </Column>
    </Wrapper>
  );
};

export default Unbonding;
