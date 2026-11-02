import type { Cast, Crew } from "../types/fetch";
import { IMAGE_CONFIG } from "../utils/config";
import { UserRound } from "lucide-react";

interface CreditProps {
  data: Cast | Crew;
}

function Credit({ data: item }: CreditProps) {
  const isCast = "character" in item;
  return (
    <li key={item.id} className="flex flex-col gap-2 min-w-40 max-w-40">
      <div className="bg-white/10 aspect-square flex w-full h-full border border-neutral-700">
        {!item.profile_path ? (
          <div className="flex-1 flex items-center justify-center">
            <UserRound />
          </div>
        ) : (
          <img
            className="w-full object-cover object-center"
            src={IMAGE_CONFIG.base_url + "w154" + item.profile_path}
          />
        )}
      </div>
      <div className='flex flex-col gap-0.5 w-full'>
        <h3 title={item.name} className="font-semibold line-clamp-1">
          {item.name}
        </h3>
        <p className="text-sm font-medium text-neutral-400 truncate">
          {isCast ? item.character : item.job}
        </p>
      </div>
    </li>
  );
}

export default Credit;
