module.exports = {
    "play": {
        mode: "lite",
        usage: {"command": "play", "description": "Disabled"},
        execute: (message, client, response) => {
            response.error(`TypicalBot's music features are expected to be back soon! Stay tuned! They recently went up for testing and provided good results. A small memory leak was detected, but is being worked on.`);
        }
    }
};
