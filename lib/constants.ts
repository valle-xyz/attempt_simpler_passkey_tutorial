export const STORAGE_PASSKEY_LIST_KEY = "__PASSKEY_SAFE_DEMO_APP__";

// RPC URL
// export const RPC_URL = "https://sepolia.gateway.tenderly.co"
export const RPC_URL = "https://ethereum-sepolia-rpc.publicnode.com";
// export const RPC_URL = "https://rpc.ankr.com/eth_sepolia"; // SEPOLIA
// export const RPC_URL = 'https://rpc.gnosischain.com/' // GNOSIS

// CHAIN
export const CHAIN_NAME = "sepolia";
// export const CHAIN_NAME = 'gnosis'

// USDC CONTRACT ADDRESS IN SEPOLIA
// faucet: https://faucet.circle.com/
export const usdcTokenAddress = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238"; // SEPOLIA
// const usdcTokenAddress = '0xddafbb505ad214d7b80b1f830fccc89b60fb7a83' // GNOSIS

const PIMLICO_API_KEY = "a199e8bb-e271-4a7d-8c0b-affe6632e308";

// PAYMASTER ADDRESS
export const paymasterAddress = "0x0000000000325602a77416A16136FDafd04b299f"; // SEPOLIA

// Bundler URL
export const BUNDLER_URL = `https://api.pimlico.io/v1/${CHAIN_NAME}/rpc?apikey=${PIMLICO_API_KEY}`; // PIMLICO

// Paymaster URL
export const PAYMASTER_URL = `https://api.pimlico.io/v2/${CHAIN_NAME}/rpc?apikey=${PIMLICO_API_KEY}`; // PIMLICO

// NFT Contract address
export const XANDER_BLAZE_NFT_ADDRESS =
  "0xBb9ebb7b8Ee75CDBf64e5cE124731A89c2BC4A07";
