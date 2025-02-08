import { getAccountById } from "@/actions/accounts";
import PageHeading from "@/components/PageHeading";
import React from "react";
import RecordContainer from "./components/RecordContainer";
import AccountBalance from "@/components/AccountBalance";
import ErrorPage from "@/components/ErrorPage";

interface AccountPageProps {
  params: { accountId: string };
}

const AccountPage: React.FC<AccountPageProps> = async ({ params }) => {
  const { accountId } = await Promise.resolve(params);
  const response = await getAccountById(accountId);
  if (!response.success) {
    return (
      <div className="pt-20 flex justify-center font-semibold">
        Account not found
      </div>
    );
  }
  const account = response.account;
  if (!account) {
    return <ErrorPage />;
  }
  return (
    <div className="pt-20 h-screen">
      <PageHeading heading={account.counterEntityName} />
      <div className="flex w-full justify-center my-12">
        <AccountBalance
          accountId={params.accountId}
          initialRecords={response.account.records}
          isDeleteAccount
        />
      </div>
      <div className="w-full flex min-h-0 pb-10 scroll-container flex-1 flex-col items-center mt-14 gap-y-6">
        {account &&
          account.records.map((record) => (
            <RecordContainer key={record.id} record={record} />
          ))}
      </div>
    </div>
  );
};

export default AccountPage;
