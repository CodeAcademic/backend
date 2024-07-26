const express = require("express");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message:'Hello Bro'})
});

app.post("/", (req, res) => {
  console.log(req.body);
  res.send("Hello posts");
});

const PORT = 8080

app.listen(PORT, () => console.log(`Listening on - http://localhost:${PORT}`))