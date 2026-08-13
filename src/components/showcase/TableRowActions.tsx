import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface TableRowActionsProps {
  rowName: string;
}

export function TableRowActions({ rowName }: TableRowActionsProps) {
  return (
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
        <DropdownMenuItem
          variant="destructive"
          onSelect={() => toast.error("Delete module", { description: `${rowName} is ready to remove.` })}
        >
          <Trash2 />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
