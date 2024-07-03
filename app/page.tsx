"use client";

import Image from "next/image";
import createPassKey from "@/lib/createPasskey";
import loadPassKey from "@/lib/loadPasskey";
import storePassKey from "@/lib/storePasskey";
import { PasskeyArgType } from "@safe-global/protocol-kit";
import { useEffect, useState } from "react";
import { Safe4337Pack } from "@safe-global/relay-kit";
import {
  RPC_URL,
  BUNDLER_URL,
  CHAIN_NAME,
  PAYMASTER_URL,
  paymasterAddress,
} from "../lib/constants";

export default function Home() {
  const [selectedPasskey, setSelectedPasskey] = useState<PasskeyArgType>();
  const [safeAddress, setSafeAddress] = useState<string>();

  useEffect(() => {
    const passkey = loadPassKey();
    if (passkey) {
      handleSelectPasskey(passkey);
    }
  }, []);

  const handleSelectPasskey = async (passkey: PasskeyArgType) => {
    setSelectedPasskey(passkey);

    const safe4337Pack = await Safe4337Pack.init({
      provider: RPC_URL,
      signer: passkey,
      bundlerUrl: BUNDLER_URL,
      options: {
        owners: [],
        threshold: 1,
      },
    });

    setSafeAddress(await safe4337Pack.protocolKit.getAddress());
  };

  const handleCreatePasskey = async () => {
    const passkey = await createPassKey();
    setSelectedPasskey(passkey);
    storePassKey(passkey);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm ">
        <p>Hello</p>
        {selectedPasskey ? (
          <>
            <div className="flex flex-col items-center justify-between">
              <p>Passkey: {selectedPasskey.rawId}</p>
            </div>
            <div className="flex flex-col items-center justify-between">
              <p>Safe Address: {safeAddress}</p>
            </div>
          </>
        ) : (
          <button
            onClick={handleCreatePasskey}
            className="px-4 py-2 text-white bg-blue-500 rounded-md items-center"
          >
            Create Passkey
          </button>
        )}
      </div>
    </main>
  );
}
