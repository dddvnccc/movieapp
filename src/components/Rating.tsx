import { Star } from "lucide-react";

interface RatingProps {
  background?: string;
  rating: number;
  size?: number;
}

function Rating({ background = "white", rating, size = 16 }: RatingProps) {
  return (
    <span
      style={{
        paddingInline: Math.max(size - 4, 6),
        background: `hsl(from ${background} h s l/40%)`,
        border: `1px solid hsl(from ${background} h s l/60%)`,
        fontSize: size,
      }}
      className="p-1 font-bold w-fit rounded border px-3 flex items-center gap-2"
    >
      <Star size={size - 1} className="fill-current text-yellow-300" />
      <span className="translate-y-[0.5px]">{rating.toFixed(1)}</span>
    </span>
  );
}

export default Rating;
