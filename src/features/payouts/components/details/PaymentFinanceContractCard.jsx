function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[14px] text-[#5d524b]">{label}</span>
      <span className="text-right text-[14px] font-semibold text-[#1d1612]">
        {value}
      </span>
    </div>
  );
}

function formatHistoryAction(action) {
  return String(action || "Activity")
    .toLowerCase()
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatHistoryActor(item) {
  const actorName = String(item?.actorName || "").trim();
  const actorType = String(item?.actorType || "").trim();

  if (actorName && actorType) {
    return `${actorName} · ${actorType}`;
  }

  return actorName || actorType || "System";
}

function HistoryList({ items }) {
  if (!Array.isArray(items) || items.length === 0) {
    return (
      <p className="text-[14px] text-[#786b63]">
        No history entries available.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <article
          key={item.id}
          className="overflow-hidden rounded-[20px] border border-[#eee1d7] bg-[linear-gradient(180deg,#ffffff_0%,#fffaf6_100%)] shadow-[0_10px_24px_rgba(51,31,17,0.05)]"
        >
          <div className="flex flex-col gap-4 px-4 py-4 sm:px-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center rounded-full border border-[#f2d3c1] bg-[linear-gradient(135deg,#fff4ec_0%,#ffe9dc_100%)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#bf6737]">
                    {formatHistoryAction(item.action)}
                  </span>
                  {(item.fromStatus || item.toStatus) ? (
                    <span className="inline-flex items-center rounded-full bg-[#f6f1ec] px-3 py-1 text-[11px] font-semibold text-[#74675f]">
                      {(item.fromStatus || "Unknown")} to {(item.toStatus || "Unknown")}
                    </span>
                  ) : null}
                </div>
                <p className="mt-3 text-[14px] font-semibold text-[#2a201a]">
                  {formatHistoryActor(item)}
                </p>
              </div>

              <div className="rounded-full bg-[#fbf5ef] px-3 py-1.5 text-[11px] font-semibold text-[#8f8177]">
                {item.createdAtLabel}
              </div>
            </div>

            {item.note ? (
              <div className="rounded-[16px] border border-[#f1e4da] bg-white/85 px-4 py-3">
                <p className="text-[13px] leading-6 text-[#4d433d]">{item.note}</p>
              </div>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}

function Section({ children, title }) {
  return (
    <section className="rounded-[18px] border border-[#ddd4cd] bg-white p-5 shadow-[0_12px_30px_rgba(55,31,13,0.05)]">
      <h3 className="text-[17px] font-bold text-[#221914]">{title}</h3>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function ReceiptPreview({ url }) {
  const normalizedUrl = `${url || ""}`.trim();

  if (!normalizedUrl || normalizedUrl === "Not available") {
    return null;
  }

  const isImage = /\.(png|jpe?g|webp|gif)($|\?)/i.test(normalizedUrl);

  return (
    <div className="mt-4 rounded-[14px] border border-[#ecdcd0] bg-white px-4 py-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[14px] font-semibold text-[#221914]">Uploaded receipt</p>
        <a
          className="text-[13px] font-semibold text-[#cf6e38] hover:text-[#bc6030]"
          href={normalizedUrl}
          rel="noreferrer"
          target="_blank"
        >
          Open file
        </a>
      </div>
      {isImage ? (
        <img
          alt="Customer payment receipt"
          className="mt-3 max-h-[320px] w-full rounded-[12px] border border-[#eee3db] object-contain"
          src={normalizedUrl}
        />
      ) : (
        <p className="mt-3 break-all text-[13px] leading-6 text-[#5b4f48]">{normalizedUrl}</p>
      )}
    </div>
  );
}

export default function PaymentFinanceContractCard({ payout }) {
  const invoice = payout.contractInvoice;
  const settlement = payout.settlement;
  const commission = payout.commission;

  if (!invoice && !settlement && !commission) {
    return null;
  }

  return (
    <div className="space-y-4">
      {invoice ? (
        <Section title="Invoice Contract Details">
          <div className="space-y-3">
            <InfoRow label="Payment Status" value={invoice.paymentStatus} />
            <InfoRow label="Payment Method" value={invoice.paymentMethod} />
            <InfoRow label="Reference" value={invoice.paymentReference} />
            <InfoRow label="Issued At" value={invoice.issuedAtLabel} />
            <InfoRow label="Due Date" value={invoice.dueDateLabel} />
            <InfoRow label="Paid At" value={invoice.paidAtLabel} />
            <InfoRow label="Verified At" value={invoice.verifiedAtLabel} />
            <InfoRow label="Rejected At" value={invoice.rejectedAtLabel} />
          </div>

          {invoice.paymentReport ? (
            <div className="mt-5 rounded-[14px] border border-[#f1e2d7] bg-[#fff8f3] px-4 py-4">
              <p className="text-[14px] font-semibold text-[#221914]">Reported Payment</p>
              <div className="mt-3 space-y-3">
                <InfoRow label="Payment Date" value={invoice.paymentReport.paymentDate} />
                <InfoRow label="Reported At" value={invoice.paymentReport.reportedAtLabel} />
                <InfoRow label="Transfer Reference" value={invoice.paymentReport.transferReference} />
                <InfoRow label="Receipt URL" value={invoice.paymentReport.receiptUrl} />
              </div>
              {invoice.paymentReport.note ? (
                <p className="mt-3 text-[13px] leading-6 text-[#5b4f48]">
                  {invoice.paymentReport.note}
                </p>
              ) : null}
              <ReceiptPreview url={invoice.paymentReport.receiptUrl} />
            </div>
          ) : null}
        </Section>
      ) : null}

      {settlement ? (
        <Section title="Settlement & Commission">
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="space-y-3">
              <InfoRow label="Settlement Number" value={settlement.settlementNumber} />
              <InfoRow label="Settlement Status" value={settlement.status} />
              <InfoRow label="Gross Order Amount" value={settlement.grossOrderAmount} />
              <InfoRow label="Tax Amount" value={settlement.taxAmount} />
              <InfoRow label="Delivery Fee" value={settlement.deliveryFee} />
              <InfoRow label="Service Fee" value={settlement.serviceFee} />
              <InfoRow label="Vendor Payable" value={settlement.vendorPayable} />
              <InfoRow label="Funded At" value={settlement.fundedAtLabel} />
              <InfoRow label="Ready For Payout" value={settlement.readyForPayoutAtLabel} />
              <InfoRow label="Settled At" value={settlement.settledAtLabel} />
            </div>

            <div className="space-y-3">
              <InfoRow label="Commission Status" value={commission?.status || "Not available"} />
              <InfoRow label="Commission Model" value={commission?.model || "Not available"} />
              <InfoRow label="Commission Rate" value={commission?.ratePercentLabel || "Not available"} />
              <InfoRow label="Gross Commission" value={commission?.grossCommission || "Not available"} />
              <InfoRow label="Total Commission" value={commission?.totalCommission || "Not available"} />
              <InfoRow label="Fixed Fee" value={commission?.fixedFee || "Not available"} />
              <InfoRow label="VAT on Commission" value={commission?.vatOnCommission || "Not available"} />
              <InfoRow label="Locked At" value={commission?.lockedAtLabel || "Not available"} />
              <InfoRow label="Adjusted At" value={commission?.adjustedAtLabel || "Not available"} />
            </div>
          </div>

          {commission?.note ? (
            <div className="mt-4 rounded-[14px] border border-[#f1e2d7] bg-[#fff8f3] px-4 py-4 text-[13px] leading-6 text-[#5b4f48]">
              {commission.note}
            </div>
          ) : null}
        </Section>
      ) : null}

      {settlement?.history?.length ? (
        <Section title="Settlement History">
          <HistoryList items={settlement.history} />
        </Section>
      ) : null}
    </div>
  );
}
