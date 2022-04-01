import React, { FC, useState, useCallback, useMemo, useEffect } from "react";
import { Trans } from "react-i18next";
import moment from "moment";

import Box from "~/renderer/components/Box/Box";
import ExclamationCircleThin from "~/renderer/icons/ExclamationCircleThin";
import ToolTip from "~/renderer/components/Tooltip";
import FirstLetterIcon from "~/renderer/components/FirstLetterIcon";
import { UnbondingType } from "~/renderer/families/elrond/types";
import { denominate } from "~/renderer/families/elrond/helpers";
import { openURL } from "~/renderer/linking";
import { Ellipsis, Column, Wrapper } from "~/renderer/families/elrond/blocks/Delegation";

const Unbonding: FC = ({ contract, seconds, validator, amount }: UnbondingType) => {
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

  useEffect(handleCounter, [seconds]);

  return (
    <Wrapper>
      <Column
        strong={true}
        clickable={true}
        onClick={() => openURL(`https://testnet-explorer.elrond.com/providers/${contract}`)}
      >
        <Box mr={2}>
          <FirstLetterIcon label={name} />
        </Box>

        <Ellipsis>{name}</Ellipsis>
      </Column>

      <Column>
        <Box color="alertRed" pl={2}>
          <ToolTip content={<Trans i18nKey="cosmos.undelegation.inactiveTooltip" />}>
            <ExclamationCircleThin size={14} />
          </ToolTip>
        </Box>
      </Column>
      <Column>{balance} EGLD</Column>
      <Column>{counter > 0 ? getTime() : "N/A"}</Column>
    </Wrapper>
  );
};

export default Unbonding;
