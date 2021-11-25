import React from "react";
import { Bar, Text } from "@ledgerhq/react-ui";

/* eslint-disable-next-line flowtype/no-types-missing-file-annotation */
export type Item = {
  label: string;
  key: string;
  value?: any;
};

type Props = {
  items: Item[];
  activeKey: string;
  onChange: (arg0: Item) => void;
};

function Pills(props: Props) {
  const { items, activeKey, onChange } = props;

  return (
    <Bar
      initialActiveIndex={items.findIndex(it => it.key === activeKey)}
      onTabChange={index => {
        onChange(items[index]);
      }}
    >
      {items.map(({ label }, index) => (
        <Text key={index} variant="small" color="inherit">
          {label}
        </Text>
      ))}
    </Bar>
  );
}

export default Pills;
