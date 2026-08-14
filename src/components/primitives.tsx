import { Check, ImagePlus, Pencil, RotateCcw, RotateCw } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";

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

export type AvatarImageTransform = {
  zoom: number;
  rotation: number;
  offsetX: number;
  offsetY: number;
};

export type AvatarImageValue = {
  src: string;
  transform?: AvatarImageTransform;
};

export type AvatarPickerProps = {
  name: string;
  value: string;
  onChange: (value: string) => void;
  size?: InitialsAvatarProps["size"];
  options?: string[];
  image?: AvatarImageValue | null;
  onImageChange?: (image: AvatarImageValue | null) => void;
};

type AvatarEditorMode = "initials" | "image";

const defaultImageTransform = (): AvatarImageTransform => ({
  zoom: 1,
  rotation: 0,
  offsetX: 0,
  offsetY: 0,
});

function resolvedImageTransform(transform?: AvatarImageTransform) {
  return { ...defaultImageTransform(), ...transform };
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function AvatarImagePreview({
  image,
  size,
  name,
}: {
  image: AvatarImageValue;
  size: InitialsAvatarProps["size"];
  name: string;
}) {
  const transform = resolvedImageTransform(image.transform);
  return (
    <span className={`avatar avatar-${size} avatar-image`} role="img" aria-label={`${name} avatar`}>
      <img
        src={image.src}
        alt=""
        draggable={false}
        style={{
          transform: `translate(${transform.offsetX}%, ${transform.offsetY}%) scale(${transform.zoom}) rotate(${transform.rotation}deg)`,
        }}
      />
    </span>
  );
}

export function AvatarPicker({
  name,
  value,
  onChange,
  size = "large",
  options = defaultAvatarOptions,
  image,
  onImageChange,
}: AvatarPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState(value);
  const [mode, setMode] = useState<AvatarEditorMode>(image ? "image" : "initials");
  const [imageDraft, setImageDraft] = useState<AvatarImageValue | null>(image ?? null);
  const [isDragging, setIsDragging] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    startX: number;
    startY: number;
    offsetX: number;
    offsetY: number;
  } | null>(null);
  const currentImage = image === undefined ? imageDraft : image;

  useEffect(() => {
    if (!isOpen) return;
    const focusFrame = requestAnimationFrame(() =>
      panelRef.current?.querySelector<HTMLButtonElement>('[role="tab"][aria-selected="true"]')?.focus(),
    );
    return () => cancelAnimationFrame(focusFrame);
  }, [isOpen]);

  const commitImage = (nextImage: AvatarImageValue | null) => {
    if (image === undefined) setImageDraft(nextImage);
    onImageChange?.(nextImage);
  };

  const close = () => {
    setIsOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  };

  const save = () => {
    if (mode === "image") {
      commitImage(
        imageDraft ? { ...imageDraft, transform: resolvedImageTransform(imageDraft.transform) } : null,
      );
      close();
      return;
    }
    const next = draft
      .replace(/[^a-z0-9]/gi, "")
      .slice(0, 2)
      .toUpperCase();
    if (next) {
      onChange(next);
      commitImage(null);
    }
    close();
  };

  const selectImage = (file?: File) => {
    if (!file?.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") return;
      setImageDraft({ src: reader.result, transform: defaultImageTransform() });
      setMode("image");
    };
    reader.readAsDataURL(file);
  };

  const handleImagePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!imageDraft) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const transform = resolvedImageTransform(imageDraft.transform);
    dragRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      offsetX: transform.offsetX,
      offsetY: transform.offsetY,
    };
    setIsDragging(true);
  };

  const handleImagePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || !event.currentTarget.hasPointerCapture(event.pointerId)) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    setImageDraft((current) => {
      if (!current) return current;
      const transform = resolvedImageTransform(current.transform);
      return {
        ...current,
        transform: {
          ...transform,
          offsetX: clamp(drag.offsetX + ((event.clientX - drag.startX) / bounds.width) * 100, -50, 50),
          offsetY: clamp(drag.offsetY + ((event.clientY - drag.startY) / bounds.height) * 100, -50, 50),
        },
      };
    });
  };

  const endImageDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    dragRef.current = null;
    setIsDragging(false);
  };

  const updateImageTransform = (update: Partial<AvatarImageTransform>) => {
    setImageDraft((current) =>
      current
        ? {
            ...current,
            transform: { ...resolvedImageTransform(current.transform), ...update },
          }
        : current,
    );
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
          if (!isOpen) {
            setDraft(value);
            setImageDraft(currentImage ?? null);
            setMode(currentImage ? "image" : "initials");
          }
          setIsOpen((current) => !current);
        }}
      >
        {currentImage ? (
          <AvatarImagePreview image={currentImage} size={size} name={name} />
        ) : (
          <InitialsAvatar size={size} label={value} name={name} />
        )}
        <span className="avatar-picker-edit" aria-hidden="true">
          <Pencil size={12} />
        </span>
      </button>
      {isOpen && (
        <div
          ref={panelRef}
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
            <span>Use initials or upload an image for your workspace profile.</span>
          </div>
          <div className="avatar-picker-tabs" role="tablist" aria-label="Avatar type">
            {(["initials", "image"] as const).map((nextMode) => (
              <button
                key={nextMode}
                type="button"
                role="tab"
                aria-selected={mode === nextMode}
                onClick={() => {
                  setMode(nextMode);
                  if (nextMode === "initials") setDraft(value);
                  if (nextMode === "image") setImageDraft(currentImage ?? null);
                }}
              >
                {nextMode === "initials" ? "Initials" : "Image"}
              </button>
            ))}
          </div>
          {mode === "initials" ? (
            <>
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
            </>
          ) : (
            <div className="avatar-image-editor-wrap">
              <div
                className={`avatar-image-editor ${isDragging ? "is-dragging" : ""}`}
                role="group"
                aria-label="Avatar image crop area"
                tabIndex={imageDraft ? 0 : -1}
                onPointerDown={handleImagePointerDown}
                onPointerMove={handleImagePointerMove}
                onPointerUp={endImageDrag}
                onPointerCancel={endImageDrag}
                onKeyDown={(event) => {
                  const amount = event.shiftKey ? 10 : 2;
                  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
                    event.preventDefault();
                    updateImageTransform({
                      offsetX: clamp(
                        resolvedImageTransform(imageDraft?.transform).offsetX +
                          (event.key === "ArrowLeft" ? -amount : amount),
                        -50,
                        50,
                      ),
                    });
                  } else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                    event.preventDefault();
                    updateImageTransform({
                      offsetY: clamp(
                        resolvedImageTransform(imageDraft?.transform).offsetY +
                          (event.key === "ArrowUp" ? -amount : amount),
                        -50,
                        50,
                      ),
                    });
                  }
                }}
              >
                {imageDraft ? (
                  <img
                    src={imageDraft.src}
                    alt=""
                    draggable={false}
                    style={{
                      transform: (() => {
                        const transform = resolvedImageTransform(imageDraft.transform);
                        return `translate(${transform.offsetX}%, ${transform.offsetY}%) scale(${transform.zoom}) rotate(${transform.rotation}deg)`;
                      })(),
                    }}
                  />
                ) : (
                  <span className="avatar-image-editor-empty">
                    <ImagePlus size={20} />
                    <strong>Choose an image</strong>
                    <small>Drag to position it</small>
                  </span>
                )}
                <span className="avatar-image-editor-frame" aria-hidden="true" />
              </div>
              <div className="avatar-image-tools">
                <label className="avatar-picker-upload button button-secondary">
                  <ImagePlus size={14} />
                  {imageDraft ? "Replace image" : "Upload image"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => selectImage(event.target.files?.[0])}
                  />
                </label>
                <div className="avatar-image-rotate" aria-label="Rotate image">
                  <button
                    className="icon-button"
                    type="button"
                    aria-label="Rotate image left"
                    disabled={!imageDraft}
                    onClick={() =>
                      updateImageTransform({
                        rotation: (resolvedImageTransform(imageDraft?.transform).rotation + 270) % 360,
                      })
                    }
                  >
                    <RotateCcw size={15} />
                  </button>
                  <button
                    className="icon-button"
                    type="button"
                    aria-label="Rotate image right"
                    disabled={!imageDraft}
                    onClick={() =>
                      updateImageTransform({
                        rotation: (resolvedImageTransform(imageDraft?.transform).rotation + 90) % 360,
                      })
                    }
                  >
                    <RotateCw size={15} />
                  </button>
                </div>
              </div>
              <label className="avatar-image-zoom">
                <span>Zoom</span>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.05"
                  value={resolvedImageTransform(imageDraft?.transform).zoom}
                  disabled={!imageDraft}
                  aria-label="Image zoom"
                  onChange={(event) => updateImageTransform({ zoom: Number(event.target.value) })}
                />
                <output>{resolvedImageTransform(imageDraft?.transform).zoom.toFixed(2)}×</output>
              </label>
              <button
                className="avatar-image-reset"
                type="button"
                disabled={!imageDraft}
                onClick={() =>
                  setImageDraft((current) =>
                    current ? { ...current, transform: defaultImageTransform() } : current,
                  )
                }
              >
                Reset position
              </button>
            </div>
          )}
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
