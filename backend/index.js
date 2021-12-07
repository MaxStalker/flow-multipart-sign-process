const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = 3001;
const fcl = require("@onflow/fcl");
const { signWithKey } = require("./signer");

// setup express middlewares
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

// setup configs
fcl.config().put("accessNode.api", `https://access-testnet.onflow.org`);
require("dotenv").config();

// setup routes
app.get("/getAccount", async (req, res) => {
  const { userId } = req.query;
  const rawAccount = await fcl.send([fcl.getAccount(userId)]);
  const { keys, address } = await fcl.decode(rawAccount);

  // You will need to implement some key rotation mechanism to prevent sequenceNum collision
  // We will pick first one for simplicity
  const { index } = keys[0];

  res.json({
    addr: address,
    keyId: index,
  });
});

app.post("/sign", (req, res) => {
  const { message } = req.body;
  console.log({ message });
  const signature = signWithKey(process.env.PKEY, message);
  res.json({
    signature,
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
