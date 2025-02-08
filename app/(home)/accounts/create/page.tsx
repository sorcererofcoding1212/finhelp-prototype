import { getAccounts } from "@/actions/accounts";
import PageHeading from "@/components/PageHeading";
import React from "react";
import RecordCreate from "./components/RecordCreate";
import { getUser } from "@/actions/user";
import ErrorPage from "@/components/ErrorPage";

const AccountCreate = async () => {
  const session = await getUser();
  if (!session || !session.user || !session.user.email) {
    return <ErrorPage />;
  }
  const initialAccounts = await getAccounts(session.user.email);
  return (
    <div className="h-screen pt-20">
      <PageHeading heading="Create a record" />
      <div className="flex justify-center mt-10 lg:mt-8">
        <div className="lg:w-[50vw] py-4 w-[90vw] bg-white rounded-md shadow-md border-gray-100 border">
          <RecordCreate accounts={initialAccounts!} />
        </div>
      </div>
    </div>
  );
};

export default AccountCreate;
