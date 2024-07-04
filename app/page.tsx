"use client";

import Image from "next/image";
import createPassKey from "@/lib/createPasskey";
import loadPassKey from "@/lib/loadPasskey";
import storePassKey from "@/lib/storePasskey";
import getTransactionHash from "@/lib/getTransactionHash";
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
  const [isSafeDeployed, setIsSafeDeployed] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string>();

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
    setIsSafeDeployed(await safe4337Pack.protocolKit.isSafeDeployed());
  };

  const handleSendTransaction = async () => {
    if (!selectedPasskey) {
      console.log("No passkey selected");
      return;
    }

    console.log("Sending transaction...");
    const safe4337Pack = await Safe4337Pack.init({
      provider: RPC_URL,
      signer: selectedPasskey,
      bundlerUrl: BUNDLER_URL,
      paymasterOptions: {
        isSponsored: true,
        paymasterUrl: PAYMASTER_URL,
        paymasterAddress,
      },
      options: {
        owners: [],
        threshold: 1,
      },
    });

    // Create a dummy transaction (sending 0 eth to the zero address)
    const transactions = [
      {
        to: "0x0000000000000000000000000000000000000000",
        value: 0n,
        data: "0x",
      },
    ];

    const safeOperation = await safe4337Pack.createTransaction({
      transactions,
    });

    try {
      const signedSafeOperation = await safe4337Pack.signSafeOperation(
        safeOperation
      );

      console.log("SafeOperation", signedSafeOperation);

      const userOperationHash = await safe4337Pack.executeTransaction({
        executable: signedSafeOperation,
      });

      const jiffyscanUrl = `https://jiffyscan.xyz/userOpHash/${userOperationHash}?network=${CHAIN_NAME}`;
      console.log("jiffyscanUrl: ", jiffyscanUrl);

      const transactionHash = await getTransactionHash(
        safe4337Pack,
        userOperationHash
      );

      console.log("transactionHash: ", transactionHash);

      setIsSafeDeployed(true);
      setTransactionHash(transactionHash);
    } catch (error) {
      console.log(error);
    }
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
              <p>Safe Deployed: {isSafeDeployed ? "Yes" : "No"}</p>
            </div>

            <div className="flex flex-col items-center justify-between">
              <button
                onClick={handleSendTransaction}
                className="px-4 py-2 text-white bg-blue-500 rounded-md items-center"
              >
                Send Transaction
              </button>
              {transactionHash && (
                <a
                  href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Transaction
                </a>
              )}
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
