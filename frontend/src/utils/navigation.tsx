import { router } from "expo-router";

// Ir para uma página
export function goToLogin() {
  router.push("/auth/login");
}

export function goToRegister() {
  router.push("/auth/register");
}

export function goToHome() {
  router.push("/tabs/home");
}

export function goBack() {
  router.back();
}

// Substituir por uma página
export function replaceToLogin() {
  router.replace("/auth/login");
}

export function replaceToHome() {
  router.replace("/tabs/home");
}
