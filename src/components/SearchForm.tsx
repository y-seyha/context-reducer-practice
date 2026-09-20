import { useState } from "react";

export type SearchFormProps = {
  onSubmit: (value: string) => void;
};

export function SearchForm({ onSubmit }: SearchFormProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!value.trim()) {
      setError("Please enter a search term.");
      return;
    }

    setError("");
    onSubmit(value.trim());
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="search">Search</label>
      <input
        id="search"
        name="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <button type="submit">Search</button>
      {error ? <p role="alert">{error}</p> : null}
    </form>
  );
}
