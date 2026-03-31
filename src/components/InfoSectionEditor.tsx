import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { InfoItemSchema, type InfoItem } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

const InfoSectionFormSchema = z.object({
  items: z.array(InfoItemSchema),
});

type InfoSectionFormValues = z.infer<typeof InfoSectionFormSchema>;

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
  const [saving, setSaving] = useState(false);

  const { register, control, handleSubmit, reset } =
    useForm<InfoSectionFormValues>({
      resolver: zodResolver(InfoSectionFormSchema),
      defaultValues: { items },
    });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  const startEdit = () => {
    reset({ items: items.map((item) => ({ ...item })) });
    setEditing(true);
    onEditingChange(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    onEditingChange(false);
  };

  const onSubmit = async (data: InfoSectionFormValues) => {
    setSaving(true);
    await onSave(data.items.filter((item) => item.body.trim()));
    setSaving(false);
    setEditing(false);
    onEditingChange(false);
  };

  // ── Edit mode ─────────────────────────────────────────────────────────────
  if (editing) {
    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        {fields.map((field, i) => (
          <div key={field.id} className="space-y-1">
            <div className="flex items-center gap-2">
              <Input
                {...register(`items.${i}.label`)}
                placeholder="Label (optional)"
                className="h-7 w-32 shrink-0 text-xs"
              />
              <button
                type="button"
                onClick={() => remove(i)}
                className="text-navy/40 hover:text-red-500"
                aria-label="Remove item"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
            <Textarea
              {...register(`items.${i}.body`)}
              placeholder="Content"
              rows={2}
              className="text-xs"
            />
          </div>
        ))}

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => append({ label: "", body: "" })}
          className="h-7 gap-1 text-xs text-navy/50 hover:text-navy"
        >
          <Plus className="h-3.5 w-3.5" />
          Add item
        </Button>

        <div className="flex gap-2">
          <Button
            type="submit"
            size="sm"
            disabled={saving}
            className="h-7 bg-teal text-white hover:bg-teal/80 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save"}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={cancelEdit}
            className="h-7"
          >
            Cancel
          </Button>
        </div>
      </form>
    );
  }

  // ── View mode ─────────────────────────────────────────────────────────────
  return (
    <div className="group relative space-y-3">
      {isAdmin && (
        <button
          onClick={startEdit}
          className="absolute -right-1 -top-1 opacity-0 transition-opacity group-hover:opacity-100 text-navy/40 hover:text-navy"
          aria-label="Edit section"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
      )}

      {items.map((item, i) =>
        labelStyle === "heading" ? (
          <div key={`${item.label}-${i}`}>
            {item.label && (
              <p className="font-semibold text-teal">{item.label}</p>
            )}
            <p>{item.body}</p>
          </div>
        ) : (
          <p key={`${item.label}-${i}`}>
            {item.label && (
              <span className="font-semibold">{item.label}: </span>
            )}
            {item.href ? (
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal underline underline-offset-2"
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
