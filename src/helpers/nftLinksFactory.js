import IconOpensea from "~/renderer/icons/Opensea";
import IconRarible from "~/renderer/icons/Rarible";
import IconGlobe from "~/renderer/icons/Globe";
import { openURL } from "~/renderer/linking";

const linksPerCurrency = {
  ethereum: (t, links) => [
    links?.opensea && {
      key: "opensea",
      id: "opensea",
      label: t("NFT.viewer.actions.open", { viewer: "Opensea.io" }),
      Icon: IconOpensea,
      type: "external",
      callback: () => openURL(links.opensea),
    },
    links?.rarible && {
      key: "rarible",
      id: "rarible",
      label: t("NFT.viewer.actions.open", { viewer: "Rarible" }),
      Icon: IconRarible,
      type: "external",
      callback: () => openURL(links.rarible),
    },
    {
      key: "sep2",
      id: "sep2",
      type: "separator",
      label: "",
    },
    links?.etherscan && {
      key: "etherscan",
      id: "etherscan",
      label: t("NFT.viewer.actions.open", { viewer: "Explorer" }),
      Icon: IconGlobe,
      type: "external",
      callback: () => openURL(links.etherscan),
    },
  ],
  polygon: (t, links) => [
    links?.opensea && {
      key: "opensea",
      id: "opensea",
      label: t("NFT.viewer.actions.open", { viewer: "Opensea.io" }),
      Icon: IconOpensea,
      type: "external",
      callback: () => openURL(links.opensea),
    },
    links?.rarible && {
      key: "rarible",
      id: "rarible",
      label: t("NFT.viewer.actions.open", { viewer: "Rarible" }),
      Icon: IconRarible,
      type: "external",
      callback: () => openURL(links.rarible),
    },
    {
      key: "sep2",
      id: "sep2",
      type: "separator",
      label: "",
    },
    links?.polygonscan && {
      key: "polygonscan",
      id: "polygonscan",
      label: t("NFT.viewer.actions.open", { viewer: "Explorer" }),
      Icon: IconGlobe,
      type: "external",
      callback: () => openURL(links.polygonscan),
    },
  ],
};

export default (currencyId, t, links) =>
  linksPerCurrency?.[currencyId]?.(t, links).filter(x => x) || [];
