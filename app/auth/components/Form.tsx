"use client";

import React, { useEffect, useState } from "react";
import LabelledInput from "./LabelledInput";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { userSignup } from "@/actions/user";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import PageLoader from "@/components/PageLoader";

type Variant = "register" | "login";

const Form = () => {
  const session = useSession();
  const router = useRouter();
  useEffect(() => {
    if (session.status === "authenticated") return router.push("/");
  }, [session.status, router]);
  const [variant, setVariant] = useState<Variant>("login");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { register, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  const submitHandler: SubmitHandler<FieldValues> = async (data) => {
    try {
      setIsLoading(true);
      if (variant === "register") {
        const signup = await userSignup(data);
        if (!signup.success) {
          return toast.error(signup.msg);
        }
        toast.success("User created!");
        const signin = await signIn("credentials", {
          ...data,
          redirect: false,
        });
        if (!signin?.error && signin?.ok) {
          router.push("/");
        }
      } else {
        toast.loading("Signing you in");
        const signin = await signIn("credentials", {
          ...data,
          redirect: false,
        });
        if (!signin?.error && signin?.ok) {
          toast.success("Signed in!");
          router.push("/");
        }
      }
    } catch (error) {
      console.log(error, "SUBMIT_HANDLER_ERROR");
      toast.error("Some error occured");
    } finally {
      setIsLoading(false);
      reset();
    }
  };
  if (session.status === "loading") {
    return (
      <div className="items-center flex justify-center mt-12">
        <PageLoader />
      </div>
    );
  }
  return (
    <>
      {session.status === "unauthenticated" && (
        <div className="lg:w-[50vw] py-6 lg:py-8 flex flex-col items-center w-[90vw] bg-white rounded-md shadow-md border-gray-100 border mt-10 lg:mt-8">
          <div>
            <h3 className="text-xl lg:text-2xl font-bold text-gray-700">
              {variant === "login"
                ? "Login to your account"
                : "Create a new account"}
            </h3>
          </div>
          <form
            onSubmit={handleSubmit(submitHandler)}
            className="flex flex-col gap-6 mt-8 lg:mt-5 w-full lg:px-8 px-6"
          >
            {variant === "register" && (
              <LabelledInput
                label="Name"
                id="name"
                placeholder="Enter your name"
                disabled={isLoading}
                register={register}
              />
            )}
            <LabelledInput
              label="Email"
              type="email"
              id="email"
              placeholder="Enter your email"
              disabled={isLoading}
              register={register}
            />
            <LabelledInput
              label="Password"
              id="password"
              type="password"
              placeholder="Create a password"
              disabled={isLoading}
              register={register}
            />
            <button
              disabled={isLoading}
              className={clsx(
                "w-full mt-1 text-sm lg:text-base lg:mt-3 py-2.5 lg:py-3 text-center text-white rounded-md font-semibold bg-sky-500",
                isLoading && "bg-sky-400"
              )}
            >
              {variant === "login" ? "Signin" : "Register"}
            </button>
            <div className="text-center text-sm lg:text-base font-medium text-gray-400">
              {variant === "login" ? (
                <>
                  Don&apos;t have an account?{" "}
                  <span
                    onClick={() => setVariant("register")}
                    className="lg:hover:underline lg:hover:cursor-pointer underline lg:no-underline"
                  >
                    Register
                  </span>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <span
                    onClick={() => setVariant("login")}
                    className="lg:hover:underline lg:hover:cursor-pointer underline lg:no-underline"
                  >
                    Login
                  </span>
                </>
              )}
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Form;
