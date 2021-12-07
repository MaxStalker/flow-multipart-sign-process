import * as fcl from "@onflow/fcl";

const API = "http://localhost:3001";

const getAccount = async (userId) => {
  const response = await fetch(`${API}/getAccount?userId=${userId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  return response.json();
};

const getSignature = async (signable) => {
  console.log({ signable });
  const response = await fetch(`${API}/sign`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(signable),
  });

  //TODO: add necessary corrections
  const signed = await response.json();
  console.log({ signed });

  return signed.signature;
};

export const serverAuthorization = (accountAddress) => async (account) => {
  const acc = await getAccount(accountAddress);
  console.log({ acc });
  const { addr, keyId } = acc;

  // authorization function need to return an account
  return {
    ...account, // bunch of defaults in here, we want to overload some of them though
    tempId: `${addr}-${keyId}`, // tempIds are more of an advanced topic, for 99% of the times where you know the address and keyId you will want it to be a unique string per that address and keyId
    addr: fcl.sansPrefix(addr), // the address of the signatory, currently it needs to be without a prefix right now
    keyId: Number(keyId), // this is the keyId for the accounts registered key that will be used to sign, make extra sure this is a number and not a string
    signingFunction: async (signable) => {
      // Singing functions are passed a signable and need to return a composite signature
      // signable.message is a hex string of what needs to be signed.
      console.log(signable);
      const signature = await getSignature(signable);

      return {
        addr: fcl.withPrefix(addr), // needs to be the same as the account.addr but this time with a prefix, eventually they will both be with a prefix
        keyId: Number(keyId), // needs to be the same as account.keyId, once again make sure its a number and not a string
        signature, // this needs to be a hex string of the signature, where signable.message is the hex value that needs to be signed
      };
    },
  };
};
