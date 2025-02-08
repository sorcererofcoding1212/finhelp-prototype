import React from "react";
import RecordCreate from "../../create/components/RecordCreate";
import PageHeading from "@/components/PageHeading";
import { getAccountById } from "@/actions/accounts";

const AccountIdCreate = async ({
  params,
}: {
  params: { accountId: string };
}) => {
  const response = await getAccountById(params.accountId);
  if (!response.success) {
    return (
      <div className="pt-20 flex justify-center font-semibold">
        Account not found
      </div>
    );
  }
  return (
    <div className="h-screen pt-20">
      <PageHeading heading="Create a record" />
      <div className="flex justify-center mt-10 lg:mt-8">
        <div className="lg:w-[50vw] py-4 w-[90vw] bg-white rounded-md shadow-md border-gray-100 border">
          <RecordCreate
            accountId={params.accountId}
            accountCounterEntityName={response.account?.counterEntityName}
          />
        </div>
      </div>
    </div>
  );
};

export default AccountIdCreate;
