import { CalendarDays, ChevronLeft, ChevronRight, Clock3, Plus } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";

import { toast } from "sonner";

import { calendarDateKey, createCalendarMonth, formatCalendarMonth } from "./ShowcaseData";

type CalendarView = "month" | "agenda";
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
  const [composerOpen, setComposerOpen] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftTime, setDraftTime] = useState("09:00");

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

  const openComposer = () => {
    setComposerOpen(true);
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
    setComposerOpen(false);
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
            <div className="calendar-view-toggle" role="radiogroup" aria-label="Calendar view">
              {(["month", "agenda"] as const).map((option) => (
                <button
                  className={view === option ? "active" : ""}
                  type="button"
                  role="radio"
                  aria-checked={view === option}
                  key={option}
                  onClick={() => setView(option)}
                >
                  {option[0].toUpperCase() + option.slice(1)}
                </button>
              ))}
            </div>
            <button
              className="button button-primary calendar-add-button"
              type="button"
              onClick={openComposer}
            >
              <Plus size={16} /> Add event
            </button>
          </div>
        </header>

        {composerOpen ? (
          <form className="calendar-composer" onSubmit={addEvent}>
            <div className="calendar-composer-title">
              <CalendarDays size={17} aria-hidden="true" />
              <strong>Add event for {selectedDateLabel}</strong>
            </div>
            <label>
              <span>Event title</span>
              <input
                autoFocus
                value={draftTitle}
                onChange={(event) => setDraftTitle(event.target.value)}
                placeholder="e.g. Product sync"
                required
              />
            </label>
            <label>
              <span>Time</span>
              <input type="time" value={draftTime} onChange={(event) => setDraftTime(event.target.value)} />
            </label>
            <div className="calendar-composer-actions">
              <button
                className="button button-secondary"
                type="button"
                onClick={() => setComposerOpen(false)}
              >
                Cancel
              </button>
              <button className="button button-primary" type="submit">
                Save event
              </button>
            </div>
          </form>
        ) : null}

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
                            onClick={() => {
                              setSelection(day.value);
                              if (day.muted) setCalendarView({ year: day.year, month: day.month });
                            }}
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
            ) : (
              <div className="calendar-agenda-view">
                <div className="calendar-agenda-view-heading">
                  <strong>{formatCalendarMonth(calendarView.year, calendarView.month)} agenda</strong>
                  <span>Upcoming events in this month</span>
                </div>
                {monthEvents.length ? (
                  <div className="calendar-agenda-list">
                    {monthEvents.map((event) => (
                      <button
                        className={`calendar-agenda-row ${event.tone}`}
                        type="button"
                        key={event.id}
                        onClick={() => setSelection(event.date)}
                      >
                        <time dateTime={`${event.date}T${event.time}`}>{event.time}</time>
                        <span>
                          <strong>{event.title}</strong>
                          <small>{dateFormatter.format(dateFromKey(event.date))}</small>
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="calendar-empty-state">No events scheduled for this month.</p>
                )}
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
    </section>
  );
}
