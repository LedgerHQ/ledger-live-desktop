// @flow
import React, { Component } from "react";
import { compose } from "redux";
import { createStructuredSelector } from "reselect";
import { withTranslation } from "react-i18next";
import type { TFunction } from "react-i18next";
import { connect } from "react-redux";
import styled from "styled-components";
import type { Account } from "@ledgerhq/live-common/lib/types/account";
import { openModal } from "~/renderer/actions/modals";
import Box from "~/renderer/components/Box";
import DownloadCloud from "~/renderer/icons/DownloadCloud";
import Label from "~/renderer/components/Label";
import Button from "~/renderer/components/Button";
import { activeAccountsSelector } from "~/renderer/reducers/accounts";
