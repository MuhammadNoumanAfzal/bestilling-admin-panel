import { FileSpreadsheet, FileText, Import, ScanSearch, Upload } from "lucide-react";
import { useRef, useState } from "react";
import Swal from "sweetalert2";
import {
  bulkImportDeliveryPostalAreasRequest,
  extractPostalCodesFromFileRequest,
  extractPostalCodesFromTextRequest,
} from "../api/deliveryApi.js";

export default function PostalCodeImportPanel({
  deliveryAreaId = "",
  onApplyPreview,
  onImportComplete,
}) {
  const fileInputRef = useRef(null);
  const [pastedText, setPastedText] = useState("");
  const [preview, setPreview] = useState(null);
  const [sourceLabel, setSourceLabel] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const hasPreview = preview?.postalCodes?.length > 0;

  async function handleFileChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setSelectedFileName(file.name || "");
      setIsExtracting(true);
      Swal.fire({
        title: "Uploading document",
        text: `Reading ${file.name} and extracting postal codes...`,
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      const result = await extractPostalCodesFromFileRequest(file);
      Swal.close();
      setPreview(result);
      setSourceLabel(file.name || result.fileName || "Uploaded file");
      await Swal.fire(
        result.uniqueCount > 0
          ? {
              icon: "success",
              title: "Postal codes extracted",
              text: `${result.uniqueCount} unique postal codes found from ${file.name}.`,
              confirmButtonColor: "#cf6e38",
            }
          : {
              icon: "warning",
              title: "No postal codes detected",
              text:
                result.message ||
                `The extractor finished reading ${file.name}, but the backend returned 0 unique postal codes.`,
              confirmButtonColor: "#cf6e38",
            },
      );
    } catch (error) {
      Swal.close();
      setPreview(null);
      setSourceLabel("");
      await Swal.fire({
        icon: "error",
        title: "Unable to extract postal codes",
        text: error instanceof Error ? error.message : "Please try again.",
        confirmButtonColor: "#cf6e38",
      });
    } finally {
      setIsExtracting(false);
      event.target.value = "";
    }
  }

  async function handleTextExtract() {
    setIsExtracting(true);

    try {
      const result = await extractPostalCodesFromTextRequest(pastedText);
      setPreview(result);
      setSourceLabel("Pasted text");
      await Swal.fire(
        result.uniqueCount > 0
          ? {
              icon: "success",
              title: "Postal codes extracted",
              text: `${result.uniqueCount} unique postal codes found from the pasted text.`,
              confirmButtonColor: "#cf6e38",
            }
          : {
              icon: "warning",
              title: "No postal codes detected",
              text:
                result.message ||
                "The extractor completed, but the backend returned 0 unique postal codes from the pasted text.",
              confirmButtonColor: "#cf6e38",
            },
      );
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Unable to extract postal codes",
        text: error instanceof Error ? error.message : "Please try again.",
        confirmButtonColor: "#cf6e38",
      });
    } finally {
      setIsExtracting(false);
    }
  }

  async function handleApply() {
    if (!hasPreview) {
      return;
    }

    if (!deliveryAreaId) {
      const result = await onApplyPreview?.(preview);
      setPreview(null);
      setSourceLabel("");
      setSelectedFileName("");
      setPastedText("");

      await Swal.fire({
        icon: "success",
        title: "Postal codes added",
        text:
          result?.addedCount > 0
            ? `${result.addedCount} new postal codes were added to the draft area.`
            : "All extracted postal codes were already present in the draft list.",
        confirmButtonColor: "#cf6e38",
      });
      return;
    }

    setIsImporting(true);

    try {
      const result = await bulkImportDeliveryPostalAreasRequest(
        deliveryAreaId,
        preview.postalCodes,
      );
      await onImportComplete?.(result, preview);
      setPreview(null);
      setSourceLabel("");
      setPastedText("");
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Unable to import postal codes",
        text: error instanceof Error ? error.message : "Please try again.",
        confirmButtonColor: "#cf6e38",
      });
    } finally {
      setIsImporting(false);
    }
  }

  return (
    <section className="rounded-[18px] border border-[#eadfd6] bg-[linear-gradient(180deg,#fffdfa_0%,#fff7f1_100%)] p-4 shadow-[0_10px_24px_rgba(55,31,13,0.04)]">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#cf6e38]">
            Postal Code Import
          </p>
          <h3 className="mt-1 text-[22px] font-bold tracking-[-0.03em] text-[#18120f]">
            Extract From File or Text
          </h3>
          <p className="mt-2 max-w-3xl text-[14px] leading-6 text-[#6f645d]">
            Upload a PDF, Excel, CSV, or text file, or paste raw coverage text. The system
            will detect postal codes, expand ranges like 0150-0155, and prepare a clean import preview.
          </p>
        </div>

        <button
          className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-[10px] border border-[#e4d7ce] bg-white px-4 text-[13px] font-semibold text-[#4a3d36] transition hover:border-[#cf6e38] hover:text-[#cf6e38]"
          onClick={() => fileInputRef.current?.click()}
          type="button"
        >
          <Upload size={15} />
          Upload Document
        </button>
      </div>

      <input
        ref={fileInputRef}
        accept=".pdf,.xlsx,.xls,.xlsm,.csv,.txt"
        className="hidden"
        onChange={(event) => {
          void handleFileChange(event);
        }}
        type="file"
      />

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[16px] border border-[#eee3db] bg-white p-4">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-[#cf6e38]" />
            <p className="text-[15px] font-bold text-[#18120f]">Paste Coverage Text</p>
          </div>
          <textarea
            className="mt-3 min-h-[140px] w-full rounded-[12px] border border-[#d9d1ca] bg-[#f6f4f2] px-3.5 py-3 text-[13px] text-[#2a1f19] outline-none transition placeholder:text-[#aa9f96] focus:border-[#ce6938] focus:bg-white focus:shadow-[0_0_0_3px_rgba(206,105,56,0.12)]"
            onChange={(event) => setPastedText(event.target.value)}
            placeholder={"0150 Oslo\n0151 - 0155 Central Zone\n5003 Bergen"}
            value={pastedText}
          />

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[12px] text-[#8b7d74]">
              Supported formats: raw lists, pasted OCR text, and range notation.
            </p>

            <button
              className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-[#cf6e38] px-4 text-[13px] font-semibold text-white transition hover:bg-[#bc6030] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isExtracting || !pastedText.trim()}
              onClick={() => {
                void handleTextExtract();
              }}
              type="button"
            >
              <ScanSearch size={15} />
              {isExtracting ? "Extracting..." : "Extract From Text"}
            </button>
          </div>
        </div>

        <div className="rounded-[16px] border border-[#eee3db] bg-white p-4">
          <div className="flex items-center gap-2">
            <FileSpreadsheet size={16} className="text-[#cf6e38]" />
            <p className="text-[15px] font-bold text-[#18120f]">Preview Summary</p>
          </div>

          {selectedFileName && !hasPreview ? (
            <div className="mt-3 rounded-[12px] bg-[#fff5ee] px-3 py-2.5">
              <p className="text-[12px] font-semibold text-[#8a6f5d]">Selected file</p>
              <p className="mt-1 break-all text-[13px] font-bold text-[#18120f]">
                {selectedFileName}
              </p>
            </div>
          ) : null}

          {hasPreview ? (
            <div className="mt-3 space-y-3">
              <div className="rounded-[12px] bg-[#fff5ee] p-3">
                <p className="text-[12px] font-semibold text-[#8a6f5d]">Source</p>
                <p className="mt-1 text-[13px] font-bold text-[#18120f]">{sourceLabel}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-[12px] border border-[#efe3da] bg-[#fcfbfa] p-3">
                  <p className="text-[12px] font-semibold text-[#8a6f5d]">Found</p>
                  <p className="mt-1 text-[22px] font-bold text-[#18120f]">{preview.totalFound}</p>
                </div>
                <div className="rounded-[12px] border border-[#efe3da] bg-[#fcfbfa] p-3">
                  <p className="text-[12px] font-semibold text-[#8a6f5d]">Unique</p>
                  <p className="mt-1 text-[22px] font-bold text-[#18120f]">{preview.uniqueCount}</p>
                </div>
              </div>

              <div className="max-h-[184px] overflow-y-auto rounded-[12px] border border-[#efe3da]">
                <div className="divide-y divide-[#f1e9e2]">
                  {preview.items.map((item) => (
                    <div
                      key={item.postalCode}
                      className="flex items-center justify-between gap-3 px-3 py-2.5"
                    >
                      <div>
                        <p className="text-[13px] font-bold text-[#18120f]">{item.postalCode}</p>
                        <p className="text-[12px] text-[#7b6f68]">
                          {item.name || "Area name unavailable"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[12px] font-semibold text-[#7b6f68]">
                          x{item.occurrences || 1}
                        </p>
                        <p
                          className={`text-[11px] font-bold ${
                            item.isKnownArea ? "text-[#2b9e62]" : "text-[#b45309]"
                          }`}
                        >
                          {item.isKnownArea ? "Known area" : "Needs review"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-[#cf6e38] px-4 text-[13px] font-semibold text-white transition hover:bg-[#bc6030] disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isImporting}
                onClick={() => {
                  void handleApply();
                }}
                type="button"
              >
                <Import size={15} />
                {deliveryAreaId
                  ? isImporting
                    ? "Importing..."
                    : `Import ${preview.postalCodes.length} Codes`
                  : `Add ${preview.postalCodes.length} Codes To Draft`}
              </button>
            </div>
          ) : (
            <div className="mt-3 rounded-[12px] border border-dashed border-[#e7dacf] bg-[#fcfbfa] px-4 py-8 text-center">
              <p className="text-[14px] font-semibold text-[#5f5149]">
                No extracted postal codes yet
              </p>
              <p className="mt-2 text-[12px] leading-5 text-[#8b7d74]">
                Upload a document or paste text to generate a preview before importing.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
