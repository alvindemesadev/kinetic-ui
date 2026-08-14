import {
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  Clock3,
  Columns3,
  Inbox,
  ListTodo,
  Milestone,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type DragEvent, type FormEvent } from "react";
import { toast } from "sonner";

import { DeleteConfirmationDialog } from "@/components/showcase/DeleteConfirmationDialog";
import { useFocusTrap } from "@/hooks/useFocusTrap";

type KanbanStatus = "backlog" | "progress" | "done";
type TimelineStatus = "complete" | "active" | "upcoming";
type TodoFilter = "all" | "active" | "done";

type KanbanTask = {
  id: string;
  title: string;
  detail: string;
  label: string;
  status: KanbanStatus;
  tone: "accent" | "blue" | "green" | "amber";
};

type TimelineItem = {
  id: string;
  date: string;
  title: string;
  detail: string;
  owner: string;
  status: TimelineStatus;
};

type TodoItem = {
  id: string;
  title: string;
  detail: string;
  due: string;
  done: boolean;
};

const kanbanColumns: Array<{ id: KanbanStatus; label: string; description: string }> = [
  { id: "backlog", label: "Backlog", description: "Queued for the next cycle" },
  { id: "progress", label: "In progress", description: "Being shaped by the team" },
  { id: "done", label: "Done", description: "Ready to share or ship" },
];

const initialKanbanTasks: KanbanTask[] = [
  {
    id: "task-navigation",
    title: "Polish navigation states",
    detail: "Align keyboard focus and active surfaces.",
    label: "UI system",
    status: "backlog",
    tone: "accent",
  },
  {
    id: "task-calendar",
    title: "Review calendar interactions",
    detail: "Validate month, agenda, and event creation flows.",
    label: "QA",
    status: "backlog",
    tone: "blue",
  },
  {
    id: "task-overlays",
    title: "Document overlay patterns",
    detail: "Capture modal, drawer, and confirmation guidance.",
    label: "Docs",
    status: "progress",
    tone: "amber",
  },
  {
    id: "task-tokens",
    title: "Ship material tokens",
    detail: "Publish the shared light and dark values.",
    label: "Release",
    status: "done",
    tone: "green",
  },
];

const timelineItems: TimelineItem[] = [
  {
    id: "timeline-foundation",
    date: "Aug 12",
    title: "Foundation review",
    detail: "Color, typography, and spacing tokens signed off.",
    owner: "Alvin",
    status: "complete",
  },
  {
    id: "timeline-components",
    date: "Aug 18",
    title: "Component QA",
    detail: "Keyboard behavior and responsive surfaces are being checked.",
    owner: "Mika",
    status: "active",
  },
  {
    id: "timeline-release",
    date: "Aug 25",
    title: "Release candidate",
    detail: "Freeze examples and prepare the component handoff.",
    owner: "Clyde",
    status: "upcoming",
  },
  {
    id: "timeline-retro",
    date: "Sep 02",
    title: "Team retro",
    detail: "Review adoption feedback and plan the next iteration.",
    owner: "Team",
    status: "upcoming",
  },
];

const initialTodoItems: TodoItem[] = [
  {
    id: "todo-audit",
    title: "Audit component examples",
    detail: "Remove duplicate demos from the reference flow.",
    due: "Today",
    done: false,
  },
  {
    id: "todo-accessibility",
    title: "Run accessibility pass",
    detail: "Check focus order, labels, and reduced motion behavior.",
    due: "Tomorrow",
    done: false,
  },
  {
    id: "todo-handoff",
    title: "Share the design handoff",
    detail: "Send the latest tokens and usage notes to the team.",
    due: "Aug 21",
    done: true,
  },
];

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <header className="section-heading">
      <span>{eyebrow}</span>
      <h2>{title}</h2>
      <p>{description}</p>
    </header>
  );
}

