import { verifyRecoveryOtpAction } from "@/features/auth/actions";
import { AuthForm } from "@/features/auth/auth-form";

export default function VerifyRecoveryPage() {
  return <AuthForm action={verifyRecoveryOtpAction} mode="verify" />;
}
