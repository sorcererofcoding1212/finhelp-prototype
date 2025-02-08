"use client";

import { changeSettled, deleteRecord } from "@/actions/accounts";
import { $Enums } from "@prisma/client";
import clsx from "clsx";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";
import SectionLoader from "@/components/SectionLoader";
import { useRouter } from "next/navigation";

interface RecordContainerProps {
  record: {
    id: string;
    createdAt: Date;
    type: $Enums.Type;
    amount: number;
    recordHolder: string | null;
    settled: boolean | null;
  };
}

const RecordContainer: React.FC<RecordContainerProps> = ({ record }) => {
  const router = useRouter();
  const [settled, setSettled] = useState<boolean>(record.settled!);
  const [isSettleChanging, setIsSettleChanging] = useState<boolean>(false);
  const [isRecordDelete, setIsRecordDelete] = useState<boolean>(false);
  const formatDate = (dateInput: string | Date) => {
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);

    if (isNaN(date.getTime())) {
      throw new Error("Invalid date");
    }

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };
  const formatTime = (dateInput: string | Date) => {
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);

    if (isNaN(date.getTime())) {
      throw new Error("Invalid date");
    }

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${hours}:${minutes}`;
  };

  const [isRefreshTextVisible, setIsRefreshTextVisible] =
    useState<boolean>(false);

  const handleSettled = async () => {
    try {
      setIsSettleChanging(true);
      const response = await changeSettled(!settled, record.id);
      if (!response.success) {
        return {
          success: false,
        };
      }
      setIsRefreshTextVisible(true);
      return {
        success: true,
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
      };
    } finally {
      setIsSettleChanging(false);
    }
  };

  const handleRecordDelete = async () => {
    setIsRecordDelete(true);
    try {
      const response = await deleteRecord(record.id);
      if (!response.success) {
        return toast.error("Some error occured");
      }
      toast.success("Record deleted");
      if (response.accountDelete) {
        return router.push("/");
      }
    } catch (error) {
      console.log(error, "DELETE_RECORD_ERROR_CLIENT");
    } finally {
      setIsRecordDelete(false);
    }
  };

  return (
    <div
      className={clsx(
        "w-[90vw] lg:w-[50%] shadow-md border border-slate-200 py-4 rounded-md",
        settled ? "bg-slate-50" : "bg-slate-100"
      )}
    >
      <div className="flex w-full px-4 lg:px-6 py-3 justify-between">
        <div className="text-sm font-medium text-slate-400">
          {formatDate(record.createdAt)}
        </div>
        <div className="text-sm font-medium text-slate-400">
          {`Created at : ${formatTime(record.createdAt)}`}
        </div>
      </div>
      <div
        className={clsx(
          "mt-2 lg:mt-4 px-4 text-base lg:text-lg font-medium lg:px-6 w-full h-10",
          record.type === "DEBIT" ? "text-red-500" : "text-green-500"
        )}
      >
        {`${record.recordHolder} ${
          record.type === "DEBIT" ? "paid" : "recieved"
        } : ₹${record.amount}`}
      </div>
      <div className="mt-4 w-full px-4 lg:px-6">
        <label className="inline-flex items-center cursor-pointer">
          <input
            onChange={async () => {
              const response = await handleSettled();
              if (!response.success) {
                return toast.error("Some error occured");
              }
              setSettled((prevSettled) => !prevSettled);
            }}
            checked={settled}
            disabled={isSettleChanging}
            type="checkbox"
            value=""
            className="sr-only peer"
          />
          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
          <span className="ms-3 text-sm font-medium text-slate-600">
            {isSettleChanging ? (
              settled ? (
                "Unmarking..."
              ) : (
                "Marking..."
              )
            ) : (
              <>
                {`${settled ? "Marked" : "Mark"} as ${
                  record.type === "DEBIT" ? "paid" : "recieved"
                }`}
              </>
            )}
          </span>
        </label>
      </div>
      <div className="mt-4 text-slate-600 font-medium text-sm px-6">
        {isRefreshTextVisible &&
          "Please refresh the page to see the latest balance"}
      </div>
      <div className="px-4 lg:px-6 flex justify-end">
        {isRecordDelete ? (
          <SectionLoader />
        ) : (
          <button disabled={isRecordDelete}>
            <MdDelete
              onClick={handleRecordDelete}
              title="Delete record"
              size={24}
              role="button"
              className="text-red-600 lg:hover:text-red-500 transition-all"
            />
          </button>
        )}
      </div>
    </div>
  );
};

export default RecordContainer;
