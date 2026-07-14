import { useMemo } from "react";
import { LifeBuoy, AlertCircle, CheckCircle, ArrowUpRight, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TICKET_STATUS = {
  Resolved: "bg-[#e8f8ef] text-[#1f8c52] rounded-[4px] px-2 py-0.5 text-[11px] font-bold tracking-wide uppercase",
  Open: "bg-[#fffbeb] text-[#b45309] rounded-[4px] px-2 py-0.5 text-[11px] font-bold tracking-wide uppercase",
};

export default function CustomerSupportInteractionsCard({ ticketsData = [] }) {
  const navigate = useNavigate();

  const stats = useMemo(() => {
    const total = ticketsData.length;
    const open = ticketsData.filter((t) => t.status === "Open").length;
    const resolved = ticketsData.filter((t) => t.status === "Resolved").length;

    return [
      { label: "Total Tickets", value: total, icon: HelpCircle },
      { label: "Open Tickets", value: open, icon: AlertCircle },
      { label: "Resolved", value: resolved, icon: CheckCircle },
    ];
  }, [ticketsData]);

  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center gap-2 px-1">
        <span className="h-4.5 w-[3px] bg-[#d96834] rounded-full" />
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-[6px] bg-[#fff0e7] text-[#d96834]">
          <LifeBuoy size={13} strokeWidth={2.5} />
        </span>
        <h3 className="text-[18px] font-bold text-[#18120f]">
          Support Interactions
        </h3>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-3 gap-3.5">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="flex items-center gap-3.5 rounded-[12px] border border-[#ddd6cf] bg-white px-4.5 py-3.5 shadow-[0_4px_12px_rgba(53,34,20,0.02)] transition duration-150 hover:border-[#cf6e38]/20"
            >
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-[#fff0e7] text-[#cf6432]">
                <Icon size={16} strokeWidth={2.5} />
              </span>
              <div>
                <span className="block text-[12px] font-bold uppercase tracking-wider text-[#9a8f86]">
                  {s.label}
                </span>
                <span className="block text-[18px] font-bold text-[#18120f] mt-0.5 leading-none">
                  {s.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tickets Table Card */}
      <div className="rounded-[14px] border border-[#ddd6cf] bg-white shadow-[0_6px_16px_rgba(53,34,20,0.05)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px] border-collapse text-[14px]">
            <thead>
              <tr className="bg-[#faf8f6] text-left border-b border-[#eee4dd]">
                {[
                  { label: "Ticket ID", width: "20%" },
                  { label: "Subject", width: "50%" },
                  { label: "Status", width: "15%" },
                  { label: "Created Date", width: "15%" },
                  { label: "Action", width: "8%", align: "text-center" },
                ].map((th, i) => (
                  <th
                    key={i}
                    style={{ width: th.width }}
                    className={`px-4 py-3.5 text-[13px] font-bold text-[#9b8f86] ${
                      th.align || ""
                    }`}
                  >
                    {th.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ticketsData.map((t) => (
                <tr
                  key={t.id}
                  className="border-b border-[#f3ece6] last:border-0 transition-colors duration-150 hover:bg-[#faf8f6]"
                >
                  <td className="px-4 py-3.5 font-bold text-[#cf6432]">{t.id}</td>
                  <td className="px-4 py-3.5 font-bold text-[#18120f]">{t.subject}</td>
                  <td className="px-4 py-3.5">
                    <span className={TICKET_STATUS[t.status] || "bg-[#f0ebe6] text-[#6f655e] rounded-[4px] px-2 py-0.5"}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-[13px] text-[#7a6e66]">{t.createdDate}</td>
                  <td className="px-4 py-3.5 text-center">
                    <button
                      onClick={() => navigate(`/support/${t.id.replace("#", "")}`)}
                      type="button"
                      className="inline-flex cursor-pointer items-center justify-center h-8.5 w-8.5 rounded-[6px] border border-[#e0d5cc] bg-white text-[#cf6e38] transition hover:border-[#cf6e38] hover:bg-[#fff6f0] outline-none"
                      title="View Ticket details"
                    >
                      <ArrowUpRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
