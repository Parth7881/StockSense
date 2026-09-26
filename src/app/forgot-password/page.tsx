import { forgotPasswordAction } from "@/features/auth/actions";
import { AuthForm } from "@/features/auth/auth-form";

export default function ForgotPasswordPage() {
  return <AuthForm action={forgotPasswordAction} mode="forgot" />;
}
