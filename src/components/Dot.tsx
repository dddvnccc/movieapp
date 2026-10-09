interface DotProps {
  size?: number;
  color?: string;
}

function Dot({ size = 4, color = "white" }: DotProps) {
  return (
    <div
      style={{ width: size, height: size, backgroundColor: color }}
      className="rounded-full"
    ></div>
  );
}

export default Dot;
