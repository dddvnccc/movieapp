import { useState } from "react";
import { NavLink } from "react-router";
import {
  Home,
  Film,
  Tv,
  User,
  Search,
  type LucideIcon,
  UserRound,
} from "lucide-react";
import Portal from "./Portal";
import SearchModal from "./SearchModal";

const NAVLINKS = [
  { id: 1, name: "home", icon: Home, href: "/" },
  { id: 2, name: "movies", icon: Film, href: "/movie" },
  { id: 3, name: "TV series", icon: Tv, href: "/tv" },
];

function Navbar() {
  const [isModalActive, setIsModalActive] = useState(false);
  const [isMenuActive, setIsMenuActive] = useState(false);
  return (
    <>
      <Portal>
        <SearchModal
          handleClose={() => setIsModalActive(false)}
          isActive={isModalActive}
        />
      </Portal>
      <header className="fixed z-50 max-w-screen-md w-auto inset-x-0 top-4 bottom-auto mx-4 sm:mx-auto bg-black/80 border border-white/20 rounded-full p-3 px-8">
        <nav className="flex items-center gap-6">
          <span className="font-bold flex-1 md:flex-none">
            <span className="uppercase">temu</span>flix
          </span>
          <ul className="hidden md:flex items-center gap-2 flex-1">
            {NAVLINKS.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      `p-2 px-3 rounded-lg text-xs font-medium tracking-wide capitalize flex items-center gap-2 transition-colors duration-300 hover:text-[--main-white] ${isActive ? "text-[--main-white] bg-[--transparent-main]" : "text-white/40 bg-transparent"}`
                    }
                  >
                    <Icon size={16} />
                    <span className="translate-y-[0.5px]">{item.name}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
          <NavbarButton
            handleClick={() => setIsModalActive(true)}
            icon={Search}
          />
          <div className="relative">
            <NavbarButton
              handleClick={() => setIsMenuActive(!isMenuActive)}
              icon={User}
            />
            <div
              style={{
                opacity: isMenuActive ? "1" : "0",
                pointerEvents: isMenuActive ? "auto" : "none",
                visibility: isMenuActive ? "visible" : "hidden",
              }}
              className="absolute mt-8 bg-black right-0 transition-all duration-300 rounded-lg min-w-[300px] border border-white/20"
            >
              <div className="p-6 flex items-center gap-4 border-b border-white/20">
                <div className="p-2 border rounded border-white/20">
                  <UserRound className="size-6" />
                </div>
                <div>
                  <h3>Guest</h3>
                  <p className="text-xs">sign in to sync your data</p>
                </div>
              </div>
              <button onClick={() => console.log("hi")}>signin</button>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}

const NavbarButton = ({
  icon: Icon,
  handleClick,
}: {
  icon: LucideIcon;
  handleClick: () => void;
}) => {
  return (
    <button onClick={handleClick} className="flex items-center">
      <Icon className="size-4" />
    </button>
  );
};

export default Navbar;
