import type { ApiError } from "../network/apiError";
import type { User } from "../components/User/user";

type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: ApiError };

export interface UsersState {
  users: AsyncState<User[]>;
  search: AsyncState<User>;
}

export const initialUsersState: UsersState = {
  users: { status: "loading" },
  search: { status: "idle" },
};
type UsersAction =
  | { type: "INITIAL_SUCCESS"; users: User[] }
  | { type: "INITIAL_FAILURE"; error: ApiError }
  | { type: "SEARCH_START" }
  | { type: "SEARCH_SUCCESS"; user: User }
  | { type: "SEARCH_FAILURE"; error: ApiError }
  | { type: "SEARCH_CLEAR" };

export function usersReducer(
  state: UsersState,
  action: UsersAction,
): UsersState {
  switch (action.type) {
    case "INITIAL_SUCCESS":
      return {
        ...state,
        users: { status: "success", data: action.users },
      };
    case "INITIAL_FAILURE":
      return {
        ...state,
        users: {
          status: "error",
          error: action.error,
        },
      };
    case "SEARCH_START":
      return { ...state, search: { status: "loading" } };
    case "SEARCH_SUCCESS":
      return { ...state, search: { status: "success", data: action.user } };
    case "SEARCH_FAILURE":
      return { ...state, search: { status: "error", error: action.error } };
    case "SEARCH_CLEAR":
      return { ...state, search: { status: "idle" } };
  }
}
