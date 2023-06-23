"use server";

import { logout } from "@/app/services/user";

export const handleLogout = async () => logout();
