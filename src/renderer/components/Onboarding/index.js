// @flow

import React, { useEffect, useState } from "react";
import { useMachine } from "@xstate/react";
import { assign, Machine } from "xstate";
import { CSSTransition } from "react-transition-group";
import { Modal } from "~/renderer/components/Onboarding/Modal";
import { saveSettings } from "~/renderer/actions/settings";
import { useDispatch } from "react-redux";
import { relaunchOnboarding } from "~/renderer/actions/onboarding";
import { track } from "~/renderer/analytics/segment";

// screens
import { Welcome } from "~/renderer/components/Onboarding/Screens/Welcome";
import { SelectDevice } from "~/renderer/components/Onboarding/Screens/SelectDevice";
import { SelectUseCase } from "~/renderer/components/Onboarding/Screens/SelectUseCase";
import {
  SetupNewDevice,
  ConnectSetUpDevice,
  UseRecoveryPhrase,
} from "~/renderer/components/Onboarding/Screens/Tutorial";

import { pedagogyMachine } from "~/renderer/components/Onboarding/Pedagogy/state";

import styled from "styled-components";
import { Pedagogy } from "~/renderer/components/Onboarding/Pedagogy";
import { preloadAssets } from "~/renderer/components/Onboarding/preloadAssets";

function LedgerLogo() {
  return (
    <svg width="99" height="26" viewBox="0 0 99 26" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.79207 1H4.22114C3.36684 1 2.54753 1.33937 1.94345 1.94345C1.33937 2.54753 1 3.36684 1 4.22114V5.79207H5.79207V1ZM17.9086 1H8.66639V13.4584H21.1297V4.22114C21.1297 3.36684 20.7904 2.54753 20.1863 1.94345C19.5822 1.33937 18.7629 1 17.9086 1ZM1 8.66631H5.79207V13.4584H1V8.66631ZM16.3625 21.1297H17.9335C18.7878 21.1297 19.6071 20.7903 20.2111 20.1862C20.8152 19.5821 21.1546 18.7628 21.1546 17.9085V16.3624H16.3625V21.1297ZM8.66639 16.3376H13.4585V21.1297H8.66639V16.3376ZM1 16.3624V17.9333C1 18.7876 1.33937 19.6069 1.94345 20.211C2.54753 20.8151 3.36684 21.1544 4.22114 21.1544H5.79207V16.3624H1ZM62.0962 7.6255C61.377 7.20892 60.5546 7.0045 59.7241 7.03591C56.4534 7.03591 54.0995 9.68716 54.0995 13.5525C54.0995 17.4179 56.2056 20.0939 59.5507 20.0939C62.8462 20.0939 63.8373 17.5913 63.8373 17.5913H63.8868C63.8513 17.8873 63.8347 18.1853 63.8373 18.4834V19.7966H65.4726V2.37764H63.7877V8.44825C63.7878 8.76276 63.8043 9.07705 63.8373 9.38982H63.7877C63.4018 8.65378 62.8153 8.04207 62.0962 7.6255ZM63.8373 13.5525C63.8373 17.0958 61.8798 18.5825 59.7985 18.5825C57.4941 18.5825 55.8587 16.6993 55.8587 13.5525C55.8587 10.4057 57.6675 8.54737 59.8728 8.54737C62.5488 8.54737 63.8373 11.0252 63.8373 13.5525ZM31.6257 2.37769H33.3354V18.2604H41.413V19.7966H31.6257V2.37769ZM47.5086 7.03594C50.9775 7.03594 52.712 9.68719 52.712 12.7844C52.712 13.0818 52.6624 13.6517 52.6624 13.6517H43.1229C43.1972 16.848 45.3777 18.5825 47.9546 18.5825C49.3565 18.562 50.7035 18.0338 51.7456 17.0958L52.489 18.3446C51.207 19.4509 49.5735 20.0657 47.8802 20.0791C47.0176 20.1094 46.1578 19.9621 45.3545 19.6463C44.5511 19.3305 43.8212 18.853 43.2101 18.2433C42.599 17.6336 42.1198 16.9048 41.8022 16.1021C41.4845 15.2995 41.3352 14.4401 41.3636 13.5773C41.3636 9.48897 44.1388 7.03594 47.5086 7.03594ZM51.0023 12.2641C50.9032 9.66241 49.3174 8.44829 47.459 8.44829C45.3777 8.44829 43.5689 9.76153 43.1724 12.2641H51.0023ZM72.1132 23.4886C74.5415 23.4886 76.4742 22.3488 76.4742 19.5736V18.4338C76.4752 18.1358 76.4918 17.8381 76.5237 17.5418H76.4742C75.7308 18.9294 74.4672 19.7223 72.5097 19.7223C69.1647 19.7223 66.9594 17.071 66.9594 13.3296C66.9594 9.58808 69.016 7.03594 72.361 7.03594C75.7061 7.03594 76.4742 9.1173 76.4742 9.1173H76.5237C76.5133 8.97708 76.5133 8.83629 76.5237 8.69607V7.33328H78.1591V19.4993C78.1591 23.4638 75.2353 25 72.2123 25C70.791 24.9923 69.3911 24.6529 68.124 24.0089L68.7682 22.6213C69.8025 23.1617 70.9467 23.4583 72.1132 23.4886ZM76.499 13.3296C76.499 9.68719 74.7645 8.57218 72.5592 8.57218C70.131 8.57218 68.7187 10.3314 68.7187 13.3048C68.7187 16.2781 70.3292 18.2108 72.807 18.2108C74.7645 18.2108 76.499 16.9967 76.499 13.3296ZM90.9693 12.7844C90.9693 9.68719 89.21 7.03594 85.7659 7.03594C82.3961 7.03594 79.6209 9.48897 79.6209 13.5625C79.5904 14.4265 79.7382 15.2875 80.0549 16.0919C80.3716 16.8963 80.8505 17.6269 81.4618 18.2382C82.0731 18.8495 82.8037 19.3284 83.6081 19.6451C84.4126 19.9618 85.2736 20.1096 86.1375 20.0791C87.8308 20.0657 89.4643 19.4509 90.7463 18.3446L89.9781 17.0958C88.936 18.0338 87.589 18.562 86.1871 18.5825C83.6102 18.5825 81.4297 16.848 81.3554 13.6517H90.9197C90.9197 13.6517 90.9693 13.0818 90.9693 12.7844ZM85.6915 8.44829C87.5499 8.44829 89.1357 9.66242 89.2348 12.2641H81.4049C81.8014 9.76153 83.6102 8.44829 85.6915 8.44829ZM92.456 7.33322H94.1161V9.53847C94.1161 10.0836 94.0666 10.5296 94.0666 10.5296H94.1161C94.7108 8.64646 96.0984 7.20933 98.0558 7.20933C98.2807 7.21172 98.5049 7.23662 98.7248 7.28367V8.92893C98.5198 8.89738 98.3128 8.88081 98.1054 8.87937C96.3461 8.87937 95.0329 10.2669 94.4878 12.1005C94.2514 12.888 94.1344 13.7066 94.1409 14.5288V19.7817H92.456V7.33322Z"
        fill="currentColor"
      />
      <path
        d="M5.79207 1H5.90921V0.88286H5.79207V1ZM1.94345 1.94345L1.86062 1.86062L1.86062 1.86062L1.94345 1.94345ZM1 5.79207H0.88286V5.90921H1V5.79207ZM5.79207 5.79207V5.90921H5.90921V5.79207H5.79207ZM8.66639 1V0.88286H8.54925V1H8.66639ZM8.66639 13.4584H8.54925V13.5755H8.66639V13.4584ZM21.1297 13.4584V13.5755H21.2469V13.4584H21.1297ZM20.1863 1.94345L20.2691 1.86062L20.1863 1.94345ZM5.79207 8.66631H5.90921V8.54917H5.79207V8.66631ZM1 8.66631V8.54917H0.88286V8.66631H1ZM5.79207 13.4584V13.5755H5.90921V13.4584H5.79207ZM1 13.4584H0.88286V13.5755H1V13.4584ZM16.3625 21.1297H16.2454V21.2468H16.3625V21.1297ZM21.1546 16.3624H21.2717V16.2452H21.1546V16.3624ZM16.3625 16.3624V16.2452H16.2454V16.3624H16.3625ZM13.4585 16.3376H13.5756V16.2205H13.4585V16.3376ZM8.66639 16.3376V16.2205H8.54925V16.3376H8.66639ZM13.4585 21.1297V21.2468H13.5756V21.1297H13.4585ZM8.66639 21.1297H8.54925V21.2468H8.66639V21.1297ZM1 16.3624V16.2452H0.88286V16.3624H1ZM1.94345 20.211L1.86062 20.2938L1.94345 20.211ZM5.79207 21.1544V21.2716H5.90921V21.1544H5.79207ZM5.79207 16.3624H5.90921V16.2452H5.79207V16.3624ZM59.7241 7.03591V7.15313L59.7285 7.15296L59.7241 7.03591ZM62.0962 7.6255L62.0374 7.72686L62.0962 7.6255ZM63.8373 17.5913V17.4742H63.7577L63.7284 17.5482L63.8373 17.5913ZM63.8868 17.5913L64.0031 17.6053L64.0189 17.4742H63.8868V17.5913ZM63.8373 18.4834H63.9544L63.9544 18.4823L63.8373 18.4834ZM63.8373 19.7966H63.7201V19.9137H63.8373V19.7966ZM65.4726 19.7966V19.9137H65.5898V19.7966H65.4726ZM65.4726 2.37764H65.5898V2.2605H65.4726V2.37764ZM63.7877 2.37764V2.2605H63.6706V2.37764H63.7877ZM63.7877 8.44825H63.6706V8.44827L63.7877 8.44825ZM63.8373 9.38982V9.50696H63.9674L63.9538 9.37754L63.8373 9.38982ZM63.7877 9.38982L63.684 9.44422L63.7169 9.50696H63.7877V9.38982ZM33.3354 2.37769H33.4525V2.26055H33.3354V2.37769ZM31.6257 2.37769V2.26055H31.5086V2.37769H31.6257ZM33.3354 18.2604H33.2182V18.3775H33.3354V18.2604ZM41.413 18.2604H41.5302V18.1433H41.413V18.2604ZM41.413 19.7966V19.9138H41.5302V19.7966H41.413ZM31.6257 19.7966H31.5086V19.9138H31.6257V19.7966ZM52.6624 13.6517V13.7688H52.7698L52.7791 13.6618L52.6624 13.6517ZM43.1229 13.6517V13.5345H43.003L43.0058 13.6544L43.1229 13.6517ZM47.9546 18.5825V18.6997L47.9563 18.6996L47.9546 18.5825ZM51.7456 17.0958L51.8463 17.0359L51.7733 16.9133L51.6673 17.0088L51.7456 17.0958ZM52.489 18.3446L52.5655 18.4333L52.6399 18.3691L52.5896 18.2847L52.489 18.3446ZM47.8802 20.0791L47.8793 19.9619L47.8761 19.962L47.8802 20.0791ZM45.3545 19.6463L45.3973 19.5373L45.3545 19.6463ZM43.2101 18.2433L43.1274 18.3262L43.2101 18.2433ZM41.3636 13.5773L41.4808 13.5812V13.5773H41.3636ZM51.0023 12.2641V12.3812H51.124L51.1193 12.2596L51.0023 12.2641ZM43.1724 12.2641L43.0567 12.2458L43.0353 12.3812H43.1724V12.2641ZM72.1132 23.4886L72.1102 23.6057H72.1132V23.4886ZM76.4742 18.4338L76.357 18.4334V18.4338H76.4742ZM76.5237 17.5418L76.6402 17.5544L76.6542 17.4247H76.5237V17.5418ZM76.4742 17.5418V17.4247H76.404L76.3709 17.4865L76.4742 17.5418ZM76.4742 9.1173L76.3643 9.15786L76.3925 9.23444H76.4742V9.1173ZM76.5237 9.1173V9.23444H76.6499L76.6405 9.10862L76.5237 9.1173ZM76.5237 8.69607L76.6409 8.70477V8.69607H76.5237ZM76.5237 7.33328V7.21614H76.4066V7.33328H76.5237ZM78.1591 7.33328H78.2762V7.21614H78.1591V7.33328ZM72.2123 25L72.2117 25.1172H72.2123V25ZM68.124 24.0089L68.0177 23.9596L67.9701 24.0621L68.0709 24.1133L68.124 24.0089ZM68.7682 22.6213L68.8224 22.5175L68.7136 22.4607L68.662 22.572L68.7682 22.6213ZM79.6209 13.5625L79.7381 13.5666V13.5625H79.6209ZM80.0549 16.0919L79.9459 16.1348V16.1348L80.0549 16.0919ZM81.4618 18.2382L81.5446 18.1554L81.4618 18.2382ZM83.6081 19.6451L83.5652 19.7541V19.7541L83.6081 19.6451ZM86.1375 20.0791L86.1366 19.9619L86.1334 19.962L86.1375 20.0791ZM90.7463 18.3446L90.8228 18.4333L90.8983 18.3682L90.846 18.2833L90.7463 18.3446ZM89.9781 17.0958L90.0779 17.0345L90.0043 16.9147L89.8998 17.0088L89.9781 17.0958ZM86.1871 18.5825V18.6997L86.1888 18.6996L86.1871 18.5825ZM81.3554 13.6517V13.5345H81.2355L81.2383 13.6544L81.3554 13.6517ZM90.9197 13.6517V13.7688H91.0271L91.0364 13.6618L90.9197 13.6517ZM89.2348 12.2641V12.3812H89.3565L89.3519 12.2596L89.2348 12.2641ZM81.4049 12.2641L81.2892 12.2458L81.2678 12.3812H81.4049V12.2641ZM94.1161 7.33322H94.2332V7.21608H94.1161V7.33322ZM92.456 7.33322V7.21608H92.3388V7.33322H92.456ZM94.0666 10.5296L93.9501 10.5167L93.9357 10.6467H94.0666V10.5296ZM94.1161 10.5296V10.6467H94.202L94.2278 10.5649L94.1161 10.5296ZM98.0558 7.20933L98.0571 7.09219H98.0558V7.20933ZM98.7248 7.28367H98.842V7.18893L98.7493 7.16912L98.7248 7.28367ZM98.7248 8.92893L98.707 9.04471L98.842 9.06548V8.92893H98.7248ZM98.1054 8.87937L98.1062 8.76223H98.1054V8.87937ZM94.4878 12.1005L94.6 12.1342L94.6001 12.1339L94.4878 12.1005ZM94.1409 14.5288H94.258L94.258 14.5278L94.1409 14.5288ZM94.1409 19.7817V19.8988H94.258V19.7817H94.1409ZM92.456 19.7817H92.3388V19.8988H92.456V19.7817ZM4.22114 1.11714H5.79207V0.88286H4.22114V1.11714ZM2.02628 2.02628C2.6084 1.44417 3.39791 1.11714 4.22114 1.11714V0.88286C3.33578 0.88286 2.48667 1.23457 1.86062 1.86062L2.02628 2.02628ZM1.11714 4.22114C1.11714 3.39791 1.44417 2.6084 2.02628 2.02628L1.86062 1.86062C1.23457 2.48667 0.88286 3.33578 0.88286 4.22114H1.11714ZM1.11714 5.79207V4.22114H0.88286V5.79207H1.11714ZM5.79207 5.67493H1V5.90921H5.79207V5.67493ZM5.67493 1V5.79207H5.90921V1H5.67493ZM8.66639 1.11714H17.9086V0.88286H8.66639V1.11714ZM8.78353 13.4584V1H8.54925V13.4584H8.78353ZM21.1297 13.3413H8.66639V13.5755H21.1297V13.3413ZM21.0126 4.22114V13.4584H21.2469V4.22114H21.0126ZM20.1035 2.02628C20.6856 2.6084 21.0126 3.39791 21.0126 4.22114H21.2469C21.2469 3.33578 20.8952 2.48667 20.2691 1.86062L20.1035 2.02628ZM17.9086 1.11714C18.7318 1.11714 19.5213 1.44417 20.1035 2.02628L20.2691 1.86062C19.6431 1.23457 18.794 0.88286 17.9086 0.88286V1.11714ZM5.79207 8.54917H1V8.78345H5.79207V8.54917ZM5.90921 13.4584V8.66631H5.67493V13.4584H5.90921ZM1 13.5755H5.79207V13.3412H1V13.5755ZM0.88286 8.66631V13.4584H1.11714V8.66631H0.88286ZM17.9335 21.0125H16.3625V21.2468H17.9335V21.0125ZM20.1283 20.1034C19.5462 20.6855 18.7567 21.0125 17.9335 21.0125V21.2468C18.8188 21.2468 19.6679 20.8951 20.294 20.269L20.1283 20.1034ZM21.0375 17.9085C21.0375 18.7317 20.7104 19.5213 20.1283 20.1034L20.294 20.269C20.92 19.643 21.2717 18.7939 21.2717 17.9085H21.0375ZM21.0375 16.3624V17.9085H21.2717V16.3624H21.0375ZM16.3625 16.4795H21.1546V16.2452H16.3625V16.4795ZM16.4797 21.1297V16.3624H16.2454V21.1297H16.4797ZM13.4585 16.2205H8.66639V16.4547H13.4585V16.2205ZM13.5756 21.1297V16.3376H13.3413V21.1297H13.5756ZM8.66639 21.2468H13.4585V21.0125H8.66639V21.2468ZM8.54925 16.3376V21.1297H8.78353V16.3376H8.54925ZM1.11714 17.9333V16.3624H0.88286V17.9333H1.11714ZM2.02628 20.1282C1.44417 19.546 1.11714 18.7565 1.11714 17.9333H0.88286C0.88286 18.8187 1.23457 19.6678 1.86062 20.2938L2.02628 20.1282ZM4.22114 21.0373C3.39791 21.0373 2.6084 20.7103 2.02628 20.1282L1.86062 20.2938C2.48667 20.9199 3.33578 21.2716 4.22114 21.2716V21.0373ZM5.79207 21.0373H4.22114V21.2716H5.79207V21.0373ZM5.67493 16.3624V21.1544H5.90921V16.3624H5.67493ZM1 16.4795H5.79207V16.2452H1V16.4795ZM59.7285 7.15296C60.5369 7.1224 61.3374 7.32137 62.0374 7.72686L62.1549 7.52413C61.4166 7.09647 60.5723 6.88661 59.7197 6.91885L59.7285 7.15296ZM54.2167 13.5525C54.2167 11.6433 54.7978 10.0429 55.7737 8.9216C56.7486 7.80134 58.1225 7.15305 59.7241 7.15305V6.91877C58.0551 6.91877 56.6166 7.5961 55.5969 8.7678C54.5782 9.93845 53.9824 11.5963 53.9824 13.5525H54.2167ZM59.5507 19.9768C57.9122 19.9768 56.5831 19.3227 55.6613 18.1985C54.7377 17.0719 54.2167 15.4649 54.2167 13.5525H53.9824C53.9824 15.5055 54.5144 17.1692 55.4801 18.347C56.4477 19.5271 57.8441 20.2111 59.5507 20.2111V19.9768ZM63.8373 17.5913C63.7284 17.5482 63.7284 17.5482 63.7284 17.5481C63.7284 17.5481 63.7284 17.5481 63.7284 17.5481C63.7284 17.5481 63.7284 17.5481 63.7284 17.5482C63.7283 17.5483 63.7282 17.5486 63.728 17.5491C63.7277 17.5499 63.7271 17.5514 63.7262 17.5534C63.7245 17.5575 63.7218 17.5638 63.7181 17.5723C63.7107 17.5892 63.6991 17.6146 63.6831 17.6473C63.651 17.7127 63.6012 17.8072 63.5312 17.921C63.391 18.1487 63.1703 18.4531 62.8492 18.7576C62.2088 19.365 61.1652 19.9768 59.5507 19.9768V20.2111C61.2316 20.2111 62.3314 19.5716 63.0104 18.9276C63.349 18.6065 63.582 18.2853 63.7307 18.0438C63.805 17.923 63.8584 17.8219 63.8934 17.7504C63.911 17.7147 63.9239 17.6864 63.9326 17.6666C63.9369 17.6568 63.9402 17.649 63.9424 17.6436C63.9436 17.6409 63.9444 17.6388 63.9451 17.6373C63.9454 17.6365 63.9456 17.6359 63.9458 17.6354C63.9459 17.6352 63.946 17.635 63.946 17.6348C63.9461 17.6348 63.9461 17.6347 63.9461 17.6346C63.9462 17.6346 63.9462 17.6345 63.8373 17.5913ZM63.8868 17.4742H63.8373V17.7085H63.8868V17.4742ZM63.9544 18.4823C63.9519 18.1893 63.9682 17.8963 64.0031 17.6053L63.7705 17.5774C63.7344 17.8783 63.7175 18.1813 63.7201 18.4844L63.9544 18.4823ZM63.9544 19.7966V18.4834H63.7201V19.7966H63.9544ZM65.4726 19.6795H63.8373V19.9137H65.4726V19.6795ZM65.3555 2.37764V19.7966H65.5898V2.37764H65.3555ZM63.7877 2.49478H65.4726V2.2605H63.7877V2.49478ZM63.9049 8.44825V2.37764H63.6706V8.44825H63.9049ZM63.9538 9.37754C63.9212 9.06884 63.9049 8.75865 63.9049 8.44824L63.6706 8.44827C63.6706 8.76687 63.6874 9.08526 63.7208 9.4021L63.9538 9.37754ZM63.7877 9.50696H63.8373V9.27268H63.7877V9.50696ZM62.0374 7.72686C62.7374 8.13235 63.3083 8.72777 63.684 9.44422L63.8915 9.33542C63.4953 8.57979 62.8932 7.9518 62.1549 7.52413L62.0374 7.72686ZM59.7985 18.6996C60.8675 18.6996 61.91 18.3173 62.6846 17.4755C63.4588 16.6341 63.9544 15.3455 63.9544 13.5525H63.7201C63.7201 15.3028 63.237 16.5292 62.5122 17.3169C61.7877 18.1043 60.8108 18.4653 59.7985 18.4653V18.6996ZM55.7416 13.5525C55.7416 15.1452 56.1555 16.431 56.8733 17.3211C57.5929 18.2134 58.6116 18.6996 59.7985 18.6996V18.4653C58.6809 18.4653 57.7298 18.01 57.0557 17.174C56.3797 16.3359 55.9759 15.1066 55.9759 13.5525H55.7416ZM59.8728 8.43023C58.7354 8.43023 57.6993 8.91023 56.9495 9.79411C56.2003 10.6771 55.7416 11.957 55.7416 13.5525H55.9759C55.9759 12.0013 56.4216 10.7785 57.1281 9.94567C57.834 9.11368 58.805 8.66451 59.8728 8.66451V8.43023ZM63.9544 13.5525C63.9544 12.271 63.6281 10.9945 62.9544 10.0349C62.278 9.07135 61.2526 8.43023 59.8728 8.43023V8.66451C61.169 8.66451 62.1258 9.26228 62.7627 10.1695C63.4022 11.0806 63.7201 12.3067 63.7201 13.5525H63.9544ZM33.3354 2.26055H31.6257V2.49483H33.3354V2.26055ZM33.4525 18.2604V2.37769H33.2182V18.2604H33.4525ZM41.413 18.1433H33.3354V18.3775H41.413V18.1433ZM41.5302 19.7966V18.2604H41.2959V19.7966H41.5302ZM31.6257 19.9138H41.413V19.6795H31.6257V19.9138ZM31.5086 2.37769V19.7966H31.7428V2.37769H31.5086ZM52.8291 12.7844C52.8291 11.2153 52.3898 9.74973 51.5014 8.67413C50.6107 7.59565 49.2759 6.9188 47.5086 6.9188V7.15308C49.2102 7.15308 50.4771 7.80186 51.3208 8.82332C52.1669 9.84766 52.5948 11.2564 52.5948 12.7844H52.8291ZM52.6624 13.6517C52.7791 13.6618 52.7791 13.6618 52.7791 13.6618C52.7791 13.6618 52.7791 13.6618 52.7791 13.6618C52.7791 13.6618 52.7791 13.6617 52.7791 13.6617C52.7791 13.6616 52.7791 13.6615 52.7791 13.6614C52.7792 13.6611 52.7792 13.6607 52.7793 13.6601C52.7794 13.659 52.7795 13.6573 52.7797 13.6552C52.78 13.6509 52.7806 13.6445 52.7813 13.6364C52.7826 13.6201 52.7846 13.5965 52.7869 13.5673C52.7916 13.5089 52.7978 13.428 52.804 13.3376C52.8164 13.158 52.8291 12.9376 52.8291 12.7844H52.5948C52.5948 12.9287 52.5827 13.1419 52.5703 13.3215C52.5642 13.4108 52.558 13.4909 52.5534 13.5486C52.5511 13.5775 52.5491 13.6008 52.5478 13.6168C52.5471 13.6248 52.5466 13.631 52.5462 13.6352C52.5461 13.6373 52.5459 13.6389 52.5458 13.64C52.5458 13.6405 52.5458 13.6409 52.5457 13.6412C52.5457 13.6413 52.5457 13.6414 52.5457 13.6414C52.5457 13.6415 52.5457 13.6415 52.5457 13.6415C52.5457 13.6415 52.5457 13.6415 52.5457 13.6415C52.5457 13.6415 52.5457 13.6415 52.6624 13.6517ZM43.1229 13.7688H52.6624V13.5345H43.1229V13.7688ZM47.9546 18.4654C46.6924 18.4654 45.5331 18.0408 44.681 17.2308C43.8296 16.4216 43.2765 15.2198 43.24 13.649L43.0058 13.6544C43.0436 15.2799 43.6178 16.5435 44.5196 17.4006C45.4204 18.257 46.6399 18.6996 47.9546 18.6996V18.4654ZM51.6673 17.0088C50.6462 17.9278 49.3265 18.4453 47.9529 18.4654L47.9563 18.6996C49.3866 18.6788 50.7608 18.1399 51.824 17.1829L51.6673 17.0088ZM52.5896 18.2847L51.8463 17.0359L51.645 17.1557L52.3883 18.4046L52.5896 18.2847ZM47.8812 20.1962C49.6022 20.1826 51.2625 19.5578 52.5655 18.4333L52.4124 18.256C51.1515 19.3441 49.5448 19.9487 47.8793 19.962L47.8812 20.1962ZM45.3116 19.7554C46.1299 20.077 47.0056 20.2271 47.8844 20.1962L47.8761 19.962C47.0295 19.9918 46.1858 19.8473 45.3973 19.5373L45.3116 19.7554ZM43.1274 18.3262C43.7498 18.9472 44.4933 19.4337 45.3116 19.7554L45.3973 19.5373C44.6089 19.2274 43.8926 18.7587 43.2929 18.1603L43.1274 18.3262ZM41.6932 16.1452C42.0168 16.9628 42.5049 17.7052 43.1274 18.3262L43.2929 18.1603C42.6931 17.562 42.2228 16.8467 41.9111 16.059L41.6932 16.1452ZM41.2465 13.5735C41.2176 14.4523 41.3697 15.3277 41.6932 16.1452L41.9111 16.059C41.5993 15.2713 41.4528 14.4279 41.4807 13.5812L41.2465 13.5735ZM47.5086 6.9188C45.7948 6.9188 44.2279 7.54288 43.0892 8.69102C41.9502 9.83959 41.2465 11.5057 41.2465 13.5773H41.4808C41.4808 11.5606 42.1646 9.95602 43.2556 8.85599C44.347 7.75552 45.8525 7.15308 47.5086 7.15308V6.9188ZM47.459 8.56543C48.3625 8.56543 49.1925 8.86021 49.8083 9.4642C50.4239 10.0679 50.8366 10.9912 50.8852 12.2686L51.1193 12.2596C51.0689 10.9353 50.6391 9.95072 49.9724 9.29693C49.306 8.64344 48.4138 8.33115 47.459 8.33115V8.56543ZM43.2881 12.2824C43.6753 9.83824 45.4338 8.56543 47.459 8.56543V8.33115C45.3216 8.33115 43.4624 9.68481 43.0567 12.2458L43.2881 12.2824ZM51.0023 12.147H43.1724V12.3812H51.0023V12.147ZM76.357 19.5736C76.357 20.9314 75.8858 21.8742 75.131 22.4804C74.372 23.09 73.3112 23.3714 72.1132 23.3714V23.6057C73.3436 23.6057 74.4632 23.3172 75.2777 22.6631C76.0962 22.0057 76.5913 20.991 76.5913 19.5736H76.357ZM76.357 18.4338V19.5736H76.5913V18.4338H76.357ZM76.4073 17.5293C76.3749 17.8296 76.3581 18.1314 76.357 18.4334L76.5913 18.4343C76.5924 18.1403 76.6087 17.8466 76.6402 17.5544L76.4073 17.5293ZM76.4742 17.659H76.5237V17.4247H76.4742V17.659ZM72.5097 19.8394C73.5043 19.8394 74.3305 19.6379 75.0051 19.2542C75.6803 18.8703 76.1967 18.3078 76.5774 17.5971L76.3709 17.4865C76.0083 18.1634 75.5212 18.6912 74.8893 19.0506C74.2569 19.4102 73.4725 19.6052 72.5097 19.6052V19.8394ZM66.8423 13.3296C66.8423 15.2228 67.4003 16.8497 68.3912 18.0052C69.3835 19.1624 70.8039 19.8394 72.5097 19.8394V19.6052C70.8704 19.6052 69.5157 18.9566 68.5691 17.8527C67.6211 16.7473 67.0766 15.1779 67.0766 13.3296H66.8423ZM72.361 6.9188C70.6563 6.9188 69.2722 7.57036 68.3163 8.70419C67.3621 9.83589 66.8423 11.4383 66.8423 13.3296H67.0766C67.0766 11.4794 67.585 9.93495 68.4954 8.85521C69.404 7.7776 70.7207 7.15308 72.361 7.15308V6.9188ZM76.4742 9.1173C76.5841 9.07674 76.584 9.07666 76.584 9.07657C76.584 9.07652 76.584 9.07642 76.5839 9.07634C76.5839 9.07618 76.5838 9.07598 76.5837 9.07575C76.5835 9.0753 76.5833 9.07471 76.583 9.07401C76.5825 9.07259 76.5818 9.07069 76.5808 9.0683C76.5789 9.06352 76.5762 9.05682 76.5726 9.04832C76.5655 9.03134 76.5548 9.00717 76.5401 8.97685C76.5107 8.91621 76.4655 8.83089 76.4007 8.72916C76.2711 8.52569 76.0632 8.25627 75.748 7.98749C75.1157 7.44825 74.0601 6.9188 72.361 6.9188V7.15308C74.007 7.15308 75.008 7.66432 75.596 8.16575C75.891 8.41731 76.0841 8.66823 76.2031 8.85501C76.2626 8.94841 76.3035 9.02569 76.3292 9.07888C76.3421 9.10547 76.3511 9.12602 76.3568 9.13952C76.3597 9.14627 76.3617 9.15126 76.3629 9.15436C76.3635 9.15591 76.3639 9.15698 76.3642 9.15757C76.3643 9.15787 76.3643 9.15804 76.3644 9.15809C76.3644 9.15811 76.3644 9.1581 76.3644 9.15806C76.3643 9.15804 76.3643 9.15799 76.3643 9.15798C76.3643 9.15792 76.3643 9.15786 76.4742 9.1173ZM76.5237 9.00016H76.4742V9.23444H76.5237V9.00016ZM76.4069 8.6874C76.3961 8.83339 76.3961 8.97998 76.4069 9.12597L76.6405 9.10862C76.6306 8.97418 76.6306 8.83919 76.6405 8.70475L76.4069 8.6874ZM76.4066 7.33328V8.69607H76.6409V7.33328H76.4066ZM78.1591 7.21614H76.5237V7.45042H78.1591V7.21614ZM78.2762 19.4993V7.33328H78.0419V19.4993H78.2762ZM72.2123 25.1172C73.7416 25.1172 75.2567 24.7288 76.3921 23.8281C77.5317 22.9241 78.2762 21.5137 78.2762 19.4993H78.0419C78.0419 21.4494 77.3246 22.7893 76.2465 23.6446C75.1643 24.5031 73.706 24.8829 72.2123 24.8829V25.1172ZM68.0709 24.1133C69.3543 24.7656 70.7721 25.1093 72.2117 25.1172L72.213 24.8829C70.8099 24.8752 69.4279 24.5402 68.1771 23.9045L68.0709 24.1133ZM68.662 22.572L68.0177 23.9596L68.2302 24.0582L68.8745 22.6707L68.662 22.572ZM72.1163 23.3715C70.9676 23.3417 69.8409 23.0496 68.8224 22.5175L68.714 22.7252C69.7641 23.2738 70.9258 23.575 72.1102 23.6057L72.1163 23.3715ZM72.5592 8.68932C73.6434 8.68932 74.5924 8.96322 75.2718 9.66638C75.952 10.3704 76.3818 11.525 76.3818 13.3296H76.6161C76.6161 11.4918 76.1786 10.2677 75.4403 9.50359C74.7012 8.73864 73.6804 8.45504 72.5592 8.45504V8.68932ZM68.8358 13.3048C68.8358 11.8349 69.185 10.6812 69.8194 9.89716C70.4511 9.11652 71.3759 8.68932 72.5592 8.68932V8.45504C71.3143 8.45504 70.3189 8.90746 69.6373 9.74979C68.9584 10.5887 68.6015 11.8013 68.6015 13.3048H68.8358ZM72.807 18.0937C71.6011 18.0937 70.6126 17.6246 69.9236 16.7978C69.2329 15.969 68.8358 14.7712 68.8358 13.3048H68.6015C68.6015 14.8117 69.0097 16.067 69.7437 16.9478C70.4794 17.8307 71.5352 18.328 72.807 18.328V18.0937ZM76.3818 13.3296C76.3818 15.1464 75.9521 16.3345 75.2995 17.0675C74.6488 17.7985 73.7612 18.0937 72.807 18.0937V18.328C73.8103 18.328 74.7687 18.0161 75.4745 17.2233C76.1786 16.4324 76.6161 15.1799 76.6161 13.3296H76.3818ZM85.7659 7.15308C87.4549 7.15308 88.722 7.80172 89.5689 8.82348C90.4182 9.848 90.8521 11.2567 90.8521 12.7844H91.0864C91.0864 11.2149 90.6407 9.74939 89.7493 8.67397C88.8556 7.59579 87.521 6.9188 85.7659 6.9188V7.15308ZM79.7381 13.5625C79.7381 11.5533 80.4219 9.95242 81.5128 8.8542C82.6042 7.75553 84.1098 7.15308 85.7659 7.15308V6.9188C84.0521 6.9188 82.4852 7.54287 81.3466 8.68909C80.2075 9.83576 79.5038 11.4982 79.5038 13.5625H79.7381ZM80.1639 16.049C79.8531 15.2595 79.7081 14.4145 79.738 13.5666L79.5038 13.5584C79.4728 14.4384 79.6233 15.3154 79.9459 16.1348L80.1639 16.049ZM81.5446 18.1554C80.9447 17.5554 80.4747 16.8384 80.1639 16.049L79.9459 16.1348C80.2685 16.9542 80.7563 17.6984 81.379 18.321L81.5446 18.1554ZM83.6511 19.5361C82.8616 19.2253 82.1446 18.7553 81.5446 18.1554L81.379 18.321C82.0017 18.9437 82.7458 19.4315 83.5652 19.7541L83.6511 19.5361ZM86.1334 19.962C85.2855 19.9919 84.4405 19.847 83.6511 19.5361L83.5652 19.7541C84.3846 20.0767 85.2616 20.2272 86.1417 20.1962L86.1334 19.962ZM90.6697 18.256C89.4088 19.3441 87.8021 19.9487 86.1366 19.962L86.1385 20.1962C87.8595 20.1826 89.5198 19.5578 90.8228 18.4333L90.6697 18.256ZM89.8784 17.1572L90.6465 18.406L90.846 18.2833L90.0779 17.0345L89.8784 17.1572ZM86.1888 18.6996C87.6191 18.6788 88.9933 18.1399 90.0565 17.1829L89.8998 17.0088C88.8787 17.9278 87.559 18.4453 86.1854 18.4654L86.1888 18.6996ZM81.2383 13.6544C81.2761 15.2799 81.8503 16.5435 82.7521 17.4006C83.653 18.257 84.8724 18.6996 86.1871 18.6996V18.4654C84.9249 18.4654 83.7656 18.0408 82.9135 17.2308C82.0622 16.4216 81.509 15.2198 81.4725 13.649L81.2383 13.6544ZM90.9197 13.5345H81.3554V13.7688H90.9197V13.5345ZM90.8521 12.7844C90.8521 12.9287 90.84 13.1419 90.8276 13.3215C90.8215 13.4108 90.8153 13.4909 90.8107 13.5486C90.8084 13.5775 90.8064 13.6008 90.8051 13.6168C90.8044 13.6248 90.8039 13.631 90.8035 13.6352C90.8034 13.6373 90.8032 13.6389 90.8031 13.64C90.8031 13.6405 90.8031 13.6409 90.803 13.6412C90.803 13.6413 90.803 13.6414 90.803 13.6414C90.803 13.6415 90.803 13.6415 90.803 13.6415C90.803 13.6415 90.803 13.6415 90.803 13.6415C90.803 13.6415 90.803 13.6415 90.9197 13.6517C91.0364 13.6618 91.0364 13.6618 91.0364 13.6618C91.0364 13.6618 91.0364 13.6618 91.0364 13.6618C91.0364 13.6618 91.0364 13.6617 91.0364 13.6617C91.0364 13.6616 91.0364 13.6615 91.0364 13.6614C91.0365 13.6611 91.0365 13.6607 91.0366 13.6601C91.0366 13.659 91.0368 13.6573 91.037 13.6552C91.0373 13.6509 91.0379 13.6445 91.0386 13.6364C91.0399 13.6201 91.0419 13.5965 91.0442 13.5673C91.0489 13.5089 91.0551 13.428 91.0613 13.3376C91.0737 13.158 91.0864 12.9376 91.0864 12.7844H90.8521ZM89.3519 12.2596C89.3014 10.9353 88.8716 9.95072 88.2049 9.29693C87.5385 8.64344 86.6464 8.33115 85.6915 8.33115V8.56543C86.5951 8.56543 87.425 8.86021 88.0409 9.4642C88.6564 10.0679 89.0691 10.9912 89.1177 12.2686L89.3519 12.2596ZM81.4049 12.3812H89.2348V12.147H81.4049V12.3812ZM85.6915 8.33115C83.5541 8.33115 81.6949 9.68481 81.2892 12.2458L81.5206 12.2824C81.9078 9.83824 83.6663 8.56543 85.6915 8.56543V8.33115ZM94.1161 7.21608H92.456V7.45036H94.1161V7.21608ZM94.2332 9.53847V7.33322H93.999V9.53847H94.2332ZM94.0666 10.5296C94.183 10.5425 94.183 10.5425 94.183 10.5425C94.183 10.5425 94.183 10.5425 94.183 10.5425C94.183 10.5424 94.183 10.5424 94.183 10.5424C94.183 10.5423 94.183 10.5422 94.183 10.5421C94.1831 10.5418 94.1831 10.5415 94.1832 10.541C94.1833 10.54 94.1834 10.5387 94.1836 10.5369C94.184 10.5333 94.1845 10.5281 94.1852 10.5213C94.1866 10.5076 94.1886 10.4877 94.1909 10.4621C94.1957 10.411 94.2019 10.3373 94.2082 10.2465C94.2207 10.065 94.2332 9.81441 94.2332 9.53847H93.999C93.999 9.80764 93.9867 10.0526 93.9745 10.2304C93.9683 10.3192 93.9622 10.3911 93.9577 10.4406C93.9554 10.4654 93.9535 10.4846 93.9522 10.4975C93.9515 10.5039 93.951 10.5088 93.9506 10.512C93.9505 10.5136 93.9503 10.5148 93.9502 10.5156C93.9502 10.516 93.9502 10.5163 93.9502 10.5165C93.9501 10.5165 93.9501 10.5166 93.9501 10.5166C93.9501 10.5167 93.9501 10.5167 93.9501 10.5167C93.9501 10.5167 93.9501 10.5167 93.9501 10.5167C93.9501 10.5167 93.9501 10.5167 94.0666 10.5296ZM94.1161 10.4124H94.0666V10.6467H94.1161V10.4124ZM98.0558 7.09219C96.0298 7.09219 94.6085 8.58141 94.0044 10.4943L94.2278 10.5649C94.8131 8.71151 96.1669 7.32647 98.0558 7.32647V7.09219ZM98.7493 7.16912C98.5217 7.12044 98.2898 7.09467 98.0571 7.0922L98.0546 7.32647C98.2717 7.32877 98.488 7.35281 98.7003 7.39822L98.7493 7.16912ZM98.842 8.92893V7.28367H98.6077V8.92893H98.842ZM98.1046 8.99651C98.3063 8.99791 98.5076 9.01402 98.707 9.04471L98.7426 8.81315C98.532 8.78073 98.3193 8.76372 98.1062 8.76224L98.1046 8.99651ZM94.6001 12.1339C95.137 10.3278 96.4179 8.99651 98.1054 8.99651V8.76223C96.2744 8.76223 94.9288 10.206 94.3755 12.0671L94.6001 12.1339ZM94.258 14.5278C94.2517 13.7174 94.3669 12.9105 94.6 12.1342L94.3756 12.0668C94.1358 12.8656 94.0172 13.6958 94.0238 14.5297L94.258 14.5278ZM94.258 19.7817V14.5288H94.0237V19.7817H94.258ZM92.456 19.8988H94.1409V19.6646H92.456V19.8988ZM92.3388 7.33322V19.7817H92.5731V7.33322H92.3388Z"
        fill="currentColor"
      />
    </svg>
  );
}

