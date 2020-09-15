// @flow

import React from "react";
import { connect } from "react-redux";
import TopBanner from "~/renderer/components/TopBanner";
import Loader from "~/renderer/icons/Loader";
import { Trans } from "react-i18next";
import { createStructuredSelector } from "reselect";
import styled from "styled-components";

import { someAccountsNeedMigrationSelector } from "~/renderer/reducers/accounts";
import { openModal } from "~/renderer/actions/modals";

const Link = styled.span`
  color: ${p => p.theme.colors.palette.primary.contrastText};
  text-decoration: underline;
  cursor: pointer;
`;

type OwnProps = {};

type Props = OwnProps & {
  someAccountsNeedMigrationSelector: boolean,
  openModal: string => void,
};

const Banner = ({ someAccountsNeedMigrationSelector, openModal }: Props) =>
  someAccountsNeedMigrationSelector ? (
    <TopBanner
      content={{
        message: <Trans i18nKey="banners.migrate" />,
        Icon: Loader,
        right: (
          <Link
            id="modal-migrate-accounts-button"
            onClick={() => openModal("MODAL_MIGRATE_ACCOUNTS")}
          >
            <Trans i18nKey="common.updateNow" />
          </Link>
        ),
      }}
      bannerId={"migrate"}
    />
  ) : null;

const mapStateToProps = createStructuredSelector({
  someAccountsNeedMigrationSelector,
});

const ConnectedBanner: React$ComponentType<OwnProps> = connect(mapStateToProps, { openModal })(
  Banner,
);
export default ConnectedBanner;
