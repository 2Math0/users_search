import { describe, expect, it } from "vitest";

import { userTest } from "../components/User/user";
import { ApiErrors } from "../network/apiError";
import { initialUsersState, usersReducer, type UsersState } from "./userReducer";

const testUser = userTest;
const testError = ApiErrors.NETWORK;

describe("usersReducer", () => {
  it("starts with a loading users list and idle search", () => {
    expect(initialUsersState).toEqual({
      users: { status: "loading" },
      search: { status: "idle" },
    });
  });

  it("INITIAL_SUCCESS stores the users list and leaves search untouched", () => {
    const before: UsersState = {
      users: { status: "loading" },
      search: { status: "idle" },
    };
    const after = usersReducer(before, {
      type: "INITIAL_SUCCESS",
      users: [testUser],
    });

    expect(after.users).toEqual({ status: "success", data: [testUser] });
    expect(after.search).toEqual(before.search);
  });

  it("INITIAL_FAILURE stores the error and leaves search untouched", () => {
    const before: UsersState = {
      users: { status: "loading" },
      search: { status: "success", data: testUser },
    };
    const after = usersReducer(before, {
      type: "INITIAL_FAILURE",
      error: testError,
    });

    expect(after.users).toEqual({ status: "error", error: testError });
    expect(after.search).toEqual(before.search);
  });

  it("SEARCH_START leaves the users list untouched", () => {
    const before: UsersState = {
      users: { status: "success", data: [testUser] },
      search: { status: "idle" },
    };
    const after = usersReducer(before, { type: "SEARCH_START" });

    expect(after.users).toEqual(before.users);
    expect(after.search).toEqual({ status: "loading" });
  });

  it("SEARCH_SUCCESS stores the user and leaves the users list untouched", () => {
    const before: UsersState = {
      users: { status: "success", data: [testUser] },
      search: { status: "loading" },
    };
    const after = usersReducer(before, {
      type: "SEARCH_SUCCESS",
      user: testUser,
    });

    expect(after.users).toEqual(before.users);
    expect(after.search).toEqual({ status: "success", data: testUser });
  });

  it("SEARCH_FAILURE stores the error and leaves the users list untouched", () => {
    const before: UsersState = {
      users: { status: "success", data: [testUser] },
      search: { status: "loading" },
    };
    const after = usersReducer(before, {
      type: "SEARCH_FAILURE",
      error: testError,
    });

    expect(after.users).toEqual(before.users);
    expect(after.search).toEqual({ status: "error", error: testError });
  });

  it("SEARCH_CLEAR resets search to idle and leaves the users list untouched", () => {
    const before: UsersState = {
      users: { status: "success", data: [testUser] },
      search: { status: "error", error: testError },
    };
    const after = usersReducer(before, { type: "SEARCH_CLEAR" });

    expect(after.users).toEqual(before.users);
    expect(after.search).toEqual({ status: "idle" });
  });

  it("does not mutate the previous state", () => {
    const before: UsersState = {
      users: { status: "success", data: [testUser] },
      search: { status: "idle" },
    };
    const snapshot = structuredClone(before);

    usersReducer(before, { type: "SEARCH_START" });

    expect(before).toEqual(snapshot);
  });
});
