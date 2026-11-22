/* Simple bold line icons for the Bright preview. White on color discs. */

interface IconProps { size?: number; }

function base(size: number) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
}

export function ShieldIcon({ size = 40 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M12 3l7 2.8v5.4c0 4.4-2.9 7.4-7 9.3-4.1-1.9-7-4.9-7-9.3V5.8L12 3z" />
      <path d="M9 11.6l2.1 2.1 4-4.2" />
    </svg>
  );
}

export function RobotIcon({ size = 40 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M12 4v3" />
      <circle cx="12" cy="3.4" r="1.3" fill="currentColor" stroke="none" />
      <rect x="4" y="7" width="16" height="11.5" rx="3.5" />
      <circle cx="9.3" cy="12.4" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="14.7" cy="12.4" r="1.5" fill="currentColor" stroke="none" />
      <path d="M9.4 15.8h5.2" />
      <path d="M4 11H2.6M21.4 11H20" />
    </svg>
  );
}

export function KeyIcon({ size = 40 }: IconProps) {
  return (
    <svg {...base(size)}>
      <circle cx="8" cy="15" r="4.6" />
      <path d="M11.4 11.6L20 3" />
      <path d="M16.2 6.8l3 3" />
      <path d="M13.4 9.6l2.4 2.4" />
    </svg>
  );
}

export function ChatIcon({ size = 40 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H12l-4.6 3.8v-3.8H6.5A2.5 2.5 0 0 1 4 13.5v-8z" />
      <path d="M8.2 8.4h7.6M8.2 11.6h4.6" />
    </svg>
  );
}

export function TrophyIcon({ size = 40 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M7 4h10v4.5a5 5 0 0 1-10 0V4z" />
      <path d="M7 5.2H4.2a2.9 2.9 0 0 0 3 4.6M17 5.2h2.8a2.9 2.9 0 0 1-3 4.6" />
      <path d="M12 13.5V17M8.4 20.5h7.2M10 17h4l.7 3.5H9.3L10 17z" />
    </svg>
  );
}

export function InboxIcon({ size = 40 }: IconProps) {
  return (
    <svg {...base(size)}>
      <rect x="3" y="4.5" width="18" height="15" rx="3" />
      <path d="M3.5 6.5L12 13l8.5-6.5" />
    </svg>
  );
}

export function LinkIcon({ size = 40 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M10.2 13.8a4.2 4.2 0 0 0 6 0l2.9-2.9a4.24 4.24 0 1 0-6-6l-1.4 1.4" />
      <path d="M13.8 10.2a4.2 4.2 0 0 0-6 0l-2.9 2.9a4.24 4.24 0 1 0 6 6l1.4-1.4" />
    </svg>
  );
}

export function CheckIcon({ size = 40 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M4.5 12.5l5 5L19.5 7" />
    </svg>
  );
}

export function StarIcon({ size = 40 }: IconProps) {
  return (
    <svg {...base(size)} fill="currentColor" stroke="none">
      <path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.3L12 17.2l-5.7 3-1.2-6.3L.4 9.5l6.4-.8L12 2.8z" />
    </svg>
  );
}

export function FlameIcon({ size = 40 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M12 3.2c.9 3-2.1 4.6-2.1 7.3a4.6 4.6 0 0 0 9.2 0c0-1.6-.6-2.7-1.4-3.9-.4 1-1 1.7-1.9 2.1.2-2.2-1.2-4.9-3.8-5.6z" />
      <path d="M12 21a2.9 2.9 0 0 1-2.9-2.9c0-1.2.7-2.1 1.5-2.9.5.6 1.4 1.2 1.4 2.4" />
    </svg>
  );
}

export function LockIcon({ size = 40 }: IconProps) {
  return (
    <svg {...base(size)}>
      <rect x="5" y="10.5" width="14" height="9.5" rx="2.5" />
      <path d="M8.2 10.5V8a3.8 3.8 0 0 1 7.6 0v2.5" />
      <circle cx="12" cy="15.2" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function HomeIcon({ size = 40 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M4 11.5L12 4l8 7.5" />
      <path d="M6.2 9.8V20h11.6V9.8" />
      <path d="M9.8 20v-5.2h4.4V20" />
    </svg>
  );
}

export function BoltIcon({ size = 40 }: IconProps) {
  return (
    <svg {...base(size)} fill="currentColor" stroke="none">
      <path d="M13.2 2.5L4.8 13.4h5.4l-1.5 8.1 8.6-11h-5.5l1.4-8z" />
    </svg>
  );
}

export function GearIcon({ size = 40 }: IconProps) {
  return (
    <svg {...base(size)}>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 3.5v3M12 17.5v3M3.5 12h3M17.5 12h3M6 6l2.1 2.1M15.9 15.9L18 18M18 6l-2.1 2.1M8.1 15.9L6 18" />
    </svg>
  );
}

export function PhoneIcon({ size = 40 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M6.8 3.8h3l1.4 4.4-2 1.6a12.6 12.6 0 0 0 5 5l1.6-2 4.4 1.4v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.8 6a2 2 0 0 1 2-2.2z" />
    </svg>
  );
}

export function EyeIcon({ size = 40 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M2.8 12S6 5.8 12 5.8 21.2 12 21.2 12 18 18.2 12 18.2 2.8 12 2.8 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function UsersIcon({ size = 40 }: IconProps) {
  return (
    <svg {...base(size)}>
      <circle cx="9" cy="8.6" r="3.4" />
      <path d="M3.4 19.6c.6-3 2.8-4.6 5.6-4.6s5 1.6 5.6 4.6" />
      <path d="M15.6 5.7a3.4 3.4 0 0 1 0 6.1M17.6 15.3c1.7.6 2.7 2 3 4.3" />
    </svg>
  );
}

export function SkullIcon({ size = 40 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M12 3.5a7.5 7.5 0 0 1 7.5 7.5c0 2.8-1.4 4.4-3 5.4V19a1.5 1.5 0 0 1-1.5 1.5H9A1.5 1.5 0 0 1 7.5 19v-2.1c-1.6-1-3-2.6-3-5.4A7.5 7.5 0 0 1 12 3.5z" />
      <circle cx="9.2" cy="11.6" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="14.8" cy="11.6" r="1.5" fill="currentColor" stroke="none" />
      <path d="M12 14.4l-1 2h2l-1-2z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function BookIcon({ size = 40 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H19v15H6.5A1.5 1.5 0 0 0 5 19.5v-15z" />
      <path d="M5 19.5A1.5 1.5 0 0 1 6.5 18H19v3H6.5" />
    </svg>
  );
}

export function ImageIcon({ size = 40 }: IconProps) {
  return (
    <svg {...base(size)}>
      <rect x="3.5" y="5" width="17" height="14" rx="2.5" />
      <circle cx="9" cy="10" r="1.6" />
      <path d="M4.5 17.5l4.7-4.7 3 3L16.5 11l3 3.4" />
    </svg>
  );
}

export function TimerIcon({ size = 40 }: IconProps) {
  return (
    <svg {...base(size)}>
      <circle cx="12" cy="13" r="7.5" />
      <path d="M12 9.5V13l2.4 1.6M9.5 3h5" />
    </svg>
  );
}

export function PlayIcon({ size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8 5.4v13.2c0 .9 1 1.5 1.8 1L20 13a1.2 1.2 0 0 0 0-2L9.8 4.4C9 4 8 4.5 8 5.4z" />
    </svg>
  );
}
