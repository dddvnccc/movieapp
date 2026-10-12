import type { Cast, Crew } from "../types/fetch";
import { IMAGE_CONFIG } from "../utils/config";
import { UserRound } from "lucide-react";

interface CreditProps {
  data: Cast | Crew;
}

function Credit({ data: item }: CreditProps) {
  const isCast = "character" in item;
  return (
    <li key={item.id} className="flex items-center gap-4">
      <div className="min-w-16 w-16 max-w-16 bg-white/10 aspect-square rounded-lg flex border border-white/20">
        {!item.profile_path ? (
          <div className="flex-1 flex items-center justify-center">
            <UserRound />
          </div>
        ) : (
          <img
            className="w-full h-full object-cover rounded-lg object-center"
            src={IMAGE_CONFIG.base_url + "w154" + item.profile_path}
          />
        )}
      </div>
      <div>
        <h3 title={item.name} className="font-semibold line-clamp-1">{item.name}</h3>
        <p className="text-sm text-neutral-400">
          {isCast ? item.character : item.job}
        </p>
      </div>
    </li>
  );
}

export default Credit;
