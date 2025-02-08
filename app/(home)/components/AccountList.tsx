"use client";

import Link from "next/link";
import React from "react";

interface AccountListProps {
  account: { counterEntityName: string; id: string };
}

const AccountList: React.FC<AccountListProps> = ({ account }) => {
  return (
    <Link
      href={`/accounts/${account.id}`}
      role="button"
      onClick={() => console.log(account.id)}
      className="py-4 px-8 border-2 rounded-md border-slate-400 lg:hover:cursor-pointer lg:hover:bg-slate-200 text-slate-500 font-medium w-full"
    >
      {account.counterEntityName}
    </Link>
  );
};

export default AccountList;
