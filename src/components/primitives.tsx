import { Check, Pencil } from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";

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

const defaultAvatarOptions = ["AD", "AM", "KM", "TU", "UX", "QA"];

export type AvatarPickerProps = {
  name: string;
  value: string;
  onChange: (value: string) => void;
  size?: InitialsAvatarProps["size"];
  options?: string[];
};

export function AvatarPicker({
  name,
  value,
  onChange,
  size = "large",
  options = defaultAvatarOptions,
}: AvatarPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState(value);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const focusFrame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(focusFrame);
  }, [isOpen]);

  const close = () => {
    setIsOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  };

  const save = () => {
    const next = draft
      .replace(/[^a-z0-9]/gi, "")
      .slice(0, 2)
      .toUpperCase();
    if (next) onChange(next);
    close();
  };

  const handleOptionKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) {
      return;
    }
    event.preventDefault();
    const buttons = [
      ...(event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>("[role=option]") ?? []),
    ];
    const index = buttons.indexOf(event.currentTarget);
    const amount = event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 1;
    buttons[(index + amount + buttons.length) % buttons.length]?.focus();
  };

  return (
    <div className={`avatar-picker ${isOpen ? "is-open" : ""}`}>
      <button
        ref={triggerRef}
        className="avatar-picker-trigger"
        type="button"
        aria-label={`Change ${name} avatar`}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={() => {
          if (!isOpen) setDraft(value);
          setIsOpen((current) => !current);
        }}
      >
        <InitialsAvatar size={size} label={value} name={name} />
        <span className="avatar-picker-edit" aria-hidden="true">
          <Pencil size={12} />
        </span>
      </button>
      {isOpen && (
        <div
          className="avatar-picker-popover"
          role="dialog"
          aria-label="Change avatar"
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.preventDefault();
              close();
            }
          }}
        >
          <div className="avatar-picker-heading">
            <strong>Change avatar</strong>
            <span>Pick initials for your workspace profile.</span>
          </div>
          <div className="avatar-picker-options" role="listbox" aria-label="Avatar options">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                role="option"
                aria-label={`Use ${option} avatar`}
                aria-selected={draft === option}
                onKeyDown={handleOptionKeyDown}
                onClick={() => setDraft(option)}
              >
                <span aria-hidden="true">
                  <InitialsAvatar size="medium" label={option} name={name} />
                </span>
                {draft === option && <Check size={14} aria-hidden="true" />}
              </button>
            ))}
          </div>
          <label className="avatar-picker-input">
            <span>Custom initials</span>
            <input
              ref={inputRef}
              value={draft}
              maxLength={2}
              autoComplete="off"
              onChange={(event) =>
                setDraft(
                  event.target.value
                    .replace(/[^a-z0-9]/gi, "")
                    .slice(0, 2)
                    .toUpperCase(),
                )
              }
            />
          </label>
          <div className="avatar-picker-footer">
            <button className="button button-secondary" type="button" onClick={close}>
              Cancel
            </button>
            <button className="button button-primary" type="button" onClick={save}>
              Save avatar
            </button>
          </div>
        </div>
      )}
    </div>
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
