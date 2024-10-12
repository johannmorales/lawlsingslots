import React, { CSSProperties, useMemo, useState } from "react";
import { ROULETTE_NUMBERS, RouletteNumber } from "./data";
import { SliceBackground } from "./slice-background";
import { motion } from "framer-motion";
import css from "./roulette.module.css";
import clsx from "clsx";
const numbers = Array.from({ length: 36 }, (_, i) => i + 1); // Numbers from 1 to 36

const Slice: React.FC<{
  index: number;
  className?: string;
  number?: number;
  color?: RouletteNumber["color"] | "gray";
  backgroundClassName?: string;
}> = ({ color, number, index, className, backgroundClassName }) => {
  const style: CSSProperties = useMemo(
    () => ({
      transform: `translate(-50%, 0) rotate(${(360 / ROULETTE_NUMBERS.length) * index}deg)`,
      transformOrigin: "50% 100%",
    }),
    [index],
  );

  return (
    <li className={clsx(css.slice, className)} style={style}>
      <SliceBackground className={backgroundClassName} fill={color} />
      <label>{number}</label>
    </li>
  );
};
export const Roulette: React.FC = () => {
  const [result, setResult] = useState<number>(0);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);

  const spinRoulette = () => {
    setResult((prev) => prev + 270 * 4);
  };

  return (
    <>
      <div className="inline-flex bg-[url('/roulette-table.jpg')]">
        <div className="flex flex-col w-24 items-start">
          <div className="bg-gray-900 bg-opacity-50 h-20 flex flex-col p-3 leading-none border-b border-gray-800 w-full justify-center gap-1">
            <label className="text-white font-semibold">xylokia</label>
            <span className="font-extrabold text-2xl text-right text-white">
              +240
            </span>
          </div>
          <div className="bg-gray-900 bg-opacity-50 h-20 flex flex-col p-3 leading-none border-b border-gray-800 w-full justify-center gap-1">
            <label className="text-white font-semibold">xylokia</label>
            <span className="font-extrabold text-2xl text-right text-white">
              +240
            </span>
          </div>
        </div>
        <div className="p-4">
          <div className="rounded-full relative h-80 w-80 justify-center items-center z-10">
            <div className="h-full w-full shadow-md rounded-full">
              <ul className="h-full w-full origin-[0%_250%] translate-x-1/2">
                {ROULETTE_NUMBERS.map((n, index) => (
                  <Slice key={n.number} index={index} {...n} />
                ))}
              </ul>
            </div>
            <div className=" absolute top-0 bottom-0 right-0 left-0 mx-auto my-auto h-[87%] w-[87%] shadow-sm rounded-full border">
              <ul className="h-full w-full origin-[0%_250%] translate-x-1/2">
                {ROULETTE_NUMBERS.map((n, index) => (
                  <Slice
                    key={index}
                    index={index}
                    color={n.color}
                    number={undefined}
                  />
                ))}
              </ul>
            </div>
            <motion.div
              animate={{
                rotate: result,
                translateX: "-50%",
                translateY: "-50%",
              }}
              transition={{
                bounce: 0,
                duration: 3,
                ease: "easeOut",
              }}
              className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 right-1/2 bottom-1/2 left-1/2 w-28 h-28 bg-center bg-contain bg-[url('/roulette-inner.png')] before:content-['\2022'] before:text-[60px] before:text-white"
            ></motion.div>
          </div>
        </div>
        <div className="flex flex-col w-24 items-start overflow-hidden max-h-full">
          <div className="bg-gray-900 bg-opacity-50 h-20 flex flex-col p-3 leading-none border-b border-gray-800 w-full justify-center gap-1">
            <label className="text-white font-semibold">xylokia</label>
            <span className="font-extrabold text-2xl text-right text-white">
              +240
            </span>
          </div>
          <div className="bg-gray-900 bg-opacity-50 h-20 flex flex-col p-3 leading-none border-b border-gray-800 w-full justify-center gap-1">
            <label className="text-white font-semibold">xylokia</label>
            <span className="font-extrabold text-2xl text-right text-white">
              +240
            </span>
          </div>
          <div className="bg-gray-900 bg-opacity-50 h-20 flex flex-col p-3 leading-none border-b border-gray-800 w-full justify-center gap-1">
            <label className="text-white font-semibold">xylokia</label>
            <span className="font-extrabold text-2xl text-right text-white">
              +240
            </span>
          </div>
          <div className="bg-gray-900 bg-opacity-50 h-20 flex flex-col p-3 leading-none border-b border-gray-800 w-full justify-center gap-1">
            <label className="text-white font-semibold">xylokia</label>
            <span className="font-extrabold text-2xl text-right text-white">
              +240
            </span>
          </div>
          <div className="bg-gray-900 bg-opacity-50 h-20 flex flex-col p-3 leading-none border-b border-gray-800 w-full justify-center gap-1">
            <label className="text-white font-semibold">xylokia</label>
            <span className="font-extrabold text-2xl text-right text-white">
              +240
            </span>
          </div>
          <div className="bg-gray-900 bg-opacity-50 h-20 flex flex-col p-3 leading-none border-b border-gray-800 w-full justify-center gap-1">
            <label className="text-white font-semibold">xylokia</label>
            <span className="font-extrabold text-2xl text-right text-white">
              +240
            </span>
          </div>
        </div>
      </div>

      <button
        className="bg-red-200 p-3 cursor-pointer z-50"
        onClick={spinRoulette}
      >
        a!
      </button>
    </>
  );
};
