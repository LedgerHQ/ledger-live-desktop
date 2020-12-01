// @flow
import React, { useCallback } from "react";
import { Trans, useTranslation } from "react-i18next";
import {
  RPCHostRequired,
  RPCUserRequired,
  RPCPassRequired,
} from "@ledgerhq/live-common/lib/errors";
import styled from "styled-components";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import InfoBox from "~/renderer/components/InfoBox";
import InputPassword from "~/renderer/components/InputPassword";
import Input from "~/renderer/components/Input";
import Label from "~/renderer/components/Label";
import Switch from "~/renderer/components/Switch";
import { openURL } from "~/renderer/linking";
import { urls } from "~/config/urls";
import useEnv from "~/renderer/hooks/useEnv";

import Tooltip from "~/renderer/components/Tooltip";
import IconInfoCircle from "~/renderer/icons/InfoCircle";

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

const maybeError = (errors, field, satStackAlreadyConfigured, ignoredErrorClass) => {
  const error = errors.find(e => e.field === field)?.error;
  return error && (satStackAlreadyConfigured || !(error instanceof ignoredErrorClass))
    ? error
    : null;
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

  const satStackAlreadyConfigured = useEnv("SATSTACK");
  const hostError = maybeError(errors, "host", satStackAlreadyConfigured, RPCHostRequired);
  const usernameError = maybeError(errors, "username", satStackAlreadyConfigured, RPCUserRequired);
  const passwordError = maybeError(errors, "password", satStackAlreadyConfigured, RPCPassRequired);

  const onLearnMore = useCallback(() => {
    openURL(urls.satstacks.learnMore);
  }, []);

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
          <Box horizontal alignItems="center">
            <Label mr={4}>
              <Trans i18nKey="fullNode.modal.steps.node.connectionSteps.notConnected.fields.nodeHost.title" />
            </Label>
            <Tooltip
              content={
                <Trans i18nKey="fullNode.modal.steps.node.connectionSteps.notConnected.fields.nodeHost.tooltip" />
              }
            >
              <IconInfoCircle size={12} />
            </Tooltip>
          </Box>
          <Input
            error={hostError}
            onChange={host => patchNodeConfig({ host })}
            value={nodeConfig?.host}
            placeholder="127.0.0.1:8332"
          />
        </Box>
        <Box horizontal flex={1} mt={32}>
          <Box flex={1}>
            <Box horizontal alignItems="center">
              <Label mr={4}>
                <Trans i18nKey="fullNode.modal.steps.node.connectionSteps.notConnected.fields.rpcCredentials.title" />
              </Label>
              <Tooltip
                content={
                  <Trans i18nKey="fullNode.modal.steps.node.connectionSteps.notConnected.fields.rpcCredentials.tooltip" />
                }
              >
                <IconInfoCircle size={12} />
              </Tooltip>
            </Box>
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
          <Box horizontal alignItems="center">
            <Label mr={4}>
              <Trans i18nKey="fullNode.modal.steps.node.connectionSteps.notConnected.fields.tls.title" />
            </Label>
            <Tooltip
              content={
                <Trans i18nKey="fullNode.modal.steps.node.connectionSteps.notConnected.fields.tls.tooltip" />
              }
            >
              <IconInfoCircle size={12} />
            </Tooltip>
          </Box>
        </Box>
      </FormWrapper>
      <InfoBox type="secondary" onLearnMore={onLearnMore}>
        <Text ff="Inter|Regular" fontSize={3} color="palette.text.shade50">
          <Trans i18nKey="fullNode.modal.steps.node.connectionSteps.notConnected.disclaimer" />
        </Text>
      </InfoBox>
    </Box>
  );
};

export default Form;
