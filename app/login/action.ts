"use server";

import type { User } from "@/app/types/user";
import { validateCredentials } from "@/app/services/user";

export const handleLogin = async (user: User) => validateCredentials(user);
