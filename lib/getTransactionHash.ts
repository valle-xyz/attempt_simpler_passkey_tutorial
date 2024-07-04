import { Safe4337Pack } from "@safe-global/relay-kit";

export default async function getTransactionHash(
  safe4337Pack: Safe4337Pack,
  userOperationHash: string
): Promise<string> {
  let userOperationReceipt = null;
  while (!userOperationReceipt) {
    await new Promise((resolve) => setTimeout(resolve, 1_500));
    userOperationReceipt = await safe4337Pack.getUserOperationReceipt(
      userOperationHash
    );
  }

  const receipt = await safe4337Pack.getUserOperationByHash(userOperationHash);

  return receipt.transactionHash;
}
