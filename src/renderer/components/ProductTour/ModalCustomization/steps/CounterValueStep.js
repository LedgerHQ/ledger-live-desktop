// @flow
import React, { useEffect } from "react";
import { Trans } from "react-i18next";
import Text from "~/renderer/components/Text";
import Box from "~/renderer/components/Box";
import CounterValueSelect from "~/renderer/screens/settings/sections/General/CounterValueSelect";
const CountervalueStep = ({ setCanContinue }: { setCanContinue: boolean => void }) => {
  useEffect(() => {
    setCanContinue(true);
  }, [setCanContinue]);

  return (
    <Box alignItems="center" px={40} pt={20} color={"palette.text.shade60"}>
      <Text ff={"Inter|Regular"} fontSize={4} mb={30} textAlign={"center"}>
        <Trans i18nKey={"productTour.flows.customize.modal.countervalue.help"} />
      </Text>
      <CounterValueSelect />
    </Box>
  );
};

export default CountervalueStep;
