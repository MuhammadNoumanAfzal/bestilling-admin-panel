import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";
import { st } from "../settingsTranslation.js";

export default function DisplayLanguageSettings() {
  const { i18n } = useTranslation("adminSettings");
  return (
    <section aria-labelledby="display-language-title" className="border-b border-[#ece3db] py-5">
      <h2 id="display-language-title" className="mb-4 text-[18px] font-bold text-[#201914]">{st("Language")}</h2>
      <div className="flex max-w-2xl items-center gap-3 rounded-[10px] border border-[#f0dfd3] bg-[#fffaf4] p-3">
        <Languages aria-hidden="true" className="shrink-0 text-[#cf6e38]" size={22} />
        <label className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="text-[13px] font-bold text-[#201914]">{st("Display language")}</span>
          <select className="h-[38px] w-full min-w-0 cursor-pointer rounded-[7px] border border-[#cec5bd] bg-white px-3 text-[13px] text-[#201712] outline-none focus:border-[#cf6e38] focus-visible:ring-2 focus-visible:ring-[#cf6e38]" onChange={(event) => i18n.changeLanguage(event.target.value)} value={i18n.resolvedLanguage}>
            <option value="nb">{st("Norwegian Bokmål")}</option>
            <option value="en">{st("English")}</option>
          </select>
        </label>
      </div>
    </section>
  );
}
