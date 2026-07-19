/** Real flag images — Windows can't render flag emojis (shows IT/GB instead). */
export default function FlagImg({ country, label, className = "w-8 h-6" }) {
  const code = (country || "un").toLowerCase();
  return (
    <img
      src={`https://flagcdn.com/w80/${code}.png`}
      srcSet={`https://flagcdn.com/w40/${code}.png 1x, https://flagcdn.com/w80/${code}.png 2x`}
      alt={label || code}
      width={80}
      height={60}
      loading="eager"
      decoding="async"
      className={`object-cover rounded-[2px] shadow-sm ring-1 ring-white/15 shrink-0 ${className}`}
    />
  );
}
