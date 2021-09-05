// @flow
import type { CreateStylesReturnType } from "~/renderer/components/Select/createStyles";

export const selectRowStylesMap: CreateStylesReturnType => CreateStylesReturnType = styles => ({
  ...styles,
  control: (provided, state) => ({
    ...styles.control(provided, state),
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  }),
  menu: provided => ({
    ...styles.menu(provided),
    width: "200%",
  }),
});

export const amountInputContainerProps = {
  noBorderLeftRadius: true,
};
