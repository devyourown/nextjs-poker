"use client";

import { useFormState, useFormStatus } from "react-dom";
import { State, createAccount } from "../lib/actions";
import {
  ArrowRightIcon,
  AtSymbolIcon,
  ExclamationCircleIcon,
  KeyIcon,
} from "@heroicons/react/24/outline";
import { Button } from "./button";
import { useEffect, useState } from "react";

export default function SignupForm() {
  const initialState: State = { message: null, errors: {} };
  const [state, dispatch] = useFormState(createAccount, initialState);
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (rePassword !== password) setPasswordError("Password should be same.");
    else setPasswordError("");
  }, [password, rePassword]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
  };

  const handleRePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRePassword = e.target.value;
    setRePassword(newRePassword);
  };

  return (
    <form action={dispatch} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`mb-3 text-2xl`}>Signup Form</h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="nickname"
            >
              Nickname
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="nickname"
                type="text"
                name="nickname"
                placeholder="Enter your nickname"
                required
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            {state.errors?.name && (
              <>
                <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                <div className="flex h-8 items-end space-x-1">
                  <p className="text-sm text-red-500">{state.errors.name}</p>
                </div>
              </>
            )}
          </div>
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                required
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            {state.errors?.email && (
              <>
                <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                <div className="flex h-8 items-end space-x-1">
                  <p className="text-sm text-red-500">{state.errors.email}</p>
                </div>
              </>
            )}
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                name="password"
                placeholder="Enter password"
                required
                minLength={8}
                value={password}
                onChange={handlePasswordChange}
              />

              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            {state.errors?.password && (
              <>
                <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                <div className="flex h-8 items-end space-x-1">
                  <p className="text-sm text-red-500">
                    {state.errors.password}
                  </p>
                </div>
              </>
            )}
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password-check"
            >
              Password Check
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password-check"
                type="password"
                name="password-check"
                placeholder="Enter re-password"
                required
                minLength={8}
                value={rePassword}
                onChange={handleRePasswordChange}
              />

              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            {passwordError && (
              <>
                <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                <div className="flex h-8 items-end space-x-1">
                  <p className="text-sm text-red-500">{passwordError}</p>
                </div>
              </>
            )}
          </div>
          {state.message && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <div className="flex h-8 items-end space-x-1">
                <p className="text-sm text-red-500">{state.message}</p>
              </div>
            </>
          )}
        </div>
        <SignupButton />
      </div>
    </form>
  );
}

function SignupButton() {
  const { pending } = useFormStatus();
  return (
    <Button className="mt-4 w-full" aria-disabled={pending}>
      Log in <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
    </Button>
  );
}
