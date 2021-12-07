import * as fcl from "@onflow/fcl";
import * as sdk from "@onflow/sdk"
import { useEffect } from "react";

export const signMessage = async () => {
  const MSG = Buffer.from("FOO").toString("hex");
  try {
    const result = await fcl.currentUser().signUserMessage(MSG);
    console.log({ result });
  } catch (error) {
    console.log(error);
  }
};

const prepareTransaction = async () => {
  const proposer = await (
    await fetch("http://localhost:3001/get-proposer")
  ).json();
  console.log({ proposer });

  return fcl.build([
    fcl.transaction`
    transaction{
      prepare(signer: AuthAccount){
        log("Signed by: ".concat(signer.address.toString()))
      }
    },
  `,
    fcl.proposer(proposer),
    fcl.payer(proposer),
    fcl.authorizations([fcl.authz]),
  ]);
};
/*
const prepareSignableTransaction = async (tx) => {
  // const signable =  buildSignable(ix.accounts[ix.proposer], {}, ix)
}

const createVoucher = async () => {
  const tx = await prepareTransaction();
  console.log(tx);
  const voucher = await fcl.createSignableVoucher(tx);
  console.log(voucher);
};

 */

fcl.currentUser().subscribe(async (user) => {
  if (user.addr) {
    console.log(`User Address: ${user.addr}`);
    const tx = await prepareTransaction();
    console.log([tx]);

    const resolved = await sdk.resolve(tx)
    console.log({resolved})

    //const auth = await fcl.currentUser().authorization();
    // const signed = await auth.signingFunction(tx);
    // console.log({ signed });
  }
});

const signOnlyTransaction = async () => {
  // console.log({ auth })
};

const sendRequest = async () => {
  //await signOnlyTransaction();
  // await createVoucher()
  // await signMessage();
  // const response = await fetch("http://localhost:3001/pay-and-submit");
  // const result = await response.json();
  //console.log({ result });
};

function App() {
  useEffect(() => {
    fcl.authenticate();
  }, []);

  return (
    <div>
      <button onClick={sendRequest}>Submit</button>
    </div>
  );
}

export default App;
