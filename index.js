const server = require("./server");
const port = 4000

server.listen(port, () =>
  console.log(`\n=== Server is running on port ${port} ===\n`)
);