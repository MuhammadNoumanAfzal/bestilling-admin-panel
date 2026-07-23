function DocumentCard({ document }) {
  return (
    <article className="rounded-[14px] border border-[#ddd6cf] bg-white p-4 shadow-[0_6px_16px_rgba(53,34,20,0.04)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-[13px] font-bold text-[#18120f]">{document.title}</h3>
          <p className="mt-1 text-[11px] text-[#8c8077]">{document.subtitle}</p>
        </div>
        <span
          className={[
            "rounded-full px-2 py-0.5 text-[9px] font-bold",
            document.status === "Verified"
              ? "bg-[#f3faf6] text-[#2b9e62]"
              : "bg-[#fff7e8] text-[#b97914]",
          ].join(" ")}
        >
          {document.status}
        </span>
      </div>

      <div className="mt-4 flex gap-2">
        <button className="flex-1 rounded-[8px] border border-[#ddd4cb] bg-white px-3 py-2 text-[11px] font-semibold text-[#4d423b]" type="button">
          Preview
        </button>
        <button className="flex-1 rounded-[8px] border border-[#ddd4cb] bg-white px-3 py-2 text-[11px] font-semibold text-[#4d423b]" type="button">
          Download
        </button>
      </div>
    </article>
  );
}

export default function VendorVerificationSection({ documents }) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 px-1">
        <span className="h-5 w-[3px] rounded-full bg-[#d96834]" />
        <h2 className="text-[18px] font-extrabold tracking-tight text-[#18120f]">
          Verification Documents
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {documents.map((document) => (
          <DocumentCard key={document.id} document={document} />
        ))}
      </div>
    </section>
  );
}
