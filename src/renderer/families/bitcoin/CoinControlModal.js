// @flow
import React, { PureComponent } from "react";
import type { Account, TransactionStatus } from "@ledgerhq/live-common/lib/types";
import type { Transaction } from "@ledgerhq/live-common/lib/families/bitcoin/types";
import {
  getUTXOStatus,
  isChangeOutput,
} from "@ledgerhq/live-common/lib/families/bitcoin/transaction";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import TrackPage from "~/renderer/analytics/TrackPage";
import Button from "~/renderer/components/Button";
import Box from "~/renderer/components/Box";
import FormattedVal from "~/renderer/components/FormattedVal";
import Text from "~/renderer/components/Text";
import Checkbox from "~/renderer/components/CheckBox";
import ErrorBanner from "~/renderer/components/ErrorBanner";
import Modal, { ModalBody } from "~/renderer/components/Modal";
import { PickUnconfirmedRBF } from "./PickUnconfirmedRBF";
import { PickingStrategy } from "./PickingStrategy";
import { RBF } from "./RBF";

type Props = {
  isOpened?: boolean,
  onClose: () => void,
  account: Account,
  transaction: Transaction,
  onChange: Transaction => void,
  status: TransactionStatus,
};

class CoinControlModal extends PureComponent<Props, *> {
  render() {
    const { isOpened, onClose, account, transaction, onChange, status } = this.props;
    if (!account.bitcoinResources) return null;
    const { bitcoinResources } = account;
    const { utxoStrategy } = transaction;
    const bridge = getAccountBridge(account);
    const errorKeys = Object.keys(status.errors);
    const error = errorKeys.length ? status.errors[errorKeys[0]] : null;
    return (
      <Modal width={700} isOpened={isOpened} centered onClose={onClose}>
        <TrackPage category="Modal" name="BitcoinCoinControl" />
        <ModalBody
          width={700}
          title={"Bitcoin Coin Controls"}
          onClose={onClose}
          render={() => (
            <Box flow={2}>
              {error ? <ErrorBanner error={error} /> : null}

              <PickingStrategy
                transaction={transaction}
                account={account}
                onChange={onChange}
                status={status}
              />

              <PickUnconfirmedRBF
                transaction={transaction}
                account={account}
                onChange={onChange}
                status={status}
              />

              {/* will be moved back in "advanced" */}
              <RBF
                transaction={transaction}
                account={account}
                onChange={onChange}
                status={status}
              />

              <Box
                flow={2}
                mt={4}
                pt={4}
                style={{ borderTop: "1px solid #aaaaaa33", minHeight: 200 }}
              >
                {bitcoinResources.utxos.map(utxo => {
                  const s = getUTXOStatus(utxo, utxoStrategy);
                  const input = (status.txInputs || []).find(
                    input =>
                      input.previousOutputIndex === utxo.outputIndex &&
                      input.previousTxHash === utxo.hash,
                  );
                  const inputIndex = (status.txInputs || []).indexOf(input);
                  const disabled = (s.reason || "") === "pickUnconfirmedRBF";
                  const onClick = () => {
                    if (disabled) return;
                    const patch = {
                      utxoStrategy: {
                        ...utxoStrategy,
                        excludeUTXOs: !s.excluded
                          ? utxoStrategy.excludeUTXOs.concat({
                              hash: utxo.hash,
                              outputIndex: utxo.outputIndex,
                            })
                          : utxoStrategy.excludeUTXOs.filter(
                              e => e.hash !== utxo.hash || e.outputIndex !== utxo.outputIndex,
                            ),
                      },
                    };
                    // TODO use the function version of updateTransaction (as part of the hook)
                    onChange(bridge.updateTransaction(transaction, patch));
                  };
                  return (
                    // TODO make this a component for better performance
                    <Box
                      style={{ width: 600, opacity: disabled ? 0.5 : 1 }}
                      flow={2}
                      horizontal
                      alignItems="center"
                      key={utxo.hash + "@" + utxo.outputIndex}
                      onClick={onClick}
                    >
                      <Checkbox isChecked={!s.excluded} onChange={onClick} />
                      <Box style={{ width: "10%" }}>
                        {input ? (
                          <Text ff="Inter|Bold" fontSize={2} color="wallet">
                            INPUT #{inputIndex}
                          </Text>
                        ) : null}
                      </Box>
                      <Box style={{ width: "30%" }}>
                        <FormattedVal
                          disableRounding
                          val={utxo.value}
                          unit={account.unit}
                          showCode
                          fontSize={4}
                          color="palette.text.shade100"
                        />
                        <Text
                          ff="Inter|Regular"
                          fontSize={2}
                          color={(utxo.blockHeight || 0) < 1 ? "alertRed" : "palette.text.shade80"}
                        >
                          {utxo.blockHeight
                            ? account.blockHeight - utxo.blockHeight + " confirmations"
                            : utxo.rbf
                            ? "replaceable"
                            : "pending"}
                        </Text>
                      </Box>
                      <Box>
                        <Text color="palette.text.shade100" ff="Inter|SemiBold" fontSize={2}>
                          {utxo.address}
                        </Text>
                        <Text
                          style={{ whiteSpace: "nowrap" }}
                          color="palette.text.shade100"
                          ff="Inter|Regular"
                          fontSize={1}
                        >
                          #{utxo.outputIndex} of {utxo.hash}
                        </Text>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          )}
          renderFooter={() => (
            <>
              {error ? null : (
                <Box flow={4} alignItems="center" horizontal>
                  <Box>
                    <Text ff="Inter|Regular" fontSize={2}>
                      to spend
                    </Text>
                    <FormattedVal
                      disableRounding
                      val={status.totalSpent}
                      unit={account.unit}
                      showCode
                      fontSize={4}
                      color="wallet"
                    />
                  </Box>

                  <Box grow>
                    {(status.txOutputs || []).map((output, i) => (
                      <Box key={i} horizontal flow={2} alignItems="center">
                        <FormattedVal
                          disableRounding
                          val={output.value}
                          unit={account.unit}
                          showCode
                          fontSize={4}
                          color="palette.text.shade100"
                        />
                        {output.path ? (
                          <Text ff="Inter|SemiBold" fontSize={2}>
                            {isChangeOutput(output) ? "change" : ""} on {output.path}
                          </Text>
                        ) : null}
                        <Text ff="Inter|Regular" fontSize={2}>
                          {output.address}
                        </Text>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
              <Box grow />
              <Button primary onClick={onClose}>
                Done
              </Button>
            </>
          )}
        />
      </Modal>
    );
  }
}

export default CoinControlModal;
