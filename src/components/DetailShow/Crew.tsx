import { useState, useEffect } from "react";
import { type ShowCredit } from "../../types/fetch";
import { IMAGE_CONFIG } from "../../utils/config";
import { ChevronDown, User } from "lucide-react";

const Crew = ({ creditData }: { creditData: ShowCredit | undefined }) => {
  const [isActive, setIsActive] = useState(false);
  const [isSelectDepartment, setIsSelectDepartment] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState<string>("");
  const groupedCrew =
    creditData?.crew?.reduce(
      (acc, member) => {
        if (!acc[member.department]) {
          acc[member.department] = [];
        }
        acc[member.department].push(member);
        return acc;
      },
      {} as Record<string, typeof creditData.crew>,
    ) ?? {};
  useEffect(() => {
    document.body.style.overflowY = isActive ? "hidden" : "";
    return () => {
      document.body.style.overflowY = "";
    };
  }, [isActive]);
  useEffect(() => {
    if (!currentDepartment) {
      const departments = Object.keys(groupedCrew ?? {}).sort((a, b) =>
        a.localeCompare(b),
      );

      if (departments.length > 0) {
        setCurrentDepartment(departments[0]);
      }
    }
  }, [currentDepartment, groupedCrew]);

  return (
    <div id="crew" className="px-12 pt-32 pb-16 bg-black relative">
      <div
        onClick={() => setIsActive(false)}
        className={`fixed inset-0 z-50 flex items-center justify-center ${isActive ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        <div className="bg-white border border-black max-h-[80vh] text-black overflow-y-auto p-8 min-w-[80vw] max-w-[80vw]">
          <div className="">
            <h2 className="uppercase font-bold text-lg">cast</h2>
            <ul className="text-black grid grid-cols-3 gap-4">
              {creditData?.cast?.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-4 bg-black text-white p-4"
                >
                  <img
                    className="w-20 h-20 object-cover"
                    src={IMAGE_CONFIG.base_url + "w185" + item.profile_path}
                  />
                  <div>
                    <h3>{item.name}</h3>
                    <p>{item.character}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2>crew</h2>
            {Object.entries(groupedCrew ?? {})?.map(([job, member]) => (
              <div key={job} className="flex flex-col gap-4">
                <h3>{job}</h3>
                <ul className="flex flex-wrap gap-4 text-black">
                  {member.map((item) => (
                    <li
                      key={item.credit_id}
                      className="flex items-center shrink-0 gap-4"
                    >
                      <h3>{item.name}</h3>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4 justify-between">
        <h2 className="text-3xl font-bold uppercase">Crew</h2>
        <div className="relative min-w-72">
          <button
            onClick={() => setIsSelectDepartment(!isSelectDepartment)}
            className="flex items-center gap-4 w-full justify-between bg-white text-black p-4 py-3 font-semibold text-lg"
          >
            {currentDepartment} <ChevronDown />
          </button>
          <ul
            className={`absolute flex flex-col right-0 w-full mt-4 bg-white text-black z-50 ${isSelectDepartment ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
          >
            {Object.keys(groupedCrew ?? {})
              .sort((a, b) => a.localeCompare(b))
              .map((item) => (
                <li key={item} className="w-full">
                  <button
                    className="text-left px-4 py-2 first:pt-4 last:pb-4 w-full"
                    onClick={() => {
                      setCurrentDepartment(item);
                      setIsSelectDepartment(false);
                    }}
                  >
                    {item}
                  </button>
                </li>
              ))}
          </ul>
        </div>
      </div>
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,350px),1fr))] gap-4 items-start mt-8">
        {groupedCrew[currentDepartment]?.map((item) => (
          <li
            key={item.credit_id}
            className="bg-neutral-950 border border-neutral-700 flex items-center"
          >
            <div className="w-24 h-24 border-r border-neutral-700 shrink-0">
              {!item.profile_path ? (
                <div className="bg-neutral-900 h-full w-full flex items-center justify-center">
                  <User className="text-neutral-600" />
                </div>
              ) : (
                <img
                  className="object-cover h-full w-full"
                  src={IMAGE_CONFIG.base_url + "w185" + item.profile_path}
                />
              )}
            </div>
            <div className="px-4">
              <h3 className="font-bold">{item.name}</h3>
              <p className="font-light text-sm">{item.job}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Crew;
