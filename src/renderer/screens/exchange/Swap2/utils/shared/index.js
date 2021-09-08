// @flow

export const KYC_STATUS = {
  open: "open",
  pending: "pending",
  rejected: "closed",
  approved: "approved",
};

export type KYCStatus = $Keys<typeof KYC_STATUS>;
