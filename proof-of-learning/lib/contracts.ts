export const SOULBOUND_NFT_CONTRACT = {
  address: "0x...", // Deploy on World Chain testnet
  abi: [
    {
      inputs: [
        { name: "to", type: "address" },
        { name: "courseName", type: "string" },
        { name: "completionDate", type: "uint256" },
      ],
      name: "mintCredential",
      outputs: [{ name: "tokenId", type: "uint256" }],
      type: "function",
    },
    {
      inputs: [{ name: "tokenId", type: "uint256" }],
      name: "getCredential",
      outputs: [
        { name: "courseName", type: "string" },
        { name: "completionDate", type: "uint256" },
        { name: "verified", type: "bool" },
      ],
      type: "function",
    },
  ],
}

export const WORLD_CHAIN_CONFIG = {
  chainId: "0x...", // World Chain testnet
  chainName: "World Chain Testnet",
  rpcUrls: ["https://worldchain-testnet.rpc.url"],
  blockExplorerUrls: ["https://worldchain-testnet.explorer.url"],
}
