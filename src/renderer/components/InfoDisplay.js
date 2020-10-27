// @flow
import React from "react";
import Box from "~/renderer/components/Box";
import InfoCircle from "~/renderer/icons/InfoCircle";
import Text from "~/renderer/components/Text";
import { colors } from "~/renderer/styles/theme";

const InfoDisplay = ({ title, description }: { title: string, description: string }) => {
  return (
    <>
      <Box
        mb={24}
        justifyContent="center"
        alignItems="center"
        width={50}
        height={50}
        borderRadius={50}
        backgroundColor={colors.pillActiveBackground}
      >
        <InfoCircle size={24} color={colors.wallet} />
      </Box>
      <Text
        fontWeight="600"
        ff="Inter|Regular"
        fontSize={18}
        textAlign="center"
        color="palette.text.shade100"
        lineHeight="22px"
        mb="16px"
      >
        {title}
      </Text>
      <Text
        ff="Inter|Regular"
        fontSize={13}
        textAlign="center"
        color="palette.text.shade50"
        lineHeight="19px"
      >
        {description}
      </Text>
    </>
  );
};

export default InfoDisplay;
