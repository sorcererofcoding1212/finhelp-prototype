"use client";

import { $Enums } from "@prisma/client";
import clsx from "clsx";
import React, { useState } from "react";
import { MdErrorOutline } from "react-icons/md";
import RecordCreateNav from "./RecordCreateNav";
import { deleteAccount } from "@/actions/accounts";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface AccountBalanceProps {
  initialRecords: {
    id?: string;
    createdAt?: Date;
    type: $Enums.Type;
    amount: number;
    recordHolder?: string | null;
    settled: boolean | null;
  }[];
  accountId?: string;
  isDeleteAccount?: boolean;
}

const AccountBalance: React.FC<AccountBalanceProps> = ({
  initialRecords,
  accountId,
  isDeleteAccount,
}) => {
  const router = useRouter();

  const [isAccountDelete, setIsAccountDelete] = useState<boolean>(false);

  const unmarkedRecords = initialRecords.filter(
    (record) => record.settled === false
  );

  const totalIncome = initialRecords
    .filter((record) => record.settled)
    .filter((record) => record.type === "CREDIT")
    .map((record) => record.amount)
    .reduce((acc, value) => acc + value, 0);

  const totalExpenses = initialRecords
    .filter((record) => record.settled)
    .filter((record) => record.type === "DEBIT")
    .map((record) => record.amount)
    .reduce((acc, value) => acc + value, 0);

  const isAccountInDeficit = totalExpenses > totalIncome;
  const accountBalance = totalIncome - totalExpenses;

  const handleAccountDelete = async () => {
    if (!accountId) {
      return;
    }
    setIsAccountDelete(true);
    try {
      const response = await deleteAccount(accountId);
      if (!response.success) {
        return toast.error(response.msg);
      }
      toast.success("Account deleted");
      router.push("/");
    } catch (error) {
      console.log(error, "ACCOUNT_DELETE_ERROR_CLIENT");
    } finally {
      setIsAccountDelete(false);
    }
  };
  return (
    <div className="w-[80%] lg:w-[40%] bg-white shadow-md rounded-md flex flex-col justify-center px-4 lg:px-8 py-6 border-slate-200 border">
      <div className="flex justify-center gap-x-3 font-medium text-lg">
        <div className="text-slate-500">Account Balance :</div>
        <div
          className={clsx(
            isAccountInDeficit ? "text-red-500" : "text-green-500"
          )}
        >
          {accountBalance}
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <div className="flex flex-col items-center gap-y-1 lg:flex-row lg:gap-x-2">
          <div className="text-red-500 font-medium">
            Total Expenses <span className="invisible lg:visible">:</span>
          </div>
          <div className="text-red-500 font-medium">{totalExpenses}</div>
        </div>
        <div className="flex flex-col items-center gap-y-1 lg:flex-row lg:gap-x-2">
          <div className="text-green-500 font-medium">
            Total Income <span className="invisible lg:visible">:</span>
          </div>
          <div className="text-green-500 font-medium">{totalIncome}</div>
        </div>
      </div>
      {unmarkedRecords.length > 0 && (
        <div className="mt-8 lg:mt-6 flex w-full justify-center gap-x-3">
          <MdErrorOutline className="text-lg" />
          <div className="text-sm text-slate-500 font-medium">
            {` You have ${unmarkedRecords.length} unmarked
            ${unmarkedRecords.length > 1 ? "records" : "record"}`}
          </div>
        </div>
      )}
      {accountId && <RecordCreateNav accountId={accountId} />}
      {isDeleteAccount && (
        <div className="mt-6 flex w-full justify-center lg:justify-end">
          <button
            onClick={handleAccountDelete}
            title="Delete account"
            disabled={isAccountDelete}
            className="text-sm px-4 py-3 rounded-md bg-red-600 lg:hover:bg-red-500 text-white font-medium"
          >
            Delete account
          </button>
        </div>
      )}
    </div>
  );
};

export default AccountBalance;
