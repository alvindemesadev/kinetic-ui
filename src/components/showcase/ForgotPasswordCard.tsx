import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { CheckCircle2, Eye, EyeOff, KeyRound, LoaderCircle, LockKeyhole, Mail } from "lucide-react";

import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";

type RecoveryStep = "email" | "code" | "password" | "complete";

export type ForgotPasswordCardProps = {
  className?: string;
  onRequestCode?: (email: string) => void | Promise<void>;
  onResendCode?: (email: string) => void | Promise<void>;
  onResetPassword?: (email: string) => void | Promise<void>;
};

const steps: Array<{ key: RecoveryStep; label: string }> = [
  { key: "email", label: "Email" },
  { key: "code", label: "Code" },
  { key: "password", label: "Reset" },
];

export function ForgotPasswordCard({
  className,
  onRequestCode,
  onResendCode,
  onResetPassword,
}: ForgotPasswordCardProps) {
  const formId = useId();
  const emailRef = useRef<HTMLInputElement>(null);
  const codeRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<RecoveryStep>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const target =
      step === "email" ? emailRef.current : step === "code" ? codeRef.current : passwordRef.current;
    target?.focus();
  }, [step]);

  const stepIndex = steps.findIndex(({ key }) => key === step);
  const stepLabel = step === "complete" ? "Complete" : `${stepIndex + 1} of 3`;

  async function runAction(action?: () => void | Promise<void>) {
    setSubmitting(true);
    try {
      await action?.();
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (step === "email") {
      if (!email.trim()) {
        setError("Enter the email address for your workspace.");
        return;
      }
      await runAction(async () => {
        await onRequestCode?.(email.trim());
        setStep("code");
      });
      return;
    }

    if (step === "code") {
      if (!/^\d{6}$/.test(code)) {
        setError("Enter the six-digit code from your email.");
        return;
      }
      setStep("password");
      return;
    }

    if (step === "password") {
      if (password.length < 8) {
        setError("Use at least 8 characters for your new password.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      await runAction(async () => {
        await onResetPassword?.(email.trim());
        setStep("complete");
      });
    }
  }

  function goBack() {
    setError("");
    setStep(step === "password" ? "code" : "email");
  }

  function restart() {
    setError("");
    setCode("");
    setPassword("");
    setConfirmPassword("");
    setStep("email");
  }

  return (
    <article
      className={cn("panel auth-card forgot-password-card", className)}
      data-slot="forgot-password-card"
    >
      <header className="auth-card-header">
        <span className="auth-brand-mark" aria-hidden="true">
          <KeyRound size={16} />
        </span>
        <div>
          <span>Password recovery · {stepLabel}</span>
          <h3>{step === "complete" ? "Password updated" : "Forgot password"}</h3>
          <p>
            {step === "email"
              ? "We’ll send a one-time reset code to your workspace email."
              : step === "code"
                ? `Enter the code sent to ${email || "your email"}.`
                : step === "password"
                  ? "Choose a new password for your Kinetic workspace."
                  : "Your new password is ready to use."}
          </p>
        </div>
      </header>

      <ol className="forgot-password-steps" aria-label="Password recovery steps">
        {steps.map(({ key, label }, index) => {
          const complete = step === "complete" || index < stepIndex;
          const active = step === key;
          return (
            <li className={cn(complete && "is-complete", active && "is-active")} key={key}>
              <span aria-hidden="true">{complete ? <CheckCircle2 size={13} /> : index + 1}</span>
              <strong>{label}</strong>
            </li>
          );
        })}
      </ol>

      {step === "complete" ? (
        <div className="forgot-password-success" role="status">
          <span className="forgot-password-success-icon" aria-hidden="true">
            <CheckCircle2 size={24} />
          </span>
          <strong>Password reset complete</strong>
          <p>Sign in with your new password to continue to the workspace.</p>
          <button className="auth-submit" type="button" onClick={restart}>
            Return to recovery
          </button>
        </div>
      ) : (
        <form className="auth-form forgot-password-form" onSubmit={handleSubmit} aria-busy={submitting}>
          {step === "email" ? (
            <div className="auth-field">
              <label htmlFor={`${formId}-email`}>Email address</label>
              <span className="auth-input-shell">
                <Mail size={15} aria-hidden="true" />
                <input
                  ref={emailRef}
                  id={`${formId}-email`}
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </span>
            </div>
          ) : null}

          {step === "code" ? (
            <div className="auth-field">
              <label htmlFor={`${formId}-code`}>Verification code</label>
              <InputOTP
                ref={codeRef}
                id={`${formId}-code`}
                className="forgot-password-otp"
                maxLength={6}
                value={code}
                onChange={setCode}
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]*"
                aria-label="Verification code"
                required
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <span className="forgot-password-field-note">Demo code: 123456</span>
            </div>
          ) : null}

          {step === "password" ? (
            <>
              <div className="auth-field">
                <label htmlFor={`${formId}-password`}>New password</label>
                <span className="auth-input-shell">
                  <LockKeyhole size={15} aria-hidden="true" />
                  <input
                    ref={passwordRef}
                    id={`${formId}-password`}
                    type={passwordVisible ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
                    minLength={8}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                  <button
                    className="auth-password-toggle"
                    type="button"
                    aria-label={passwordVisible ? "Hide new password" : "Show new password"}
                    onClick={() => setPasswordVisible((visible) => !visible)}
                  >
                    {passwordVisible ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </span>
              </div>
              <div className="auth-field">
                <label htmlFor={`${formId}-confirm-password`}>Confirm new password</label>
                <span className="auth-input-shell">
                  <LockKeyhole size={15} aria-hidden="true" />
                  <input
                    id={`${formId}-confirm-password`}
                    type={confirmVisible ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Repeat your password"
                    minLength={8}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    required
                  />
                  <button
                    className="auth-password-toggle"
                    type="button"
                    aria-label={confirmVisible ? "Hide confirmation password" : "Show confirmation password"}
                    onClick={() => setConfirmVisible((visible) => !visible)}
                  >
                    {confirmVisible ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </span>
              </div>
            </>
          ) : null}

          {error ? (
            <p className="auth-error" role="alert">
              {error}
            </p>
          ) : null}

          <div className="forgot-password-actions">
            {step !== "email" ? (
              <button
                className="button button-secondary"
                type="button"
                onClick={goBack}
                disabled={submitting}
              >
                Back
              </button>
            ) : null}
            <button className="auth-submit" type="submit" disabled={submitting}>
              {submitting ? <LoaderCircle className="loading-button-spinner" size={15} /> : null}
              {submitting
                ? step === "email"
                  ? "Sending code"
                  : "Updating password"
                : step === "email"
                  ? "Send reset code"
                  : step === "code"
                    ? "Verify code"
                    : "Reset password"}
            </button>
          </div>
        </form>
      )}

      {step === "code" ? (
        <footer className="auth-card-footer forgot-password-footer">
          <span>Didn’t receive the email?</span>
          <button
            className="auth-text-button"
            type="button"
            disabled={submitting}
            onClick={() => void runAction(() => onResendCode?.(email.trim()))}
          >
            Resend code
          </button>
        </footer>
      ) : null}

      {step === "email" ? (
        <footer className="auth-card-footer">
          <span>Need help? Contact your workspace administrator.</span>
        </footer>
      ) : null}
    </article>
  );
}