const OnboardingLogoContainer = styled.div`
  position: absolute;
  top: 40px;
  left: 40px;
  z-index: 1;
  display: flex;
  color: ${p => p.theme.colors.palette.text.shade100};
`;

const OnboardingContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  position: relative;
`;

const onboardingMachine = Machine({
  id: "onboarding",
  initial: "welcome",
  states: {
    welcome: {
      on: {
        NEXT: {
          actions: () => track("Onboarding - Start"),
          target: "selectDevice",
        },
        PREV: { target: "onboardingComplete" },
      },
    },
    selectDevice: {
      on: {
        DEVICE_SELECTED: {
          target: "selectUseCase",
          cond: (_, { deviceId }) => !!deviceId,
          actions: [
            assign((_, { deviceId }) => ({
              deviceId,
            })),
            (_, { deviceId }) => track("Onboarding Device - Selection", { deviceId }),
          ],
        },
        PREV: {
          target: "welcome",
        },
      },
    },
    selectUseCase: {
      invoke: {
        id: "modal",
        src: pedagogyMachine,
      },
      on: {
        OPEN_PEDAGOGY_MODAL: {
          actions: [
            assign({
              pedagogy: true,
            }),
            () => track("Onboarding - Setup new"),
          ],
        },
        CLOSE_PEDAGOGY_MODAL: {
          actions: assign({
            pedagogy: false,
          }),
        },
        USE_RECOVERY_PHRASE: {
          target: "useRecoveryPhrase",
          actions: () => track("Onboarding - Restore"),
        },
        SETUP_NEW_DEVICE: {
          target: "setupNewDevice",
          actions: assign({
            pedagogy: false,
          }),
        },
        CONNECT_SETUP_DEVICE: {
          target: "connectSetupDevice",
          actions: () => track("Onboarding - Connect"),
        },
        PREV: {
          target: "selectDevice",
        },
      },
    },
    setupNewDevice: {
      on: {
        PREV: {
          target: "selectUseCase",
        },
        NEXT: {
          target: "onboardingComplete",
          actions: () => track("Onboarding - End"),
        },
      },
    },
    connectSetupDevice: {
      on: {
        PREV: {
          target: "selectUseCase",
        },
        NEXT: {
          target: "onboardingComplete",
          actions: () => track("Onboarding - End"),
        },
      },
    },
    useRecoveryPhrase: {
      on: {
        PREV: {
          target: "selectUseCase",
        },
        NEXT: {
          target: "onboardingComplete",
          actions: () => track("Onboarding - End"),
        },
      },
    },
    onboardingComplete: {
      entry: "onboardingCompleted",
      type: "final",
    },
  },
});

const screens = {
  welcome: Welcome,
  selectDevice: SelectDevice,
  selectUseCase: SelectUseCase,
  setupNewDevice: SetupNewDevice,
  connectSetupDevice: ConnectSetUpDevice,
  useRecoveryPhrase: UseRecoveryPhrase,
};

const DURATION = 200;

const ScreenContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;

  &.page-switch-appear {
    opacity: 0;
  }

  &.page-switch-appear-active {
    opacity: 1;
    transition: opacity ${DURATION}ms ease-in;
  }
`;

