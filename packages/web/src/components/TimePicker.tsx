/**
 * Wraps <input type="time"> but speaks "h:mm AM/PM" externally.
 * The native picker always produces a valid time, so no manual format
 * validation is needed at the input level — the schema catches it on save.
 */

type Props = {
  value: string; // "4:20 PM"
  onChange: (value: string) => void;
  className?: string;
  autoFocus?: boolean;
};

/** "4:20 PM" → "16:20" */
const to24h = (display: string): string => {
  const match = display.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return "";
  let h = parseInt(match[1]);
  const period = match[3].toUpperCase();
  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;
  return `${String(h).padStart(2, "0")}:${match[2]}`;
};

/** "16:20" → "4:20 PM" */
const to12h = (native: string): string => {
  const match = native.match(/^(\d{2}):(\d{2})$/);
  if (!match) return "";
  let h = parseInt(match[1]);
  const minutes = match[2];
  const period = h >= 12 ? "PM" : "AM";
  if (h > 12) h -= 12;
  if (h === 0) h = 12;
  return `${h}:${minutes} ${period}`;
};

const TimePicker = ({ value, onChange, className, autoFocus }: Props) => (
  <input
    type="time"
    value={to24h(value)}
    onChange={(e) => onChange(to12h(e.target.value))}
    className={className}
    autoFocus={autoFocus}
  />
);

export default TimePicker;
