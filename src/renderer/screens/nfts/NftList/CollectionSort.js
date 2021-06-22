// @flow
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import BoldToggle from "~/renderer/components/BoldToggle";
import Box from "~/renderer/components/Box";
import type { DropDownItemType } from "~/renderer/components/DropDownSelector";
import Text from "~/renderer/components/Text";
import Ellipsis from "~/renderer/components/Ellipsis";
import DropDownSelector, { DropDownItem } from "~/renderer/components/DropDownSelector";

type CollectionItemProps = {
  item: DropDownItemType,
  isActive: boolean,
};

const CollectionItem = React.memo<CollectionItemProps>(function CollectionItem({
  item,
  isActive,
}: CollectionItemProps) {
  return (
    <DropDownItem
      width="100%"
      alignItems="center"
      justifyContent="flex-start"
      horizontal
      isActive={isActive}
      flow={2}
    >
      <Box grow alignItems="flex-start">
        <BoldToggle isBold={isActive}>{item.label}</BoldToggle>
      </Box>
    </DropDownItem>
  );
});

function CollectionSort({
  collectionItems,
  onChange,
  value,
}: {
  collectionItems: *,
  onChange: *,
  value: *,
}) {
  const renderItem = useCallback(props => <CollectionItem {...props} />, []);

  const onItemChange = useCallback(
    o => {
      if (!o) return;
      onChange(o.key);
    },
    [onChange],
  );

  return (
    // $FlowFixMe DropDownSelector is not typed well
    <DropDownSelector
      items={collectionItems}
      renderItem={renderItem}
      onChange={onItemChange}
      controlled
      value={collectionItems.find(item => item.key === value)}
    >
      {({ isOpen, value }) =>
        value ? (
          <Box horizontal flow={1}>
            <Text color="palette.text.shade60" ff="Inter|SemiBold" fontSize={4}>
              Collection
            </Text>
            <Box
              alignItems="center"
              color="wallet"
              ff="Inter|SemiBold"
              flow={1}
              fontSize={4}
              horizontal
            >
              <Text color="wallet" style={{ maxWidth: 250 }}>
                <Ellipsis>{value.label}</Ellipsis>
              </Text>
            </Box>
          </Box>
        ) : null
      }
    </DropDownSelector>
  );
}

export default React.memo<*>(CollectionSort);
