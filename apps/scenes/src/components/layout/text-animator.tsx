import { ReactNode, useEffect, useState } from "react";
import { motion } from "framer-motion";

export const TextAnimator = ({ nodes }: { nodes: ReactNode[] }) => {
  const [index, setIndex] = useState(0);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsLeaving(true);

      // Change the text after the fade-out duration
      setTimeout(() => {
        setIndex((prevIndex) => (prevIndex + 1) % nodes.length);
        setIsLeaving(false);
      }, 500); // Faster fade-out duration
    }, 6500); // Total duration: 5 seconds visible + 0.5 seconds fade-out

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <motion.div
        key={index}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLeaving ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }} // Faster fade-in and fade-out duration
      >
        {nodes[index]}
      </motion.div>
    </div>
  );
};
