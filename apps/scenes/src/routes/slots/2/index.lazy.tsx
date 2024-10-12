import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/slots/2/")({
  component: Index,
});

function Index() {
  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
    </div>
  );
}
