import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TimePicker from "@/components/TimePicker";
import { TimelineEntrySchema, type TimelineEntry } from "@/lib/schemas";
import { Check, Pencil, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";

type Props = {
  entries: TimelineEntry[];
  isAdmin: boolean;
  onSave: (entries: TimelineEntry[]) => Promise<void>;
  onEditingChange: (editing: boolean) => void;
};

type RowState =
  | { type: "view" }
  | { type: "edit"; time: string; label: string; error?: string };

const TimelineEditor = ({
  entries,
  isAdmin,
  onSave,
  onEditingChange,
}: Props) => {
  const [rows, setRows] = useState<Map<string, RowState>>(new Map());
  const [saving, setSaving] = useState(false);

  const anyEditing = [...rows.values()].some((r) => r.type === "edit");

  const startEdit = (entry: TimelineEntry) => {
    setRows((prev) =>
      new Map(prev).set(entry.id, {
        type: "edit",
        time: entry.time,
        label: entry.label,
      }),
    );
    onEditingChange(true);
  };

  const cancelEdit = (id: string) => {
    setRows((prev) => {
      const m = new Map(prev);
      m.delete(id);
      return m;
    });
    onEditingChange(false);
  };

  const commitEdit = async (id: string) => {
    const row = rows.get(id);
    if (row?.type !== "edit") return;

    const validation = TimelineEntrySchema.safeParse({
      id,
      time: row.time,
      label: row.label,
    });
    if (!validation.success) {
      const error = validation.error.issues[0]?.message ?? "Invalid entry";
      setRows((prev) => new Map(prev).set(id, { ...row, error }));
      return;
    }

    const updated = entries.map((e) =>
      e.id === id ? { ...e, time: row.time, label: row.label } : e,
    );
    setSaving(true);
    await onSave(updated);
    setSaving(false);
    setRows((prev) => {
      const m = new Map(prev);
      m.delete(id);
      return m;
    });
    onEditingChange(false);
  };

  const deleteRow = async (id: string) => {
    const updated = entries.filter((e) => e.id !== id);
    setSaving(true);
    await onSave(updated);
    setSaving(false);
  };

  const addRow = async () => {
    const id = crypto.randomUUID();
    const newEntry: TimelineEntry = { id, time: "", label: "" };
    const updated = [...entries, newEntry];
    setSaving(true);
    try {
      await onSave(updated);
      setRows((prev) =>
        new Map(prev).set(id, { type: "edit", time: "", label: "" }),
      );
      onEditingChange(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-1">
      <ol className="space-y-2">
        {entries.map((entry) => {
          const row = rows.get(entry.id);
          if (row?.type === "edit") {
            return (
              <li key={entry.id} className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <TimePicker
                    value={row.time}
                    onChange={(time) =>
                      setRows((prev) =>
                        new Map(prev).set(entry.id, {
                          ...row,
                          time,
                          error: undefined,
                        }),
                      )
                    }
                    className="h-7 w-24 shrink-0 rounded-md border border-input bg-background px-2 text-right text-xs font-semibold text-[#c9a84c] focus:outline-none focus:ring-1 focus:ring-ring"
                    autoFocus
                  />
                  <Input
                    className="h-7 min-w-0 flex-1 text-xs text-[#1a2744]"
                    value={row.label}
                    onChange={(e) =>
                      setRows((prev) =>
                        new Map(prev).set(entry.id, {
                          ...row,
                          label: e.target.value,
                          error: undefined,
                        }),
                      )
                    }
                    placeholder="Event"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") commitEdit(entry.id);
                      if (e.key === "Escape") cancelEdit(entry.id);
                    }}
                  />
                  <button
                    onClick={() => commitEdit(entry.id)}
                    disabled={saving}
                    className="shrink-0 text-[#2a7f7f] hover:text-[#2a7f7f]/70 disabled:opacity-40"
                    aria-label="Save"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => cancelEdit(entry.id)}
                    className="shrink-0 text-[#1a2744]/40 hover:text-[#1a2744]/70"
                    aria-label="Cancel"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                {row.error && (
                  <p className="pl-1 text-xs text-red-500">{row.error}</p>
                )}
              </li>
            );
          }

          return (
            <li key={entry.id} className="group flex items-center gap-4">
              <span className="w-20 shrink-0 text-right text-sm font-semibold text-[#c9a84c]">
                {entry.time}
              </span>
              <span className="flex-1 text-sm text-[#1a2744]">
                {entry.label}
              </span>
              {isAdmin && (
                <span className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => startEdit(entry)}
                    disabled={anyEditing}
                    className="text-[#1a2744]/40 hover:text-[#1a2744] disabled:opacity-20"
                    aria-label="Edit"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => deleteRow(entry.id)}
                    disabled={anyEditing || saving}
                    className="text-[#1a2744]/40 hover:text-red-500 disabled:opacity-20"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </span>
              )}
            </li>
          );
        })}
      </ol>

      {isAdmin && (
        <Button
          variant="ghost"
          size="sm"
          onClick={addRow}
          disabled={anyEditing || saving}
          className="mt-2 h-7 gap-1 text-xs text-[#1a2744]/50 hover:text-[#1a2744]"
        >
          <Plus className="h-3.5 w-3.5" />
          Add entry
        </Button>
      )}
    </div>
  );
};

export default TimelineEditor;
