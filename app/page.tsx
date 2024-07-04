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
  const [jiffyscanUrl, setJiffyscanUrl] = useState<string>();
  const [isTransactionPending, setIsTransactionPending] = useState(false);

  useEffect(() => {
    const passkey = loadPassKey();
    if (passkey) {
      handleSelectPasskey(passkey);
    }
  }, []);

  const handleCreatePasskey = async () => {
    const passkey = await createPassKey();
    setSelectedPasskey(passkey);
    storePassKey(passkey);
  };

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

    setIsTransactionPending(true);

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

      console.log("SafeOperation:", signedSafeOperation);

      const userOperationHash = await safe4337Pack.executeTransaction({
        executable: signedSafeOperation,
      });

      const jiffyscanUrl = `https://jiffyscan.xyz/userOpHash/${userOperationHash}?network=${CHAIN_NAME}`;
      console.log("jiffyscanUrl: ", jiffyscanUrl);
      setJiffyscanUrl(jiffyscanUrl);

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

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm ">
        <h1 className="text-4xl font-bold mb-8">
          Deploy a Safe with Passkey and 4337 module
        </h1>
        <p>
          Hey there and welcome to this demo on how tao sign a Safe transaction
          with a passkey and the 4337 module.
        </p>
        <p className="mb-4">
          We will start by creating a passkey, which will be stored in the local
          storage.
        </p>
        {selectedPasskey ? (
          <>
            <div className="flex flex-col items-center justify-between mb-8">
              <p>Great! You created a passkey.</p>
              <p>Passkey ID: {selectedPasskey.rawId}</p>
            </div>
            <div className="flex flex-col items-center justify-between mb-8">
              <p className="mb-4">
                With this passkey, we can precalculate the Safe address
                (counterfactual deployment). This is useful if you want to
                prefund your Safe before it is deployed.
              </p>
              <p>Safe Address: {safeAddress}</p>
              <p>Safe Deployed: {isSafeDeployed ? "Yes" : "No"}</p>
            </div>

            <div className="flex flex-col items-center justify-between">
              <p className="mb-8">
                Now you can sign a transaction &quot;from&quot; your Safe. The
                paymaster will pay for this transaction. As it is your first
                transaction, this transaction will automatically deploy your
                Safe.
              </p>

              {!isTransactionPending && (
                <button
                  onClick={handleSendTransaction}
                  className="px-4 py-2 text-white bg-blue-500 rounded-md items-center"
                >
                  Send Transaction
                </button>
              )}

              {jiffyscanUrl && (
                <>
                  <p className="mb-8">
                    Before the transaction settles, you can already see the user
                    operation, before a bundler includes it.
                  </p>
                  <p>
                    <a
                      href={jiffyscanUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline-current text-blue-500 mb-4"
                    >
                      {jiffyscanUrl}
                    </a>
                  </p>
                </>
              )}

              {transactionHash && isTransactionPending && (
                <p>
                  Transaction successful:{" "}
                  <a
                    href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline-current text-blue-500 mb-4"
                  >
                    {transactionHash}
                  </a>
                </p>
              )}

              {isTransactionPending && !transactionHash && (
                <p>Transaction pending...</p>
              )}
            </div>
          </>
        ) : (
          <button
            onClick={handleCreatePasskey}
            className="px-4 py-2 text-white bg-blue-500 rounded-md items-center"
          >
            Create a Passkey
          </button>
        )}
      </div>
    </main>
  );
}
