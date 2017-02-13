module.exports = {
    "play": {
        mode: "lite",
        usage: {"command": "play", "description": "Disabled"},
        execute: (message, client, response) => {
            response.error(`TypicalBot no longer supports music for the time being due to a memory leak. You can get another bot created by the same person called HyperCast at <https://typicalbot.com/hypercast/> that'll give you access to 24/7 and queue-less music. You can compare it to a car radio, if you would like to. Support will be provided in <https://typicalbot.com/partners/hypercast/>.`);
        }
    }
};
