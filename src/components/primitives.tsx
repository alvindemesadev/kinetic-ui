export type InitialsAvatarProps = {
  size?: "small" | "medium" | "large";
  label?: string;
  name?: string;
};

export function InitialsAvatar({ size = "medium", label, name = "User" }: InitialsAvatarProps) {
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
      <span aria-hidden="true">{initials}</span>
    </span>
  );
}

export function StatusPill({ status }: { status: string }) {
  return <span className={`badge badge-${status.toLowerCase()}`}>{status}</span>;
}

export type SwitchControlProps = {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
};

export function SwitchControl({ checked, onChange, label }: SwitchControlProps) {
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
