// @flow
import React from "react";

import Button from "~/renderer/components/Button";
import ChevronLeft from "~/renderer/icons/ChevronLeft";
import ChevronRight from "~/renderer/icons/ChevronRight";
import Box from "~/renderer/components/Box";

type Props = {
  totalSize: number,
  currentPage: number,
  limit: number,
  small?: boolean,
  onChange: any,
  loading?: boolean,
};

type InnerButtonProps = {
  children: React$Node,
};

export default function Paginator(props: Props) {
  const { totalSize, currentPage, small, limit, onChange, loading = false } = props;

  const numberOfPages = Math.ceil(totalSize / limit);
  const pages = [];
  const isPrevDisabled: boolean = currentPage === 1;
  const isNextDisabled: boolean = currentPage === numberOfPages;

  if (totalSize !== 0 && totalSize > limit) {
    for (let i = 1; i < numberOfPages + 1; i++) {
      pages.push(i);
    }
  }

  let slicedFrom;
  if (currentPage < 4) {
    slicedFrom = 0;
  } else if (currentPage > totalSize - 2) {
    slicedFrom = -5;
  } else {
    slicedFrom = currentPage - 3;
  }

  let slicedAmount;
  if (currentPage > totalSize - 5) {
    slicedAmount = undefined;
  } else if (currentPage > totalSize - 2) {
    slicedAmount = 0;
  } else {
    slicedAmount = currentPage + 2;
  }

  const InnerButton = (props: InnerButtonProps) => (
    <Button {...props} disabled={loading}>
      {props.children}
    </Button>
  );

  if (!pages.length) {
    return null;
  }

  return (
    <Box horizontal>
      <InnerButton
        onClick={() => onChange(currentPage - 1)}
        disabled={isPrevDisabled}
        small={small}
      >
        <ChevronLeft size={12} />
      </InnerButton>
      {currentPage > 3 && (
        <InnerButton onClick={() => onChange(1)} small={small}>
          {1}
        </InnerButton>
      )}
      {currentPage > 4 && (
        <InnerButton onClick={() => onChange(currentPage - 3)} small={small}>
          ...
        </InnerButton>
      )}
      {pages.slice(slicedFrom, slicedAmount).map(page => {
        return (
          <InnerButton
            onClick={() => page !== currentPage && onChange(page)}
            key={page}
            primary={page === currentPage}
            small={small}
          >
            {page}
          </InnerButton>
        );
      })}
      {numberOfPages > currentPage + 3 && (
        <InnerButton onClick={() => onChange(currentPage + 3)} small={small}>
          ...
        </InnerButton>
      )}
      {currentPage < numberOfPages - 2 ? (
        <InnerButton onClick={() => onChange(numberOfPages)} key={numberOfPages} small={small}>
          {numberOfPages}
        </InnerButton>
      ) : null}
      <InnerButton
        onClick={() => onChange(currentPage + 1)}
        disabled={isNextDisabled}
        small={small}
      >
        <ChevronRight size={12} />
      </InnerButton>
    </Box>
  );
}
