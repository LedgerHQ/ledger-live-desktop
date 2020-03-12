// @flow
import React from "react";
import { getEnv } from "@ledgerhq/live-common/lib/env";
import styled from "styled-components";
import Text from "~/renderer/components/Text";

const Badge = styled(Text)`
  border-radius: 4px;
  padding: 0 4px;
  position: absolute;
  font-size: 13px;
  background: #ea2e49;
  left: 4px;
  bottom: 4px;
  color: white;
  &:before {
    content: "mock";
  }
  &:hover {
    opacity: 0;
  }
`;

const MockBadge = () => (getEnv("MOCK") ? <Badge /> : null);
export default MockBadge;
