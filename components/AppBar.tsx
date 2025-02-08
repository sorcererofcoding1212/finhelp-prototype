"use client";

import React, { useState } from "react";
import { MdOutlineLogout } from "react-icons/md";
import { IoCreateOutline } from "react-icons/io5";
import { BsThreeDotsVertical } from "react-icons/bs";
import { signOut } from "next-auth/react";
import { BiHomeAlt2 } from "react-icons/bi";
import { usePathname } from "next/navigation";
import InfoModal from "./InfoModal";
import { IoArrowBack } from "react-icons/io5";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface AppBarParams {
  name: string;
}

const AppBar: React.FC<AppBarParams> = ({ name }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const pathName = usePathname();
  const router = useRouter();
  return (
    <nav className="px-5 w-full z-30 fixed top-0 lg:px-5 py-4 bg-slate-700 flex items-center justify-between">
      <InfoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      {pathName === "/" ? (
        <div className="text-sm font-medium text-zinc-100">{name}</div>
      ) : (
        <IoArrowBack
          onClick={() => router.back()}
          className="text-zinc-100 lg:text-2xl text-xl lg:hover:scale-95 lg:transition-all lg:hover:cursor-pointer"
        />
      )}
      <div className="flex items-center gap-x-8 lg:gap-x-10">
        <Link href={"/accounts/create"}>
          <IoCreateOutline className="text-zinc-100 lg:text-2xl text-xl lg:hover:scale-95 lg:transition-all lg:hover:cursor-pointer" />
        </Link>
        {pathName === "/" ? null : (
          <Link href={"/"}>
            <BiHomeAlt2 className="text-zinc-100 lg:text-2xl text-xl lg:hover:scale-95 lg:transition-all lg:hover:cursor-pointer" />
          </Link>
        )}
        <MdOutlineLogout
          onClick={() => signOut()}
          className="text-zinc-100 lg:text-2xl text-xl lg:hover:scale-95 lg:transition-all lg:hover:cursor-pointer"
        />
        <BsThreeDotsVertical
          onClick={() => setIsModalOpen(true)}
          className="text-zinc-100 lg:text-2xl text-xl lg:hover:scale-95 lg:transition-all lg:hover:cursor-pointer"
        />
      </div>
    </nav>
  );
};

export default AppBar;
