// @flow
import "../live-common-setup";
import { setBridgeProxy } from "@ledgerhq/live-common/lib/bridge";
import { getAccountBridge, getCurrencyBridge } from "./bridge/proxy";

// TODO
/*
import { getUserId } from '~/user'
import { setEnvOnAllThreads } from './env'
setEnvOnAllThreads('USER_ID', getUserId())
*/

setBridgeProxy({ getAccountBridge, getCurrencyBridge });
