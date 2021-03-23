// @flow
import { renderError } from "~/renderer/components/DeviceAction/rendering";

export type ErrorDisplayProps = {
  error: Error,
  onRetry?: () => void,
  withExportLogs?: boolean,
  list?: boolean,
  supportLink?: string,
  warning?: boolean,
};

const ErrorDisplay = ({
  error,
  onRetry,
  withExportLogs,
  list,
  supportLink,
  warning,
}: ErrorDisplayProps) =>
  renderError({ error, onRetry, withExportLogs, list, supportLink, warning });

export default ErrorDisplay;
