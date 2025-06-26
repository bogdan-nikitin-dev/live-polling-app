require("module-alias/register");
import { WebSocketServer } from "ws";

import path from "path";

import app from "./app";
import { initPollVoteManager } from "./managers/PollVoteManager";
import { sqliteKnex } from "./config/sqliteKnex";

const PORT = 5000;

async function bootstrap() {
    if (!__filename.endsWith(".ts")) {
        require("ts-node").register();
    }

    await sqliteKnex.migrate.latest({
        directory: path.join(process.cwd(), "./migrations"),
        loadExtensions: [".ts"],
    });

    const server = app.listen(PORT, () => {
        console.log(`The server started listening on port: ${PORT}`);
    });

    const websocketServer = new WebSocketServer({ server });
    initPollVoteManager(websocketServer);
}

bootstrap().catch((err) => {
    console.error(err);
    process.exit(1);
});
