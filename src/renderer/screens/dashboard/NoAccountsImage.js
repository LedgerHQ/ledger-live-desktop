// @flow
import React, { memo } from "react";

type Props = { size?: number };

const NoAccountsImage = ({ size = 250 }: Props) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 250 250"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0)">
      <circle opacity="0.15" cx="125" cy="125" r="103" fill="url(#paint0_linear)" />
      <path
        d="M31.6045 113.53C31.6046 112.216 32.5262 110.617 33.6646 109.957L114.006 63.3801C114.491 63.0985 114.962 63.0235 115.335 63.1684L119.327 64.7208C119.826 64.9152 120.099 65.4848 120.063 66.2573L116.957 131.861C116.897 133.136 116.023 134.619 114.948 135.271L36.1338 183.051C35.5434 183.409 34.975 183.461 34.5723 183.195L32.1562 181.596C31.8 181.361 31.602 180.894 31.602 180.291L31.6045 113.53Z"
        fill="#D9DCE2"
      />
      <rect
        width="98.439"
        height="72.1886"
        rx="2.38359"
        transform="matrix(0.866006 -0.500033 -3.77048e-05 1 34.5843 112.343)"
        fill="white"
      />
      <path
        opacity="0.4"
        d="M38.7815 116.237C38.7816 115.243 39.4839 114.035 40.3447 113.547L53.395 106.158C53.7697 105.945 54.1305 105.898 54.4102 106.025L56.0848 106.782C56.4458 106.945 56.6357 107.38 56.598 107.959L55.6586 122.373C55.5995 123.281 55.0009 124.322 54.2449 124.832L41.5803 133.375C41.1275 133.68 40.6808 133.75 40.3587 133.566L39.2371 132.925C38.9451 132.758 38.7809 132.397 38.7809 131.921L38.7815 116.237Z"
        fill="#0EBDCD"
      />
      <rect
        width="19.0315"
        height="19.0315"
        rx="1.7877"
        transform="matrix(0.866006 -0.500033 -3.77105e-05 1 40.2672 115.625)"
        fill="#CFF2F5"
      />
      <g clipPath="url(#clip1)">
        <g clipPath="url(#clip2)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M47.4264 122.017L48.8051 121.888L50.1839 120.544L48.805 124.233L47.4264 122.017ZM50.4104 119.111L48.8052 120.676L47.2 120.826L48.8053 116.531L50.4104 119.111ZM51.5497 118.915L48.8054 114.504L46.0606 121.848L48.8049 126.259L51.5497 118.915Z"
            fill="#0EBDCD"
          />
        </g>
      </g>
      <g filter="url(#filter0_d)">
        <rect
          width="38.0631"
          height="2.62504"
          rx="1.31252"
          transform="matrix(0.866006 -0.500033 -3.77105e-05 1 64.1368 106.436)"
          fill="#E7E8EA"
        />
      </g>
      <g filter="url(#filter1_d)">
        <rect
          width="21.0003"
          height="2.62504"
          rx="1.31252"
          transform="matrix(0.866006 -0.500033 -3.77105e-05 1 64.1366 112.999)"
          fill="#E7E8EA"
        />
      </g>
      <path
        d="M52.5533 153.721C45.6011 157.735 40.2073 152.335 40.2073 152.335L40.2065 173.415C40.2064 174.402 40.8996 174.802 41.7546 174.309L112.942 133.205C113.797 132.711 114.49 131.511 114.491 130.523L114.491 123.796C114.491 123.796 108.483 103.669 99.6349 108.778C90.7866 113.887 89.8334 135.844 84.7772 138.764C79.7211 141.683 78.2557 128.42 69.921 133.232C61.5862 138.045 59.5055 149.707 52.5533 153.721Z"
        fill="url(#paint1_linear)"
        fillOpacity="0.1"
      />
      <g filter="url(#filter2_d)">
        <path
          d="M40.2073 152.335C40.2073 152.335 45.6011 157.735 52.5533 153.721C59.5055 149.707 61.5862 138.045 69.921 133.232C78.2557 128.42 79.7211 141.683 84.7772 138.764C89.8334 135.844 90.7866 113.887 99.6349 108.778C108.483 103.669 114.491 123.796 114.491 123.796"
          stroke="#0EBDCD"
          strokeWidth="1.7877"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M119.833 84.9358L91.9741 101.021C91.2704 101.428 90.6999 101.098 90.6999 100.286L90.7007 79.9416L117.769 64.3122C118.909 63.6539 119.833 64.1875 119.833 65.5039L119.833 84.9358Z"
        fill="black"
        fillOpacity="0.03"
      />
      <path
        d="M87.545 78.7513L90.7567 79.9442L97.6389 75.9984L96.2625 73.7043L87.545 78.7513Z"
        fill="black"
        fillOpacity="0.04"
      />
      <path
        d="M93.45 51.5025C93.45 50.691 94.019 49.7042 94.7218 49.2968L144.318 20.5435C144.618 20.3696 144.909 20.3233 145.139 20.4128L147.603 21.3711C147.912 21.4911 148.08 21.8427 148.058 22.3196L146.141 62.8188C146.103 63.6055 145.564 64.5213 144.9 64.9236L96.2461 94.4193C95.8816 94.6403 95.5307 94.6726 95.2821 94.5082L93.7906 93.5216C93.5707 93.3762 93.4485 93.0882 93.4485 92.7159L93.45 51.5025Z"
        fill="#D9DCE2"
      />
      <rect
        width="60.769"
        height="44.5639"
        rx="1.47145"
        transform="matrix(0.866006 -0.500033 -3.77048e-05 1 95.2897 50.7693)"
        fill="white"
      />
      <path
        opacity="0.4"
        d="M97.8807 53.1736C97.8807 52.56 98.3143 51.8138 98.8457 51.5129L106.902 46.9511C107.133 46.8201 107.356 46.7909 107.529 46.869L108.562 47.3363C108.785 47.437 108.903 47.7059 108.879 48.0631L108.299 56.9616C108.263 57.5218 107.893 58.1644 107.427 58.4792L99.6085 63.7528C99.3289 63.9414 99.0532 63.9846 98.8543 63.8709L98.1619 63.4753C97.9816 63.3723 97.8803 63.1493 97.8803 62.8556L97.8807 53.1736Z"
        fill="#23292F"
      />
      <rect
        width="11.7487"
        height="11.7487"
        rx="1.10359"
        transform="matrix(0.866006 -0.500033 -3.77105e-05 1 98.798 52.7952)"
        fill="#D3D4D5"
      />
      <g clipPath="url(#clip3)">
        <path
          d="M102.458 54.2063L101.586 54.6726L103.085 55.5496C103.613 55.8582 104.47 55.4004 104.998 54.5279L106.498 52.0482L105.625 52.5145L104.558 54.2789C104.272 54.7506 103.811 54.9971 103.526 54.8303L102.458 54.2063Z"
          fill="#23292F"
        />
        <path
          d="M104.998 55.9347C104.47 55.6261 103.613 56.0839 103.085 56.9564L101.577 59.4501L102.45 58.9838L103.525 57.2054C103.811 56.7337 104.272 56.4871 104.558 56.654L105.633 57.2829L106.506 56.8166L104.998 55.9347Z"
          fill="#23292F"
        />
      </g>
      <g filter="url(#filter3_d)">
        <rect
          width="23.4974"
          height="1.62051"
          rx="0.810254"
          transform="matrix(0.866006 -0.500033 -3.77105e-05 1 113.533 47.1233)"
          fill="#E7E8EA"
        />
      </g>
      <g filter="url(#filter4_d)">
        <rect
          width="12.9641"
          height="1.62051"
          rx="0.810254"
          transform="matrix(0.866006 -0.500033 -3.77105e-05 1 113.533 51.1741)"
          fill="#E7E8EA"
        />
      </g>
      <path
        d="M106.382 76.3133C102.091 78.7914 98.7609 75.4579 98.7609 75.4579L98.7604 88.4709C98.7604 89.0804 99.1882 89.3274 99.7161 89.0227L143.662 63.6482C144.19 63.3434 144.618 62.6022 144.618 61.9927L144.618 57.8402C144.618 57.8402 140.909 45.4148 135.447 48.5687C129.985 51.7226 129.396 65.2776 126.275 67.0798C123.154 68.8821 122.249 60.6944 117.104 63.6652C111.959 66.6361 110.674 73.8352 106.382 76.3133Z"
        fill="url(#paint2_linear)"
        fillOpacity="0.1"
      />
      <g filter="url(#filter5_d)">
        <path
          d="M98.7609 75.4579C98.7609 75.4579 102.091 78.7914 106.382 76.3133C110.674 73.8352 111.959 66.6361 117.104 63.6652C122.249 60.6944 123.154 68.8821 126.275 67.0798C129.396 65.2776 129.985 51.7226 135.447 48.5687C140.909 45.4148 144.618 57.8402 144.618 57.8402"
          stroke="#23292F"
          strokeWidth="1.10359"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M77.1509 125.524C75.3979 126.541 73.9786 129.002 73.9786 131.027L73.9774 161.931L117.967 136.532C119.107 135.874 120.031 134.273 120.031 132.956L120.032 100.664L77.1509 125.524Z"
        fill="black"
        fillOpacity="0.03"
      />
      <path
        d="M79.4838 120.013C79.4839 117.989 80.9032 115.527 82.6562 114.511L206.373 42.7867C207.121 42.3531 207.846 42.2376 208.42 42.4607L214.567 44.8512C215.337 45.1505 215.757 46.0277 215.701 47.2173L210.919 148.241C210.826 150.204 209.48 152.488 207.824 153.491L86.4585 227.068C85.5493 227.619 84.674 227.699 84.054 227.289L80.3334 224.828C79.7849 224.465 79.48 223.747 79.48 222.818L79.4838 120.013Z"
        fill="#D9DCE2"
      />
      <rect
        width="151.586"
        height="111.163"
        rx="3.67049"
        transform="matrix(0.866006 -0.500033 -3.77048e-05 1 84.0721 118.185)"
        fill="white"
      />
      <path
        opacity="0.4"
        d="M90.5359 124.182C90.5359 122.651 91.6174 120.79 92.943 120.039L113.039 108.66C113.616 108.333 114.172 108.26 114.602 108.455L117.181 109.621C117.737 109.872 118.03 110.543 117.971 111.434L116.525 133.631C116.434 135.028 115.512 136.631 114.348 137.416L94.8457 150.571C94.1485 151.041 93.4606 151.149 92.9646 150.866L91.2375 149.879C90.7877 149.622 90.5349 149.066 90.5349 148.333L90.5359 124.182Z"
        fill="#FFAE35"
      />
      <rect
        width="29.3067"
        height="29.3067"
        rx="2.75287"
        transform="matrix(0.866006 -0.500033 -3.77105e-05 1 92.8233 123.238)"
        fill="#FFEFD7"
      />
      <g clipPath="url(#clip4)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M107.242 124.919L107.5 124.782C108.889 124.13 109.968 124.749 109.896 126.174L109.895 126.403C109.936 127.088 109.694 127.871 109.264 128.591C109.922 128.728 110.345 129.292 110.326 130.188L110.326 130.462C110.353 131.908 109.206 133.708 107.762 134.52L107.391 134.718L107.39 136.375L106.084 137.073L106.084 135.416L104.773 136.117L104.773 137.773L103.466 138.471L103.466 136.815L102.129 137.529L102.13 127.649L102.783 127.3L103.467 126.935L103.467 125.334L104.773 124.636L104.773 126.238L105.936 125.617L105.936 124.015L107.242 123.317L107.242 124.919ZM103.436 132.587L103.436 135.435L107.745 133.133C108.475 132.722 109.032 131.849 109.02 131.174L109.02 130.87C109.034 130.194 108.477 129.914 107.762 130.275L103.436 132.587ZM108.59 127.144L108.591 126.833C108.623 126.183 108.114 125.891 107.46 126.197L103.436 128.347L103.436 131.191L107.435 129.054C108.126 128.633 108.628 127.799 108.59 127.144Z"
          fill="#FFAE35"
        />
      </g>
      <g filter="url(#filter6_d)">
        <rect
          width="58.6134"
          height="4.0423"
          rx="2.02115"
          transform="matrix(0.866006 -0.500033 -3.77105e-05 1 129.58 109.089)"
          fill="#E7E8EA"
        />
      </g>
      <g filter="url(#filter7_d)">
        <rect
          width="32.3384"
          height="4.0423"
          rx="2.02115"
          transform="matrix(0.866006 -0.500033 -3.77105e-05 1 129.58 119.194)"
          fill="#E7E8EA"
        />
      </g>
      <path
        d="M111.743 181.903C101.037 188.084 92.731 179.769 92.731 179.769L92.7298 212.23C92.7297 213.75 93.797 214.366 95.1137 213.606L204.736 150.31C206.052 149.55 207.12 147.701 207.12 146.181L207.12 135.822C207.12 135.822 197.869 104.828 184.244 112.695C170.618 120.562 169.15 154.375 161.364 158.87C153.578 163.366 151.322 142.942 138.487 150.353C125.652 157.763 122.448 175.721 111.743 181.903Z"
        fill="url(#paint3_linear)"
        fillOpacity="0.1"
      />
      <g filter="url(#filter8_d)">
        <path
          d="M92.731 179.769C92.731 179.769 101.037 188.084 111.743 181.903C122.448 175.721 125.652 157.763 138.487 150.353C151.322 142.942 153.578 163.366 161.364 158.87C169.15 154.375 170.618 120.562 184.244 112.695C197.869 104.828 207.12 135.822 207.12 135.822"
          stroke="#FFAE35"
          strokeWidth="2.75287"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </g>
    <defs>
      <filter
        id="filter0_d"
        x="62.945"
        y="87.3082"
        width="34.1547"
        height="21.2516"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset dx="-1.1918" dy="-0.595898" />
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.02 0" />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
      </filter>
      <filter
        id="filter1_d"
        x="62.9447"
        y="102.403"
        width="19.3782"
        height="12.7197"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset dx="-1.1918" dy="-0.595898" />
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.02 0" />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
      </filter>
      <filter
        id="filter2_d"
        x="37.6455"
        y="105.756"
        width="77.6196"
        height="50.4487"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset dx="-1.7877" dy="-1.1918" />
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.03 0" />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
      </filter>
      <filter
        id="filter3_d"
        x="112.797"
        y="35.3153"
        width="21.0846"
        height="13.1192"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset dx="-0.735727" dy="-0.367863" />
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.02 0" />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
      </filter>
      <filter
        id="filter4_d"
        x="112.797"
        y="44.6331"
        width="11.9627"
        height="7.85221"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset dx="-0.735727" dy="-0.367863" />
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.02 0" />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
      </filter>
      <filter
        id="filter5_d"
        x="97.1794"
        y="46.7032"
        width="47.9167"
        height="31.1433"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset dx="-1.10359" dy="-0.735727" />
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.03 0" />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
      </filter>
      <filter
        id="filter6_d"
        x="127.745"
        y="79.634"
        width="52.5948"
        height="32.7254"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset dx="-1.83525" dy="-0.917623" />
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.02 0" />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
      </filter>
      <filter
        id="filter7_d"
        x="127.744"
        y="102.878"
        width="29.8405"
        height="19.5871"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset dx="-1.83525" dy="-0.917623" />
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.02 0" />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
      </filter>
      <filter
        id="filter8_d"
        x="88.7861"
        y="108.041"
        width="119.526"
        height="77.686"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset dx="-2.75287" dy="-1.83525" />
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.03 0" />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
      </filter>
      <linearGradient
        id="paint0_linear"
        x1="177"
        y1="214"
        x2="81"
        y2="28"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#3670C6" />
        <stop offset="0.494792" stopColor="#6490F1" />
        <stop offset="1" stopColor="#64BEF1" />
      </linearGradient>
      <linearGradient
        id="paint1_linear"
        x1="77.3484"
        y1="133.856"
        x2="85.9664"
        y2="148.78"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#0EBDCD" />
        <stop offset="1" stopColor="white" stopOpacity="0" />
      </linearGradient>
      <linearGradient
        id="paint2_linear"
        x1="121.689"
        y1="64.0502"
        x2="127.009"
        y2="73.2633"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#23292F" />
        <stop offset="1" stopColor="white" stopOpacity="0" />
      </linearGradient>
      <linearGradient
        id="paint3_linear"
        x1="149.925"
        y1="151.313"
        x2="163.196"
        y2="174.295"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FFAE35" />
        <stop offset="1" stopColor="#FFAE35" stopOpacity="0" />
      </linearGradient>
      <clipPath id="clip0">
        <rect width="250" height="250" fill="white" />
      </clipPath>
      <clipPath id="clip1">
        <rect
          width="9.22585"
          height="11.7553"
          transform="matrix(0.865403 -0.462393 -4.07518e-05 1 44.8136 116.637)"
          fill="white"
        />
      </clipPath>
      <clipPath id="clip2">
        <rect
          width="6.91938"
          height="11.7553"
          transform="matrix(0.865403 -0.462393 -4.07518e-05 1 45.8116 116.104)"
          fill="white"
        />
      </clipPath>
      <clipPath id="clip3">
        <rect
          width="5.69536"
          height="5.26663"
          transform="matrix(0.865403 -0.462393 -4.07518e-05 1 101.605 54.4158)"
          fill="white"
        />
      </clipPath>
      <clipPath id="clip4">
        <rect
          width="14.2069"
          height="13.1374"
          transform="matrix(0.865403 -0.462393 -4.07518e-05 1 99.8246 127.28)"
          fill="white"
        />
      </clipPath>
    </defs>
  </svg>
);

export default memo<Props>(NoAccountsImage);
