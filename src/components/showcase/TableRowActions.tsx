import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";

interface TableRowActionsProps {
  rowName: string;
}

export function TableRowActions({ rowName }: TableRowActionsProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="icon-button table-row-actions-trigger"
            aria-label={`Actions for ${rowName}`}
            type="button"
          >
            <MoreHorizontal size={16} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="table-row-actions-menu">
          <DropdownMenuLabel>{rowName}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => toast("View module", { description: `${rowName} opened for review.` })}
          >
            <Eye />
            View
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => toast("Edit module", { description: `${rowName} is ready to edit.` })}
          >
            <Pencil />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onSelect={() => setDeleteOpen(true)}>
            <Trash2 />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteConfirmationDialog open={deleteOpen} rowName={rowName} onOpenChange={setDeleteOpen} />
    </>
  );
}
