# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
 - `$informaiton` command (duplicate of `$help` command). ([#36](https://github.com/typicalbot/typicalbot/pull/36))

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

[Unreleased]: https://github.com/typicalbot/typicalbot/compare/2.4.0...HEAD
[2.4.0]: https://github.com/typicalbot/typicalbot/releases/tag/2.4.0
[2.3.0]: https://github.com/typicalbot/typicalbot/releases/tag/2.3.0
[2.2.0]: https://github.com/typicalbot/typicalbot/releases/tag/2.2.0