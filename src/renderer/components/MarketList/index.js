import React from "react";
import { FixedSizeList as List } from "react-window";
import Box from "~/renderer/components/Box";
import MarketRowItem from "~/renderer/components/MarketList/MarketRowItem";
import { usePortfolio } from "~/renderer/actions/portfolio";
import { getCryptoCurrencyById, listCryptoCurrencies, getCurrencyColor } from "@ledgerhq/live-common/lib/currencies";
function MarketList(props) {
  const {
    emptyText,
  } = props;

  // console.log('portfolio', getCurrencyColor(listCryptoCurrencies()[0]))
  let currencies = listCryptoCurrencies()

  // currencies = [
  //   {
  //     "name": "Bitcoin",
  //     "short_name": "BTC",
  //     "price": "55,540.54",
  //     "currency": {
  //       "type": "CryptoCurrency",
  //       "id": "bitcoin",
  //       "coinType": 0,
  //       "name": "Bitcoin",
  //       "managerAppName": "Bitcoin",
  //       "ticker": "BTC",
  //       "scheme": "bitcoin",
  //       "color": "#ffae35",
  //       "symbol": "Ƀ",
  //       "units": [{ "name": "bitcoin", "code": "BTC", "magnitude": 8 }, {
  //         "name": "mBTC",
  //         "code": "mBTC",
  //         "magnitude": 5,
  //       }, { "name": "bit", "code": "bit", "magnitude": 2 }, { "name": "satoshi", "code": "sat", "magnitude": 0 }],
  //       "supportsSegwit": true,
  //       "supportsNativeSegwit": true,
  //       "family": "bitcoin",
  //       "blockAvgTime": 900,
  //       "bitcoinLikeInfo": { "P2PKH": 0, "P2SH": 5, "XPUBVersion": 76067358 },
  //       "explorerViews": [{
  //         "address": "https://blockstream.info/address/$address",
  //         "tx": "https://blockstream.info/tx/$hash",
  //       }, {
  //         "address": "https://www.blockchain.com/btc/address/$address",
  //         "tx": "https://blockchain.info/btc/tx/$hash",
  //       }],
  //     },
  //   },
  // ];

  const Row = ({ index, style }) => (
    <MarketRowItem {...currencies[index]} order_number={index + 1} style={style} />
  );
  return (
      <Box id="accounts-list-selectable" flow={2}>
        <List
          height={500}
          width="100%"
          itemCount={currencies.length}
          itemSize={60}
        >
          {Row}
          {/*{currencies.length ? (*/}
          {/*  <Box id="accounts-list-selectable" flow={2}>*/}
          {/*    {currencies.map((account, i) => (*/}
          {/*      <MarketItemRow*/}

          {/*      />*/}
          {/*    ))}*/}
          {/*  </Box>*/}
          {/*) : emptyText ? (*/}
          {/*  <Box ff="Inter|Regular" fontSize={3}>*/}
          {/*    {emptyText}*/}
          {/*  </Box>*/}
          {/*) : null}*/}
        </List>
      </Box>
  );
}

export default MarketList;
