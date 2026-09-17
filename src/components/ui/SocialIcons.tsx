type IconProps = { size?: number; className?: string };

// lucide-react no longer ships trademarked brand icons — these are minimal inline
// replacements, sized and stroked to sit alongside lucide's own icon set.
export function InstagramIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  );
}

export function FacebookIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M14 8.5h2.5V5.2h-2.7C11.2 5.2 10 6.9 10 9v2H8v3.3h2V21h3.3v-6.7h2.4l.5-3.3h-2.9V9c0-.4.2-.5.7-.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function TwitterIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M18.5 4h2.4l-5.2 6 6.1 8.1h-4.8l-3.8-4.9-4.3 4.9H6.5l5.6-6.4L6.2 4H11l3.5 4.5L18.5 4Zm-.9 12.6h1.3L8.5 5.3H7.1l10.5 11.3Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function LinkedinIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="8" cy="8.5" r="1.1" fill="currentColor" />
      <path d="M7 11v6M17 17v-3.3c0-1.5-.8-2.2-1.9-2.2-1 0-1.7.6-2 1.2V17M11 11v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function PinterestIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M10.2 18c.4-1.5 1-4.1 1.3-5.5a2.3 2.3 0 0 1-.2-1c0-1 .6-1.7 1.3-1.7.6 0 .9.5.9 1.1 0 .6-.4 1.6-.6 2.5-.2.7.4 1.3 1.1 1.3 1.3 0 2.2-1.7 2.2-3.6 0-1.5-1-2.6-2.9-2.6-2.1 0-3.4 1.6-3.4 3.3 0 .6.2 1 .5 1.4.1.2.2.3.1.5l-.2.7c0 .2-.2.3-.4.2-1-.4-1.5-1.6-1.5-2.9 0-2.2 1.8-4.8 5.4-4.8 2.9 0 4.8 2.1 4.8 4.3 0 2.9-1.6 5.1-3.9 5.1-.8 0-1.5-.4-1.8-.9l-.5 2c-.2.7-.6 1.6-.9 2.1"
        fill="currentColor"
      />
    </svg>
  );
}
