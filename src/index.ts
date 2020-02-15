import TuposClient from "./lib/TuposClient";

const client = new TuposClient();
client.login(process.env.TOKEN)
    .catch(err => console.error(err));
