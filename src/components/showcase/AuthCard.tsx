import { useId, useState, type FormEvent } from "react";
import { Component, Eye, EyeOff, LoaderCircle, LockKeyhole, Mail, User } from "lucide-react";

import { cn } from "@/lib/utils";

export type AuthCardMode = "login" | "signup";

export type AuthCardValues = {
  name?: string;
  email: string;
  password: string;
  remember: boolean;
};

export type AuthCardProps = {
  mode: AuthCardMode;
  className?: string;
  onSubmit?: (values: AuthCardValues) => void | Promise<void>;
  onModeChange?: (mode: AuthCardMode) => void;
  onForgotPassword?: () => void;
};

export function AuthCard({ mode, className, onSubmit, onModeChange, onForgotPassword }: AuthCardProps) {
  const formId = useId();
  const isSignup = mode === "signup";
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") ?? "");

    if (isSignup && password !== String(form.get("confirmPassword") ?? "")) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setSubmitting(true);
    try {
      await Promise.all([
        Promise.resolve(
          onSubmit?.({
            name: isSignup ? String(form.get("name") ?? "") : undefined,
            email: String(form.get("email") ?? ""),
            password,
            remember: form.get("remember") === "on",
          }),
        ),
        new Promise<void>((resolve) => window.setTimeout(resolve, 700)),
      ]);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <article className={cn("panel auth-card", className)} data-slot="auth-card">
      <header className="auth-card-header">
        <span className="auth-brand-mark" aria-hidden="true">
          <Component size={16} />
        </span>
        <div>
          <span>{isSignup ? "Create your workspace" : "Welcome back"}</span>
          <h3>{isSignup ? "Create account" : "Sign in"}</h3>
          <p>{isSignup ? "Start building with Kinetic today." : "Continue to your Kinetic workspace."}</p>
        </div>
      </header>

      <form className="auth-form" onSubmit={handleSubmit} noValidate={false} aria-busy={submitting}>
        {isSignup ? (
          <div className="auth-field">
            <label htmlFor={`${formId}-name`}>Full name</label>
            <span className="auth-input-shell">
              <User size={15} aria-hidden="true" />
              <input
                id={`${formId}-name`}
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Alvin de Mesa"
                required
              />
            </span>
          </div>
        ) : null}

        <div className="auth-field">
          <label htmlFor={`${formId}-email`}>Email address</label>
          <span className="auth-input-shell">
            <Mail size={15} aria-hidden="true" />
            <input
              id={`${formId}-email`}
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
            />
          </span>
        </div>

        <div className="auth-field">
          <label htmlFor={`${formId}-password`}>Password</label>
          <span className="auth-input-shell">
            <LockKeyhole size={15} aria-hidden="true" />
            <input
              id={`${formId}-password`}
              name="password"
              type={passwordVisible ? "text" : "password"}
              autoComplete={isSignup ? "new-password" : "current-password"}
              placeholder="At least 8 characters"
              minLength={8}
              required
            />
            <button
              className="auth-password-toggle"
              type="button"
              aria-label={passwordVisible ? "Hide password" : "Show password"}
              onClick={() => setPasswordVisible((visible) => !visible)}
            >
              {passwordVisible ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </span>
        </div>

        {isSignup ? (
          <div className="auth-field">
            <label htmlFor={`${formId}-confirm-password`}>Confirm password</label>
            <span className="auth-input-shell">
              <LockKeyhole size={15} aria-hidden="true" />
              <input
                id={`${formId}-confirm-password`}
                name="confirmPassword"
                type={passwordVisible ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Repeat your password"
                minLength={8}
                required
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${formId}-error` : undefined}
              />
            </span>
          </div>
        ) : null}

        <div className="auth-options">
          <label className="auth-check">
            <input name="remember" type="checkbox" required={isSignup} />
            <span className="auth-check-control" aria-hidden="true" />
            <span>{isSignup ? "I agree to the terms" : "Remember me"}</span>
          </label>
          {!isSignup ? (
            <button className="auth-text-button" type="button" onClick={onForgotPassword}>
              Forgot password?
            </button>
          ) : null}
        </div>

        {error ? (
          <p className="auth-error" id={`${formId}-error`} role="alert">
            {error}
          </p>
        ) : null}

        <button className="auth-submit" type="submit" disabled={submitting} aria-busy={submitting}>
          {submitting ? <LoaderCircle className="loading-button-spinner" size={15} /> : null}
          {submitting
            ? isSignup
              ? "Creating account"
              : "Signing in"
            : isSignup
              ? "Create account"
              : "Sign in"}
        </button>
      </form>

      <footer className="auth-card-footer">
        <span>{isSignup ? "Already have an account?" : "New to Kinetic?"}</span>
        <button
          className="auth-text-button"
          type="button"
          onClick={() => onModeChange?.(isSignup ? "login" : "signup")}
        >
          {isSignup ? "Sign in" : "Create account"}
        </button>
      </footer>
    </article>
  );
}
