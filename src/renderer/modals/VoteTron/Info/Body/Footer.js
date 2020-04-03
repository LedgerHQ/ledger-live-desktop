// @flow
import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { openModal, closeModal } from "~/renderer/actions/modals";
import Button from "~/renderer/components/Button";
// import CheckBox from "~/renderer/components/CheckBox";
import { useAccount } from "../shared";

export default function VoteTronInfoModalBodyFooter() {
  const { t } = useTranslation();

  const accountContext = useAccount();

  const tronResources =
    accountContext &&
    accountContext.account &&
    accountContext.account.type === "Account" &&
    accountContext.account.tronResources;

  const hasVotesAvailable = tronResources ? tronResources.tronPower > 0 : false;

  // const [showAgain, setShowAgain] = useState(false);

  // function onClickShowAgain() {
  //   setShowAgain(!showAgain);
  // }

  const dispatch = useDispatch();
  const onNext = useCallback(() => {
    if (!accountContext) {
      return;
    }
    const { name, account, parentAccount } = accountContext;

    dispatch(closeModal(name));
    dispatch(
      openModal("MODAL_VOTE_TRON", {
        parentAccount,
        account,
      }),
    );
  }, [accountContext, dispatch]);

  return (
    <>
      {/* <Box horizontal alignItems="center" onClick={onClickShowAgain} style={{ flex: 1 }}>
                <CheckBox isChecked={showAgain} />
                <Text
                  ff="Inter|SemiBold"
                  fontSize={4}
                  color="palette.text.shade50"
                  style={{ marginLeft: 8, overflowWrap: "break-word", flex: 1 }}
                >
                  {t("tron.manage.vote.steps.vote.footer.doNotShowAgain")}
                </Text>
              </Box> */}

      <Button primary disabled={!hasVotesAvailable} onClick={onNext}>
        {t("tron.manage.vote.steps.vote.footer.next")}
      </Button>
    </>
  );
}
