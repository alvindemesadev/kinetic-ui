export type AvatarProps = {
  size?: "small" | "medium" | "large";
  label?: string;
  name?: string;
};

export function Avatar({ size = "medium", label, name = "User" }: AvatarProps) {
  const initials =
    label ??
    name
      .split(/\s+/)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  return (
    <span className={`avatar avatar-${size}`} role="img" aria-label={`${name} avatar`}>
      {initials}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  return <span className={`badge badge-${status.toLowerCase()}`}>{status}</span>;
}

export type ToggleProps = {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
};

export function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <button
      className={`switch ${checked ? "is-on" : ""}`}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
    >
      <span />
    </button>
  );
}
