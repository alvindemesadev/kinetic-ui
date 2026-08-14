import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight, Clock3, Plus, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";

import { toast } from "sonner";

import { TimePicker } from "../../components";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { calendarDateKey, createCalendarMonth, formatCalendarMonth } from "./ShowcaseData";

type CalendarView = "day" | "week" | "month" | "year";
type EventTone = "orange" | "blue" | "green";

type CalendarEvent = {
  id: string;
  date: string;
  time: string;
  title: string;
  tone: EventTone;
};

const initialEvents: CalendarEvent[] = [
  { id: "planning", date: "2026-08-05", time: "09:30", title: "Sprint planning", tone: "blue" },
  { id: "design", date: "2026-08-12", time: "13:00", title: "Design critique", tone: "orange" },
  { id: "review", date: "2026-08-15", time: "10:00", title: "Release review", tone: "green" },
  { id: "demo", date: "2026-08-22", time: "15:30", title: "Component demo", tone: "orange" },
  { id: "retro", date: "2026-09-03", time: "11:00", title: "Team retro", tone: "blue" },
  { id: "launch", date: "2026-09-18", time: "16:00", title: "Workspace launch", tone: "green" },
];

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const viewModes: Array<{ value: CalendarView; label: string; shortcut: string }> = [
  { value: "day", label: "Day", shortcut: "D" },
  { value: "week", label: "Week", shortcut: "W" },
  { value: "month", label: "Month", shortcut: "M" },
  { value: "year", label: "Year", shortcut: "Y" },
];

const dateFormatter = new Intl.DateTimeFormat("en", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
});

