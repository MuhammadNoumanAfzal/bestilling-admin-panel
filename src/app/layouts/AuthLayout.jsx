export default function AuthLayout({ children, allowScroll = false }) {
  return (
    <main
      className={[
        "h-dvh overflow-hidden",
        "bg-[#f4eee7]",
      ].join(" ")}
    >
      <section
        className={[
          "relative flex justify-center overflow-hidden px-4",
          allowScroll
            ? "min-h-full items-start overflow-y-auto py-8 hide-scrollbar"
            : "h-full items-center py-4 sm:py-5",
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
          <div className="mb-4 flex flex-col items-center gap-2.5 text-center sm:mb-5 sm:gap-3">
            <img className="h-32 w-auto max-w-[240px]" src="/logo (2).png" alt="Go Catering" />
            <div className="space-y-1.5">
              <p className="text-[19px] font-extrabold uppercase tracking-[0.14em] text-[#cf6e38] sm:text-[21px]">
                Go Catering
              </p>
              <p className="max-w-[360px] text-[15px] font-medium leading-6 text-[#7d7066]">
                Secure access to the control center
              </p>
            </div>
          </div>
          {children}
        </div>
      </section>
    </main>
  );
}
