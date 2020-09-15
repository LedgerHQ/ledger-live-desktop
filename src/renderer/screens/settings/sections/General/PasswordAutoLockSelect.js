// @flow

import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { autoLockTimeoutSelector } from "~/renderer/reducers/settings";
import { setAutoLockTimeout } from "~/renderer/actions/settings";
import Select from "~/renderer/components/Select";

const PasswordAutoLockSelect = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const autoLockTimeout = useSelector(autoLockTimeoutSelector);

  const handleChangeTimeout = useCallback(
    ({ value: timeoutKey }: { value: number }) => {
      dispatch(setAutoLockTimeout(+timeoutKey));
    },
    [dispatch],
  );

  const timeouts = useMemo(
    () => [
      { value: 1, label: `1 ${t("time.minute", { count: 1 })}` },
      { value: 10, label: `10 ${t("time.minute", { count: 10 })}` },
      { value: 30, label: `30 ${t("time.minute", { count: 30 })}` },
      { value: 60, label: `1 ${t("time.hour")}` },
      { value: -1, label: t(`app:common.never`) },
    ],
    [t],
  );

  const currentTimeout = timeouts.find(l => l.value === autoLockTimeout);

  return (
    <Select
      small
      minWidth={260}
      isSearchable={false}
      onChange={handleChangeTimeout}
      renderSelected={item => item && item.name}
      value={currentTimeout}
      options={timeouts}
    />
  );
};

export default PasswordAutoLockSelect;
