import { NavLink } from "react-router";
import { Home, Film, Tv, User, Search } from "lucide-react";

const NAVLINKS = [
  { id: 1, name: "home", icon: Home, href: "/" },
  { id: 2, name: "movies", icon: Film, href: "/movies" },
  { id: 3, name: "TV series", icon: Tv, href: "/tv" },
];

function Navbar() {
  return (
    <header className="fixed z-30 max-w-screen-md w-full top-4 inset-x-0 bottom-auto mx-auto bg-black/80 border border-white/20 rounded-full p-3 px-8">
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
                  <span>{item.name}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
        <button>
          <Search />
        </button>
        <button>
          <User />
        </button>
      </nav>
    </header>
  );
}

export default Navbar;
