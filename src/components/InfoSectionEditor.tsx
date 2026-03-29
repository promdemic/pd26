import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { type InfoItem } from "@/lib/schemas";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

type Props = {
  items: InfoItem[];
  isAdmin: boolean;
  /** "inline" → bold label inline with text; "heading" → label as colored block heading */
  labelStyle?: "inline" | "heading";
  onSave: (items: InfoItem[]) => Promise<void>;
  onEditingChange: (editing: boolean) => void;
};

const InfoSectionEditor = ({
  items,
  isAdmin,
  labelStyle = "inline",
  onSave,
  onEditingChange,
}: Props) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<InfoItem[]>([]);
  const [saving, setSaving] = useState(false);

  const startEdit = () => {
    setDraft(items.map((item) => ({ ...item })));
    setEditing(true);
    onEditingChange(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    onEditingChange(false);
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave(draft.filter((item) => item.body.trim()));
    setSaving(false);
    setEditing(false);
    onEditingChange(false);
  };

  const updateItem = (i: number, patch: Partial<InfoItem>) =>
    setDraft((prev) => prev.map((it, j) => (j === i ? { ...it, ...patch } : it)));

  // ── Edit mode ─────────────────────────────────────────────────────────────
  if (editing) {
    return (
      <div className="space-y-3">
        {draft.map((item, i) => (
          <div key={i} className="space-y-1">
            <div className="flex items-center gap-2">
              <Input
                value={item.label}
                onChange={(e) => updateItem(i, { label: e.target.value })}
                placeholder="Label (optional)"
                className="h-7 w-32 shrink-0 text-xs"
              />
              <button
                onClick={() => setDraft((prev) => prev.filter((_, j) => j !== i))}
                className="text-[#1a2744]/40 hover:text-red-500"
                aria-label="Remove item"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
            <Textarea
              value={item.body}
              onChange={(e) => updateItem(i, { body: e.target.value })}
              placeholder="Content"
              rows={2}
              className="text-xs"
            />
          </div>
        ))}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setDraft((prev) => [...prev, { label: "", body: "" }])}
          className="h-7 gap-1 text-xs text-[#1a2744]/50 hover:text-[#1a2744]"
        >
          <Plus className="h-3.5 w-3.5" />
          Add item
        </Button>

        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={handleSave}
            disabled={saving}
            className="h-7 bg-[#2a7f7f] text-white hover:bg-[#2a7f7f]/80 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save"}
          </Button>
          <Button size="sm" variant="ghost" onClick={cancelEdit} className="h-7">
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  // ── View mode ─────────────────────────────────────────────────────────────
  return (
    <div className="group relative space-y-3">
      {isAdmin && (
        <button
          onClick={startEdit}
          className="absolute -right-1 -top-1 opacity-0 transition-opacity group-hover:opacity-100 text-[#1a2744]/40 hover:text-[#1a2744]"
          aria-label="Edit section"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
      )}

      {items.map((item, i) =>
        labelStyle === "heading" ? (
          <div key={i}>
            {item.label && <p className="font-semibold text-[#2a7f7f]">{item.label}</p>}
            <p>{item.body}</p>
          </div>
        ) : (
          <p key={i}>
            {item.label && <span className="font-semibold">{item.label}: </span>}
            {item.href ? (
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2a7f7f] underline underline-offset-2"
              >
                {item.body}
              </a>
            ) : (
              item.body
            )}
          </p>
        ),
      )}
    </div>
  );
};

export default InfoSectionEditor;
