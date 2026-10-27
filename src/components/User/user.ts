export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email?: string | null;
  birthDate?: string | null;
  login?: Login | null;
  address?: Address | null;
  phone?: string | null;
  website?: string | null;
  company?: Company | null;
}

export interface Login {
  uuid: string;
  username: string;
  password: string;
  md5?: string | null;
  sha1?: string | null;
  registered: string | null;
}

export interface Address {
  street?: string | null;
  suite?: string | null;
  city?: string | null;
  zipcode?: string | null;
  geo?: Geo | null;
}

export interface Geo {
  lat: string;
  lng: string;
}

export interface Company {
  name: string;
  catchPhrase?: string | null;
  bs?: string | null;
}

export const userTest: User = {
  id: 1,
  firstname: "John",
  lastname: "Doe",
  email: "oIj0z@example.com",
  birthDate: "1990-01-01",
  login: {
    uuid: "123e4567-e89b-12d3-a456-426614174000",
    username: "johndoe",
    password: "password123",
    registered: "2020-01-01",
  },
  address: {
    street: "123 Main St",
    suite: "Apt 4B",
    city: "Anytown",
    zipcode: "12345",
    geo: {
      lat: "40.7128",
      lng: "-74.0060",
    },
  },
  phone: "555-1234",
  website: "www.johndoe.com",
  company: {
    name: "Doe Enterprises",
    catchPhrase: "Innovating the future",
    bs: "business solutions",
  },
};
