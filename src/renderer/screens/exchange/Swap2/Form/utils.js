// @flow
import type { StyleObject as InputStyleObject } from "~/renderer/components/Select";

export const FORM_CONTAINER_WIDTH = 540;

export const selectRowStylesMap: InputStyleObject => InputStyleObject = styles => ({
  ...styles,
  control: (provided, state) => ({
    ...styles.control(provided, state),
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  }),
  menu: provided => ({
    ...styles.menu(provided),
    width: `${FORM_CONTAINER_WIDTH}px`,
  }),
});

export const amountInputContainerProps = {
  noBorderLeftRadius: true,
};
