import { useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { LoaderCircle } from "lucide-react";

import { cn } from "@/lib/utils";

export type LoadingButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> & {
  loadingText?: ReactNode;
  loadingLabel?: string;
  minimumLoadingTime?: number;
  onAction?: () => unknown | Promise<unknown>;
  onError?: (error: unknown) => void;
};

function wait(duration: number) {
  return new Promise<void>((resolve) => window.setTimeout(resolve, duration));
}

export function LoadingButton({
  children,
  className,
  disabled,
  loadingText = "Loading",
  loadingLabel,
  minimumLoadingTime = 650,
  onAction,
  onError,
  type = "button",
  ...props
}: LoadingButtonProps) {
  const [loading, setLoading] = useState(false);

  async function runAction() {
    if (loading || disabled) return;
    setLoading(true);

    try {
      await Promise.all([Promise.resolve(onAction?.()), wait(Math.max(0, minimumLoadingTime))]);
    } catch (error) {
      onError?.(error);
    } finally {
      setLoading(false);
    }
  }

  const accessibleLoadingLabel = loadingLabel ?? (typeof loadingText === "string" ? loadingText : "Loading");

  return (
    <button
      {...props}
      className={cn("loading-button", className)}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading}
      aria-label={loading ? accessibleLoadingLabel : props["aria-label"]}
      data-loading={loading || undefined}
      onClick={runAction}
    >
      <span className="loading-button-content" aria-hidden={loading || undefined}>
        {children}
      </span>
      {loading ? (
        <span className="loading-button-status" aria-hidden="true">
          <LoaderCircle className="loading-button-spinner" />
          {loadingText}
        </span>
      ) : null}
    </button>
  );
}
