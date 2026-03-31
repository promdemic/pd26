import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useAdminReport,
  type RsvpRow,
  type VolunteerRow,
} from "@/hooks/useAdminReport";
import { useAuth } from "@/hooks/useAuth";
import { VOLUNTEER_ROLES, type VolunteerRole } from "@/lib/volunteers";
import { RefreshCw } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const SKELETON_ROWS = 5;

const TableSkeleton = ({ cols }: { cols: number }) => (
  <>
    {Array.from({ length: SKELETON_ROWS }).map((_, i) => (
      <tr key={i}>
        {Array.from({ length: cols }).map((_, j) => (
          <td key={j} className="px-3 py-2">
            <div className="h-3 animate-pulse rounded bg-[#1a2744]/10" />
          </td>
        ))}
      </tr>
    ))}
  </>
);

const Th = ({ children }: { children: React.ReactNode }) => (
  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-[#1a2744]/50">
    {children}
  </th>
);

const Td = ({ children }: { children: React.ReactNode }) => (
  <td className="px-3 py-2 text-sm text-[#1a2744]">{children}</td>
);

const empty = (v: string | undefined) => v?.trim() || "—";
const yesNo = (v: boolean) => (v ? "Yes" : "No");

const StatCard = ({ label, value }: { label: string; value: number }) => (
  <div className="rounded-lg bg-[#1a2744] px-4 py-3 text-center">
    <div className="text-2xl font-bold text-[#c9a84c]">{value}</div>
    <div className="mt-0.5 text-xs text-white/70">{label}</div>
  </div>
);

const AdminReportModal = ({ open, onOpenChange }: Props) => {
  const { state: authState } = useAuth();
  const isAdmin = authState.status === "authenticated" && authState.isAdmin;
  const { state, refresh } = useAdminReport(isAdmin);

  const loading = state.status === "loading";
  const error = state.status === "error";
  const rsvps: RsvpRow[] = state.status === "ready" ? state.rsvps : [];
  const volunteers: VolunteerRow[] =
    state.status === "ready" ? state.volunteers : [];

  const studentsOvernight = rsvps.filter((r) => r.overnight).length;
  const parentsOvernight = volunteers.filter((v) => v.overnight).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] w-full max-w-4xl flex-col gap-0 overflow-hidden p-0">
        <DialogHeader className="shrink-0 border-b border-[#d4c8b8] px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-[#1a2744]">
                Attendee Report
              </DialogTitle>
              <DialogDescription className="text-[#1a2744]/50">
                Promdemic 2026 · May 15–16
              </DialogDescription>
            </div>
            <button
              onClick={refresh}
              disabled={loading}
              className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-[#1a2744]/50 hover:bg-[#1a2744]/5 hover:text-[#1a2744] disabled:opacity-40"
              aria-label="Refresh"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>
        </DialogHeader>

        <div className="overflow-y-auto px-6 py-5 space-y-8">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              Failed to load report. Check your connection and{" "}
              <button
                onClick={refresh}
                className="underline hover:no-underline"
              >
                try again
              </button>
              .
            </div>
          )}
          {/* Summary stats */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard label="Total RSVPs" value={rsvps.length} />
            <StatCard label="Students Overnight" value={studentsOvernight} />
            <StatCard label="Total Volunteers" value={volunteers.length} />
            <StatCard label="Parents Overnight" value={parentsOvernight} />
          </div>

          {/* Volunteer slots */}
          <div>
            <h3 className="mb-2 text-sm font-semibold text-[#1a2744]">
              Volunteer Slots
            </h3>
            <div className="overflow-x-auto rounded-lg border border-[#d4c8b8]">
              <table className="w-full">
                <thead className="border-b border-[#d4c8b8] bg-[#f5efe6]">
                  <tr>
                    <Th>Role</Th>
                    <Th>Filled</Th>
                    <Th>Capacity</Th>
                    <Th>Status</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d4c8b8]">
                  {(
                    Object.entries(VOLUNTEER_ROLES) as [VolunteerRole, number][]
                  ).map(([role, capacity]) => {
                    const filled = volunteers.filter(
                      (v) => v.role === role,
                    ).length;
                    const open = capacity - filled;
                    return (
                      <tr key={role} className="bg-white">
                        <Td>{role}</Td>
                        <Td>{filled}</Td>
                        <Td>{capacity}</Td>
                        <td className="px-3 py-2 text-sm">
                          {open <= 0 ? (
                            <span className="font-medium text-[#2a7f7f]">
                              Full
                            </span>
                          ) : (
                            <span className="text-[#c9a84c]">{open} open</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Student RSVPs */}
          <div>
            <h3 className="mb-2 text-sm font-semibold text-[#1a2744]">
              Student RSVPs ({rsvps.length})
            </h3>
            <div className="overflow-x-auto rounded-lg border border-[#d4c8b8]">
              <table className="w-full">
                <thead className="border-b border-[#d4c8b8] bg-[#f5efe6]">
                  <tr>
                    <Th>Name</Th>
                    <Th>Overnight</Th>
                    <Th>Dietary</Th>
                    <Th>Song Requests</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d4c8b8]">
                  {loading ? (
                    <TableSkeleton cols={4} />
                  ) : rsvps.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-3 py-4 text-center text-sm text-[#1a2744]/40"
                      >
                        No RSVPs yet
                      </td>
                    </tr>
                  ) : (
                    rsvps.map((r) => (
                      <tr key={r.uid} className="bg-white">
                        <Td>{r.name}</Td>
                        <Td>{yesNo(r.overnight)}</Td>
                        <Td>{empty(r.dietary)}</Td>
                        <Td>{empty(r.songs)}</Td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Parent volunteers */}
          <div>
            <h3 className="mb-2 text-sm font-semibold text-[#1a2744]">
              Parent Volunteers ({volunteers.length})
            </h3>
            <div className="overflow-x-auto rounded-lg border border-[#d4c8b8]">
              <table className="w-full">
                <thead className="border-b border-[#d4c8b8] bg-[#f5efe6]">
                  <tr>
                    <Th>Name</Th>
                    <Th>Role</Th>
                    <Th>Email</Th>
                    <Th>Overnight</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d4c8b8]">
                  {loading ? (
                    <TableSkeleton cols={4} />
                  ) : volunteers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-3 py-4 text-center text-sm text-[#1a2744]/40"
                      >
                        No volunteers yet
                      </td>
                    </tr>
                  ) : (
                    volunteers.map((v) => (
                      <tr key={v.uid} className="bg-white">
                        <Td>{v.name}</Td>
                        <Td>{v.role}</Td>
                        <Td>{v.email}</Td>
                        <Td>{yesNo(v.overnight)}</Td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminReportModal;
