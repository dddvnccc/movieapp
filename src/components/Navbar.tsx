import { useState } from "react";
import { NavLink } from "react-router";
import { Home, Film, Tv, User, Search, type LucideIcon } from "lucide-react";
import Portal from "./Portal";
import SearchModal from "./SearchModal";

const NAVLINKS = [
  { id: 1, name: "home", icon: Home, href: "/" },
  { id: 2, name: "movies", icon: Film, href: "/movies" },
  { id: 3, name: "TV series", icon: Tv, href: "/tv" },
];

function Navbar() {
  const [isModalActive, setIsModalActive] = useState(false);
  return (
    <>
      <Portal>
        <SearchModal
          handleClose={() => setIsModalActive(false)}
          isActive={isModalActive}
        />
      </Portal>
      <header className="fixed z-50 max-w-screen-md w-full top-4 inset-x-0 bottom-auto mx-auto bg-black/80 border border-white/20 rounded-full p-3 px-8">
        <nav className="flex items-center gap-6">
          <span>temuflix</span>
          <ul className="flex items-center gap-2 flex-1">
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
          <NavbarButton handleClick={() => ""} icon={User} />
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
