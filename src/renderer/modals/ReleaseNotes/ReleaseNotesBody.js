// @flow
import React, { PureComponent } from "react";
import { withTranslation } from "react-i18next";
import styled from "styled-components";
import semver from "semver";
import type { TFunction } from "react-i18next";

import { ModalBody } from "~/renderer/components/Modal";
import Box from "~/renderer/components/Box";
import TranslatedError from "~/renderer/components/TranslatedError";
import Spinner from "~/renderer/components/Spinner";
import TrackPage from "~/renderer/analytics/TrackPage";
import Text from "~/renderer/components/Text";
import Button from "~/renderer/components/Button";
import Markdown, { Notes } from "~/renderer/components/Markdown";
import network from "@ledgerhq/live-common/lib/network";

type Props = {
  version: string,
  onClose: () => void,
  t: TFunction,
};

type State = {
  notes: *,
  error: ?Error,
};

const Title = styled(Text).attrs(() => ({
  ff: "Inter",
  fontSize: 5,
  color: "palette.text.shade100",
}))``;

class ReleaseNotesBody extends PureComponent<Props, State> {
  state = {
    notes: null,
    error: null,
  };

  componentDidMount() {
    const { version } = this.props;
    this.fetchNotes(version);
  }

  fetchNotes = async (version: string) => {
    try {
      const { data } = await network({
        method: "GET",
        url: "https://api.github.com/repos/LedgerHQ/ledger-live-desktop/releases",
        // `https://api.github.com/repos/LedgerHQ/ledger-live-desktop/releases/tags/v${version}`,
      });
      const v = semver.parse(version);
      if (!v) throw new Error(`can't parse semver ${version}`);
      const notes = data.filter(
        d =>
          semver.valid(d.tag_name) &&
          semver.gte(
            d.tag_name,
            v.prerelease.length
              ? `${v.major}.${v.minor}.${v.patch}-${v.prerelease[0]}`
              : `${v.major}.${v.minor}.0`,
          ) &&
          semver.lte(d.tag_name, version),
      );
      this.setState({ notes });
    } catch (error) {
      this.setState({ error });
    }
  };

  renderContent = () => {
    const { error, notes } = this.state;
    const { t } = this.props;

    const { version } = this.props;

    if (notes) {
      return notes.map(note => (
        <Notes mb={6} key={note.tag_name}>
          <Title>{t("releaseNotes.version", { versionNb: note.tag_name })}</Title>
          <Markdown>{note.body}</Markdown>
        </Notes>
      ));
    } else if (error) {
      return (
        <Notes>
          <Title>{t("releaseNotes.version", { versionNb: version })}</Title>
          <Box style={{ wordWrap: "break-word" }} color="alertRed" ff="Inter|SemiBold" fontSize={3}>
            <TranslatedError error={error} />
          </Box>
        </Notes>
      );
    }

    return (
      <Box horizontal alignItems="center">
        <Spinner
          size={32}
          style={{
            margin: "auto",
          }}
        />
      </Box>
    );
  };

  render() {
    const { onClose, t } = this.props;

    return (
      <ModalBody
        onClose={onClose}
        title={t("releaseNotes.title")}
        render={() => (
          <Box relative style={{ height: 500 }} px={5} pb={8}>
            <TrackPage category="Modal" name="ReleaseNotes" />
            {this.renderContent()}
          </Box>
        )}
        renderFooter={() => (
          <Box horizontal justifyContent="flex-end">
            <Button onClick={onClose} primary>
              {t("common.continue")}
            </Button>
          </Box>
        )}
      />
    );
  }
}

export default withTranslation()(ReleaseNotesBody);
