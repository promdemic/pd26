type Props = {
  rows: string[]; // Tailwind width classes, one per row
  variant: "dark" | "light";
};

// "dark" = navy card background (RSVPForm), "light" = sand card background (VolunteerForm)
const FormSkeleton = ({ rows, variant }: Props) => {
  const labelCls =
    variant === "dark" ? "bg-white/20" : "bg-gray-200";
  const inputCls =
    variant === "dark" ? "bg-white/10" : "bg-gray-100";

  return (
    <div className="space-y-5">
      {rows.map((w, i) => (
        <div key={i} className="space-y-1.5">
          <div className={`h-4 w-24 animate-pulse rounded ${labelCls}`} />
          <div className={`h-10 ${w} animate-pulse rounded ${inputCls}`} />
        </div>
      ))}
    </div>
  );
};

export default FormSkeleton;
