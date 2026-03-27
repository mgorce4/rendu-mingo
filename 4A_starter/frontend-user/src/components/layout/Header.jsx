import { useTheme } from "../context/ThemeContext";

function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={theme === "dark" ? "bg-black" : "bg-white"}>
      <button onClick={toggleTheme}>Changer le thème</button>
    </div>
  );
}
