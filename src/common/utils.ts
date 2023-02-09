// https://github.com/libevm/eth_call_abuser/blob/main/src/FreeENS.sol
// Allows batch retrival of ENS names without deploying any contracts
// Usage example https://github.com/libevm/eth_call_abuser/blob/main/scripts-ts/ens.ts
import { ethers } from "ethers";
import FreeENS from "./FreeENS.json";

export const prettyAddress = (a: string) => {
  // 42 is the length of an address
  if (a.startsWith("0x") && a.length === 42)
    return a.slice(0, 5) + "..." + a.slice(-3);

  return a;
};

// Gets all ENS names
export const getENSNames = async (addresses: string[]) => {
  const uniqueAddress: string[] = [
    ...new Set(addresses.map((x) => ethers.utils.getAddress(x))),
  ];
  const provider = new ethers.providers.InfuraProvider();
  const wallet = ethers.Wallet.createRandom().connect(provider);
  const FreeENSFactory = new ethers.ContractFactory(
    FreeENS.abi,
    FreeENS.bytecode,
    wallet
  );

  const { data } = FreeENSFactory.getDeployTransaction(uniqueAddress);
  const retDataE = await provider.call({ data });
  const ensDomains: string[] = ethers.utils.defaultAbiCoder.decode(
    ["string[]"],
    retDataE
  )[0];

  const kv: { [key: string]: string } = ensDomains.reduce((acc, x, idx) => {
    if (x === "") return acc;

    // @ts-ignore:next-line
    acc[uniqueAddress[idx]] = x;

    return acc;
  }, {});

  return kv;
};
