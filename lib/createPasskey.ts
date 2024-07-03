import { PasskeyArgType, extractPasskeyData } from "@safe-global/protocol-kit";

async function createPasskey(): Promise<PasskeyArgType> {
  // Generate a passkey credential using WebAuthn API
  const passkeyCredential = await navigator.credentials.create({
    publicKey: {
      pubKeyCredParams: [
        {
          // ECDSA w/ SHA-256: https://datatracker.ietf.org/doc/html/rfc8152#section-8.1
          alg: -7,
          type: "public-key",
        },
      ],
      challenge: crypto.getRandomValues(new Uint8Array(32)),
      rp: {
        name: "Safe SmartAccount",
      },
      user: {
        displayName: "Safe Demo Passkey",
        id: crypto.getRandomValues(new Uint8Array(32)),
        name: 'safe-demo-passkey',
      },
      timeout: 60_000,
      attestation: "none",
    },
  });

  if (!passkeyCredential) {
    throw Error("Passkey creation failed: No credential was returned.");
  }

  const passkey = await extractPasskeyData(passkeyCredential);

  console.log("new passkey created: ", passkey);

  return passkey;
}

export default createPasskey;
