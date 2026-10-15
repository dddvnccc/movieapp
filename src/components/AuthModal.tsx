import { X } from "lucide-react";
import React, {
  useEffect,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
  type SubmitEvent,
} from "react";
import { supabase } from "../utils/supabase";

interface AuthModalProps {
  isActive: boolean;
  handleClose: () => void;
}

type AuthForm = "name" | "email" | "password";

function AuthModal({ isActive, handleClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    document.body.classList.add("hide-scrollbar");
    document.body.style.overflowY = isActive ? "hidden" : "";
    return () => {
      document.body.classList.remove("hide-scrollbar");
      document.body.style.overflowY = "";
    };
  }, [isActive]);

  const handleInput = (
    e: ChangeEvent<HTMLInputElement>,
    field_name: AuthForm,
  ) => {
    setAuthForm((prev) => ({ ...prev, [field_name]: e.target.value }));
  };

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!isLogin) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: authForm.email,
          password: authForm.password,
          options: {
            data: {
              display_name: authForm.name,
            },
          },
        });

        if (error) {
          console.log(error);
        }
        return data;
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div
      style={{
        opacity: isActive ? 1 : 0,
        pointerEvents: isActive ? "auto" : "none",
      }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300"
    >
      <div className="bg-black/90 p-8 border border-white/20">
        <header className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
          <span>Auth</span>
          <button onClick={handleClose}>
            <X />
          </button>
        </header>
        <h2 className="text-xl font-semibold mt-4">Welcome, back</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
          {!isLogin && (
            <div className="flex flex-col gap-2">
              <label className="font-medium capitalize" htmlFor="name">
                name
              </label>
              <input
                value={authForm.name}
                className="p-4 px-5 bg-black border border-white/20"
                id="name"
                type="text"
                placeholder="your name"
                onChange={(e) => handleInput(e, "name")}
              />
            </div>
          )}
          <div className="flex flex-col gap-2">
            <label className="font-medium capitalize" htmlFor="email">
              email
            </label>
            <input
              value={authForm.email}
              className="p-4 px-5 bg-black border border-white/20"
              id="email"
              type="email"
              placeholder="your email"
              onChange={(e) => handleInput(e, "email")}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-medium capitalize" htmlFor="password">
              password
            </label>
            <input
              value={authForm.password}
              className="p-4 px-5 bg-black border border-white/20"
              id="password"
              type="password"
              placeholder="your password"
              onChange={(e) => handleInput(e, "password")}
            />
          </div>
          <button
            disabled={loading}
            className="bg-white text-black p-3.5 capitalize font-semibold mt-1.5"
          >
            {isLogin ? "sign in" : "create account"}
          </button>
        </form>
        <button onClick={() => setIsLogin(!isLogin)}>
          {isLogin
            ? "Dont have account ? register"
            : "already have account? login"}
        </button>
      </div>
    </div>
  );
}

export default AuthModal;
