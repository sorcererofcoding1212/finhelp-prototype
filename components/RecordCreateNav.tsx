"use client";

import Link from "next/link";
import React from "react";

const RecordCreateNav = ({ accountId }: { accountId: string }) => {
  return (
    <Link
      className="flex justify-center text-sm mt-6 font-medium lg:hover:underline text-slate-500"
      href={`/accounts/${accountId}/create`}
    >
      Create a new record
    </Link>
  );
};

export default RecordCreateNav;
