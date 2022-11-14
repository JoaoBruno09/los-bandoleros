import express from "express";

const app = express();

// GET
app.get("/hello", function (req, res) {
  res.contentType("application/json");
  res.send(JSON.stringify({ text: "HELLO WORLD" }));
});

const port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log("Servidor a correr na porta", port);
});
