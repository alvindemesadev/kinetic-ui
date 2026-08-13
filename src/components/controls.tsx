import {
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock3,
  Monitor,
  Moon,
  Search,
  Sun,
} from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState, useCallback, type KeyboardEvent } from "react";
import { frameworkOptions, styleOptions } from "./controlData";

export type OpenControlProps = {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
};

export type ThemePreference = "dark" | "light" | "system";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const pickerWeekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const pickerYears = Array.from({ length: 201 }, (_, index) => 1900 + index);

function dateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function formatDate(value: string) {
  if (!value) return "Select a date";
  const [year, month, day] = value.split("-");
  return `${month}/${day}/${year}`;
}

function createMonthGrid(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(year, month, index - firstDay + 1);
    return {
      day: date.getDate(),
      month: date.getMonth(),
      year: date.getFullYear(),
      muted: date.getMonth() !== month,
      value: dateKey(date.getFullYear(), date.getMonth(), date.getDate()),
    };
  });
}

export type DatePickerProps = OpenControlProps & {
  value: string;
  onChange: (value: string) => void;
};

export function DatePicker({ value, onChange, isOpen, onToggle, onClose }: DatePickerProps) {
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const dayRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const initialDate = value ? new Date(`${value}T00:00:00`) : new Date();
  const [viewMonth, setViewMonth] = useState({
    year: initialDate.getFullYear(),
    month: initialDate.getMonth(),
  });
  const days = useMemo(() => createMonthGrid(viewMonth.year, viewMonth.month), [viewMonth]);
  const selectedIndex = days.findIndex((date) => date.value === value);
  const [activeIndex, setActiveIndex] = useState(selectedIndex);

  useEffect(() => {
    if (!isOpen) return;
    const nextIndex = selectedIndex >= 0 ? selectedIndex : days.findIndex((date) => !date.muted);
    const focusFrame = requestAnimationFrame(() => {
      setActiveIndex(nextIndex);
      dayRefs.current[nextIndex]?.focus();
    });
    return () => cancelAnimationFrame(focusFrame);
  }, [days, isOpen, selectedIndex]);

  const closeAndRestoreFocus = useCallback(() => {
    onClose();
    requestAnimationFrame(() => triggerRef.current?.focus());
  }, [onClose]);

  const moveMonth = useCallback((amount: number) => {
    setViewMonth((current) => {
      const date = new Date(current.year, current.month + amount, 1);
      return { year: date.getFullYear(), month: date.getMonth() };
    });
  }, []);

  const chooseDate = useCallback(
    (index: number) => {
      const date = days[index];
      onChange(date.value);
      setViewMonth({ year: date.year, month: date.month });
      closeAndRestoreFocus();
    },
    [days, onChange, closeAndRestoreFocus],
  );

  const moveFocus = useCallback(
    (nextIndex: number) => {
      const boundedIndex = Math.max(0, Math.min(days.length - 1, nextIndex));
      setActiveIndex(boundedIndex);
      dayRefs.current[boundedIndex]?.focus();
    },
    [days.length],
  );

  const handleDayKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
      const moves: Record<string, number> = {
        ArrowLeft: index - 1,
        ArrowRight: index + 1,
        ArrowUp: index - 7,
        ArrowDown: index + 7,
        Home: index - (index % 7),
        End: index + (6 - (index % 7)),
      };
      if (event.key in moves) {
        event.preventDefault();
        moveFocus(moves[event.key]);
      } else if (event.key === "PageUp" || event.key === "PageDown") {
        event.preventDefault();
        moveMonth(event.key === "PageUp" ? -1 : 1);
      } else if (event.key === "Escape") {
        event.preventDefault();
        closeAndRestoreFocus();
      }
    },
    [moveFocus, moveMonth, closeAndRestoreFocus],
  );

  const chooseToday = useCallback(() => {
    const today = new Date();
    onChange(dateKey(today.getFullYear(), today.getMonth(), today.getDate()));
    setViewMonth({ year: today.getFullYear(), month: today.getMonth() });
    closeAndRestoreFocus();
  }, [onChange, closeAndRestoreFocus]);

  return (
    <div
      className={`field custom-control ${isOpen ? "is-open" : ""}`}
      onClick={(event) => event.stopPropagation()}
    >
      <span>Date picker</span>
      <button
        ref={triggerRef}
        className="custom-trigger"
        type="button"
        aria-label={`Date picker, ${formatDate(value)}`}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <span>{formatDate(value)}</span>
        <CalendarDays size={15} />
      </button>
      {isOpen && (
        <div
          ref={panelRef}
          className="control-popover date-popover"
          id={panelId}
          role="dialog"
          aria-label="Choose a date"
        >
          <div className="picker-heading" aria-live="polite" aria-atomic="true">
            <button type="button" aria-label="Previous month" onClick={() => moveMonth(-1)}>
              <ChevronLeft size={15} />
            </button>
            <div className="picker-heading-selects">
              <select
                aria-label="Month"
                value={viewMonth.month}
                onChange={(event) =>
                  setViewMonth((current) => ({ ...current, month: Number(event.target.value) }))
                }
              >
                {monthNames.map((month, index) => (
                  <option value={index} key={month}>
                    {month}
                  </option>
                ))}
              </select>
              <select
                aria-label="Year"
                value={viewMonth.year}
                onChange={(event) =>
                  setViewMonth((current) => ({ ...current, year: Number(event.target.value) }))
                }
              >
                {pickerYears.map((year) => (
                  <option value={year} key={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <button type="button" aria-label="Next month" onClick={() => moveMonth(1)}>
              <ChevronRight size={15} />
            </button>
          </div>
          <div className="picker-weekdays" aria-hidden="true">
            {pickerWeekdays.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
          <div
            className="picker-days"
            role="grid"
            aria-label={`${monthNames[viewMonth.month]} ${viewMonth.year}`}
          >
            {days.map((date, index) => (
              <button
                ref={(node) => {
                  dayRefs.current[index] = node;
                }}
                className={`${date.muted ? "muted" : ""} ${date.value === value ? "selected" : ""}`}
                type="button"
                role="gridcell"
                aria-label={date.value}
                aria-selected={date.value === value}
                tabIndex={index === activeIndex ? 0 : -1}
                key={date.value}
                onKeyDown={(event) => handleDayKeyDown(event, index)}
                onClick={() => chooseDate(index)}
              >
                {date.day}
              </button>
            ))}
          </div>
          <div className="picker-footer">
            <button
              type="button"
              onClick={() => {
                onChange("");
                closeAndRestoreFocus();
              }}
            >
              Clear
            </button>
            <button type="button" onClick={chooseToday}>
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export type TimePickerProps = OpenControlProps & {
  value: string;
  onChange: (value: string) => void;
};

type ClockFormat = "12" | "24";

function displayHour(hour: number, format: ClockFormat) {
  return format === "12" ? hour % 12 || 12 : hour;
}

function formatTime(value: string, format: ClockFormat) {
  const [hour, minute] = value.split(":").map(Number);
  if (format === "24") return value;
  return `${String(displayHour(hour, format)).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${hour >= 12 ? "PM" : "AM"}`;
}

export function TimePicker({ value, onChange, isOpen, onToggle, onClose }: TimePickerProps) {
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const hourInputRef = useRef<HTMLInputElement>(null);
  const presets = ["08:00", "12:30", "18:00", "22:22"];
  const [hour, minute] = value.split(":").map(Number);
  const [clockFormat, setClockFormat] = useState<ClockFormat>("24");
  const [hourDraft, setHourDraft] = useState(() => String(hour).padStart(2, "0"));
  const [minuteDraft, setMinuteDraft] = useState(() => String(minute).padStart(2, "0"));
  const [lastValue, setLastValue] = useState(value);
  const currentTimeRef = useRef({ hour, minute });
  const suppressInitialSelectionRef = useRef(false);

  useEffect(() => {
    if (!isOpen) return;
    suppressInitialSelectionRef.current = true;
    const focusFrame = requestAnimationFrame(() => {
      hourInputRef.current?.setAttribute("data-auto-focused", "true");
      hourInputRef.current?.focus();
    });
    return () => cancelAnimationFrame(focusFrame);
  }, [isOpen]);

  const clearAutoFocusStyle = (event: React.SyntheticEvent<HTMLInputElement>) => {
    event.currentTarget.removeAttribute("data-auto-focused");
  };

  const selectInputOnFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    if (suppressInitialSelectionRef.current) {
      suppressInitialSelectionRef.current = false;
      return;
    }
    event.currentTarget.select();
  };

  const closeAndRestoreFocus = useCallback(() => {
    onClose();
    requestAnimationFrame(() => triggerRef.current?.focus());
  }, [onClose]);

  if (value !== lastValue) {
    setLastValue(value);
    setHourDraft(String(displayHour(hour, clockFormat)).padStart(2, "0"));
    setMinuteDraft(String(minute).padStart(2, "0"));
  }

  useEffect(() => {
    currentTimeRef.current = { hour, minute };
  }, [hour, minute]);

  const applyTime = (nextHour: number, nextMinute: number) => {
    const nextValue = `${String(nextHour).padStart(2, "0")}:${String(nextMinute).padStart(2, "0")}`;
    currentTimeRef.current = { hour: nextHour, minute: nextMinute };
    setHourDraft(String(displayHour(nextHour, clockFormat)).padStart(2, "0"));
    setMinuteDraft(String(nextMinute).padStart(2, "0"));
    onChange(nextValue);
  };

  const updatePart = (part: "hour" | "minute", amount: number) => {
    const current = currentTimeRef.current;
    const nextHour = part === "hour" ? (current.hour + amount + 24) % 24 : current.hour;
    const nextMinute = part === "minute" ? (current.minute + amount + 60) % 60 : current.minute;
    applyTime(nextHour, nextMinute);
  };

  const updateDraft = (part: "hour" | "minute", nextDraft: string) => {
    const digits = nextDraft.replace(/\D/g, "").slice(0, 2);
    if (part === "hour") setHourDraft(digits);
    else setMinuteDraft(digits);
  };

  const commitDraft = (part: "hour" | "minute", inputValue?: string) => {
    const current = currentTimeRef.current;
    const draft = inputValue ?? (part === "hour" ? hourDraft : minuteDraft);
    const fallback = part === "hour" ? displayHour(current.hour, clockFormat) : current.minute;
    const minimum = part === "hour" && clockFormat === "12" ? 1 : 0;
    const maximum = part === "hour" ? (clockFormat === "12" ? 12 : 23) : 59;
    const parsed = Number.parseInt(draft, 10);
    const committed = Number.isNaN(parsed) ? fallback : Math.max(minimum, Math.min(maximum, parsed));
    const committedHour =
      part === "hour" && clockFormat === "12" ? (committed % 12) + (current.hour >= 12 ? 12 : 0) : committed;
    applyTime(part === "hour" ? committedHour : current.hour, part === "minute" ? committed : current.minute);
  };
  const chooseClockFormat = (format: ClockFormat) => {
    setClockFormat(format);
    setHourDraft(String(displayHour(currentTimeRef.current.hour, format)).padStart(2, "0"));
  };
  const choosePeriod = (period: "AM" | "PM") => {
    const current = currentTimeRef.current;
    const isPm = current.hour >= 12;
    const nextHour =
      period === "PM" && !isPm
        ? current.hour + 12
        : period === "AM" && isPm
          ? current.hour - 12
          : current.hour;
    applyTime(nextHour, current.minute);
  };
  const handlePresetKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
    event.preventDefault();
    const direction = event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 1;
    const buttons = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>("[role=option]");
    buttons?.[(index + direction + presets.length) % presets.length]?.focus();
  };

  return (
    <div
      className={`field custom-control ${isOpen ? "is-open" : ""}`}
      onClick={(event) => event.stopPropagation()}
    >
      <span>Time picker</span>
      <button
        ref={triggerRef}
        className="custom-trigger"
        type="button"
        aria-label={`Time picker, ${formatTime(value, clockFormat)}`}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <span>{formatTime(value, clockFormat)}</span>
        <Clock3 size={15} />
      </button>
      {isOpen && (
        <div
          className="control-popover time-popover align-right"
          id={panelId}
          role="dialog"
          aria-label="Choose a time"
          ref={panelRef}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.preventDefault();
              closeAndRestoreFocus();
            }
          }}
        >
          <div className="time-format-heading">
            <span className="popover-kicker">{clockFormat}-hour time</span>
            <div className="time-format-toggle" role="radiogroup" aria-label="Clock format">
              {(["12", "24"] as const).map((format) => (
                <button
                  className={clockFormat === format ? "selected" : ""}
                  type="button"
                  role="radio"
                  aria-checked={clockFormat === format}
                  key={format}
                  onClick={() => chooseClockFormat(format)}
                >
                  {format}H
                </button>
              ))}
            </div>
          </div>
          <div className="time-steppers" aria-live="polite">
            <div className="time-step">
              <button type="button" aria-label="Increase hour" onClick={() => updatePart("hour", 1)}>
                <ChevronUp size={16} />
              </button>
              <input
                ref={hourInputRef}
                aria-label="Hour"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={2}
                value={hourDraft}
                onChange={(event) => updateDraft("hour", event.target.value)}
                onFocus={selectInputOnFocus}
                onPointerDown={clearAutoFocusStyle}
                onBlur={(event) => {
                  clearAutoFocusStyle(event);
                  commitDraft("hour", event.currentTarget.value);
                }}
                onKeyDown={(event) => {
                  clearAutoFocusStyle(event);
                  if (event.key === "Enter") {
                    event.preventDefault();
                    commitDraft("hour", event.currentTarget.value);
                  }
                  if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                    event.preventDefault();
                    updatePart("hour", event.key === "ArrowUp" ? 1 : -1);
                  }
                }}
              />
              <button type="button" aria-label="Decrease hour" onClick={() => updatePart("hour", -1)}>
                <ChevronDown size={16} />
              </button>
              <small>Hour</small>
            </div>
            <b>:</b>
            <div className="time-step">
              <button type="button" aria-label="Increase minute" onClick={() => updatePart("minute", 5)}>
                <ChevronUp size={16} />
              </button>
              <input
                aria-label="Minute"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={2}
                value={minuteDraft}
                onChange={(event) => updateDraft("minute", event.target.value)}
                onFocus={selectInputOnFocus}
                onPointerDown={clearAutoFocusStyle}
                onBlur={(event) => {
                  clearAutoFocusStyle(event);
                  commitDraft("minute", event.currentTarget.value);
                }}
                onKeyDown={(event) => {
                  clearAutoFocusStyle(event);
                  if (event.key === "Enter") {
                    event.preventDefault();
                    commitDraft("minute", event.currentTarget.value);
                  }
                  if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                    event.preventDefault();
                    updatePart("minute", event.key === "ArrowUp" ? 5 : -5);
                  }
                }}
              />
              <button type="button" aria-label="Decrease minute" onClick={() => updatePart("minute", -5)}>
                <ChevronDown size={16} />
              </button>
              <small>Minute</small>
            </div>
          </div>
          {clockFormat === "12" && (
            <div className="period-toggle" role="radiogroup" aria-label="AM or PM">
              {(["AM", "PM"] as const).map((period) => {
                const selected = period === (hour >= 12 ? "PM" : "AM");
                return (
                  <button
                    className={selected ? "selected" : ""}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    key={period}
                    onClick={() => choosePeriod(period)}
                  >
                    {period}
                  </button>
                );
              })}
            </div>
          )}
          <div
            className={`time-presets ${clockFormat === "12" ? "twelve-hour" : ""}`}
            role="listbox"
            aria-label="Time presets"
          >
            {presets.map((time, index) => (
              <button
                className={time === value ? "selected" : ""}
                type="button"
                role="option"
                aria-selected={time === value}
                tabIndex={time === value ? 0 : -1}
                key={time}
                onKeyDown={(event) => handlePresetKeyDown(event, index)}
                onClick={() => {
                  const [nextHour, nextMinute] = time.split(":").map(Number);
                  applyTime(nextHour, nextMinute);
                }}
              >
                {formatTime(time, clockFormat)}
              </button>
            ))}
          </div>
          <button className="picker-done" type="button" onClick={closeAndRestoreFocus}>
            Done
          </button>
        </div>
      )}
    </div>
  );
}

export type StyleDropdownProps = OpenControlProps & {
  value: ThemePreference;
  onChange: (value: ThemePreference) => void;
};

function ThemePreferenceIcon({ value, size = 14 }: { value: ThemePreference; size?: number }) {
  const Icon = value === "dark" ? Moon : value === "light" ? Sun : Monitor;
  return <Icon size={size} strokeWidth={1.9} />;
}

export function StyleDropdown({ value, onChange, isOpen, onToggle, onClose }: StyleDropdownProps) {
  const listboxId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const selected = useMemo(
    () => styleOptions.find((option) => option.value === value) ?? styleOptions[0],
    [value],
  );
  useEffect(() => {
    if (!isOpen) return;
    const focusFrame = requestAnimationFrame(() =>
      panelRef.current?.querySelector<HTMLButtonElement>('[aria-selected="true"]')?.focus(),
    );
    return () => cancelAnimationFrame(focusFrame);
  }, [isOpen]);
  const closeAndRestoreFocus = useCallback(() => {
    onClose();
    requestAnimationFrame(() => triggerRef.current?.focus());
  }, [onClose]);
  const focusOption = useCallback((target: EventTarget & HTMLButtonElement, amount: number) => {
    const buttons = [...(target.parentElement?.querySelectorAll<HTMLButtonElement>("[role=option]") ?? [])];
    const index = buttons.indexOf(target);
    buttons[(index + amount + buttons.length) % buttons.length]?.focus();
  }, []);
  const handleTriggerKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      if (["ArrowDown", "ArrowUp"].includes(event.key)) {
        event.preventDefault();
        onToggle();
      }
    },
    [onToggle],
  );
  return (
    <div
      className={`field full custom-control ${isOpen ? "is-open" : ""}`}
      onClick={(event) => event.stopPropagation()}
    >
      <span>Dropdown</span>
      <button
        ref={triggerRef}
        className="custom-trigger"
        type="button"
        role="combobox"
        aria-label={`Interface style, ${selected.label}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        onKeyDown={handleTriggerKeyDown}
        onClick={onToggle}
      >
        <i className={`theme-choice-icon ${selected.value}`} aria-hidden="true">
          <ThemePreferenceIcon value={selected.value} />
        </i>
        <span>{selected.label}</span>
        <ChevronDown className="trigger-chevron" size={15} />
      </button>
      {isOpen && (
        <div
          ref={panelRef}
          className="control-popover option-popover"
          id={listboxId}
          role="listbox"
          aria-label="Interface style"
        >
          {styleOptions.map((option) => (
            <button
              type="button"
              role="option"
              aria-selected={option.value === value}
              tabIndex={option.value === value ? 0 : -1}
              key={option.value}
              onKeyDown={(event) => {
                if (["ArrowDown", "ArrowRight"].includes(event.key)) {
                  event.preventDefault();
                  focusOption(event.currentTarget, 1);
                } else if (["ArrowUp", "ArrowLeft"].includes(event.key)) {
                  event.preventDefault();
                  focusOption(event.currentTarget, -1);
                } else if (event.key === "Escape") {
                  event.preventDefault();
                  closeAndRestoreFocus();
                }
              }}
              onClick={() => {
                onChange(option.value);
                closeAndRestoreFocus();
              }}
            >
              <i className={`option-swatch ${option.value}`} aria-hidden="true">
                <ThemePreferenceIcon value={option.value} />
              </i>
              <span>
                <strong>{option.label}</strong>
                <small>{option.detail}</small>
              </span>
              {option.value === value && <Check size={15} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export type FrameworkComboboxProps = Omit<OpenControlProps, "onToggle"> & {
  value: string;
  onChange: (value: string) => void;
  onOpen: () => void;
  options?: string[];
};

export function FrameworkCombobox({
  value,
  onChange,
  isOpen,
  onOpen,
  onClose,
  options = frameworkOptions,
}: FrameworkComboboxProps) {
  const listboxId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const matches = useMemo(
    () => options.filter((option) => option.toLowerCase().includes(value.toLowerCase())),
    [options, value],
  );
  const closeAndRestoreFocus = useCallback(() => {
    onClose();
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [onClose]);
  const choose = useCallback(
    (option: string) => {
      onChange(option);
      closeAndRestoreFocus();
    },
    [onChange, closeAndRestoreFocus],
  );
  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        onOpen();
        const amount = event.key === "ArrowDown" ? 1 : -1;
        setActiveIndex(
          (index) => (index + amount + Math.max(matches.length, 1)) % Math.max(matches.length, 1),
        );
      } else if (event.key === "Enter" && isOpen && matches[activeIndex]) {
        event.preventDefault();
        choose(matches[activeIndex]);
      } else if (event.key === "Escape") {
        event.preventDefault();
        closeAndRestoreFocus();
      }
    },
    [matches, isOpen, activeIndex, onOpen, choose, closeAndRestoreFocus],
  );
  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange(event.target.value);
      setActiveIndex(0);
      onOpen();
    },
    [onChange, onOpen],
  );
  return (
    <div
      className={`field custom-control combobox-control ${isOpen ? "is-open" : ""}`}
      onClick={(event) => event.stopPropagation()}
    >
      <span>Framework</span>
      <div className="input-shell has-icon custom-combobox">
        <Search size={15} />
        <input
          ref={inputRef}
          role="combobox"
          aria-label="Framework"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-activedescendant={isOpen && matches[activeIndex] ? `${listboxId}-${activeIndex}` : undefined}
          value={value}
          onKeyDown={handleKeyDown}
          onFocus={onOpen}
          onChange={handleInputChange}
        />
        <ChevronDown size={14} />
      </div>
      {isOpen && (
        <div
          className="control-popover combobox-popover"
          id={listboxId}
          role="listbox"
          aria-label="Frameworks"
        >
          {matches.length > 0 ? (
            matches.map((option, index) => (
              <button
                id={`${listboxId}-${index}`}
                type="button"
                role="option"
                aria-selected={option === value}
                key={option}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => choose(option)}
              >
                <span className="framework-mark">{option.slice(0, 1)}</span>
                <span>{option}</span>
                {option === value && <Check size={14} />}
              </button>
            ))
          ) : (
            <span className="no-options">No matching framework</span>
          )}
        </div>
      )}
    </div>
  );
}
