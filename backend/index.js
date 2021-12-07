const express = require("express");
const cors = require("cors");
const app = express();
const port = 3001;
const fcl = require("@onflow/fcl");

fcl.config().put("accessNode.api", `https://access-testnet.onflow.org`);
app.use(cors());

app.get("/get-proposer", async (req, res) => {
  const rawBlock = await fcl.send([fcl.getBlock(true)]);
  const block = await fcl.decode(rawBlock);

  const rawAccount = await fcl.send([fcl.getAccount("0x54356d44d4d2f53b")]);
  const { keys, address } = await fcl.decode(rawAccount);
  console.log({ keys, address });

  // You will need to implement some key rotation mechanism to prevent sequenceNum collision
  // We will pick first one for simplicity
  const key = keys[0];
  console.log(key)
  res.json({
    referenceBlock: block.height,
    proposer: {
      addr: address,
      keyId: key.index,
      sequenceNum: key.sequenceNumber,
    },
  });
});

app.get("/pay-and-submit", (req, res) => {
  res.json({
    message: "Hello, World!",
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
