// @flow

import React, { useMemo } from "react";
import styled from "styled-components";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import { Trans } from "react-i18next";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import type { OverlayConfig } from "~/renderer/components/ProductTour/Overlay";

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
  config,
  i18nKey,
  ...rest
}: {
  config: OverlayConfig,
  i18nKey: string,
  t: number,
  b: number,
  l: number,
  r: number,
}) => {
  const { t, b, l, r } = rest;

  const { flexDirection, alignItems, justifyContent, boxPosition, icon } = useMemo(() => {
    const { top, left, right, bottom, padding: p = 0 } = config;
    if (top && left) {
      return {
        flexDirection: "row-reverse",
        alignItems: "flex-end",
        justifyContent: "flex-end",
        icon: <IconArrowShortCorner />,
        boxPosition: {
          top: t - (120 + p),
          left: l + 50,
        },
      };
    }

    if (top && right) {
      return {
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "flex-end",
        icon: <IconArrowShortCorner flippedX />,
        boxPosition: {
          top: t - (120 + p),
          left: l + (r - l) / 2,
        },
      };
    }

    if (top) {
      return {
        flexDirection: "column",
        alignItems: "",
        justifyContent: "",
        icon: <IconArrowShortVertical flippedY />,
        boxPosition: {
          top: t - (120 + p),
          left: l + (r - l) / 2,
        },
      };
    }

    if (bottom && left) {
      return {
        flexDirection: "row-reverse",
        alignItems: "",
        justifyContent: "flex-end",
        icon: <IconArrowShortCorner flippedY />,
        boxPosition: {
          top: b + 20 + p,
          left: l + 50,
        },
      };
    }

    if (bottom && right) {
      return {
        flexDirection: "row",
        alignItems: "",
        justifyContent: "flex-end",
        icon: <IconArrowShortCorner flippedX flippedY />,
        boxPosition: {
          top: b + 20 + p,
          left: r - 350,
        },
      };
    }

    return {
      flexDirection: "column-reverse",
      alignItems: "",
      justifyContent: "",
      icon: <IconArrowShortVertical />,
      boxPosition: {
        top: b + 20 + p,
        left: l + (r - l) / 2,
      },
    };
  }, [config, b, l, r, t]);

  return config?.none ? null : (
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
      {icon}
    </Wrapper>
  );
};

export default HelpBox;
