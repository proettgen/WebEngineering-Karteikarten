import express from 'express';

const app = express();

app.get("/", (_, res) => {
    res.send("Hello express");
});

const PORT = process.env.PORT || 3001; // Port 80 requires admin rights on Windows

app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});
