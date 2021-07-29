// @flow
import type { StyleObject as InputStyleObject } from "~/renderer/components/Select";

export const selectRowStylesMap: InputStyleObject => InputStyleObject = styles => ({
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
