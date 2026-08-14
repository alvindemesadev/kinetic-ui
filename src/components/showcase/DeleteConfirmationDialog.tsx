import { useId, useRef } from "react";
import { CircleAlert, X } from "lucide-react";
import { toast } from "sonner";

import { useFocusTrap } from "@/hooks/useFocusTrap";
import { waitForDemo } from "@/sections/demoUtils";
import { LoadingButton } from "./LoadingButton";

interface DeleteConfirmationDialogProps {
  open: boolean;
  rowName: string;
  onOpenChange: (open: boolean) => void;
  onConfirm?: () => void;
  bodyText?: string;
  confirmLabel?: string;
  successTitle?: string;
  successDescription?: string;
}

/** The shared destructive confirmation surface used by row actions and overlays. */
export function DeleteConfirmationDialog({
  open,
  rowName,
  onOpenChange,
  onConfirm,
  bodyText = "This action removes the module from the workspace and cannot be undone.",
  confirmLabel = "Delete module",
  successTitle = "Module deleted",
  successDescription = `${rowName} was removed from the workspace.`,
}: DeleteConfirmationDialogProps) {
  const dialogRef = useRef<HTMLElement>(null);
  const titleId = `delete-confirmation-title-${useId().replace(/:/g, "")}`;
  const descriptionId = `delete-confirmation-description-${useId().replace(/:/g, "")}`;

  useFocusTrap(dialogRef, open);

  if (!open) return null;

  const close = () => onOpenChange(false);
  const confirmDelete = async () => {
    await waitForDemo(650);
    onConfirm?.();
    close();
    toast.success(successTitle, {
      description: successDescription,
    });
  };

  return (
    <div
      className="showcase-overlay-layer"
      role="presentation"
      onMouseDown={(event) => event.target === event.currentTarget && close()}
    >
      <section
        ref={dialogRef}
        className="showcase-overlay-card danger"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            close();
          }
        }}
      >
        <span className="showcase-overlay-handle" aria-hidden="true" />
        <header className="showcase-overlay-header">
          <div>
            <span className="eyebrow">Responsive overlay</span>
            <h2 id={titleId}>Delete</h2>
            <p>Confirm a destructive action.</p>
          </div>
          <button
            className="icon-button"
            type="button"
            aria-label="Close delete confirmation"
            onClick={close}
          >
            <X size={18} />
          </button>
        </header>

        <div className="showcase-overlay-body">
          <div className="overlay-confirmation-copy">
            <span className="overlay-confirmation-icon danger" aria-hidden="true">
              <CircleAlert size={22} />
            </span>
            <p>{`Delete ${rowName}?`}</p>
            <small id={descriptionId}>{bodyText}</small>
          </div>
        </div>

        <footer className="showcase-overlay-footer">
          <button className="button button-secondary" type="button" onClick={close}>
            Cancel
          </button>
          <LoadingButton className="button button-danger" loadingText="Deleting" onAction={confirmDelete}>
            {confirmLabel}
          </LoadingButton>
        </footer>
      </section>
    </div>
  );
}
