import React from "react";
import { useTranslation } from "react-i18next";
import { SectionRow as Row } from "../../Rows";
import FullNodeButton from "./FullNodeButton";
import FullNodeStatus from "./FullNodeStatus";

const FullNode = () => {
  const { t } = useTranslation();
  return (
    <>
      <Row
        title={t("settings.accounts.fullNode.title")}
        desc={t("settings.accounts.fullNode.desc")}
      >
        <FullNodeButton />
      </Row>
      <FullNodeStatus />
    </>
  );
};

export default FullNode;
