// @flow
import { track } from "~/renderer/analytics/segment";
import type { Manifest } from "./type";

/**
 * Obtain Event data from Platform App manifest
 *
 * @param {Manifest} manifest
 * @returns Object - event data
 */
function getEventData(manifest: Manifest) {
  return { platform: manifest.name };
}

// Failed to load the iframe
export function platformLoad(manifest: Manifest) {
  track("Platform Load", getEventData(manifest));
}

// Failed to load the iframe
export function platformReload(manifest: Manifest) {
  track("Platform Reload", getEventData(manifest));
}

// Failed to load the iframe
export function platformLoadFail(manifest: Manifest) {
  // TODO: handle iframe failed
  track("Platform Load Fail", getEventData(manifest));
}

// Successfully loaded the iframe
export function platformLoadSuccess(manifest: Manifest) {
  track("Platform Load Success", getEventData(manifest));
}

// Sign transaction modal open
export function platformSignTransactionRequested(manifest: Manifest) {
  track("Platform SignTransaction", getEventData(manifest));
}

// Failed to sign transaction (cancel or error)
export function platformSignTransactionFail(manifest: Manifest) {
  track("Platform SignTransaction Fail", getEventData(manifest));
}

// Successfully signed transaction
export function platformSignTransactionSuccess(manifest: Manifest) {
  track("Platform SignTransaction Success", getEventData(manifest));
}

// Select account modal open
export function platformRequestAccountRequested(manifest: Manifest) {
  track("Platform RequestAccount", getEventData(manifest));
}

// Failed to select account (cancel or error)
export function platformRequestAccountFail(manifest: Manifest) {
  track("Platform RequestAccount Fail", getEventData(manifest));
}

// The user successfully selected an account
export function platformRequestAccountSuccess(manifest: Manifest) {
  track("Platform RequestAccount Success", getEventData(manifest));
}

// Select account modal open
export function platformReceiveRequested(manifest: Manifest) {
  track("Platform Receive", getEventData(manifest));
}

// Failed to select account (cancel or error)
export function platformReceiveFail(manifest: Manifest) {
  track("Platform Receive Fail", getEventData(manifest));
}

// The user successfully selected an account
export function platformReceiveSuccess(manifest: Manifest) {
  track("Platform Receive Success", getEventData(manifest));
}

// Failed to broadcast a signed transaction
export function platformBroadcastFail(manifest: Manifest) {
  track("Platform Broadcast Fail", getEventData(manifest));
}

// Successfully broadcast a signed transaction
export function platformBroadcastSuccess(manifest: Manifest) {
  track("Platform Broadcast Success", getEventData(manifest));
}

// Successfully broadcast a signed transaction
export function platformBroadcastOperationDetailsClick(manifest: Manifest) {
  track("Platform Broadcast OpD Clicked", getEventData(manifest));
}
