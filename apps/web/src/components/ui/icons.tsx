import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

function IconBase({
  size = 20,
  strokeWidth = 1.9,
  className,
  children,
  ...props
}: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-4.2-4.2" />
    </IconBase>
  );
}

export function CartIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="9" cy="20" r="1.25" />
      <circle cx="18" cy="20" r="1.25" />
      <path d="M3 4h2.4l2.4 11.2a1 1 0 0 0 1 .8H18a1 1 0 0 0 1-.8L21 8H7.2" />
    </IconBase>
  );
}

export function ArrowLeftIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </IconBase>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </IconBase>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m6 9 6 6 6-6" />
    </IconBase>
  );
}

export function UserIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 19a7 7 0 0 1 14 0" />
    </IconBase>
  );
}

export function StoreIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 10h16" />
      <path d="M5 10v8.5a1.5 1.5 0 0 0 1.5 1.5h11a1.5 1.5 0 0 0 1.5-1.5V10" />
      <path d="M7 4h10l2 4.5a1.5 1.5 0 0 1-1.4 2H6.4A1.5 1.5 0 0 1 5 8.5z" />
      <path d="M9 14h6" />
    </IconBase>
  );
}

export function PackageIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z" />
      <path d="m12 12 8-4.5" />
      <path d="m12 12-8-4.5" />
      <path d="M12 21v-9" />
    </IconBase>
  );
}

export function DashboardIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="4" y="4" width="6" height="7" rx="1.5" />
      <rect x="14" y="4" width="6" height="4" rx="1.5" />
      <rect x="14" y="11" width="6" height="9" rx="1.5" />
      <rect x="4" y="14" width="6" height="6" rx="1.5" />
    </IconBase>
  );
}

export function ClipboardIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="6" y="5" width="12" height="15" rx="2" />
      <path d="M9 5.5a3 3 0 0 1 6 0" />
      <path d="M9 11h6" />
      <path d="M9 15h4" />
    </IconBase>
  );
}

export function WalletIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4.5 7.5A2.5 2.5 0 0 1 7 5h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7A2.5 2.5 0 0 1 4.5 16.5z" />
      <path d="M4.5 8.5h13.5" />
      <circle cx="15.5" cy="13.5" r="1" />
    </IconBase>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4.5l3 1.5" />
    </IconBase>
  );
}

export function CheckCircleIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="8" />
      <path d="m8.5 12.5 2.2 2.2 4.8-5.2" />
    </IconBase>
  );
}

export function AlertTriangleIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 4 4.2 18a1.3 1.3 0 0 0 1.1 2h13.4a1.3 1.3 0 0 0 1.1-2z" />
      <path d="M12 9v4" />
      <circle cx="12" cy="16.3" r=".7" fill="currentColor" stroke="none" />
    </IconBase>
  );
}

export function TruckIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M3.5 7.5h10v8h-10z" />
      <path d="M13.5 10.5h3.5l2 2.5v2.5h-5.5z" />
      <circle cx="7" cy="18" r="1.5" />
      <circle cx="17" cy="18" r="1.5" />
    </IconBase>
  );
}

export function LocationIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 20s6-4.7 6-10a6 6 0 1 0-12 0c0 5.3 6 10 6 10Z" />
      <circle cx="12" cy="10" r="2.2" />
    </IconBase>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M7.6 5.5c.4-1 1.6-1.5 2.6-1.1l1.5.6c.9.3 1.4 1.2 1.3 2.1l-.2 1.8a2 2 0 0 0 .6 1.7l.9.9a2 2 0 0 0 1.7.6l1.8-.2c.9-.1 1.8.4 2.1 1.3l.6 1.5c.4 1-.1 2.2-1.1 2.6l-1.2.5a5 5 0 0 1-5.3-1.1l-5.1-5.1a5 5 0 0 1-1.1-5.3z" />
    </IconBase>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m12 3 7 3.2v5.5c0 4.2-2.8 7-7 9.3-4.2-2.3-7-5.1-7-9.3V6.2z" />
      <path d="m9.5 12.2 1.7 1.7 3.6-4" />
    </IconBase>
  );
}

export function NoteIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M6 4.5h9l3 3v12H6z" />
      <path d="M15 4.5v3h3" />
      <path d="M9 11h6" />
      <path d="M9 15h6" />
    </IconBase>
  );
}

export function CameraIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M5 8.5h2.4l1.2-2h6.8l1.2 2H19a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6.5a2 2 0 0 1 2-2Z" />
      <circle cx="12" cy="13" r="3.2" />
    </IconBase>
  );
}

export function ImageIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <circle cx="9" cy="10" r="1.5" />
      <path d="m7 16 3.5-3.5 2.5 2.5 2.5-2.5L19 16" />
    </IconBase>
  );
}

export function RefreshIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M20 11a8 8 0 0 0-14-4" />
      <path d="M4 4v4h4" />
      <path d="M4 13a8 8 0 0 0 14 4" />
      <path d="M20 20v-4h-4" />
    </IconBase>
  );
}

