import { createFileRoute } from "@tanstack/react-router";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import BonusList from "../../../components/bonuslist";

export const Route = createFileRoute("/stream/slots/1")({
  component: Index,
});

const Slot = ({}) => {
  return (
    <div
      className="relative w-full h-0"
      style={{ paddingTop: `${(1000 / 1667) * 100}%` }}
    >
      <div className="guideline absolute top-0 left-0 w-full h-full shadow-md">
        {}
      </div>
    </div>
  );
};

function Index() {
  // Client-side code
  const [bonuses, setBonuses] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Establish EventSource connection
    const eventSource = new EventSource("http://192.168.100.10:5008/hunts/sse");

    // Handle incoming messages
    eventSource.onmessage = (event) => {
      const newBonuses = JSON.parse(event.data);
      setBonuses(newBonuses);
    };
    // Handle errors
    eventSource.onerror = (event) => {
      console.error("EventSource failed:", event);
      eventSource.close(); // Close the connection on error
    };

    // Cleanup on component unmount
    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className="w-full h-full grid grid-cols-[1667px_1fr] grid-rows-[1000px_1fr] gap-2">
      <div>
        <Slot />
      </div>
      <div className="guideline"></div>
      <div>
        <div className="flex justify-between w-full max-w-full overflow-hidden  gap-2 items-center h-40">
          <img src="/gamdom/promo.png" className=" max-h-full" />
          <video
            className="max-h-full"
            autoPlay
            loop
            muted
            src="/adhd/vertical-pendulum.mp4"
          />
          {/* <video
            className="max-h-full"
            autoPlay
            loop
            muted
            src="/adhd/vertical-wave.mp4"
          /> */}
          <video
            className="max-h-full"
            autoPlay
            loop
            muted
            src="/adhd/tunnel.webm"
          />
          <video
            className="max-h-full"
            autoPlay
            loop
            muted
            src="/adhd/vertical-wave.mp4"
          />

          {/* <video
            className="max-h-full"
            autoPlay
            loop
            muted
            src="/adhd/vertical-wave.mp4"
          /> */}
          {/* <video
            className="max-h-full"
            autoPlay
            loop
            muted
            src="/adhd/fruits.webm"
          /> */}
        </div>
      </div>
      <div className="guideline"></div>
    </div>
  );
}
