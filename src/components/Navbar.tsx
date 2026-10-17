import { useState, useRef, useEffect, useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import {
  Home,
  Film,
  Tv,
  User,
  Search,
  LogIn,
  Bookmark,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import Portal from "./Portal";
import SearchModal from "./SearchModal";
import AuthModal from "./AuthModal";
import { AuthContexts } from "../Context/AuthContext";
import { supabase } from "../utils/supabase";

const NAVLINKS = [
  { id: 1, name: "home", icon: Home, href: "/" },
  { id: 2, name: "movies", icon: Film, href: "/movie" },
  { id: 3, name: "TV series", icon: Tv, href: "/tv" },
];

function Navbar() {
  const navigate = useNavigate();
  const context = useContext(AuthContexts);
  if (!context) {
    throw new Error("error");
  }

  const { claims, clearClaims } = context;
  const menuRef = useRef<HTMLDivElement>(null);
  const [isModalActive, setIsModalActive] = useState(false);
  const [isMenuActive, setIsMenuActive] = useState(false);
  const [isLoginActive, setIsLoginActive] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!claims) {
      setIsLoginActive(true);
      return;
    }
    setLoading(true);
    try {
      await supabase.auth.signOut();
      clearClaims();
      navigate("/");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        isMenuActive &&
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setIsMenuActive(false);
      }
    };
    window.addEventListener("click", handleOutsideClick);
  }, [isMenuActive]);

  return (
    <>
      <Portal>
        <SearchModal
          handleClose={() => setIsModalActive(false)}
          isActive={isModalActive}
        />
        <AuthModal
          isActive={isLoginActive}
          handleClose={() => setIsLoginActive(false)}
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
          <div ref={menuRef} className="relative">
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
              className="absolute mt-8 bg-black -right-4 transition-all duration-300 rounded-lg min-w-[350px] border border-white/20"
            >
              <div className="p-6 flex items-center gap-4 border-b border-white/20">
                <div className="size-12 p-2 border rounded border-white/20 flex items-center justify-center">
                  <UserRound className="" />
                </div>
                <div className="flex flex-col ">
                  <h3 className="font-semibold">
                    {claims ? claims.email : "Guest"}
                  </h3>
                  <p className="text-sm font-light">
                    sign in to sync your data
                  </p>
                </div>
              </div>
              <div className="p-2">
                {claims && (
                  <Link
                    className="p-3 px-4 w-full hover:bg-white/10 rounded flex items-center gap-4 capitalize"
                    to="/list"
                  >
                    <Bookmark /> <span>my list</span>
                  </Link>
                )}
                <button
                  disabled={loading}
                  className="p-3 px-4 w-full hover:bg-white/10 rounded flex items-center gap-4 capitalize"
                  onClick={handleLogin}
                >
                  <LogIn className="size-5" />
                  <span className="font-bold">
                    {claims ? "signout" : "sign In"}
                  </span>
                </button>
              </div>
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
