import "./App.css";

import { UserCard } from "./components/User/UserCard";
import { SearchBar } from "./components/Search/SearchBar";
import { useUsers } from "./hooks/useUsers";

function App() {
  const {
    state,
    mode,
    query,
    selectedFields,
    visibleUsers,
    normalizedQuery,
    setSelectedFields,
    handleQueryChange,
    handleModeChange,
    searchById,
  } = useUsers();

  const request = mode === "id" ? state.search : state.users;

  return (
    <main className="app">
      <header className="app-header">
        <h1>Users</h1>
        <p>Search and explore user details.</p>
      </header>

      <SearchBar
        mode={mode}
        onModeChange={handleModeChange}
        query={query}
        onQueryChange={handleQueryChange}
        selectedFields={selectedFields}
        onFieldsChange={setSelectedFields}
        onSearchById={searchById}
      />

      <section className="results">
        {/* Initial API request */}
        {request.status === "loading" && (
          <p className="status" role="status">
            <span className="spinner" />
            {mode === "id" ? "Searching for user..." : "Loading users..."}
          </p>
        )}

        {request.status === "error" && (
          <p className="error" role="alert">
            {mode === "id"
              ? `${request.error.message}${request.error.statusCode ? ` (HTTP ${request.error.statusCode})` : ""}`
              : request.error.message}
          </p>
        )}

        {/* User results */}
        {request.status === "success" && visibleUsers.length > 0 && (
          <div className="user-list">
            {visibleUsers.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        )}

        {/* Local search empty states */}
        {mode === "local" &&
          request.status === "success" &&
          normalizedQuery &&
          selectedFields.length === 0 && (
            <p className="empty-state">Select at least one field to search.</p>
          )}

        {mode === "local" &&
          request.status === "success" &&
          normalizedQuery &&
          selectedFields.length > 0 &&
          visibleUsers.length === 0 && (
            <p className="empty-state">No matching users found.</p>
          )}

        {/* ID search empty state */}
        {mode === "id" &&
          request.status === "success" &&
          visibleUsers.length === 0 && (
            <p className="empty-state">No user found with that ID.</p>
          )}
      </section>
    </main>
  );
}

export default App;
