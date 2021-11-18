import React from "react";
import { Flex, Text, Button, Tip, Link, Box } from "@ledgerhq/react-ui";
import { Drawer } from "@ledgerhq/react-ui";

import { TipProps } from "@ledgerhq/react-ui/components/message/Tip";
import { ArrowRightMedium } from "@ledgerhq/react-ui/assets/icons";

import { openURL } from "~/renderer/linking";

type InfoDrawerSections = Array<{
  title?: string;
  descriptions?: string[];
  tips?: { type?: TipProps["type"]; label: string }[];
  link?: { href: string; label: string };
}>;

const OnboardContent = ({
  sections,
  onClose,
}: {
  sections: InfoDrawerSections;
  onClose: () => void;
}) => {
  return (
    <Flex flexDirection={"column"} height={"100%"}>
      {sections.map(({ title, descriptions, link, tips }, index) => (
        <Box key={index} mb={12}>
          {title && (
            <Text as={"div"} variant={"h5"} textTransform={"uppercase"} mb={5}>
              {title}
            </Text>
          )}
          {descriptions && (
            <>
              {descriptions.map((description, index) => (
                <Text
                  key={index}
                  as={"p"}
                  variant={"paragraph"}
                  color={"palette.neutral.c80"}
                  mb={5}
                >
                  {description}
                </Text>
              ))}
            </>
          )}
          {tips && (
            <>
              {tips.map(({ type, label }, index) => (
                <Box key={index} mb={5}>
                  <Tip type={type} label={label} />
                </Box>
              ))}
            </>
          )}
          {link && (
            <Flex justifyContent={"flex-start"}>
              <Link onClick={() => openURL(link.href)}>{link.label}</Link>
            </Flex>
          )}
        </Box>
      ))}

      <Flex mt={"auto"}>
        <Button variant={"main"} onClick={onClose} style={{ flex: 1 }} Icon={ArrowRightMedium}>
          {"Continue"}
        </Button>
      </Flex>
    </Flex>
  );
};

export const InfoSideDrawer = ({
  sections,
  onClose,
  ...props
}: {
  isOpen: boolean;
  title?: React.ReactNode;
  onClose: () => void;
  sections: InfoDrawerSections;
}) => {
  return (
    <Drawer
      title={
        <Text variant={"h3"} textTransform={"uppercase"}>
          Where should I keep my Recovery phrase?
        </Text>
      }
      setTransitionsEnabled={() => 0}
      onClose={onClose}
      hideNavigation={true}
      {...props}
    >
      <OnboardContent sections={sections} onClose={onClose} />
    </Drawer>
  );
};

export default InfoSideDrawer;
