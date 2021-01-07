// @flow
import "../live-common-setup";
import { setBridgeProxy } from "@ledgerhq/live-common/lib/bridge";
import { getUserId } from "~/helpers/user";
import { getAccountBridge, getCurrencyBridge } from "./bridge/proxy";
import { setEnvOnAllThreads } from "./../helpers/env";

setEnvOnAllThreads("USER_ID", getUserId());

setBridgeProxy({ getAccountBridge, getCurrencyBridge });
