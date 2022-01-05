// @flow
import { memo } from "react";
import moment from "moment";

type Props = {
  date?: Date,
  format?: string,
};

/* TODO: Replace this function with the useDateTimeFormat hook */
function FormattedDate({ date, format = "L LT" }: Props) {
  // For the format, prefer formats that are purely digital
  // https://momentjs.com/docs/#/parsing/string-format/
  return moment(date).format(format);
}

export default memo<Props>(FormattedDate);