function dateFromKey(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function ShowcaseCalendar() {
  const [calendarView, setCalendarView] = useState({ year: 2026, month: 7 });
  const [selection, setSelection] = useState("2026-08-12");
  const [view, setView] = useState<CalendarView>("month");
  const [events, setEvents] = useState(initialEvents);
  const [addEventOpen, setAddEventOpen] = useState(false);
  const [timePickerOpen, setTimePickerOpen] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftTime, setDraftTime] = useState("09:00");
  const eventDialogRef = useRef<HTMLElement>(null);

  useFocusTrap(eventDialogRef, addEventOpen);

  useEffect(() => {
    if (!addEventOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      if (timePickerOpen) {
        setTimePickerOpen(false);
        return;
      }
      setAddEventOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [addEventOpen, timePickerOpen]);

  const days = useMemo(() => createCalendarMonth(calendarView.year, calendarView.month), [calendarView]);
  const monthEvents = useMemo(
    () =>
      events.filter((event) =>
        event.date.startsWith(`${calendarView.year}-${String(calendarView.month + 1).padStart(2, "0")}`),
      ),
    [calendarView, events],
  );
  const selectedEvents = events
    .filter((event) => event.date === selection)
    .sort((a, b) => a.time.localeCompare(b.time));
  const selectedDateLabel = dateFormatter.format(dateFromKey(selection));
  const selectedViewMode = viewModes.find((option) => option.value === view) ?? viewModes[2];
  const weekDays = useMemo(() => {
    const selectedDate = dateFromKey(selection);
    const mondayOffset = (selectedDate.getDay() + 6) % 7;
    const monday = new Date(selectedDate);
    monday.setDate(selectedDate.getDate() - mondayOffset);
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);
      const value = calendarDateKey(date.getFullYear(), date.getMonth(), date.getDate());
      return {
        day: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear(),
        value,
        muted: date.getMonth() !== calendarView.month,
      };
    });
  }, [calendarView.month, selection]);
  const yearMonths = useMemo(
    () =>
      Array.from({ length: 12 }, (_, month) => ({
        month,
        label: new Intl.DateTimeFormat("en", { month: "long" }).format(new Date(calendarView.year, month, 1)),
        events: events.filter((event) =>
          event.date.startsWith(`${calendarView.year}-${String(month + 1).padStart(2, "0")}`),
        ),
      })),
    [calendarView.year, events],
  );

  const moveMonth = (amount: number) => {
    setCalendarView((current) => {
      const next = new Date(current.year, current.month + amount, 1);
      return { year: next.getFullYear(), month: next.getMonth() };
    });
  };

  const goToToday = () => {
    const today = new Date();
    const todayKey = calendarDateKey(today.getFullYear(), today.getMonth(), today.getDate());
    setCalendarView({ year: today.getFullYear(), month: today.getMonth() });
    setSelection(todayKey);
  };

  const selectDate = (value: string, year: number, month: number) => {
    setSelection(value);
    if (month !== calendarView.month || year !== calendarView.year) setCalendarView({ year, month });
  };

  const openComposer = () => {
    setAddEventOpen(true);
    setTimePickerOpen(false);
    setDraftTitle("");
    setDraftTime("09:00");
  };

  const addEvent = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const title = draftTitle.trim();
    if (!title) return;
    setEvents((current) => [
      ...current,
      {
        id: `custom-${Date.now()}`,
        date: selection,
        time: draftTime,
        title,
        tone: "orange",
      },
    ]);
    setAddEventOpen(false);
    setTimePickerOpen(false);
    toast.success("Event added", { description: `${title} · ${selectedDateLabel}` });
  };

  return (
    <section className="kit-section calendar-section" id="calendar" aria-labelledby="calendar-title">
      <header className="section-heading">
        <span>04 · Schedule</span>
        <h2 id="calendar-title">Calendar that feels tactile</h2>
        <p>Plan releases, reviews, and team rituals with a familiar month view and physical controls.</p>
      </header>

      <article className="panel calendar-workspace" aria-label="Schedule calendar">
        <header className="calendar-toolbar">
          <div className="calendar-toolbar-start">
            <button className="button button-secondary calendar-today" type="button" onClick={goToToday}>
              Today
            </button>
            <div className="calendar-nav-controls" aria-label="Calendar navigation">
              <button
                className="icon-button"
                type="button"
                aria-label="Previous calendar month"
                onClick={() => moveMonth(-1)}
              >
                <ChevronLeft size={17} />
              </button>
              <button
                className="icon-button"
                type="button"
                aria-label="Next calendar month"
                onClick={() => moveMonth(1)}
              >
                <ChevronRight size={17} />
              </button>
            </div>
          </div>
          <div className="calendar-toolbar-title" aria-live="polite">
            <strong>{formatCalendarMonth(calendarView.year, calendarView.month)}</strong>
            <span>{monthEvents.length} scheduled events</span>
          </div>
          <div className="calendar-toolbar-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="calendar-view-mode-trigger" type="button" aria-label="Calendar view mode">
                  <span>{selectedViewMode.label}</span>
                  <ChevronDown size={15} aria-hidden="true" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={8} className="calendar-view-mode-menu">
                <DropdownMenuRadioGroup
                  value={view}
                  onValueChange={(value) => setView(value as CalendarView)}
                >
                  {viewModes.map((option) => (
                    <DropdownMenuRadioItem value={option.value} key={option.value}>
                      <span>{option.label}</span>
                      <span className="calendar-view-mode-shortcut">{option.shortcut}</span>
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <button
              className="button button-primary calendar-add-button"
              type="button"
              onClick={openComposer}
            >
              <Plus size={16} /> Add event
            </button>
          </div>
        </header>

        <div className="calendar-workspace-body">
          <div className="calendar-month-surface">
            {view === "month" ? (
              <>
                <div className="calendar-weekday-row" aria-hidden="true">
                  {weekdays.map((weekday) => (
                    <span key={weekday}>{weekday}</span>
                  ))}
                </div>
                <div
                  className="calendar-month-grid"
                  role="group"
                  aria-label={formatCalendarMonth(calendarView.year, calendarView.month)}
                >
                  {Array.from({ length: 6 }, (_, rowIndex) => (
                    <div className="calendar-week-row" key={`week-${rowIndex}`}>
                      {days.slice(rowIndex * 7, rowIndex * 7 + 7).map((day) => {
                        const dayEvents = events
                          .filter((event) => event.date === day.value)
                          .sort((a, b) => a.time.localeCompare(b.time));
                        const selected = day.value === selection;
                        return (
                          <button
                            className={`calendar-day-cell ${day.muted ? "muted" : ""} ${day.today ? "today" : ""} ${selected ? "selected" : ""}`}
                            type="button"
                            aria-pressed={selected}
                            aria-label={day.value}
                            aria-description={`${dateFormatter.format(dateFromKey(day.value))}${dayEvents.length ? `, ${dayEvents.length} events` : ""}`}
                            key={day.value}
                            onClick={() => selectDate(day.value, day.year, day.month)}
                          >
                            <span className="calendar-day-number">{day.day}</span>
                            <span className="calendar-day-events">
                              {dayEvents.slice(0, 2).map((event) => (
                                <span className={`calendar-event-chip ${event.tone}`} key={event.id}>
                                  <span>{event.time}</span> {event.title}
                                </span>
                              ))}
                              {dayEvents.length > 2 ? (
                                <span className="calendar-event-more">+{dayEvents.length - 2} more</span>
                              ) : null}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </>
            ) : view === "week" ? (
              <div className="calendar-mode-view calendar-week-view">
                <div className="calendar-mode-heading">
                  <strong>Week of {dateFormatter.format(dateFromKey(weekDays[0].value))}</strong>
                  <span>Seven-day view</span>
                </div>
                <div className="calendar-week-view-grid">
                  {weekDays.map((day) => {
                    const dayEvents = events
                      .filter((event) => event.date === day.value)
                      .sort((a, b) => a.time.localeCompare(b.time));
                    const selected = day.value === selection;
                    return (
                      <button
                        className={`calendar-week-day ${day.muted ? "muted" : ""} ${selected ? "selected" : ""}`}
                        type="button"
                        aria-pressed={selected}
                        aria-label={day.value}
                        key={day.value}
                        onClick={() => selectDate(day.value, day.year, day.month)}
                      >
                        <span>{weekdays[weekDays.indexOf(day)]}</span>
                        <strong>{day.day}</strong>
                        <span className="calendar-day-events">
                          {dayEvents.map((event) => (
                            <span className={`calendar-event-chip ${event.tone}`} key={event.id}>
                              <span>{event.time}</span> {event.title}
                            </span>
                          ))}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : view === "day" ? (
              <div className="calendar-mode-view calendar-day-view">
                <div className="calendar-mode-heading">
                  <strong>{selectedDateLabel}</strong>
                  <span>Day view</span>
                </div>
                <div className="calendar-hour-list">
                  {Array.from({ length: 12 }, (_, index) => {
                    const hour = index + 8;
                    const hourEvents = selectedEvents.filter(
                      (event) => Number(event.time.slice(0, 2)) === hour,
                    );
                    return (
                      <div className="calendar-hour-row" key={hour}>
                        <time>{String(hour).padStart(2, "0")}:00</time>
                        <div>
                          {hourEvents.map((event) => (
                            <span className={`calendar-event-chip ${event.tone}`} key={event.id}>
                              <span>{event.time}</span> {event.title}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="calendar-mode-view calendar-year-view">
                <div className="calendar-mode-heading">
                  <strong>{calendarView.year}</strong>
                  <span>
                    Year view ·{" "}
                    {events.filter((event) => event.date.startsWith(`${calendarView.year}-`)).length} events
                  </span>
                </div>
                <div className="calendar-year-grid">
                  {yearMonths.map(({ month, label, events: monthEventsForYear }) => (
                    <button
                      className={`calendar-year-month ${month === calendarView.month ? "selected" : ""}`}
                      type="button"
                      key={month}
                      onClick={() => {
                        setCalendarView({ year: calendarView.year, month });
                        setSelection(calendarDateKey(calendarView.year, month, 1));
                        setView("month");
                      }}
                    >
                      <strong>{label}</strong>
                      <span>
                        {monthEventsForYear.length} {monthEventsForYear.length === 1 ? "event" : "events"}
                      </span>
                      <i aria-hidden="true">
                        {monthEventsForYear.slice(0, 4).map((event) => (
                          <b className={event.tone} key={event.id} />
                        ))}
                      </i>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="calendar-agenda-panel" aria-label="Selected day agenda">
            <div className="calendar-agenda-heading">
              <span>Selected day</span>
              <strong>{selectedDateLabel}</strong>
            </div>
            {selectedEvents.length ? (
              <div className="calendar-selected-events">
                {selectedEvents.map((event) => (
                  <div className={`calendar-selected-event ${event.tone}`} key={event.id}>
                    <span className="calendar-event-marker" aria-hidden="true" />
                    <div>
                      <strong>{event.title}</strong>
                      <span>
                        <Clock3 size={13} /> {event.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="calendar-empty-state">Nothing scheduled. Add a focused block for this day.</p>
            )}
            <button className="calendar-agenda-add" type="button" onClick={openComposer}>
              <Plus size={15} /> Add to this day
            </button>
          </aside>
        </div>
      </article>

      {addEventOpen ? (
        <div
          className="modal-layer calendar-event-modal-layer"
          role="presentation"
          onMouseDown={(event) => event.target === event.currentTarget && setAddEventOpen(false)}
        >
          <section
            ref={eventDialogRef}
            className="dialog-card calendar-event-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="calendar-event-dialog-title"
            tabIndex={-1}
          >
            <span className="drawer-handle" />
            <div className="dialog-icon">
              <CalendarDays size={21} aria-hidden="true" />
            </div>
            <div className="dialog-copy">
              <span className="eyebrow">Schedule event</span>
              <h2 id="calendar-event-dialog-title">Add event</h2>
              <p>Keep the day focused with a clear title and a tactile time control.</p>
            </div>
            <form className="calendar-event-form" onSubmit={addEvent}>
              <label className="calendar-event-field">
                <span>Event title</span>
                <input
                  autoFocus
                  data-autofocus
                  value={draftTitle}
                  onChange={(event) => setDraftTitle(event.target.value)}
                  placeholder="e.g. Product sync"
                  required
                />
              </label>
              <TimePicker
                value={draftTime}
                onChange={setDraftTime}
                isOpen={timePickerOpen}
                onToggle={() => setTimePickerOpen((open) => !open)}
                onClose={() => setTimePickerOpen(false)}
              />
              <div className="dialog-actions calendar-event-actions">
                <button
                  className="button button-secondary"
                  type="button"
                  onClick={() => setAddEventOpen(false)}
                >
                  Cancel
                </button>
                <button className="button button-primary" type="submit">
                  Save event
                </button>
              </div>
            </form>
            <button
              className="icon-button dialog-close"
              aria-label="Close add event dialog"
              onClick={() => setAddEventOpen(false)}
              type="button"
            >
              <X size={18} />
            </button>
          </section>
        </div>
      ) : null}
    </section>
  );
}
