import React, { PureComponent } from "react";
import { Text } from "@ledgerhq/react-ui";
import FormattedDate from "../FormattedDate";

export default class OperationDate extends PureComponent<{ date: Date }> {
  render() {
    const { date } = this.props;
    return (
      <Text variant="small" fontWeight="medium" color="palette.neutral.c80">
        <FormattedDate date={date} format={"HH:mm"} />
      </Text>
    );
  }
}
