import { getAllRecords } from "@/actions/accounts";
import { getUser } from "@/actions/user";
import AccountBalance from "@/components/AccountBalance";
import PageHeading from "@/components/PageHeading";
import React from "react";

const UserBalancePage = async () => {
  const session = await getUser();
  const userId = session?.user?.email;
  const { records } = await getAllRecords(userId!);
  return (
    <div className="pt-20 h-screen">
      <div className="text-center">
        <PageHeading heading="My Balance" />
      </div>
      <div className="mt-8 w-full flex justify-center">
        {records && <AccountBalance initialRecords={records} />}
      </div>
    </div>
  );
};

export default UserBalancePage;
