function DocumentCard({ document, onDownload, onPreview }) {
  return (
    <article className="rounded-[16px] border border-[#ddd6cf] bg-white p-5 shadow-[0_8px_20px_rgba(53,34,20,0.05)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-[16px] font-bold text-[#18120f]">{document.title}</h3>
          <p className="mt-1 text-[12px] text-[#8c8077]">{document.subtitle}</p>
        </div>
        <span
          className={[
            "rounded-full px-2.5 py-1 text-[10px] font-bold",
            document.status === "Verified"
              ? "bg-[#f3faf6] text-[#2b9e62]"
              : "bg-[#fff7e8] text-[#b97914]",
          ].join(" ")}
        >
          {document.status}
        </span>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          className="flex-1 rounded-[8px] border border-[#ddd4cb] bg-white px-3 py-2.5 text-[12px] font-semibold text-[#4d423b]"
          onClick={() => onPreview?.(document)}
          type="button"
        >
          Preview
        </button>
        <button
          className="flex-1 rounded-[8px] border border-[#ddd4cb] bg-white px-3 py-2.5 text-[12px] font-semibold text-[#4d423b]"
          onClick={() => onDownload?.(document)}
          type="button"
        >
          Download
        </button>
      </div>
    </article>
  );
}

export default function VendorVerificationSection({ documents, onDownload, onPreview }) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 px-1">
        <span className="h-6 w-[4px] rounded-full bg-[#d96834]" />
        <h2 className="text-[22px] font-extrabold tracking-tight text-[#18120f]">
          Verification Documents
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {documents.map((document) => (
          <DocumentCard
            key={document.id}
            document={document}
            onDownload={onDownload}
            onPreview={onPreview}
          />
        ))}
      </div>
    </section>
  );
}