export function StarIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m12 4 2.3 4.6 5.1.7-3.7 3.6.9 5.1-4.6-2.4-4.6 2.4.9-5.1-3.7-3.6 5.1-.7z" />
    </IconBase>
  );
}

export function SparklesIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m12 3 1.2 3.4L16.5 7l-3.3 1.1L12 11.5l-1.2-3.4L7.5 7l3.3-.6z" />
      <path d="m18.2 13.5.8 2.1 2.1.8-2.1.8-.8 2.1-.8-2.1-2.1-.8 2.1-.8z" />
      <path d="m6.2 14.5 1 2.7 2.7 1-2.7 1-1 2.7-1-2.7-2.7-1 2.7-1z" />
    </IconBase>
  );
}

export function CategoryIcon({
  slug,
  size = 18,
  ...props
}: IconProps & { slug?: string | null }) {
  const key = (slug ?? "").toLowerCase();

  if (key.includes("electronic")) {
    return (
      <IconBase size={size} {...props}>
        <rect x="5" y="6" width="14" height="10" rx="2" />
        <path d="M9 19h6" />
      </IconBase>
    );
  }

  if (key.includes("cloth") || key.includes("fashion")) {
    return (
      <IconBase size={size} {...props}>
        <path d="m8 6 4-2 4 2 2 4-2 1.5V19H8v-7.5L6 10z" />
      </IconBase>
    );
  }

  if (key.includes("food") || key.includes("grocery")) {
    return (
      <IconBase size={size} {...props}>
        <path d="M8 5v14" />
        <path d="M11 5v6a2 2 0 0 1-2 2H8" />
        <path d="M15 5v14" />
        <path d="M15 9h3" />
      </IconBase>
    );
  }

  if (key.includes("home") || key.includes("kitchen")) {
    return (
      <IconBase size={size} {...props}>
        <path d="m4 11 8-6 8 6" />
        <path d="M6.5 10.5V19h11v-8.5" />
        <path d="M10 19v-4.5h4V19" />
      </IconBase>
    );
  }

  if (key.includes("book") || key.includes("office") || key.includes("school")) {
    return (
      <IconBase size={size} {...props}>
        <path d="M6 5.5h9a3 3 0 0 1 3 3V19H9a3 3 0 0 0-3 3z" />
        <path d="M6 5.5V19" />
      </IconBase>
    );
  }

  if (key.includes("sport")) {
    return (
      <IconBase size={size} {...props}>
        <circle cx="12" cy="12" r="7.5" />
        <path d="M12 4.5c2.4 2 3.6 4.6 3.6 7.5S14.4 17.5 12 19.5" />
        <path d="M12 4.5c-2.4 2-3.6 4.6-3.6 7.5S9.6 17.5 12 19.5" />
        <path d="M4.8 9h14.4" />
        <path d="M4.8 15h14.4" />
      </IconBase>
    );
  }

  if (key.includes("toy") || key.includes("baby") || key.includes("gift")) {
    return (
      <IconBase size={size} {...props}>
        <rect x="5" y="10" width="14" height="9" rx="2" />
        <path d="M12 10v9" />
        <path d="M5 13.5h14" />
        <path d="M9.5 10c-1.7 0-2.8-1.2-2.8-2.7 0-1.1.8-1.8 1.8-1.8 1.7 0 3.5 2.6 3.5 4.5Z" />
        <path d="M14.5 10c1.7 0 2.8-1.2 2.8-2.7 0-1.1-.8-1.8-1.8-1.8-1.7 0-3.5 2.6-3.5 4.5Z" />
      </IconBase>
    );
  }

  if (key.includes("beauty")) {
    return (
      <IconBase size={size} {...props}>
        <path d="M10 5h4" />
        <path d="M9 8h6v11H9z" />
        <path d="M8 19h8" />
      </IconBase>
    );
  }

  if (key.includes("automotive")) {
    return (
      <IconBase size={size} {...props}>
        <path d="M6 15.5h12l-1.4-5a2 2 0 0 0-1.9-1.5H9.3a2 2 0 0 0-1.9 1.5z" />
        <circle cx="8" cy="16.5" r="1.5" />
        <circle cx="16" cy="16.5" r="1.5" />
      </IconBase>
    );
  }

  if (key.includes("health")) {
    return (
      <IconBase size={size} {...props}>
        <path d="M9 4.5v15" />
        <path d="M15 4.5v15" />
        <path d="M4.5 9h15" />
        <path d="M4.5 15h15" />
      </IconBase>
    );
  }

  if (key.includes("garden") || key.includes("pet")) {
    return (
      <IconBase size={size} {...props}>
        <path d="M12 19c4 0 5-3.1 5-5.6 0-4.4-3.4-7.2-7.8-8.9C7.6 8.9 7 11.2 7 13.4 7 16 8.7 19 12 19Z" />
        <path d="M12 19v-8" />
      </IconBase>
    );
  }

  return <PackageIcon size={size} {...props} />;
}
