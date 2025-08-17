export function Logo() {
  return (
    <div className="flex flex-col items-start justify-center border-0 shadow-none h-24 sm:h-28 lg:h-32">
      <img
        src="/logo.svg"
        alt="Logo"
        className="h-16 sm:h-20 lg:h-32 mix-blend-darken"
      />
    </div>
  );
}
