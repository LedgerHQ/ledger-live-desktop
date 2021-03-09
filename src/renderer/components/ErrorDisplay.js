// @flow
import { renderError } from "~/renderer/components/DeviceAction/rendering";

export type ErrorDisplayProps = {
  error: Error,
  onRetry?: () => void,
  withExportLogs?: boolean,
  list?: boolean,
  supportLink?: string,
};

const ErrorDisplay = ({ error, onRetry, withExportLogs, list, supportLink }: ErrorDisplayProps) =>
  renderError({ error, onRetry, withExportLogs, list, supportLink });

export default ErrorDisplay;
