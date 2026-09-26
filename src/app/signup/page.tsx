import { signUpAction } from "@/features/auth/actions";
import { AuthForm } from "@/features/auth/auth-form";

export default function SignUpPage() {
  return <AuthForm action={signUpAction} mode="signup" />;
}
