import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

const ThemeProvider = (props) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "english";
  });

  const toggleLanguage = () => {
    setLanguage((prev) => {
      const newLanguage = prev === "vietnamese" ? "english" : "vietnamese";
      localStorage.setItem("language", newLanguage);
      return newLanguage;
    });
  };

  // eslint-disable-next-line no-unused-vars
  const prefersDarkMode = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  const [darkMode, setDarkMode] = useState(() => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme ? storedTheme === "dark" : true;
  });

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem("theme", newMode ? "dark" : "light");
      return newMode;
    });
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const value = { language, darkMode, toggleLanguage, toggleDarkMode };

  return (
    <ThemeContext.Provider value={value} {...props}></ThemeContext.Provider>
  );
};

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (typeof context === "undefined")
    throw new Error("useTheme must be used within a ThemeContext");
  return context;
};

export { ThemeProvider, useTheme };
