import { loginAction } from "@/features/auth/actions";
import { AuthForm } from "@/features/auth/auth-form";

export default function LoginPage() {
  return <AuthForm action={loginAction} mode="login" />;
}
