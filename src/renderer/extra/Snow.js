// @flow

import React, { useLayoutEffect, useRef, useState } from "react";
import times from "lodash/times";
import each from "lodash/each";
import throttle from "lodash/throttle";

export const isSnowTime = () => {
  const now = new Date();

  return process.env.SNOW_EVENT || (now.getMonth() === 11 && now.getDate() > 21);
};

function randomBetween(min, max, round) {
  const num = Math.random() * (max - min + 1) + min;

  if (round) {
    return Math.floor(num);
  }
  return num;
}

function Flake(x, y) {
  const maxWeight = 5;
  const maxSpeed = 3;

  this.x = x;
  this.y = y;
  this.r = randomBetween(0, 1);
  this.a = randomBetween(0, Math.PI);
  this.aStep = 0.01;

  this.weight = randomBetween(2, maxWeight);
  this.alpha = this.weight / maxWeight / 2;
  this.speed = (this.weight / maxWeight) * maxSpeed;

  this.update = () => {
    this.x += Math.cos(this.a) * this.r;
    this.a += this.aStep;
    this.y += this.speed;
  };
}

type Props = {
  numFlakes: number,
};

const Snow = ({ numFlakes }: Props) => {
  const canvasRef = useRef();
  const containerRef = useRef();

  const [dimension, setDimension] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const updateDimension = () => {
      if (!containerRef.current) return;
      setDimension(containerRef.current.getBoundingClientRect());
    };

    const ro = new ResizeObserver(throttle(updateDimension, 250));
    ro.observe(containerRef.current);

    updateDimension();

    return () => {
      ro.disconnect();
    };
  }, []);

  useLayoutEffect(() => {
    const { width, height } = dimension;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const flakes = times(
      numFlakes,
      () => new Flake(randomBetween(0, width, true), randomBetween(0, height, true)),
    );

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    let loopId;

    const updateFlakes = () => {
      ctx.clearRect(0, 0, width, height);

      each(flakes, flake => {
        flake.update();

        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.weight, 0, 2 * Math.PI, false);
        ctx.fillStyle = `rgba(255, 255, 255, ${flake.alpha})`;
        ctx.fill();

        if (flake.y >= height) {
          flake.y = -flake.weight;
        }
      });
      loopId = requestAnimationFrame(updateFlakes);
    };

    loopId = requestAnimationFrame(updateFlakes);

    return () => {
      cancelAnimationFrame(loopId);
    };
  }, [dimension, numFlakes]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        marginTop: -60,
        marginBottom: -60,
      }}
    >
      <canvas ref={canvasRef} />
    </div>
  );
};

export default Snow;
