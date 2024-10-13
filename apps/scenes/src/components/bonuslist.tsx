import clsx from "clsx";
import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

type BonusListProps = {
  data: IBonus[];
};

type IBonus = any;

const Bonus = ({ bonus, index }: { bonus: IBonus; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }} // Initial state (invisible)
      animate={{ opacity: 1 }} // Final state (visible)
      transition={{ duration: 1 }} // Duration of the fade-in
      key={index}
      className={clsx(
        "grid grid-cols-[2rem_repeat(8,_1fr)] gap-2 p-2 items-center h-20 scroll-item",
        index % 2 === 0 && "bg-opacity-15 bg-slate-900",
        index % 2 === 1 && "bg-opacity-30 bg-slate-900",
      )}
    >
      <img
        src={bonus.slot.thumbnail}
        className="col-span-2 rounded-sm shadow-md" // TDO: Add loading
      />
      <div className="col-span-5">
        <div className="text-base text-ellipsis max-w-full text-nowrap whitespace-nowrap overflow-hidden">
          {bonus.slot.name}
        </div>
        <div className="text-sm font-medium">{bonus.slot.provider}</div>
        {/* <div className="text-xs font-medium italic text-gold mt-0.5">
                  Tocho
                </div> */}
      </div>
      <div className="col-span-2 justify-self-end text-xl">
        {bonus.currency} {bonus.bet}
      </div>

      {/* <div className="col-span-2 justify-self-end text-lg flex flex-col items-end leading-none gap-0.5">
                ₦ {5000 * index + 10}{" "}
                <label className="font-light text-xs leading-none">2000x</label>
              </div> */}
    </motion.div>
  );
};

export default function BonusList({ data: items }: BonusListProps) {
  const [shouldScroll, setShouldScroll] = useState(false);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const checkOverflow = () => {
      if (scrollContainerRef.current) {
        const containerHeight = scrollContainerRef.current.clientHeight;
        const contentHeight = scrollContainerRef.current.scrollHeight;
        setShouldScroll(contentHeight > containerHeight);
      }
    };

    checkOverflow(); // Initial check
    window.addEventListener("resize", checkOverflow); // Check on window resize

    return () => {
      window.removeEventListener("resize", checkOverflow);
    };
  }, [items]); // Run whenever items change

  const scrollDuration = 20; // Duration for the scroll animation

  // Create a duplicate of the items for seamless scrolling
  const fullItems = [...items, ...items];

  return (
    <div
      className="scroll-container h-full w-full max-h-full max-w-full"
      ref={scrollContainerRef}
    >
      {shouldScroll ? (
        <motion.div
          className="scroll-content"
          initial={{ y: 0 }}
          animate={{ y: `-${(items.length * 100) / items.length}vh` }} // Move up by the full height of the list
          transition={{
            duration: scrollDuration,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {fullItems.map((item, index) => (
            <div className="scroll-item" key={item.id}>
              <Bonus bonus={item} index={index} />
            </div>
          ))}
        </motion.div>
      ) : (
        items.map((item, index) => (
          <div className="scroll-item" key={index}>
            <Bonus bonus={item} index={index} />
          </div>
        ))
      )}
    </div>
  );
}
