import express from "express";

const app = express();

app.get("/", (_, res) => { 
  res.send("Hello express");
});

app.listen(80);
console.log("Server started at http://localhost:80");
