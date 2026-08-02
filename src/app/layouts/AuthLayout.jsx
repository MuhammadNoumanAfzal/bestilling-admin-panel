export default function AuthLayout({ children, allowScroll = false }) {
  return (
    <main
      className={[
        "min-h-screen overflow-y-auto",
        "bg-[#f4eee7]",
      ].join(" ")}
    >
      <section
        className={[
          "relative flex min-h-screen justify-center overflow-hidden px-4",
          allowScroll ? "items-start py-8" : "items-center py-6 sm:py-8",
        ].join(" ")}
        style={{
          backgroundImage:
            'linear-gradient(rgba(251,244,237,0.82), rgba(251,244,237,0.82)), url("/heroBg.webp")',
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.24),transparent_55%)]" />

        <div className="relative z-[1] flex w-full max-w-[480px] flex-col items-center">
          <div className="mb-3 flex flex-col items-center gap-2 text-center sm:mb-4 sm:gap-2.5">
            <img className="h-13 w-auto max-w-[220px]" src="/logo.png" alt="Bestilling Admin" />
            <div className="space-y-1">
              <p className="type-subpara text-[12px] font-bold uppercase tracking-[0.22em] text-[#cf6e38]">
                Bestilling Admin
              </p>
              <p className="type-para text-[#7d7066]">Secure access to the control center</p>
            </div>
          </div>
          {children}
        </div>
      </section>
    </main>
  );
}
