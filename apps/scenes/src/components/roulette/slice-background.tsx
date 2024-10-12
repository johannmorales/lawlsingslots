import { CSSProperties, useMemo } from "react";
import { RouletteNumber } from "./data";

export const SliceBackground: React.FC<{
  fill?: string;
  className?: string;
}> = ({ fill, className }) => {
  const style: CSSProperties = useMemo(
    () => ({
      fill,
    }),
    [fill],
  );
  return (
    <svg
      viewBox="0 0 89.5896 500"
      height="100%"
      style={style}
      className={className}
    >
      <path
        transform="matrix(3.500028133392334, 0, 0, 3.500028133392334, -1436.6865234375, -503.4546203613281)"
        d="M 410.478581961 144.417457867 A 142.856 142.856 0 0 1 436.075418039 144.417457867 L 423.277 286.699 Z"
      />
    </svg>
  );
};
