// @flow
import { ethers } from "ethers";

const provider = ethers.getDefaultProvider("ropsten");

const getENSReverseLookup = async (address: string) => {
  return await provider.lookupAddress(address);
};

export default getENSReverseLookup;
