import type { SearchField } from "../components/Search/searchTypes";
import type { User } from "../components/User/user";

/*
 * Read the value associated with a selected search field.
 * Optional nested properties are handled safely.
 */
function getSearchValue(
  user: User,
  field: SearchField,
): string | null | undefined {
  switch (field) {
    case "firstname":
      return user.firstname;

    case "lastname":
      return user.lastname;

    case "email":
      return user.email;

    case "username":
      return user.login?.username;

    case "phone":
      return user.phone;

    case "website":
      return user.website;

    case "company":
      return user.company?.name;

    case "city":
      return user.address?.city;
  }
}

/*
 * Search across the selected fields.
 * A user matches if ANY selected field contains the query.
 */
export function filterUsers(
  users: User[],
  query: string,
  selectedFields: SearchField[],
): User[] {
  const normalizedQuery = query.trim().toLocaleLowerCase();

  if (!normalizedQuery || selectedFields.length === 0) {
    return users;
  }

  return users.filter((user) =>
    selectedFields.some((field) => {
      const value = getSearchValue(user, field);

      return value?.toLocaleLowerCase().includes(normalizedQuery) ?? false;
    }),
  );
}
