// @flow
/* eslint-disable react/no-unused-prop-types */

/**
 *                                   Chart
 *                                   -----
 *
 *                                    XX
 *                                   XXXX
 *                          X       XX  X
 *                         XXXX    XX   X
 *                        XX  X  XX     X
 *                       X    XXXX       X     XX    X
 *                      XX     XX        X   XX XX  XX
 *                     XX                XX XX   XXXX
 *                                        XX
 *                                        XX
 *  Usage:
 *
 *    <Chart
 *      data={data}
 *      color="#5f8ced"   // Main color for line, gradient, etc.
 *      height={300}      // Fix height. Width is responsive to container.
 *    />
 *
 *    `data` looks like:
 *
 *     [
 *       { date: '2018-01-01', value: 10 },
 *       { date: '2018-01-02', value: 25 },
 *       { date: '2018-01-03', value: 50 },
 *     ]
 *
 */

import React, { useRef, useLayoutEffect, useMemo } from "react";
import ChartJs from "chart.js";
import Color from "color";

import useTheme from "~/renderer/hooks/useTheme";

import type { Data } from "./types";

export type Props = {
  data: Data,
  height: number,
  color?: string,
  valueKey?: string,
};

export default function Chart({ height, data, color, valueKey = "value" }: Props) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const theme = useTheme("colors.palette");

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
            x: new Date(d.date),
            y: d[valueKey].toNumber(),
          })),
        },
      ],
    }),
    [color, data, valueKey],
  );

  const generateOptions = useMemo(
    () => ({
      responsive: false,
      maintainAspectRatio: false,
      tooltips: {
        enabled: false,
      },
      layout: {
        padding: {
          top: 4,
          bottom: 4,
        },
      },
      animation: {
        duration: 0,
      },
      legend: {
        display: false,
      },
      scales: {
        xAxes: [
          {
            display: false,
            type: "time",
            gridLines: {
              display: false,
              color: theme.text.shade10,
            },
            ticks: {
              fontColor: theme.text.shade60,
              fontFamily: "Inter",
              maxTicksLimit: 7,
            },
          },
        ],
        yAxes: [
          {
            display: false,
            gridLines: {
              color: theme.text.shade10,
              borderDash: [5, 5],
              drawTicks: false,
              drawBorder: false,
              zeroLineColor: theme.text.shade10,
            },
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    }),
    [theme.text.shade10, theme.text.shade60],
  );

  useLayoutEffect(() => {
    if (chartRef.current) {
      chartRef.current.data = generatedData;
      chartRef.current.options = generateOptions;
      chartRef.current.update(0);
    } else {
      chartRef.current = new ChartJs(canvasRef.current, {
        type: "line",
        data: generatedData,
        options: generateOptions,
      });
    }
  }, [generateOptions, generatedData]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        height,
      }}
    />
  );
}
