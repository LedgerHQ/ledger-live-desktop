import React, { useState, useEffect, memo } from "react";
import { getEnv } from "@ledgerhq/live-common/lib/env";
import styled from "styled-components";
import axios from "axios";

import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";

const TopBar = styled(Box)`
  background: #007781;
  font-weight: bold;
  color: white;
  text-align: center;
  border-radius: 4px;
  padding: 2px 40px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const Legend = styled(Text)`
  display: inline-flex;
  text-transform: capitalize;
`;

const Button = styled.button`
  padding: 2px 10px;
  background: white;
  color: #007781;
  border-radius: 99999px;
  border: none;
  font-size: 8px;
  text-transform: uppercase;
  margin-left: 10px;
  display: inline-flex;
`;

const NftProviderSwitcher = () => {
  const [provider, setProvider] = useState("");
  const switchProvider = async () => {
    await axios.get(`${getEnv("NFT_ETH_METADATA_SERVICE")}/switch`);
    window.location.reload();
  };

  useEffect(() => {
    axios.get(`${getEnv("NFT_ETH_METADATA_SERVICE")}/provider`).then(({ data }) => {
      setProvider(data);
    });
  }, []);

  return (
    <TopBar onClick={switchProvider}>
      <Legend>Provider: {provider}</Legend>
      <Button>Switch</Button>
    </TopBar>
  );
};

export default memo(NftProviderSwitcher);
