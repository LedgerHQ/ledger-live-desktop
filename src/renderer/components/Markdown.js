// @flow
import React, { PureComponent } from "react";
import styled from "styled-components";
import ReactMarkdown from "react-markdown";
import { shell } from "electron";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

import Box from "~/renderer/components/Box";

export const Notes: ThemedComponent<{}> = styled(Box).attrs(() => ({
  ff: "Inter",
  fontSize: 4,
  color: "palette.text.shade80",
  flow: 4,
}))`
  ul,
  ol {
    padding-left: 20px;
  }

  p {
    margin: 1em 0;
    text-align: justify;
  }

  code,
  pre {
    font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
  }

  code {
    padding: 0.2em 0.4em;
    font-size: 0.9em;
    background-color: ${p => p.theme.colors.palette.background.default};
    border-radius: 3px;
  }

  pre {
    word-wrap: normal;

    code {
      word-break: normal;
      white-space: pre;
      background: transparent;
    }
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: ${p => p.theme.colors.palette.text.shade100};
    font-weight: bold;
    margin-top: 24px;
    margin-bottom: 16px;
  }

  h1 {
    padding-bottom: 0.3em;
    font-size: 1.33em;
  }

  h2 {
    padding-bottom: 0.3em;
    font-size: 1.25em;
  }

  h3 {
    font-size: 1em;
  }

  h4 {
    font-size: 0.875em;
  }

  h5,
  h6 {
    font-size: 0.85em;
    color: #6a737d;
  }

  strong {
    font-weight: bold;
  }

  img {
    max-width: 100%;
  }

  hr {
    height: 1px;
    border: none;
    background-color: ${p => p.theme.colors.palette.divider};
  }

  blockquote {
    padding: 0 1em;
    border-left: 0.25em solid #dfe2e5;
  }

  table {
    width: 100%;
    ${p => p.theme.overflow.xy};
    border-collapse: collapse;

    th {
      font-weight: bold;
    }

    th,
    td {
      padding: 6px 13px;
      border: 1px solid #dfe2e5;
    }

    tr {
      background-color: #fff;
      border-top: 1px solid #c6cbd1;
    }

    tr:nth-child(2n) {
      background-color: #f6f8fa;
    }
  }

  input[type="Switch"] {
    margin-right: 0.5em;
  }
`;

export const Terms = Notes;

type Props = {
  children: *,
};

export default class Markdown extends PureComponent<Props> {
  componentDidMount() {
    if (this.parent) {
      const links: NodeList<HTMLElement> = this.parent.querySelectorAll("a");
      links.forEach(link => {
        link.style.cursor = "pointer";
        link.addEventListener("click", (e: MouseEvent) => {
          e.preventDefault();
          // $FlowFixMe
          const href = e.target && e.target.href;
          shell.openExternal(href);
        });
      });
    }
  }

  parent: ?HTMLDivElement;

  render() {
    const { children } = this.props;
    return (
      <div id="terms-markdown" ref={c => (this.parent = c)}>
        <ReactMarkdown>{children}</ReactMarkdown>
      </div>
    );
  }
}