export function ShowcaseKanban() {
  const [tasks, setTasks] = useState(initialKanbanTasks);
  const [composerOpen, setComposerOpen] = useState(false);
  const [draftTask, setDraftTask] = useState("");
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<KanbanStatus | null>(null);
  const composerDialogRef = useRef<HTMLElement>(null);

  useFocusTrap(composerDialogRef, composerOpen);

  useEffect(() => {
    if (!composerOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setComposerOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [composerOpen]);

  const moveTask = (id: string, direction: -1 | 1) => {
    setTasks((current) =>
      current.map((task) => {
        if (task.id !== id) return task;
        const currentIndex = kanbanColumns.findIndex((column) => column.id === task.status);
        const nextIndex = Math.max(0, Math.min(kanbanColumns.length - 1, currentIndex + direction));
        return { ...task, status: kanbanColumns[nextIndex].id };
      }),
    );
  };

  const moveTaskToColumn = (id: string, status: KanbanStatus, targetId?: string, insertBefore = false) => {
    const task = tasks.find((item) => item.id === id);
    if (!task || targetId === id) return;

    setTasks((current) => {
      const movingTask = current.find((item) => item.id === id);
      if (!movingTask) return current;

      const remaining = current.filter((item) => item.id !== id);
      const targetIndex = targetId
        ? remaining.findIndex((item) => item.id === targetId && item.status === status)
        : -1;
      const lastColumnIndex = remaining.reduce(
        (lastIndex, item, index) => (item.status === status ? index : lastIndex),
        -1,
      );
      const insertIndex = targetIndex >= 0 ? targetIndex + (insertBefore ? 0 : 1) : lastColumnIndex + 1;
      const next = [...remaining];
      next.splice(Math.max(0, insertIndex), 0, { ...movingTask, status });
      return next;
    });

    if (task.status !== status) {
      toast.success(`Moved to ${kanbanColumns.find((column) => column.id === status)?.label}`);
    }
  };

  const handleDragStart = (event: DragEvent<HTMLElement>, id: string) => {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", id);
    setDraggingTaskId(id);
  };

  const handleDragOver = (event: DragEvent<HTMLElement>, status: KanbanStatus) => {
    if (!draggingTaskId) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    setDropTarget(status);
  };

  const handleDrop = (event: DragEvent<HTMLElement>, status: KanbanStatus) => {
    event.preventDefault();
    const id = event.dataTransfer.getData("text/plain") || draggingTaskId;
    const column = event.currentTarget as HTMLElement;
    const targetElement = [...column.querySelectorAll<HTMLElement>("[data-kanban-task-id]")].find(
      (element) => {
        const bounds = element.getBoundingClientRect();
        return event.clientY < bounds.top + bounds.height / 2;
      },
    );
    const targetId = targetElement?.dataset.kanbanTaskId;
    const insertBefore = Boolean(targetElement);
    if (id) moveTaskToColumn(id, status, targetId, insertBefore);
    setDraggingTaskId(null);
    setDropTarget(null);
  };

  const handleDragEnd = () => {
    setDraggingTaskId(null);
    setDropTarget(null);
  };

  const addTask = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const title = draftTask.trim();
    if (!title) return;
    setTasks((current) => [
      ...current,
      {
        id: `task-${Date.now()}`,
        title,
        detail: "New task added to the planning queue.",
        label: "New",
        status: "backlog",
        tone: "accent",
      },
    ]);
    setDraftTask("");
    setComposerOpen(false);
    toast.success("Task added to backlog");
  };

  return (
    <section className="kit-section productivity-section" id="kanban" aria-labelledby="kanban-title">
      <SectionHeading
        eyebrow="05 · Planning"
        title="Kanban for focused delivery"
        description="Keep work moving across tactile columns with clear ownership, status, and accessible movement controls."
      />
      <article className="panel kanban-panel">
        <div className="panel-heading">
          <div>
            <h3 id="kanban-title">Workspace board</h3>
            <p>Drag a card between stages, or use the arrow buttons to move it one step.</p>
          </div>
          <button
            className="button button-primary"
            type="button"
            aria-expanded={composerOpen}
            aria-controls="kanban-task-dialog"
            onClick={() => setComposerOpen(true)}
          >
            <Plus size={16} aria-hidden="true" /> Add task
          </button>
        </div>

        <div className="kanban-board">
          {kanbanColumns.map((column) => {
            const columnTasks = tasks.filter((task) => task.status === column.id);
            return (
              <section
                className={`kanban-column ${dropTarget === column.id ? "is-drop-target" : ""}`}
                key={column.id}
                aria-labelledby={`kanban-${column.id}`}
                onDragOver={(event) => handleDragOver(event, column.id)}
                onDrop={(event) => handleDrop(event, column.id)}
              >
                <div className="kanban-column-heading">
                  <div>
                    <h4 id={`kanban-${column.id}`}>{column.label}</h4>
                    <p>{column.description}</p>
                  </div>
                  <span className="badge badge-neutral">{columnTasks.length}</span>
                </div>
                <div className="kanban-task-list">
                  {columnTasks.length === 0 ? (
                    <div className="kanban-empty">
                      <span className="kanban-empty-icon" aria-hidden="true">
                        <Inbox size={18} />
                      </span>
                      <strong>Stage is clear</strong>
                      <span>No tasks in this stage.</span>
                    </div>
                  ) : (
                    columnTasks.map((task) => {
                      const taskIndex = kanbanColumns.findIndex((item) => item.id === task.status);
                      return (
                        <article
                          className={`kanban-task ${task.tone} ${draggingTaskId === task.id ? "is-dragging" : ""}`}
                          key={task.id}
                          data-kanban-task-id={task.id}
                          draggable
                          aria-label={`Drag ${task.title} to another stage`}
                          onDragStart={(event) => handleDragStart(event, task.id)}
                          onDragEnd={handleDragEnd}
                        >
                          <div className="kanban-task-topline">
                            <span className="badge badge-neutral">{task.label}</span>
                            <span
                              className="kanban-task-grip"
                              title="Drag to another stage"
                              aria-hidden="true"
                            >
                              <Columns3 size={14} />
                            </span>
                          </div>
                          <h5>{task.title}</h5>
                          <p>{task.detail}</p>
                          <div className="kanban-task-actions">
                            <button
                              className="icon-button"
                              type="button"
                              aria-label={`Move ${task.title} left`}
                              disabled={taskIndex === 0}
                              onClick={() => moveTask(task.id, -1)}
                            >
                              <ChevronLeft size={16} aria-hidden="true" />
                            </button>
                            <button
                              className="icon-button"
                              type="button"
                              aria-label={`Move ${task.title} right`}
                              disabled={taskIndex === kanbanColumns.length - 1}
                              onClick={() => moveTask(task.id, 1)}
                            >
                              <ChevronRight size={16} aria-hidden="true" />
                            </button>
                          </div>
                        </article>
                      );
                    })
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </article>

      {composerOpen && (
        <div
          className="modal-layer kanban-task-modal-layer"
          role="presentation"
          onMouseDown={(event) => event.target === event.currentTarget && setComposerOpen(false)}
        >
          <section
            ref={composerDialogRef}
            className="dialog-card kanban-task-dialog"
            id="kanban-task-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="kanban-task-dialog-title"
            aria-describedby="kanban-task-dialog-description"
            tabIndex={-1}
          >
            <span className="drawer-handle" />
            <div className="dialog-icon">
              <Plus size={22} aria-hidden="true" />
            </div>
            <div className="dialog-copy">
              <span className="eyebrow">Workspace board</span>
              <h2 id="kanban-task-dialog-title">Add task</h2>
              <p id="kanban-task-dialog-description">
                Create a new item and place it in the backlog so the team can move it forward.
              </p>
            </div>
            <form className="kanban-task-form" onSubmit={addTask}>
              <label className="kanban-task-field" htmlFor="kanban-task-title">
                <span>Task title</span>
                <input
                  id="kanban-task-title"
                  value={draftTask}
                  onChange={(event) => setDraftTask(event.target.value)}
                  placeholder="What needs to move forward?"
                  data-autofocus
                />
              </label>
              <p className="kanban-task-hint">New tasks start in the Backlog column.</p>
              <div className="dialog-actions kanban-task-actions">
                <button
                  className="button button-secondary"
                  type="button"
                  onClick={() => setComposerOpen(false)}
                >
                  Cancel
                </button>
                <button className="button button-primary" type="submit">
                  <Plus size={16} aria-hidden="true" /> Add to backlog
                </button>
              </div>
            </form>
            <button
              className="icon-button dialog-close"
              aria-label="Close add task dialog"
              onClick={() => setComposerOpen(false)}
              type="button"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </section>
        </div>
      )}
    </section>
  );
}

export function ShowcaseTimeline() {
  const [selectedId, setSelectedId] = useState("timeline-components");
  const [filter, setFilter] = useState<"all" | TimelineStatus>("all");
  const [completedIds, setCompletedIds] = useState<string[]>(["timeline-foundation"]);
  const selectedItem = timelineItems.find((item) => item.id === selectedId) ?? timelineItems[0];
  const visibleItems = useMemo(
    () =>
      timelineItems.filter((item) => {
        const status = completedIds.includes(item.id) ? "complete" : item.status;
        return filter === "all" || status === filter;
      }),
    [completedIds, filter],
  );
  const selectedComplete = completedIds.includes(selectedItem.id);

  const toggleMilestone = () => {
    setCompletedIds((current) =>
      current.includes(selectedItem.id)
        ? current.filter((id) => id !== selectedItem.id)
        : [...current, selectedItem.id],
    );
    toast.success(selectedComplete ? "Milestone reopened" : "Milestone marked complete");
  };

  return (
    <section className="kit-section productivity-section" id="timeline" aria-labelledby="timeline-title">
      <SectionHeading
        eyebrow="06 · Planning"
        title="Timeline for shared momentum"
        description="A calm milestone view keeps the next decision visible without turning the workspace into a spreadsheet."
      />
      <article className="panel timeline-panel">
        <div className="panel-heading">
          <div>
            <h3 id="timeline-title">Product roadmap</h3>
            <p>Choose a milestone to see its owner and delivery note.</p>
          </div>
          <Milestone size={20} aria-hidden="true" />
        </div>
        <div className="timeline-toolbar" role="tablist" aria-label="Timeline filters">
          {(["all", "complete", "active", "upcoming"] as const).map((option) => (
            <button
              key={option}
              type="button"
              role="tab"
              aria-selected={filter === option}
              className={filter === option ? "active" : ""}
              onClick={() => setFilter(option)}
            >
              {option === "all" ? "All milestones" : option[0].toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>
        <div className="timeline-layout">
          <div className="timeline-list" role="list">
            {visibleItems.map((item) => {
              const isComplete = completedIds.includes(item.id);
              const status = isComplete ? "complete" : item.status;
              return (
                <div className="timeline-entry" role="listitem" key={item.id}>
                  <span className={`timeline-marker ${status}`} aria-hidden="true">
                    {status === "complete" ? (
                      <Check size={14} />
                    ) : status === "active" ? (
                      <Clock3 size={14} />
                    ) : (
                      <Circle size={10} />
                    )}
                  </span>
                  <button
                    className={`timeline-item ${selectedId === item.id ? "selected" : ""}`}
                    type="button"
                    onClick={() => setSelectedId(item.id)}
                  >
                    <span className="timeline-item-copy">
                      <span className="timeline-item-date">{item.date}</span>
                      <strong>{item.title}</strong>
                      <small>{item.detail}</small>
                    </span>
                    <span
                      className={`badge badge-${status === "active" ? "accent" : status === "complete" ? "success" : "neutral"}`}
                    >
                      {status}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
          <aside className="timeline-detail" aria-live="polite">
            <span className="eyebrow">Selected milestone</span>
            <h4>{selectedItem.title}</h4>
            <p>{selectedItem.detail}</p>
            <dl className="timeline-detail-meta">
              <div>
                <dt>Owner</dt>
                <dd>{selectedItem.owner}</dd>
              </div>
              <div>
                <dt>Target</dt>
                <dd>{selectedItem.date}</dd>
              </div>
            </dl>
            <button className="button button-secondary" type="button" onClick={toggleMilestone}>
              {selectedComplete ? "Reopen milestone" : "Mark complete"}
            </button>
          </aside>
        </div>
      </article>
    </section>
  );
}

export function ShowcaseTodoList() {
  const [items, setItems] = useState(initialTodoItems);
  const [filter, setFilter] = useState<TodoFilter>("all");
  const [draft, setDraft] = useState("");
  const [deleteItem, setDeleteItem] = useState<TodoItem | null>(null);
  const activeCount = items.filter((item) => !item.done).length;
  const visibleItems = items.filter(
    (item) => filter === "all" || (filter === "done" ? item.done : !item.done),
  );

  const addTodo = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const title = draft.trim();
    if (!title) return;
    setItems((current) => [
      ...current,
      {
        id: `todo-${Date.now()}`,
        title,
        detail: "Added from the workspace checklist.",
        due: "No due date",
        done: false,
      },
    ]);
    setDraft("");
    toast.success("Task added to your list");
  };

  return (
    <section className="kit-section productivity-section" id="todo" aria-labelledby="todo-title">
      <SectionHeading
        eyebrow="07 · Planning"
        title="To-do list that stays actionable"
        description="Capture the next small step, check it off, and keep the list grounded in the same physical controls as the rest of the kit."
      />
      <article className="panel todo-panel">
        <div className="panel-heading">
          <div>
            <h3 id="todo-title">Today’s focus</h3>
            <p>
              {activeCount === 0
                ? "Everything is complete."
                : `${activeCount} open ${activeCount === 1 ? "task" : "tasks"} remaining.`}
            </p>
          </div>
          <ListTodo size={20} aria-hidden="true" />
        </div>
        <form className="todo-composer" onSubmit={addTodo}>
          <label className="sr-only" htmlFor="todo-title-input">
            Add a task
          </label>
          <input
            id="todo-title-input"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Add a task to your list..."
          />
          <button className="button button-primary" type="submit">
            <Plus size={16} aria-hidden="true" /> Add task
          </button>
        </form>
        <div className="todo-toolbar" role="tablist" aria-label="To-do filters">
          {(["all", "active", "done"] as const).map((option) => (
            <button
              key={option}
              type="button"
              role="tab"
              aria-selected={filter === option}
              className={filter === option ? "active" : ""}
              onClick={() => setFilter(option)}
            >
              {option[0].toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>
        <div className="todo-list" role="list">
          {visibleItems.length === 0 ? (
            <div className="todo-empty">
              <CheckCircle2 size={19} aria-hidden="true" />
              <span>No tasks in this view.</span>
            </div>
          ) : (
            visibleItems.map((item) => (
              <div className={`todo-row ${item.done ? "done" : ""}`} role="listitem" key={item.id}>
                <button
                  className={`todo-check ${item.done ? "checked" : ""}`}
                  type="button"
                  role="checkbox"
                  aria-checked={item.done}
                  aria-label={`${item.done ? "Mark" : "Complete"} ${item.title}`}
                  onClick={() =>
                    setItems((current) =>
                      current.map((todo) => (todo.id === item.id ? { ...todo, done: !todo.done } : todo)),
                    )
                  }
                >
                  {item.done && <Check size={14} aria-hidden="true" />}
                </button>
                <span className="todo-copy">
                  <strong>{item.title}</strong>
                  <small>{item.detail}</small>
                </span>
                <span className="todo-due">{item.due}</span>
                <button
                  className="icon-button todo-delete"
                  type="button"
                  aria-label={`Remove ${item.title}`}
                  onClick={() => setDeleteItem(item)}
                >
                  <Trash2 size={15} aria-hidden="true" />
                </button>
              </div>
            ))
          )}
        </div>
      </article>
      <DeleteConfirmationDialog
        open={deleteItem !== null}
        rowName={deleteItem?.title ?? "task"}
        bodyText="This action removes the task from your list and cannot be undone."
        confirmLabel="Delete task"
        successTitle="Task deleted"
        successDescription={deleteItem ? `${deleteItem.title} was removed from your list.` : undefined}
        onOpenChange={(open) => {
          if (!open) setDeleteItem(null);
        }}
        onConfirm={() => {
          if (!deleteItem) return;
          setItems((current) => current.filter((todo) => todo.id !== deleteItem.id));
        }}
      />
    </section>
  );
}
