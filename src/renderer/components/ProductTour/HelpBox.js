// @flow

import React, { useEffect, useMemo } from "react";
import styled from "styled-components";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import { Trans } from "react-i18next";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import type { OverlayConfig } from "~/renderer/components/ProductTour/ContextualOverlay";

import IconArrowShortVertical from "~/renderer/icons/arrows/ShortVertical";
import IconArrowShortCorner from "~/renderer/icons/arrows/ShortCorner";

const Wrapper: ThemedComponent<*> = styled(Box)`
  position: absolute;
  width: 330px;
  height: 100px;
  flex-direction: ${p => p.flexDirection};
  top: ${p => p.boxPosition.top}px;
  left: ${p => p.boxPosition.left}px;
  z-index: 100;
  & > ${Text} {
    flex: 1;
    align-items: center;
    display: flex;
    margin: 0 8px;
  }
`;

const HelpBox = ({
  conf,
  i18nKey,
  ...rest
}: {
  conf: OverlayConfig,
  i18nKey: string,
  t: number,
  b: number,
  l: number,
  r: number,
}) => {
  const { t, b, l, r } = rest;

  const { flexDirection, alignItems, justifyContent, boxPosition, Icon } = useMemo(() => {
    if (conf.top && conf.left) {
      return {
        flexDirection: "row-reverse",
        alignItems: "flex-end",
        justifyContent: "flex-end",
        Icon: () => <IconArrowShortCorner />,
        boxPosition: {
          top: t - 120,
          left: l + 50,
        },
      };
    }

    if (conf.top && conf.right) {
      return {
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "flex-end",
        Icon: () => <IconArrowShortCorner flippedX />,
        boxPosition: {
          top: t - 120,
          left: l + (r - l) / 2,
        },
      };
    }

    if (conf.top) {
      return {
        flexDirection: "column",
        alignItems: "",
        justifyContent: "",
        Icon: () => <IconArrowShortVertical flippedY />,
        boxPosition: {
          top: t - 120,
          left: l + (r - l) / 2,
        },
      };
    }

    if (conf.bottom && conf.left) {
      return {
        flexDirection: "row-reverse",
        alignItems: "",
        justifyContent: "flex-end",
        Icon: () => <IconArrowShortCorner flippedY />,
        boxPosition: {
          top: b + 20,
          left: l + 50,
        },
      };
    }

    if (conf.bottom && conf.right) {
      return {
        flexDirection: "row",
        alignItems: "",
        justifyContent: "flex-end",
        Icon: () => <IconArrowShortCorner flippedX flippedY />,
        boxPosition: {
          top: b + 20,
          left: r - 350,
        },
      };
    }

    return {
      flexDirection: "column-reverse",
      alignItems: "",
      justifyContent: "",
      Icon: () => <IconArrowShortVertical />,
      boxPosition: {
        top: b + 20,
        left: l + (r - l) / 2,
      },
    };
  }, [b, conf, l, r, t]);

  return conf?.none ? null : (
    <Wrapper
      flexDirection={flexDirection}
      alignItems={alignItems}
      justifyContent={justifyContent}
      boxPosition={boxPosition}
      {...{ t, b, l, r }}
    >
      <Text ff="Inter|SemiBold" fontSize={5} color={"white"}>
        <Trans i18nKey={i18nKey} />
      </Text>
      <Icon />
    </Wrapper>
  );
};

export default HelpBox;
