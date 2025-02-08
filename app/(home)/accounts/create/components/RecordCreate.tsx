"use client";

import React, { useCallback, useEffect, useState } from "react";
import RecordInput from "./RecordInput";
import { useSession } from "next-auth/react";
import clsx from "clsx";
import { toast } from "react-toastify";
import { CreateAccountProps, CreateRecordProps } from "@/types";
import { createAccount, createRecord } from "@/actions/accounts";

interface RecordCreateProps {
  accounts?: {
    counterEntityName: string;
    id: string;
  }[];
  accountId?: string;
  accountCounterEntityName?: string;
}

type Variant = "RECORD" | "ACCOUNT";

type Amount = "CREDIT" | "DEBIT";

const RecordCreate: React.FC<RecordCreateProps> = ({
  accounts,
  accountId,
  accountCounterEntityName,
}) => {
  const session = useSession();
  const [amountType, setAmountType] = useState<Amount>("CREDIT");
  const [userEmail, setUserEmail] = useState<string>("");
  const [recordHolder, setRecordHolder] = useState<string>("");
  const [variant, setVariant] = useState<Variant>("RECORD");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [settled, setSettled] = useState<boolean>(true);
  const [counterEntityName, setCounterEntityName] = useState<string>("");
  const [counterEntityId, setCounterEntityId] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  useEffect(() => {
    if (accounts && accounts.length < 1) {
      setVariant("ACCOUNT");
    }
    if (
      !session ||
      !session.data ||
      !session.data.user ||
      !session.data.user.email ||
      !session.data.user.name
    ) {
      return;
    }
    setUserEmail(session.data.user.email);
    setRecordHolder(session.data.user.name);
  }, [accounts, session]);
  const toggleSettled = useCallback(() => {
    setSettled((settle) => !settle);
  }, [setSettled]);
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (variant === "ACCOUNT") {
        const data: CreateAccountProps = {
          holderId: userEmail,
          type: amountType,
          counterEntityName: counterEntityName,
          amount: amount,
          recordHolder: recordHolder,
          settled: settled,
        };
        const res = await createAccount(data);
        if (!res.success) {
          return toast.error(res.msg);
        }
        toast.success(res.msg);
      } else {
        const data: CreateRecordProps = {
          counterEntityId: counterEntityId,
          type: amountType,
          amount: amount,
          recordHolder: recordHolder,
          settled: settled,
        };
        const res = await createRecord(data);
        if (!res.success) {
          return toast.error(res.msg);
        }
        toast.success(res.msg);
      }
    } catch (error) {
      console.log(error, "ACCOUNT_CREATE_ERROR");
      toast.error("Some error occured");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="py-4 w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="w-full flex flex-col gap-y-4 items-center"
      >
        {!accountId && variant === "ACCOUNT" && (
          <RecordInput
            label="Account Name"
            type="text"
            placeholder="Enter account name"
            required={true}
            disabled={isLoading}
            onChange={(e) => setCounterEntityName(e.target.value)}
          />
        )}
        {variant === "RECORD" && (
          <div className="flex flex-col gap-y-3 items-center">
            <div className="flex gap-x-3">
              <label
                htmlFor="select_account"
                className="text-sm lg:text-base font-medium text-slate-500 cursor-pointer"
              >
                Select an account
              </label>
              <select
                required={true}
                onChange={(e) => {
                  setCounterEntityId(e.target.value);
                }}
                id="select_account"
                value={counterEntityId}
                className="text-sm font-medium text-slate-500 cursor-pointer bg-white"
              >
                <option value="" disabled={true} className="text-xs lg:text-sm">
                  Select an option
                </option>
                {accountId ? (
                  <option
                    className="text-xs lg:text-sm hover:bg-slate-200"
                    value={accountId}
                  >
                    {accountCounterEntityName}
                  </option>
                ) : (
                  <>
                    {accounts &&
                      accounts.map((account) => (
                        <option
                          key={account.id}
                          value={account.id}
                          className="text-xs lg:text-sm hover:bg-slate-200"
                        >
                          {account.counterEntityName}
                        </option>
                      ))}
                  </>
                )}
              </select>
            </div>
            {!accountId && (
              <div
                onClick={() => setVariant("ACCOUNT")}
                role="button"
                className="text-slate-400 text-sm font-medium lg:hover:underline mb-2"
              >
                Create a new account
              </div>
            )}
          </div>
        )}
        <RecordInput
          label="Record Holder"
          id="record_holder"
          placeholder="Record holder"
          required={false}
          disabled={isLoading}
          onChange={(e) => setRecordHolder(e.target.value)}
          defaultValue={recordHolder}
        />
        <RecordInput
          label="Amount"
          id="amount"
          type="number"
          placeholder="Enter amount"
          required={true}
          onChange={(e) => setAmount(e.target.valueAsNumber)}
          disabled={isLoading}
        />
        <div className="flex gap-x-8 items-center">
          <div className="flex gap-x-3 items-center">
            <label
              htmlFor="type"
              className="text-sm text-slate-400 font-medium"
            >
              Recieved
            </label>
            <input
              className="size-3 hover:cursor-pointer"
              type="radio"
              name="type"
              disabled={isLoading}
              value="CREDIT"
              defaultChecked={true}
              onChange={() => {
                setAmountType("CREDIT");
              }}
            />
          </div>
          <div className="flex items-center gap-x-3">
            <label
              htmlFor="type"
              className="text-sm text-slate-400 font-medium"
            >
              Paid
            </label>
            <input
              className="size-3 hover:cursor-pointer"
              type="radio"
              name="type"
              value="DEBIT"
              disabled={isLoading}
              onChange={() => {
                setAmountType("DEBIT");
              }}
            />
          </div>
        </div>
        <div className="text-center mt-2 flex items-center gap-x-3">
          <label
            htmlFor="setlled"
            className="text-sm text-slate-400 font-medium"
          >
            {amountType === "DEBIT" ? "Mark as paid" : "Mark as recieved"}
          </label>
          <input
            className="size-3 hover:cursor-pointer"
            type="checkbox"
            name="settled"
            checked={settled}
            onChange={() => {
              toggleSettled();
            }}
          />
        </div>
        <div className="w-full px-6 mt-3 text-center">
          <button
            className={clsx(
              "w-full lg:w-[30vw] py-3 text-sm lg:py-4 lg:hover:bg-sky-600 text-white font-medium rounded-md bg-sky-500",
              isLoading && "bg-zinc-300 text-zinc-100"
            )}
            disabled={isLoading}
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
};

export default RecordCreate;
