require("dotenv").config();

import { app } from "@/app";
import discordClient from "@/discord";
import * as http from "http";

const port = 3100;

(async () => {
  const httpServer = http.createServer(app);

  httpServer.listen(port, async () => {
    console.log(`[Express] Server started at port ${port}`);

    discordClient.connect();
  });
})();