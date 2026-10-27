import { Search, X } from "lucide-react";
import styles from "./SearchBar.module.css";
import type { SearchField, SearchMode } from "./searchTypes";

interface SearchBarProps {
  mode: SearchMode;
  onModeChange: (mode: SearchMode) => void;

  query: string;
  onQueryChange: (query: string) => void;

  selectedFields: SearchField[];
  onFieldsChange: (fields: SearchField[]) => void;

  onSearchById: () => void;
}

const searchFields: { value: SearchField; label: string }[] = [
  { value: "firstname", label: "First name" },
  { value: "lastname", label: "Last name" },
  { value: "email", label: "Email" },
  { value: "username", label: "Username" },
  { value: "phone", label: "Phone" },
  { value: "website", label: "Website" },
  { value: "company", label: "Company" },
  { value: "city", label: "City" },
];

export function SearchBar({
  mode,
  onModeChange,
  query,
  onQueryChange,
  selectedFields,
  onFieldsChange,
  onSearchById,
}: SearchBarProps) {
  function toggleField(field: SearchField) {
    const nextFields = selectedFields.includes(field)
      ? selectedFields.filter((item) => item !== field)
      : [...selectedFields, field];

    onFieldsChange(nextFields);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (mode === "id") {
      onSearchById();
    }
  }

  return (
    <section className={styles.searchSection}>
      <div className={styles.modeSelector}>
        <label>
          <input
            type="radio"
            name="searchMode"
            checked={mode === "local"}
            onChange={() => onModeChange("local")}
          />
          Search users
        </label>

        <label>
          <input
            type="radio"
            name="searchMode"
            checked={mode === "id"}
            onChange={() => onModeChange("id")}
          />
          Search by ID
        </label>
      </div>

      <form className={styles.searchForm} onSubmit={handleSubmit}>
        <div className={styles.searchBar}>
          <Search className={styles.searchIcon} size={20} strokeWidth={1.8} />

          <input
            type={mode === "id" ? "number" : "search"}
            min={mode === "id" ? 1 : undefined}
            step={mode === "id" ? 1 : undefined}
            placeholder={mode === "id" ? "Enter user ID..." : "Search users..."}
            aria-label={mode === "id" ? "User ID" : "Search users"}
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
          />

          {query && (
            <button
              type="button"
              className={styles.clearButton}
              onClick={() => onQueryChange("")}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}

          {mode === "id" && (
            <button
              type="submit"
              className={styles.searchButton}
              disabled={
                !query.trim() ||
                !Number.isInteger(Number(query)) ||
                Number(query) <= 0
              }
            >
              Search
            </button>
          )}
        </div>
      </form>

      {mode === "id" ? (
        <p className={styles.hint}>
          Searching by ID will make an API request.
          <br />
          API supports id=1 Only.
        </p>
      ) : (
        <fieldset className={styles.fieldset}>
          <legend>Search in</legend>

          <div className={styles.fieldOptions}>
            {searchFields.map((field) => (
              <label key={field.value} className={styles.fieldOption}>
                <input
                  type="checkbox"
                  checked={selectedFields.includes(field.value)}
                  onChange={() => toggleField(field.value)}
                />
                {field.label}
              </label>
            ))}
          </div>
        </fieldset>
      )}
    </section>
  );
}
