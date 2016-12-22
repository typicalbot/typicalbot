module.exports = {
    "triggers": {
        mode: "strict",
        permission: 6,
        usage: {"command": "trigger", "description": "In Progress"},
        execute: (message, client, response) => {
            let match = message.content.match(/triggers\s+(add|remove|edit|view|list)(?:\s+(.+))?/i);
            if (!match) return response.error("Invalid command usage.");
            let action = match[1];
            if (action === "add") {
                let values = match[2];
                if (!values) return response.error("Invalid command usage.");
                let tr = values.match(/(.+(?!\|))\s*\|\s*(?:{(.+)}\s*)?((?:.|[\r\n])+)/i);
                if (!tr) return response.error("Invalid command usage.");
                let trigger = tr[1];
                let options = tr[2] || [];
                let resp = tr[3];
                client.settings.connection.query(`INSERT INTO triggers SET ?`, {
                    guildid: message.guild.id,
                    trigger,
                    exact: options.includes("exact") ? "Y" : "N",
                    dm: options.includes("dm") ? "Y" : "N",
                    response: resp,
                });
            }
        }
    }
};
