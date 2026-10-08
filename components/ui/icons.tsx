import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function IconBase({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {children}
    </svg>
  );
}

export function BagIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </IconBase>
  );
}

export function MemoryIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 3c-3.5 0-6 2.5-6 5.5 0 2 1 3.3 2 4.3.7.7 1 1.5 1 2.4V17h6v-1.8c0-.9.3-1.7 1-2.4 1-1 2-2.3 2-4.3C18 5.5 15.5 3 12 3Z" />
      <path d="M10 20h4" />
    </IconBase>
  );
}

export function SparkIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" />
    </IconBase>
  );
}

export function BoxIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m3 7 9-4 9 4-9 4-9-4Z" />
      <path d="M3 7v10l9 4 9-4V7M12 11v10" />
    </IconBase>
  );
}

export function BookIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15Z" />
      <path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5" />
    </IconBase>
  );
}

export function TrashIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3" />
    </IconBase>
  );
}

export function ArrowLeftIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </IconBase>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </IconBase>
  );
}

export function SunIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" />
    </IconBase>
  );
}

export function MoonIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
    </IconBase>
  );
}
