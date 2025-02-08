"use client";

import React, { useEffect, useState } from "react";
import AccountList from "./AccountList";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { fetchSearchResults } from "@/actions/accounts";
import PageLoader from "@/components/PageLoader";

interface AccountComponentProps {
  accounts: {
    id: string;
    counterEntityName: string;
  }[];
}

interface AccountProps {
  counterEntityName: string;
  id: string;
}

const AccountComponent: React.FC<AccountComponentProps> = ({ accounts }) => {
  const session = useSession();
  const [searchItem, setSearchItem] = useState<string>("");
  const [searchAccounts, setSearchAccounts] = useState<AccountProps[] | []>([]);
  const [isFetchingResults, setIsFetchingResults] = useState<boolean>(false);
  const [fetchAccountsError, setFetchAccountsError] = useState<boolean>(false);
  const DEBOUNCE_DELAY = 200;
  const fetchSearchAccounts = async () => {
    if (searchItem.length < 1) {
      return;
    }
    setIsFetchingResults(true);
    if (
      !session ||
      !session.data ||
      !session.data.user ||
      !session.data.user.email
    ) {
      return;
    }
    try {
      const response = await fetchSearchResults(
        searchItem,
        session.data.user.email
      );
      if (response.msg === "No accounts found" || !response.success) {
        setFetchAccountsError(true);
      }
      setSearchAccounts(response.results!);
    } catch (error) {
      console.log(error, "FETCH_SEARCH_ERROR");
      return toast.error("Some error occured");
    } finally {
      setIsFetchingResults(false);
    }
  };
  useEffect(() => {
    setFetchAccountsError(false);
    const handler = setTimeout(() => {
      fetchSearchAccounts();
    }, DEBOUNCE_DELAY);
    return () => clearTimeout(handler);
  }, [searchItem]);
  return (
    <>
      <div className="mb-4 text-center">
        <input
          type="text"
          onChange={(e) => setSearchItem(e.target.value)}
          value={searchItem}
          className="bg-white border-2 py-3 border-slate-400 text-slate-600 px-4 lg:px-6 outline-none focus:ring-2 focus:ring-inset focus:ring-sky-400 lg:py-2 rounded-md placeholder:font-medium placeholder:text-slate-500 focus:border-slate-300"
          placeholder="Search account"
        />
      </div>
      <div className="flex-1 overflow-y-auto w-full flex flex-col gap-y-4 px-4 py-4 min-h-0 scroll-container">
        {searchItem.length > 0 ? (
          <>
            {isFetchingResults ? (
              <div className="flex w-full justify-center mt-16 lg:mt-10">
                <PageLoader />
              </div>
            ) : (
              <>
                {fetchAccountsError ? (
                  <div className="text-center mt-16 lg:mt-10 text-slate-500 font-medium text-xl lg:text-2xl">
                    Error in fetching results
                  </div>
                ) : (
                  <>
                    {searchAccounts?.map((account, index) => (
                      <AccountList key={index} account={account} />
                    ))}
                  </>
                )}
              </>
            )}
          </>
        ) : (
          <>
            {accounts && accounts.length < 1 ? (
              <div className="text-center text-slate-500 font-semibold">
                No records available
              </div>
            ) : (
              <>
                {accounts?.map((account, index) => (
                  <AccountList key={index} account={account} />
                ))}
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default AccountComponent;
