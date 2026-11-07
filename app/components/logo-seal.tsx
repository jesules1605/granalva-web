import Image from "next/image";

export function LogoSeal({ small = false, className = "" }: { small?: boolean; className?: string }) {
  return (
    <span className={`brand-logo-seal ${small ? "brand-logo-seal--small" : ""} ${className}`.trim()} aria-hidden="true">
      <Image src="/granalva-logo.jpg" alt="" width={120} height={120} unoptimized />
    </span>
  );
}
