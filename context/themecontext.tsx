// @/context/themecontext.tsx
import Colors from "@/constants/colors";
import { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";

export const ThemeContext = createContext({
  isDark: false,
  colors: Colors.light,
  setScheme: (scheme: string) => {},
});

export const ThemeProvider = (props: any) => {
  const colorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(colorScheme === "dark");

  useEffect(() => {
    setIsDark(colorScheme === "dark");
  }, [colorScheme]);

  const defaultTheme = {
    isDark,
    colors: isDark ? Colors.dark : Colors.light,
    setScheme: (scheme: string) => setIsDark(scheme === "dark"),
  };

  return (
    <ThemeContext.Provider value={defaultTheme}>
      {props.children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
