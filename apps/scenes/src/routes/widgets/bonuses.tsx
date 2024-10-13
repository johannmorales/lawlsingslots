import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import BonusList from "../../components/bonuslist";
import { data } from "framer-motion/client";

export const Route = createFileRoute("/widgets/bonuses")({
  component: Index,
});

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

  return <BonusList data={bonuses} />;
}
