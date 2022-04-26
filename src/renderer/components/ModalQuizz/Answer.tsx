import React from "react";
import { Flex, Text } from "@ledgerhq/react-ui";

type ResultScreenProps = {
  Illustration?:
    | React.ComponentType<{ size?: number }>
    | ((props: { size?: number }) => React.ReactNode);
  illustrationSize?: number;
  title?: string | null;
  description?: string | null;
};

const Answer = ({ Illustration, illustrationSize, title, description }: ResultScreenProps) => {
  return (
    <Flex flexDirection="column" alignItems="center" alignSelf="center" p={12}>
      {Illustration && <Illustration size={illustrationSize} />}
      {title && (
        <Text variant="h1" mt={7} mb={5}>
          {title}
        </Text>
      )}
      {description && (
        <Text variant="paragraph" fontWeight="medium" textAlign="center">
          {description}
        </Text>
      )}
    </Flex>
  );
};

export default Answer;
