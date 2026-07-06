import axios from "axios";
import Cookies from "js-cookie";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

const UserContext = createContext();

const clearAllAuthCookies = () => {
  Cookies.remove("token");
  Cookies.remove("user");
  Cookies.remove("staffToken");
  Cookies.remove("staffUser");
};

const showSessionExpiredToast = (message) => {
  toast.custom(
    (toastObj) => (
      <div
        className={`${
          toastObj.visible ? "animate-enter" : "animate-leave"
        } max-w-sm w-full bg-[#1a1a1a] border border-orange-500/30 shadow-2xl shadow-orange-500/10 rounded-2xl pointer-events-auto flex items-start gap-4 p-5`}
      >
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#f97316"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        <div className="flex-1">
          <p className="text-white font-black text-sm uppercase tracking-wide">
            Session Ended
          </p>
          <p className="text-gray-400 text-xs mt-0.5 font-medium">{message}</p>
        </div>

        <button
          onClick={() => toast.dismiss(toastObj.id)}
          className="text-gray-600 hover:text-orange-500 transition-colors text-lg leading-none mt-0.5"
        >
          ×
        </button>
      </div>
    ),
    { duration: 4000, position: "top-center" },
  );
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState([]);
  const COOKIE_KEY = "user";
  const isHttps =
    typeof window !== "undefined" && window.location.protocol === "https:";

  const hasShownExpiredToast = useRef(false);

  const persistUser = useCallback(
    (value) => {
      if (!value) {
        Cookies.remove(COOKIE_KEY);
        return;
      }

      Cookies.set(COOKIE_KEY, JSON.stringify(value), {
        expires: 1,
        sameSite: "Strict",
        secure: isHttps,
      });
    },
    [COOKIE_KEY, isHttps],
  );

  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  const logout = useCallback(
    (showExpiredMessage = false) => {
      persistUser(null);
      setUser(null);

      clearAllAuthCookies();
      if (showExpiredMessage && !hasShownExpiredToast.current) {
        hasShownExpiredToast.current = true;

        const message = isAr
          ? "انتهت صلاحية جلستك. سيتم توجيهك إلى صفحة تسجيل الدخول..."
          : "Your session has expired. Redirecting to login...";

        showSessionExpiredToast(message);

        setTimeout(() => {
          hasShownExpiredToast.current = false;
          const currentPath = window.location.pathname;
          const isStaffPath =
            currentPath.startsWith("/admin") ||
            currentPath.startsWith("/chef") ||
            currentPath.startsWith("/plans") ||
            currentPath.startsWith("/staff");
          window.location.href = isStaffPath ? "/staff" : "/";
        }, 2000);
      }
    },
    [persistUser, isAr],
  );

  const syncUserWithServer = useCallback(
    async (token) => {
      if (!token) return null;

      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/me`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        const normalizedUser = { ...res.data, token };
        setUser(normalizedUser);
        persistUser(normalizedUser);
        return normalizedUser;
      } catch (error) {
        console.error("Failed to sync user with server:", error);
        logout(true);
        return null;
      }
    },
    [logout, persistUser],
  );

  useEffect(() => {
    let isMounted = true;

    const initializeUser = async () => {
      const savedUser = Cookies.get(COOKIE_KEY);

      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          if (isMounted) {
            setUser(parsedUser);
          }
          await syncUserWithServer(parsedUser.token);
        } catch (err) {
          console.warn("Failed to parse user cookie, clearing it", err);
          Cookies.remove(COOKIE_KEY);
        }
      }

      if (isMounted) {
        setLoading(false);
      }
    };

    initializeUser();

    return () => {
      isMounted = false;
    };
  }, [COOKIE_KEY, syncUserWithServer]);

  const login = (userData) => {
    hasShownExpiredToast.current = false;
    persistUser(userData);
    setUser(userData);
    syncUserWithServer(userData.token);
  };

  useEffect(() => {
    const isTokenError = (errorString) => {
      const s = errorString.toLowerCase();
      return (
        s.includes("invalid token") ||
        s.includes("invalid or expired token") ||
        s.includes("expired token") ||
        s.includes("jwt expired") ||
        s.includes("jwt malformed")
      );
    };

    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 403 || error.response?.status === 401) {
          const data = error.response?.data;
          const errorString =
            typeof data === "string" ? data : JSON.stringify(data ?? "");

          if (isTokenError(errorString)) {
            logout(true);
          }
        }
        return Promise.reject(error);
      },
    );

    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const response = await originalFetch(...args);

      if (response.status === 403 || response.status === 401) {
        try {
          const cloned = response.clone();
          const contentType = cloned.headers.get("content-type") || "";
          let payload = "";

          if (contentType.includes("application/json")) {
            const data = await cloned.json();
            payload = typeof data === "string" ? data : JSON.stringify(data);
          } else {
            payload = await cloned.text();
          }

          if (isTokenError(payload)) {
            logout(true);
          }
        } catch (err) {
          console.error("Failed to inspect fetch response:", err);
        }
      }

      return response;
    };

    return () => {
      axios.interceptors.response.eject(interceptor);
      window.fetch = originalFetch;
    };
  }, [logout]);

  const updatePhone = async (newPhone, navigate) => {
    if (!user) throw new Error("No user logged in");

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/update-phone`,
        { newPhone },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${user.token}`,
          },
        },
      );

      if (res.data.msg === "OTP sent to your phone") {
        toast.success(t("otp_sent"));
        navigate("/otp-verification", {
          state: { phone: user.phone, newPhone },
        });
      }

      const updatedUser = { ...user, phone: newPhone };
      setUser(updatedUser);
      persistUser(updatedUser);
    } catch (error) {
      console.error("Failed to update phone number:", error);
      throw error;
    }
  };

  const getAllUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/users`);
      if (res.status !== 200) throw new Error("Failed to fetch users");
      setAllUsers(res.data);
      return res.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error(t("error_fetching_users"));
      throw error;
    }
  };

  const isAuthenticated = !!user;

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated,
        allUsers,
        login,
        logout,
        updatePhone,
        getAllUsers,
        loading,
        refreshUser: () => syncUserWithServer(user?.token),
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
