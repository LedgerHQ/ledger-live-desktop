// @flow
import React from "react";
import { Trans, useTranslation } from "react-i18next";

import styled from "styled-components";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import InfoBox from "~/renderer/components/InfoBox";
import InputPassword from "~/renderer/components/InputPassword";
import Input from "~/renderer/components/Input";
import Label from "~/renderer/components/Label";
import Switch from "~/renderer/components/Switch";

const FormWrapper = styled(Box)`
  margin-bottom: 32px;
`;
const InputWrapper = styled(Box)`
  margin-top: 5px;
  & > * {
    flex: 1;
    &:nth-of-type(1) {
      margin-right: 16px;
    }
    &:nth-of-type(2) {
      margin-left: 16px;
    }
  }
`;

export type RPCNodeConfig = {
  host: string,
  username: string,
  password: string,
  tls?: boolean,
};

const Form = ({
  nodeConfig,
  patchNodeConfig,
  errors,
}: {
  nodeConfig?: RPCNodeConfig,
  patchNodeConfig: ({ [$Keys<RPCNodeConfig>]: any }) => void,
  errors: any,
}) => {
  const { t } = useTranslation();

  const hostError = errors.find(e => e.field === "host")?.error;
  const usernameError = errors.find(e => e.field === "username")?.error;
  const passwordError = errors.find(e => e.field === "password")?.error;

  return (
    <Box>
      <Text
        ff="Inter|SemiBold"
        textAlign={"center"}
        mb={32}
        fontSize={6}
        color="palette.text.shade100"
      >
        <Trans i18nKey="fullNode.modal.steps.node.connectionSteps.notConnected.header" />
      </Text>
      <FormWrapper>
        <Box flow={1}>
          <Label>
            <Trans i18nKey="fullNode.modal.steps.node.connectionSteps.notConnected.fields.nodeURL.title" />
          </Label>
          <Input
            error={hostError}
            onChange={host => patchNodeConfig({ host })}
            value={nodeConfig?.host}
            placeholder={t(
              "fullNode.modal.steps.node.connectionSteps.notConnected.fields.nodeURL.placeholder",
            )}
          />
        </Box>
        <Box horizontal flex={1} mt={32}>
          <Box flex={1}>
            <Label>
              <Trans i18nKey="fullNode.modal.steps.node.connectionSteps.notConnected.fields.rpcCredentials.title" />
            </Label>
            <InputWrapper horizontal flex={1}>
              <Input
                error={usernameError}
                onChange={username => patchNodeConfig({ username })}
                value={nodeConfig?.username}
                placeholder={t(
                  "fullNode.modal.steps.node.connectionSteps.notConnected.fields.rpcCredentials.usernamePlaceholder",
                )}
              />
              <InputPassword
                error={passwordError}
                onChange={password => patchNodeConfig({ password })}
                value={nodeConfig?.password}
                placeholder={t(
                  "fullNode.modal.steps.node.connectionSteps.notConnected.fields.rpcCredentials.passwordPlaceholder",
                )}
              />
            </InputWrapper>
          </Box>
        </Box>
        <Box flow={1} mt={32} horizontal>
          <Switch onChange={tls => patchNodeConfig({ tls })} isChecked={!!nodeConfig?.tls} />
          <Label>
            <Trans i18nKey="fullNode.modal.steps.node.connectionSteps.notConnected.fields.tls.title" />
          </Label>
        </Box>
      </FormWrapper>
      <InfoBox
        type="secondary"
        onLearnMore={() => {
          /* TODO Implement this */
        }}
      >
        <Text ff="Inter|Regular" fontSize={3} color="palette.text.shade50">
          <Trans i18nKey="fullNode.modal.steps.node.connectionSteps.notConnected.disclaimer" />
        </Text>
      </InfoBox>
    </Box>
  );
};

export default Form;
