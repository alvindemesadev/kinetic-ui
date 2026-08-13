import * as React from "react";
import { Search, Filter, Plus, ArrowUpDown, FileText, MoreHorizontal } from "lucide-react";
import { InitialsAvatar, StatusPill } from "@/components";
import { toast } from "sonner";

interface TableRowData {
  name: string;
  owner: string;
  avatarName: string;
  initials: string;
  status: "Ready" | "Review" | "Draft" | string;
  updated: string;
  size: string;
}

interface ShowcaseDataTableProps {
  tableQuery: string;
  setTableQuery: (value: string) => void;
  filteredRows: TableRowData[];
}

export function ShowcaseDataTable({ tableQuery, setTableQuery, filteredRows }: ShowcaseDataTableProps) {
  return (
    <article className="panel table-panel">
      <div className="table-toolbar">
        <div>
          <h3>Project files</h3>
          <p>4 active interface modules</p>
        </div>
        <div>
          <div className="input-shell has-icon table-search">
            <Search size={15} />
            <input
              placeholder="Filter modules..."
              value={tableQuery}
              onChange={(event) => setTableQuery(event.target.value)}
            />
          </div>
          <button className="button button-secondary compact" type="button">
            <Filter size={15} /> Filter
          </button>
          <button
            className="button button-primary compact"
            onClick={() => toast.success("Module added")}
            type="button"
          >
            <Plus size={15} /> Add module
          </button>
        </div>
      </div>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>
                <button type="button">
                  Name <ArrowUpDown size={13} />
                </button>
              </th>
              <th>Owner</th>
              <th>Status</th>
              <th>Updated</th>
              <th>Size</th>
              <th aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row) => (
              <tr key={row.name}>
                <td>
                  <span className="file-type">
                    <FileText size={16} />
                  </span>
                  <strong>{row.name}</strong>
                </td>
                <td>
                  <span className="owner-cell">
                    <InitialsAvatar size="small" label={row.initials} name={row.avatarName} />
                    {row.owner}
                  </span>
                </td>
                <td>
                  <StatusPill status={row.status} />
                </td>
                <td>{row.updated}</td>
                <td>{row.size}</td>
                <td>
                  <button className="icon-button" aria-label={`Actions for ${row.name}`} type="button">
                    <MoreHorizontal size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}
