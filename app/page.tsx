"use client";

import Image from "next/image";
import createPassKey from "@/lib/createPasskey";
import loadPassKey from "@/lib/loadPasskey";
import storePassKey from "@/lib/storePasskey";
import { PasskeyArgType } from "@safe-global/protocol-kit";
import { useEffect, useState } from "react";

export default function Home() {
  const [selectedPasskey, setSelectedPasskey] = useState<PasskeyArgType>();

  useEffect(() => {
    const passkey = loadPassKey();
    if (passkey) {
      setSelectedPasskey(passkey);
    }
  }, []);

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
          <div className="flex flex-col items-center justify-between">
            <p>Passkey: {selectedPasskey.rawId}</p>
          </div>
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
