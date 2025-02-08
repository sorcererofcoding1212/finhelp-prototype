import { getUser } from "@/actions/user";
import { getAccounts } from "@/actions/accounts";
import AccountComponent from "./components/AccountComponent";
import ErrorPage from "@/components/ErrorPage";

export default async function Home() {
  const session = await getUser();
  if (!session || !session.user || !session.user.email) {
    return <ErrorPage />;
  }
  const accounts = await getAccounts(session.user.email);
  return (
    <div className="grid grid-cols-12 lg:divide-x-2">
      <div className="pt-20 flex flex-col h-screen col-span-12 lg:col-span-3">
        <h3 className="text-center pb-4 text-2xl font-semibold text-slate-500">
          Accounts
        </h3>
        {accounts ? (
          <AccountComponent accounts={accounts} />
        ) : (
          <div className="text-center mt-10 text-xl font-medium text-slate-500">
            Some error occured
          </div>
        )}
      </div>
      <div className="hidden lg:block h-screen lg:col-span-9">
        <div className="h-full w-full flex justify-center items-center">
          <h2 className="font-semibold text-slate-500 text-4xl">
            Select an account to view the transactions
          </h2>
        </div>
      </div>
    </div>
  );
}
