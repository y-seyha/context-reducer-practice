import { useState } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { useLocalStorage } from "../hooks/useLocalStorage";

export function SearchDemo() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [theme, setTheme] = useLocalStorage<"light" | "dark">("theme", "light");

  return (
    <div>
      <label htmlFor="search-demo">Search</label>
      <input
        id="search-demo"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      <div>
        <p>Raw value: {search}</p>
        <p>Debounced value: {debouncedSearch}</p>
      </div>

      <button
        type="button"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      >
        Toggle theme ({theme})
      </button>
    </div>
  );
}
