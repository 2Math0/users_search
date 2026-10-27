import { apiRequest } from "../../network/apiClient";
import type { User } from "./user";

/*
 * Reuse an in-flight request if React Strict Mode runs the effect again
 * during development. Clear the cache after failure so a retry is possible.
 */
let usersRequest: Promise<User[]> | null = null;

export function getUsers(): Promise<User[]> {
  if (usersRequest) {
    // look if there is a cached request
    return usersRequest;
  }

  const request = apiRequest<User[]>("/users");

  usersRequest = request;

  request.catch(() => {
    if (usersRequest === request) {
      usersRequest = null;
    }
  });

  return request;
}

export function getUser(id: number): Promise<User> {
  return apiRequest<User>(`/users?id=${id}`);
}
