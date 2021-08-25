import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function FreezeRegular({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.3039 21.36H12.6959L12.6479 18.312L14.3759 20.064L15.2879 19.152L12.6959 16.56L12.6479 13.536L17.8079 18.72L18.7199 17.808L13.5359 12.648L16.5599 12.696L19.1519 15.288L20.0639 14.376L18.3119 12.648L21.3599 12.696V11.304L18.3119 11.352L20.0639 9.62402L19.1519 8.71202L16.5599 11.304L13.5359 11.352L18.7199 6.19201L17.8079 5.28001L12.6479 10.464L12.6959 7.44001L15.2879 4.84801L14.3759 3.93601L12.6479 5.68801L12.6959 2.64001H11.3039L11.3519 5.68801L9.62389 3.93601L8.71189 4.84801L11.3039 7.44001L11.3519 10.464L6.19189 5.28001L5.27989 6.19201L10.4639 11.352L7.43989 11.304L4.84789 8.71202L3.93589 9.62402L5.68789 11.352L2.63989 11.304V12.696L5.68789 12.648L3.93589 14.376L4.84789 15.288L7.43989 12.696L10.4639 12.648L5.27989 17.808L6.19189 18.72L11.3519 13.536L11.3039 16.56L8.71189 19.152L9.62389 20.064L11.3519 18.312L11.3039 21.36Z"
        fill={color}
      />
    </svg>
  );
}

export default FreezeRegular;
