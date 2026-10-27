import { useEffect, useReducer, useRef, useState } from "react";

import { getUser, getUsers } from "../components/User/userApi";
import type { User } from "../components/User/user";

import { getApiError } from "../network/apiError";
import { usersReducer, initialUsersState } from "../reducers/userReducer";
import type { SearchField, SearchMode } from "../components/Search/searchTypes";
import { filterUsers } from "../utils/UserSearch";

export function useUsers() {
  const [state, dispatch] = useReducer(usersReducer, initialUsersState);

  const [mode, setMode] = useState<SearchMode>("local");
  const [query, setQuery] = useState("");

  const [selectedFields, setSelectedFields] = useState<SearchField[]>([
    "firstname",
    "lastname",
  ]);

  /*
   * Used to ignore outdated ID search responses.
   * Updating a ref doesn't trigger a component render.
   */
  const latestRequestId = useRef(0);

  /*
   * Load the initial users list when the hook's component mounts.
   * The active flag prevents this effect from dispatching after cleanup.
   */
  useEffect(() => {
    let active = true;

    getUsers()
      .then((users) => {
        if (active) {
          dispatch({
            type: "INITIAL_SUCCESS",
            users,
          });
        }
      })
      .catch((error: unknown) => {
        if (active) {
          dispatch({
            type: "INITIAL_FAILURE",
            error: getApiError(error),
          });
        }
      });

    return () => {
      active = false;
    };
  }, []);

  /*
   * Changing the input invalidates any pending ID search.
   * An old response must not overwrite the current search state.
   */
  function handleQueryChange(value: string) {
    setQuery(value);

    latestRequestId.current += 1;

    dispatch({ type: "SEARCH_CLEAR" });
  }

  /*
   * Switching modes resets the input and ID search state.
   */
  function handleModeChange(nextMode: SearchMode) {
    setMode(nextMode);
    setQuery("");

    latestRequestId.current += 1;

    dispatch({ type: "SEARCH_CLEAR" });
  }

  /*
   * Search the API by ID.
   * Request sequence numbers prevent older responses from winning races.
   */
  async function searchById() {
    const id = Number(query);

    if (!Number.isInteger(id) || id <= 0) {
      return;
    }

    const requestId = ++latestRequestId.current;

    dispatch({ type: "SEARCH_START" });

    try {
      const user = await getUser(id);

      if (requestId !== latestRequestId.current) {
        return;
      }

      dispatch({
        type: "SEARCH_SUCCESS",
        user,
      });
    } catch (error: unknown) {
      if (requestId !== latestRequestId.current) {
        return;
      }

      dispatch({
        type: "SEARCH_FAILURE",
        error: getApiError(error),
      });
    }
  }

  /*
   * Local filtering is derived from the original list.
   * ID search results are managed separately by the reducer.
   */
  const normalizedQuery = query.trim().toLocaleLowerCase();

  const filteredUsers = filterUsers(
    state.users.status === "success" ? state.users.data : [],
    query,
    selectedFields,
  );

  const visibleUsers: User[] =
    mode === "id"
      ? state.search.status === "success"
        ? [state.search.data]
        : []
      : filteredUsers;

  return {
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
  };
}
