import axios from "axios";

const BASE_URL = import.meta.env["VITE_API_URL"] ?? "http://localhost:3001";

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthData {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    avatarUrl: string | null;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export async function login(input: LoginInput): Promise<AuthData> {
  const { data } = await axios.post<{ success: boolean; data: AuthData }>(
    `${BASE_URL}/api/auth/login`,
    input,
  );

  if (!data.success || !data.data) {
    throw new Error("Login failed");
  }

  return data.data;
}
