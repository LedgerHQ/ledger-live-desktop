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
};

export default function Paginator(props: Props) {
  const { totalSize, currentPage, small, limit, onChange } = props;

  const numberOfPages = Math.ceil(totalSize / limit);
  const pages = [];
  const isPrevDisabled: boolean = currentPage === 1;
  const isNextDisabled: boolean = currentPage === numberOfPages;
  for (let i = 1; i < numberOfPages + 1; i++) {
    pages.push(i);
  }

  let slicedFrom = 0;
  if (currentPage < 4) {
    slicedFrom = 0;
  } else if (currentPage > totalSize - 2) {
    slicedFrom = -5;
  } else {
    slicedFrom = currentPage - 3;
  }

  let slicedAmount = 0;
  if (currentPage > totalSize - 5) {
    slicedAmount = undefined;
  } else if (currentPage > totalSize - 2) {
    slicedAmount = 0;
  } else {
    slicedAmount = currentPage + 2;
  }
  return (
    <Box horizontal>
      <Button onClick={() => onChange(currentPage - 1)} disabled={isPrevDisabled} small={small}>
        <ChevronLeft size={12} />
      </Button>
      {currentPage > 3 && (
        <Button onClick={() => onChange(1)} small={small}>
          {1}
        </Button>
      )}
      {currentPage > 4 && (
        <Button onClick={() => onChange(currentPage - 3)} small={small}>
          ...
        </Button>
      )}
      {pages.slice(slicedFrom, slicedAmount).map(page => {
        return (
          <Button
            onClick={() => page !== currentPage && onChange(page)}
            key={page}
            primary={page === currentPage}
            small={small}
          >
            {page}
          </Button>
        );
      })}
      {numberOfPages > currentPage + 3 && (
        <Button onClick={() => onChange(currentPage + 3)} small={small}>
          ...
        </Button>
      )}
      {currentPage < numberOfPages - 2 ? (
        <Button onClick={() => onChange(numberOfPages)} key={numberOfPages} small={small}>
          {numberOfPages}
        </Button>
      ) : null}
      <Button onClick={() => onChange(currentPage + 1)} disabled={isNextDisabled} small={small}>
        <ChevronRight size={12} />
      </Button>
    </Box>
  );
}
