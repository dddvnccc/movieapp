import { useState, useEffect } from "react";
import { type ShowCredit } from "../../types/fetch";
import { IMAGE_CONFIG } from "../../utils/config";

const Cast = ({ creditData }: { creditData: ShowCredit | undefined }) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    document.body.style.overflowY = isActive ? "hidden" : "";

    return () => {
      document.body.style.overflowY = "";
    };
  }, [isActive]);

  return (
    <div id="cast" className="px-12 pt-32 pb-16 bg-black relative">
      <div
        onClick={() => setIsActive(false)}
        className={`fixed inset-0 z-50 flex items-center justify-center ${isActive ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        <div className="bg-white border border-black max-h-[80vh] text-black overflow-y-auto p-8 min-w-[80vw] max-w-[80vw]">
          <div className="">
            <h2 className="uppercase font-bold text-lg">cast</h2>
            <ul className="text-black grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-4">
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
        </div>
      </div>
      <div className="flex items-center gap-4 justify-between">
        <h2 className="text-3xl font-bold uppercase">Cast</h2>
        <button onClick={() => setIsActive(true)}>see all</button>
      </div>
      <ul className="flex overflow-x-auto gap-4 items-start mt-8 hide-scrollbar">
        {creditData?.cast.slice(0, 10).map((item) => (
          <li key={item.credit_id} className="flex flex-col gap-4">
            <div className="w-52 h-52 object-cover">
              <img
                className="w-full h-full object-cover"
                src={IMAGE_CONFIG.base_url + "w185" + item.profile_path}
              />
            </div>
            <div>
              <h3 className="font-bold">{item.name}</h3>
              <p className="text-sm font-light text text-neutral-400">
                {item.character}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Cast;
