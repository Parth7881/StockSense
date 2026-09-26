import { updatePasswordAction } from "@/features/auth/actions";
import { AuthForm } from "@/features/auth/auth-form";

export default function UpdatePasswordPage() {
  return <AuthForm action={updatePasswordAction} mode="update" />;
}
