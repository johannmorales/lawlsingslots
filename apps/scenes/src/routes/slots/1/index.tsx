import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/slots/1/")({
  component: Index,
});

const Slot = ({}) => {
  return (
    <div
      className="relative w-full h-0"
      style={{ paddingTop: `${(1000 / 1667) * 100}%` }}
    >
      <div className="absolute top-0 left-0 w-full h-full shadow-md">{}</div>
    </div>
  );
};

function Index() {
  return (
    <div className="w-full h-full grid grid-cols-6 grid-rows-2 gap-2">
      <div className="col-span-4 row-span-2">
        <div className="flex flex-col gap-2 items-center h-full">
          <Slot />
          <div className="flex justify-between w-full gap-2 h-full items-center">
            <div>
              <img src="/gamdom/promo.png" className="max-h-40" />
            </div>
            <div className="h-full flex items-center">
              <video
                className="max-h-40"
                autoPlay
                loop
                muted
                src="/adhd/minecraft.webm"
              />
            </div>
            <div className="h-full flex items-center">
              <video
                className="max-h-40"
                autoPlay
                loop
                muted
                src="/adhd/subwaysurfers.webm"
              />
            </div>
            <div className="h-full flex items-center">
              <video
                className="max-h-40"
                autoPlay
                loop
                muted
                src="/adhd/fruits.webm"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-2"></div>
      <div className="col-span-2"></div>
    </div>
  );
}
