# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

[Unreleased]: https://github.com/typicalbot/typicalbot/compare/2.6.0...HEAD
[2.6.0]: https://github.com/typicalbot/typicalbot/releases/tag/2.6.0
[2.5.2]: https://github.com/typicalbot/typicalbot/releases/tag/2.5.2
[2.5.1]: https://github.com/typicalbot/typicalbot/releases/tag/2.5.1
[2.5.0]: https://github.com/typicalbot/typicalbot/releases/tag/2.5.0
[2.4.1]: https://github.com/typicalbot/typicalbot/releases/tag/2.4.1
[2.4.0]: https://github.com/typicalbot/typicalbot/releases/tag/2.4.0
[2.3.0]: https://github.com/typicalbot/typicalbot/releases/tag/2.3.0
[2.2.0]: https://github.com/typicalbot/typicalbot/releases/tag/2.2.0