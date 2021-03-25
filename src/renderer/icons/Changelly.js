// @flow

import React from "react";

const Changelly = ({ size, color = "currentColor" }: { size: number, color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 22 22">
    <path
      fill={color}
      d="M10.3897 16.9419C10.2299 17.1011 10.0555 17.2457 9.86658 17.3759C9.5033 17.6508 9.1255 17.8823 8.71863 18.0993C7.91942 18.5044 7.07662 18.8083 6.19022 18.9819C5.97226 19.0253 5.75429 19.0687 5.53633 19.0976L5.20211 19.141L5.04227 19.1555L4.88243 19.17L4.54822 19.1989L4.214 19.2134C3.99604 19.2278 3.76354 19.2278 3.54558 19.2423C2.89168 19.2423 2.23778 19.2134 1.58388 19.1555C1.65654 19.0542 1.72919 18.9385 1.80185 18.8227C2.00528 18.5044 2.19419 18.1572 2.36856 17.81C2.68824 17.1155 2.93527 16.3921 3.13871 15.6687C3.32761 14.9598 3.56011 14.2798 3.82166 13.5854C4.08322 12.8909 4.38837 12.2254 4.73712 11.5743C4.49009 11.8492 4.27213 12.153 4.06869 12.4713C3.86526 12.7751 3.66182 13.1079 3.48745 13.4262C3.12417 14.0773 2.80449 14.7717 2.55746 15.4662C2.2959 16.1462 2.01981 16.8262 1.6856 17.4483C1.35139 18.0704 0.944518 18.6491 0.479524 19.1989L0 19.7776L0.755614 19.8789C1.6856 20.0091 2.63012 20.0814 3.57464 20.0525C3.80713 20.038 4.05416 20.038 4.28666 20.0091L4.6354 19.9802L4.98415 19.9368C5.21664 19.9078 5.44914 19.8499 5.68164 19.821C5.91413 19.7631 6.14663 19.7197 6.37913 19.6474C6.61163 19.5895 6.82959 19.5027 7.06209 19.4304C7.28005 19.3436 7.51255 19.2568 7.73051 19.1555C8.16645 18.9674 8.58785 18.7215 8.98019 18.461C9.37252 18.2006 9.7358 17.8968 10.07 17.5496C10.3897 17.2023 10.6803 16.8406 10.8838 16.4211C10.7239 16.6236 10.5641 16.7972 10.3897 16.9419ZM15.5918 4.45611C15.8534 4.19569 16.2021 4.05101 16.5799 4.05101C16.9432 4.05101 17.2919 4.18122 17.568 4.45611C18.1057 5.00589 18.1057 5.87396 17.568 6.42374C17.0304 6.95906 16.144 6.95906 15.5918 6.42374C15.3303 6.16332 15.1849 5.81609 15.1849 5.43993C15.1849 5.06376 15.3303 4.71653 15.5918 4.45611ZM16.5799 7.66798C17.1612 7.66798 17.7279 7.45096 18.1638 7.01693C19.0357 6.13439 19.0357 4.731 18.1638 3.84846C17.2919 2.98039 15.8679 2.98039 14.996 3.84846C14.5746 4.26803 14.3421 4.83228 14.3421 5.42546C14.3421 6.01864 14.5746 6.58289 14.996 7.00246C15.4174 7.4365 15.9841 7.66798 16.5799 7.66798ZM17.2338 10.8799C14.0225 13.7011 12.6856 13.9615 11.3487 13.3539L12.8018 11.5309C13.0198 11.2705 13.1651 10.9522 13.2523 10.6194L13.8336 8.17436L11.3923 8.75308C11.0581 8.83988 10.7384 8.98456 10.4769 9.20158L8.64597 10.6484C8.02114 9.31732 8.29723 7.98628 11.1162 4.78887C13.79 1.76508 19.428 1.07062 21.0991 0.925944C20.9683 2.58975 20.2708 8.21776 17.2338 10.8799ZM15.0978 15.2492C15.0687 15.3794 14.996 15.5096 14.8798 15.5819C14.5456 15.8134 14.0225 16.1317 13.5575 16.4211L13.5865 16.3343C13.8045 15.4517 13.8045 14.7717 13.5865 14.3087C14.1968 14.1207 14.8507 13.7879 15.5918 13.2815C15.4029 13.9615 15.1995 14.7717 15.0978 15.2492ZM10.0264 13.6722C9.83752 13.9181 9.53236 14.0483 9.22721 14.0339H9.21268H8.48613L11.0145 10.9956L7.96301 13.513V12.8041V12.7751C7.94848 12.4713 8.07926 12.1675 8.32629 11.9794L11 9.8671C11.1744 9.73689 11.3778 9.63561 11.5812 9.57774L12.6711 9.31732L12.4095 10.4024C12.3514 10.6194 12.2642 10.822 12.1189 10.9956L10.0264 13.6722ZM5.66711 8.43478L5.57992 8.46372C5.85601 8.00074 6.17569 7.4799 6.40819 7.14714C6.48085 7.0314 6.61163 6.95906 6.7424 6.93012C7.22193 6.82884 8.03567 6.6263 8.71863 6.45268C8.21004 7.19054 7.87583 7.85607 7.68692 8.46372C7.23646 8.2033 6.5535 8.20329 5.66711 8.43478ZM21.5495 0.0434019C21.2444 0.0578698 13.8626 0.39063 10.4769 4.22462C10.1572 4.58632 9.85205 4.96249 9.5469 5.33865C9.05284 5.46886 7.33818 5.93184 6.58256 6.09098C6.23382 6.16332 5.91413 6.36587 5.7107 6.6697C5.18758 7.42203 4.28666 8.97009 4.2576 9.02796L3.6037 10.142L4.79524 9.62115C5.57992 9.28839 6.88771 8.94116 7.35271 9.21605C7.42536 9.25945 7.51255 9.34626 7.52708 9.56328C7.54161 10.1131 7.68692 10.6484 7.96301 11.1837L7.80317 11.3139C7.35271 11.6756 7.09115 12.2254 7.12021 12.8041V14.873H9.19815C9.77939 14.9019 10.3316 14.6415 10.6948 14.193L10.8256 14.0339C11.3633 14.3087 11.9009 14.4679 12.4531 14.4679C12.6711 14.4824 12.7437 14.5547 12.8018 14.6415C13.0925 15.1045 12.7437 16.4211 12.395 17.2023L11.8719 18.3887L12.9908 17.7376C13.0634 17.6942 14.6037 16.7972 15.3593 16.2764C15.6499 16.0738 15.8534 15.77 15.926 15.4083C16.0859 14.656 16.5509 12.9343 16.6816 12.4424C17.0304 12.1675 17.3937 11.8492 17.786 11.502C21.6222 8.13096 21.9709 0.766798 21.9855 0.462972L22 0L21.5495 0.0434019Z"
    />
  </svg>
);

export default Changelly;
