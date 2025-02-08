"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface InfoModalRouteProps {
  label: string;
  active?: boolean;
  href: string;
  onClose: () => void;
}

const InfoModalRoute: React.FC<InfoModalRouteProps> = ({
  label,
  active,
  href,
  onClose,
}) => {
  const pathName = usePathname();
  const isPathMatchHref = pathName === href;
  return (
    <Link
      onClick={onClose}
      href={isPathMatchHref ? "#" : href}
      className={clsx(
        "text-base font-medium py-4 lg:py-4 hover:bg-zinc-200 hover:cursor-pointer w-full text-center",
        active && "bg-zinc-200"
      )}
    >
      {label}
    </Link>
  );
};

export default InfoModalRoute;
