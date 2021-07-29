// @flow
/* eslint-disable react/no-unused-prop-types */

import React, { useRef, useLayoutEffect, useState, useMemo } from "react";
import { Chart, registerables } from "chart.js";
import styled from "styled-components";
import Color from "color";
import moment from "moment";
import "chartjs-adapter-moment";

import useTheme from "~/renderer/hooks/useTheme";
import Tooltip from "./Tooltip";

import type { Data } from "./types";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

Chart.register(...registerables);
export type Props = {
  data: Data,
  magnitude: number,
  height?: number,
  tickXScale: string,
  color?: string,
  hideAxis?: boolean,
  renderTooltip?: Function,
  renderTickY: (t: number) => string | number,
  valueKey?: string,
};

const ChartContainer: ThemedComponent<{}> = styled.div.attrs(({ height }) => ({
  style: {
    height,
  },
}))`
  position: relative;
`;

export default function ChartWrapper({
  magnitude,
  height,
  data,
  color,
  tickXScale,
  renderTickY,
  renderTooltip,
  valueKey = "value",
}: Props) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const theme = useTheme("colors.palette");
  const [tooltip, setTooltip] = useState();
  const valueKeyRef = useRef(valueKey);

  const generatedData = useMemo(
    () => ({
      datasets: [
        {
          label: "all accounts",
          borderColor: color,
          backgroundColor: ({ chart }) => {
            const gradient = chart.ctx.createLinearGradient(0, 0, 0, chart.height / 1.2);
            gradient.addColorStop(0, Color(color).alpha(0.4));
            gradient.addColorStop(1, Color(color).alpha(0.0));
            return gradient;
          },
          pointRadius: 0,
          borderWidth: 2,
          data: data.map(d => ({
            x:
              tickXScale === "week"
                ? new Date(d.date)
                : tickXScale === "day"
                ? moment(new Date(d.date))
                    .startOf("hour")
                    .toDate()
                : moment(new Date(d.date))
                    .startOf("day")
                    .toDate(),
            y: d[valueKey],
          })),
        },
      ],
    }),
    [color, data, valueKey, tickXScale],
  );

  const generateOptions = useMemo(
    () => ({
      animation: {
        duration: 0,
      },
      fill: true,
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false,
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
          position: "nearest",
          external: ({ tooltip }) => setTooltip({ ...tooltip }),
        },
      },
      elements: {
        line: {
          tension: 0.5,
        },
      },
      scales: {
        x: {
          type: "time",
          grid: {
            display: false,
            color: theme.text.shade10,
          },
          ticks: {
            fontColor: theme.text.shade60,
            fontFamily: "Inter",
            maxTicksLimit: 7,
            maxRotation: 0.1, // trick to make the graph fit the whole canvas regardless of data
            minRotation: 0,
          },
          time: {
            minUnit: tickXScale === "day" ? "hour" : "day",
            displayFormats: {
              quarter: "MMM YYYY",
            },
          },
        },
        y: {
          suggestedMax: 10 ** Math.max(magnitude - 4, 1),
          beginAtZero: true,
          grid: {
            color: theme.text.shade10,
            borderDash: [5, 5],
            drawTicks: false,
            drawBorder: false,
            zeroLineColor: theme.text.shade10,
          },
          ticks: {
            maxTicksLimit: 4,
            fontColor: theme.text.shade60,
            fontFamily: "Inter",
            padding: 10,
            callback: value => renderTickY(value),
          },
        },
      },
      layout: {
        padding: {
          left: 0,
          right: 10, // trick to make the graph fit the whole canvas regardless of data
          top: 0,
          bottom: 0,
        },
      },
    }),
    [theme.text.shade10, theme.text.shade60, tickXScale, magnitude, renderTickY],
  );

  useLayoutEffect(() => {
    if (chartRef.current) {
      let shouldAnimate = false;
      if (valueKeyRef.current !== valueKey) {
        valueKeyRef.current = valueKey;
        shouldAnimate = true;
      }

      chartRef.current.data.datasets[0].data = generatedData.datasets[0].data;
      chartRef.current.options = generateOptions;
      chartRef.current.update(shouldAnimate ? 500 : 0);
    } else {
      chartRef.current = new Chart(canvasRef.current, {
        type: "line",
        data: generatedData,
        options: generateOptions,
      });
    }
  }, [generateOptions, generatedData, valueKey]);

  return (
    <ChartContainer height={height}>
      <canvas ref={canvasRef} />
      {tooltip && renderTooltip ? (
        <Tooltip
          tooltip={tooltip}
          theme={theme}
          renderTooltip={renderTooltip}
          color={color}
          data={data}
        />
      ) : null}
    </ChartContainer>
  );
}
