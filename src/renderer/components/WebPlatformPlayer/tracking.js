// @flow
import { track } from "~/renderer/analytics/segment";
import type { AppManifest } from "@ledgerhq/live-common/lib/platform/types";

/**
 * Obtain Event data from Platform App manifest
 *
 * @param {AppManifest} manifest
 * @returns Object - event data
 */
function getEventData(manifest: AppManifest) {
  return { platform: manifest.name };
}

// Failed to load the iframe
export function platformLoad(manifest: AppManifest) {
  track("Platform Load", getEventData(manifest));
}

// Failed to load the iframe
export function platformReload(manifest: AppManifest) {
  track("Platform Reload", getEventData(manifest));
}

// Failed to load the iframe
export function platformLoadFail(manifest: AppManifest) {
  // TODO: handle iframe failed
  track("Platform Load Fail", getEventData(manifest));
}

// Successfully loaded the iframe
export function platformLoadSuccess(manifest: AppManifest) {
  track("Platform Load Success", getEventData(manifest));
}

// Sign transaction modal open
export function platformSignTransactionRequested(manifest: AppManifest) {
  track("Platform SignTransaction", getEventData(manifest));
}

// Failed to sign transaction (cancel or error)
export function platformSignTransactionFail(manifest: AppManifest) {
  track("Platform SignTransaction Fail", getEventData(manifest));
}

// Successfully signed transaction
export function platformSignTransactionSuccess(manifest: AppManifest) {
  track("Platform SignTransaction Success", getEventData(manifest));
}

// Select account modal open
export function platformRequestAccountRequested(manifest: AppManifest) {
  track("Platform RequestAccount", getEventData(manifest));
}

// Failed to select account (cancel or error)
export function platformRequestAccountFail(manifest: AppManifest) {
  track("Platform RequestAccount Fail", getEventData(manifest));
}

// The user successfully selected an account
export function platformRequestAccountSuccess(manifest: AppManifest) {
  track("Platform RequestAccount Success", getEventData(manifest));
}

// Select account modal open
export function platformReceiveRequested(manifest: AppManifest) {
  track("Platform Receive", getEventData(manifest));
}

// Failed to select account (cancel or error)
export function platformReceiveFail(manifest: AppManifest) {
  track("Platform Receive Fail", getEventData(manifest));
}

// The user successfully selected an account
export function platformReceiveSuccess(manifest: AppManifest) {
  track("Platform Receive Success", getEventData(manifest));
}

// Failed to broadcast a signed transaction
export function platformBroadcastFail(manifest: AppManifest) {
  track("Platform Broadcast Fail", getEventData(manifest));
}

// Successfully broadcast a signed transaction
export function platformBroadcastSuccess(manifest: AppManifest) {
  track("Platform Broadcast Success", getEventData(manifest));
}

// Successfully broadcast a signed transaction
export function platformBroadcastOperationDetailsClick(manifest: AppManifest) {
  track("Platform Broadcast OpD Clicked", getEventData(manifest));
}

// Generate Exchange nonce modal open
export function platformStartExchangeRequested(manifest: AppManifest) {
  track("Platform start Exchange Nonce request", getEventData(manifest));
}

// Successfully generated an Exchange app nonce
export function platformStartExchangeSuccess(manifest: AppManifest) {
  track("Platform start Exchange Nonce success", getEventData(manifest));
}

// Failed to generate an Exchange app nonce
export function platformStartExchangeFail(manifest: AppManifest) {
  track("Platform start Exchange Nonce fail", getEventData(manifest));
}

export function platformCompleteExchangeRequested(manifest: AppManifest) {
  track("Platform complete Exchange requested", getEventData(manifest));
}

// Successfully completed an Exchange
export function platformCompleteExchangeSuccess(manifest: AppManifest) {
  track("Platform complete Exchange success", getEventData(manifest));
}

// Failed to complete an Exchange
export function platformCompleteExchangeFail(manifest: AppManifest) {
  track("Platform complete Exchange Nonce fail", getEventData(manifest));
}
