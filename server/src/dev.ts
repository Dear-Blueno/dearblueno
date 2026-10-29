import app from "./index";
const port = Number(process.env.PORT ?? 5000);
app.listen(port, process.env.HOST ?? "127.0.0.1", () =>
  console.info(`Dear Blueno API listening on ${port}`)
);
