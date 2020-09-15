// @flow
import { renderError } from "~/renderer/components/DeviceAction/rendering";

export type ErrorDisplayProps = {
  error: Error,
  onRetry?: () => void,
  withExportLogs?: boolean,
  list?: boolean,
};

const ErrorDisplay = ({ error, onRetry, withExportLogs, list }: ErrorDisplayProps) =>
  renderError({ error, onRetry, withExportLogs, list });

export default ErrorDisplay;
