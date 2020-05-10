# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [3.4.1]
### Fixed
 - Leave messages not being sent due to permission check error ([#223](https://github.com/sylkellc/typicalbot/pull/223))
 - `NONICKNAME` and `STARBOARD-STARS` strings not being properly translated, closes [#221](https://github.com/sylkellc/typicalbot/pull/221) ([#225](https://github.com/sylkellc/typicalbot/pull/225))
 - No indication on how to get to the second page on `$settings` command, closes [#212](https://github.com/sylkellc/typicalbot/pull/212) ([#225](https://github.com/sylkellc/typicalbot/pull/225))
 - Settings list was missing keys ([#225](https://github.com/sylkellc/typicalbot/pull/225))

## [3.4.0]
### Added
 - Version number to `$help` command ([#215](https://github.com/sylkellc/typicalbot/pull/215))
 - `discord.com/invite/your-server` to invite regex
 - Jump url in starboard messages

### Changed
 - CI to build against both Node 12 and Node 14 ([#213](https://github.com/sylkellc/typicalbot/pull/213))
 - `$reason` error response to indicate how to setup modlogs ([#206](https://github.com/sylkellc/typicalbot/pull/206))
 - `$set view` responses to be more clear than returning blank, null, undefined, and unresolved channels/roles ([#222](https://github.com/sylkellc/typicalbot/pull/222))

### Fixed
 - `$randomuser` not filtering roles properly ([#214](https://github.com/sylkellc/typicalbot/pull/214))
 - No response on boolean-type settings with invalid value ([#207](https://github.com/sylkellc/typicalbot/pull/207))
 - `$twitch` response being empty ([#224](https://github.com/sylkellc/typicalbot/pull/224))
 - `$roles info members [role]` showing guild name instead of role name

## [3.3.0]
### Changed
 - `$randomuser` command to pick user by role ([#197](https://github.com/sylkellc/typicalbot/pull/197))
 - `autorole` will honor the verification level and adjust `autorole-delay` automatically ([#192](https://github.com/sylkellc/typicalbot/pull/192))
 - Use application owner(s) instead of config option ([#193](https://github.com/sylkellc/typicalbot/pull/193))
 - Automatically delete invite warning messages after a few seconds ([#186](https://github.com/sylkellc/typicalbot/pull/186)) 

### Fixed
 - Webhook messages not being purged ([#183](https://github.com/sylkellc/typicalbot/pull/183))
 - Custom event typings ([#189](https://github.com/sylkellc/typicalbot/pull/189))
 - Use cache size for automod ([#188](https://github.com/sylkellc/typicalbot/pull/188))

## [3.2.4]
### Fixed
 - `guild.settings` being undefined in guildMemberAdd and guildMemberRemove events ([#178](https://github.com/sylkellc/typicalbot/pull/178))

## [3.2.3]
### Fixed
 - `$settings clear` responding with invalid usage ([#176](https://github.com/sylkellc/typicalbot/pull/176))

## [3.2.2]
### Fixed
 - Correct string location for `$play` command
 - Correct response number for `$8ball` command

## [3.2.1]
### Added
 - Security policy ([#167](https://github.com/sylkellc/typicalbot/pull/167))

### Changed
 - Moved index.ts (root) into src directory; renamed the original index.ts to client.ts ([#173](https://github.com/sylkellc/typicalbot/pull/173))

### Removed
 - Unused strings in settings ([#171](https://github.com/sylkellc/typicalbot/pull/171))
 - Carbonitex api typings ([#172](https://github.com/sylkellc/typicalbot/pull/172))

## [3.2.0]
### Added
 - `dmcommands` setting that controls whether to send commands to DM ([#154](https://github.com/sylkellc/typicalbot/pull/154))

### Changed
 - `commands` command to change its behavior to send commands to the channel where the command is ran by default and honor the new "dmcommands" setting ([#154](https://github.com/sylkellc/typicalbot/pull/154))

### Fixed
 - `twitch` command not responding when no arguments are provided ([#155](https://github.com/sylkellc/typicalbot/pull/155), closes [#152](https://github.com/sylkellc/typicalbot/issues/152))

## [3.1.0]
### Added
 - Sentry error tracking ([e80a29a](https://github.com/sylkellc/typicalbot/commit/e80a29af42147f231df18049db17a23bd9cb265c))
 - Short codes to `lang` setting ([1e08bd9](https://github.com/sylkellc/typicalbot/commit/1e08bd9577a200c9060e07a8e8b6bfeebd8542e1))

### Changed
 - Removed unnecessary information from `stats` command ([88eb179](https://github.com/sylkellc/typicalbot/commit/88eb1798307712d786cb910858ce285e2ace4f91))
 - Updated french localization strings ([59b0f05](https://github.com/sylkellc/typicalbot/commit/59b0f05134380d608b2f20a333ff8f066b9154a6))

### Fixed
 - Mute typings ([4e56c5f](https://github.com/sylkellc/typicalbot/commit/4e56c5f67335cdd3caf85d6c66eab837790861d0))
 - Permission showing [Object object] instead of permission title in help command ([#116](https://github.com/sylkellc/typicalbot/pull/116))

### Removed
 - Music functionality and localization ([b982529](https://github.com/sylkellc/typicalbot/commit/b9825291bfd517b2cb7a9fb5f1b38d7dfcbab243), [3228503](https://github.com/sylkellc/typicalbot/commit/32285031bab870bdfb61b67ab53ef67d41878928), [e4a33a2](https://github.com/sylkellc/typicalbot/commit/e4a33a227015e8302470492f9924fc7b8c3ec3e2), [c09b1b1](https://github.com/sylkellc/typicalbot/commit/c09b1b1c6b50016f2b67a51c85d0c3ed69b0b21f), [81a2924](https://github.com/sylkellc/typicalbot/commit/81a2924b20496cfd6f4ae68859dee676db41e0be), [3c941f5](https://github.com/sylkellc/typicalbot/commit/3c941f5daaff6d40b809819d5b04e79a8399ff12))
 - `update` and `restart` command ([b7e27fa](https://github.com/sylkellc/typicalbot/commit/b7e27fa38b0aade3842ea2db2b64225ae23326d6))

## [3.0.1]
### Fixed
 - Shard count using incorrect number
 - 8ball now showing translation
 - Missing setting check (autorole-silent)
 - Incorrect role name (autorole)
 - Incorrect path for 8ball invalid localization message
 - Missing path for `auto.role.delay`
 - Depth search for 3+ in settings
 - Command mode not recognizing free mode

## [3.0.0]
### Added
 - i18n ([#78](https://github.com/typicalbot/typicalbot/pull/78)) ([ae0b16f](https://github.com/typicalbot/typicalbot/commit/ae0b16f5f50e470b5d94c36255058db657ce3434))
 - `language` setting ([#78](https://github.com/typicalbot/typicalbot/pull/78)) ([ae0b16f](https://github.com/typicalbot/typicalbot/commit/ae0b16f5f50e470b5d94c36255058db657ce3434))
 - `.prettier` to enforce code styles ([#78](https://github.com/typicalbot/typicalbot/pull/78)) ([ae0b16f](https://github.com/typicalbot/typicalbot/commit/ae0b16f5f50e470b5d94c36255058db657ce3434))
 - Typings ([#78](https://github.com/typicalbot/typicalbot/pull/78)) ([ae0b16f](https://github.com/typicalbot/typicalbot/commit/ae0b16f5f50e470b5d94c36255058db657ce3434))

### Changed
 - Project is now in TypeScript ([#78](https://github.com/typicalbot/typicalbot/pull/78)) ([ae0b16f](https://github.com/typicalbot/typicalbot/commit/ae0b16f5f50e470b5d94c36255058db657ce3434))
 - Updated dependencies

### Fixed
 - `set` command to display correct permission level ([#107](https://github.com/typicalbot/typicalbot/pull/107)) ([da1ad8a](https://github.com/typicalbot/typicalbot/commit/da1ad8a3a0a318a65fbb0cd9e28f8023e668d6c4))
 - `set view` command to display all setting values ([#78](https://github.com/typicalbot/typicalbot/pull/78)) ([ae0b16f](https://github.com/typicalbot/typicalbot/commit/ae0b16f5f50e470b5d94c36255058db657ce3434)), closes [#52](https://github.com/typicalbot/typicalbot/issues/52)

### Removed
 - `alias` and `description` properties from `Command` structure ([#108](https://github.com/typicalbot/typicalbot/pull/108))
 - Music commands and functionality ([00e7d95](https://github.com/typicalbot/typicalbot/commit/00e7d95f5ba6892d0b7f1de48fe84f9f5f5bbbe2))

## [2.7.1]
### Fixed
 - Update check of autorole-silent setting ([#83](https://github.com/typicalbot/typicalbot/pull/83))
 - Incorrect setting being displayed for `modlogs-purge` ([#85](https://github.com/typicalbot/typicalbot/pull/85))

### Removed
 - Purged messages sent to hastebin ([#84](https://github.com/typicalbot/typicalbot/pull/84))

## [2.7.0]
### Changed
 - `alias` command is available to everyone
 - YouTube live streams is available to everyone via `play` command
 - `music-timelimit` max limit has been changed from 600 to 7200
 - `music-queuelimit` max limit has been changed from 10 to 100

## [2.6.0]
### Changed
 - Update veza dependency ([#74](https://github.com/typicalbot/typicalbot/pull/74)) ([94035f8](https://github.com/typicalbot/typicalbot/commit/94035f839395ab7c7eb6e7873c2b6d9349f51969))

### Fixed
 - `userinfo` command to remove extra single quote ([#79](https://github.com/typicalbot/typicalbot/pull/79)) ([22c96b3](https://github.com/typicalbot/typicalbot/commit/22c96b36e5cc3ae2d999d9b5c4a53d33cc7cff86))
 - `userinfo` command to use toString method ([#79](https://github.com/typicalbot/typicalbot/pull/79)) ([eb69c0a](https://github.com/typicalbot/typicalbot/commit/eb69c0a6515f3531e5df272718f7ddff39b36eb7))
 - Update to use updated veza methods ([#74](https://github.com/typicalbot/typicalbot/pull/74)) ([17d7ee7](https://github.com/typicalbot/typicalbot/commit/17d7ee7e15451f9da542cd069a4b1ffdff36e2cd))

### Removed
 - `quote` command because of dead API ([#62](https://github.com/typicalbot/typicalbot/pull/62)) ([5db93ce](https://github.com/typicalbot/typicalbot/commit/5db93cee5222b8902ab02cab34664b02ed7d3a08))
 - `tiger` command because of dead API ([#62](https://github.com/typicalbot/typicalbot/pull/62)) ([5db93ce](https://github.com/typicalbot/typicalbot/commit/5db93cee5222b8902ab02cab34664b02ed7d3a08))

## [2.5.2]
### Fixed
 - Update error message in AudioUtil#searchError ([#72](https://github.com/typicalbot/typicalbot/pull/72)) ([f668b30](https://github.com/typicalbot/typicalbot/commit/f668b3065639ba5f4677875d4d17a7dd326e623c)), closes [#71](https://github.com/typicalbot/typicalbot/issues/71)

## [2.5.1]
### Changed
 - `twitch` command to change error response
 - Rename administration command category to system
 - Update contributor guidelines

## [2.5.0]
### Added
 - `dehoist` command ([#42](https://github.com/typicalbot/typicalbot/pull/42))
 - `discordstatus` command ([#50](https://github.com/typicalbot/typicalbot/pull/50))

### Changed
 - `canvas` dependency to use GitHub registry instead of NPM ([#51](https://github.com/typicalbot/typicalbot/pull/51))
 - `help` command to add `support` as an alias ([#43](https://github.com/typicalbot/typicalbot/pull/43))
 - `say` command to add support for logging in activity logs ([#53](https://github.com/typicalbot/typicalbot/pull/53))
 - `settings` command to add `logs-say` setting ([#53](https://github.com/typicalbot/typicalbot/pull/53))
 - `settings` command to add `subscriberrole` as a viewable setting ([#46](https://github.com/typicalbot/typicalbot/pull/46))
 - `stats` command to remove code duplication
 - `subscribe` command to remove hardcoded settings ([#46](https://github.com/typicalbot/typicalbot/pull/46))
 - `userinfo` command to add `whois` as an alias ([#48](https://github.com/typicalbot/typicalbot/pull/48))
 - `userinfo` command to cleanup and reformat the response ([#48](https://github.com/typicalbot/typicalbot/pull/48))
 - `unsubscribe` command to remove hardcoded settings ([#46](https://github.com/typicalbot/typicalbot/pull/46))
 - `Settings` structure to add `logs-say` setting ([#53](https://github.com/typicalbot/typicalbot/pull/53))
 - Contributor Guidelines ([#38](https://github.com/typicalbot/typicalbot/pull/38))
 - Issue and Pull Request Templates ([#38](https://github.com/typicalbot/typicalbot/pull/38))
 - Made `bignum` dependency optional ([#51](https://github.com/typicalbot/typicalbot/pull/51))
 - Update `eslint` dev dependency
 - Update `mathjs` dependency

### Fixed
 - `urban` command parameter regex ([#45](https://github.com/typicalbot/typicalbot/pull/45))

### Removed
 - `server` command ([#43](https://github.com/typicalbot/typicalbot/pull/43))

## [2.4.1]
### Fixed
 - Remove undefinied variable in `guildCreate` event (statistics).

## [2.4.0]
### Added
 - Starboard, star messages to a board (channel). ([#30](https://github.com/typicalbot/typicalbot/pull/30), [#32](https://github.com/typicalbot/typicalbot/pull/32), [#39](https://github.com/typicalbot/typicalbot/pull/39))
 - `starboard` setting, channel of the starboard.
 - `starboard-stars` setting, required stars for message to appear on starboard.
 - `autorole-bots` setting, give bots a different role than normal users. ([#31](https://github.com/typicalbot/typicalbot/pull/31))
 - `stars` parameter to `$ignore` command to ignore starred messages in channel.
 - `view` parameter to `$ignore` command to view all ignored channels for each of the categories.
 - `BUG_REPORT`, `FEATURE_REQUEST`, and `PULL_REQUEST_TEMPLATE` github templates. ([#34](https://github.com/typicalbot/typicalbot/pull/34))
 - `$info` as an alias to `$help`. ([#36](https://github.com/typicalbot/typicalbot/pull/36))

### Changed
 - `autoroledelay` setting to `autorole-delay`. ([#31](https://github.com/typicalbot/typicalbot/pull/31))
 - `autorolesilent` setting to `autorole-silent`. ([#31](https://github.com/typicalbot/typicalbot/pull/31))
 - Revert custom emotes to emoji in `message#reply` and `message#error`. ([#32](https://github.com/typicalbot/typicalbot/pull/32))
 - Update email address in code of conduct.
 - Move `$servers` command to utility category (previously core category). ([#37](https://github.com/typicalbot/typicalbot/pull/37))
 - Update `$ignore` and `$unignore` command description to include stars. ([#41](https://github.com/typicalbot/typicalbot/pull/41))
 - Update `$adcheck` command description.

### Removed
 - `$information` command (duplicate of `$help` command). ([#36](https://github.com/typicalbot/typicalbot/pull/36))
 - Unused function parameters in commands

### Fixed
- Correct URL to settings documentation.

## [2.3.0]
### Added
 - Adopt [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
 - `$ruser` as an alias to `$randomuser`. ([#29](https://github.com/typicalbot/typicalbot/pull/29))
 - `-o` parameter to `$randomuser` command to pick an online user. ([#29](https://github.com/typicalbot/typicalbot/pull/29))

### Changed
 - Installation process in README.

## [2.2.0]
### Added
 - `$twitch` command.
 - `$voicekick` command.
 - `$calc` command.
 - Include prerequisites and installation process in README.

### Removed
 - `$youtube` command.

### Fixed
 - Fix typos in music commands ([#25](https://github.com/typicalbot/typicalbot/pull/25)).

[Unreleased]: https://github.com/typicalbot/typicalbot/compare/3.4.1...HEAD
[3.4.1]: https://github.com/typicalbot/typicalbot/releases/tag/3.4.1
[3.4.0]: https://github.com/typicalbot/typicalbot/releases/tag/3.4.0
[3.3.0]: https://github.com/typicalbot/typicalbot/releases/tag/3.3.0
[3.2.4]: https://github.com/typicalbot/typicalbot/releases/tag/3.2.4
[3.2.3]: https://github.com/typicalbot/typicalbot/releases/tag/3.2.3
[3.2.2]: https://github.com/typicalbot/typicalbot/releases/tag/3.2.2
[3.2.1]: https://github.com/typicalbot/typicalbot/releases/tag/3.2.1
[3.2.0]: https://github.com/typicalbot/typicalbot/releases/tag/3.2.0
[3.1.0]: https://github.com/typicalbot/typicalbot/releases/tag/3.1.0
[3.0.1]: https://github.com/typicalbot/typicalbot/releases/tag/3.0.1
[3.0.0]: https://github.com/typicalbot/typicalbot/releases/tag/3.0.0
[2.7.1]: https://github.com/typicalbot/typicalbot/releases/tag/2.7.1
[2.7.0]: https://github.com/typicalbot/typicalbot/releases/tag/2.7.0
[2.6.0]: https://github.com/typicalbot/typicalbot/releases/tag/2.6.0
[2.5.2]: https://github.com/typicalbot/typicalbot/releases/tag/2.5.2
[2.5.1]: https://github.com/typicalbot/typicalbot/releases/tag/2.5.1
[2.5.0]: https://github.com/typicalbot/typicalbot/releases/tag/2.5.0
[2.4.1]: https://github.com/typicalbot/typicalbot/releases/tag/2.4.1
[2.4.0]: https://github.com/typicalbot/typicalbot/releases/tag/2.4.0
[2.3.0]: https://github.com/typicalbot/typicalbot/releases/tag/2.3.0
[2.2.0]: https://github.com/typicalbot/typicalbot/releases/tag/2.2.0