export function Onboarding({ onboardingRelaunched }: { onboardingRelaunched: boolean }) {
  const dispatch = useDispatch();
  const [imgsLoaded, setImgsLoaded] = useState(false);

  const [state, sendEvent, service] = useMachine(onboardingMachine, {
    actions: {
      onboardingCompleted: () => {
        dispatch(saveSettings({ hasCompletedOnboarding: true }));
        dispatch(relaunchOnboarding(false));
      },
    },
  });

  useEffect(() => {
    const subscription = service.subscribe(state => {
      if (state.changed) {
        console.log("SERVICE: ", state.toStrings(), state);
      }
    });

    return subscription.unsubscribe;
  }, [service]);

  useEffect(() => {
    preloadAssets().then(() => setImgsLoaded(true));
  }, []);

  const CurrentScreen = screens[state.value];

  return (
    <React.Fragment>
      <OnboardingLogoContainer>
        <LedgerLogo />
      </OnboardingLogoContainer>
      <Modal
        isOpen={state.context.pedagogy}
        onRequestClose={() => sendEvent("CLOSE_PEDAGOGY_MODAL")}
      >
        <Pedagogy onDone={() => sendEvent("SETUP_NEW_DEVICE")} />
      </Modal>
      <OnboardingContainer className={imgsLoaded ? "onboarding-imgs-loaded" : ""}>
        <CSSTransition in appear key={state.value} timeout={DURATION} classNames="page-switch">
          <ScreenContainer>
            <CurrentScreen
              sendEvent={sendEvent}
              context={state.context}
              onboardingRelaunched={onboardingRelaunched}
            />
          </ScreenContainer>
        </CSSTransition>
      </OnboardingContainer>
    </React.Fragment>
  );
}
