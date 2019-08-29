# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
 - Starboard, star messages to a board (channel). 
 - `starboard` setting, channel of the starboard.
 - `starboard-stars` setting, required stars for message to appear on starboard.
 - `autorole-bots` setting, give bots a different role than normal users. (See #31)
 - `stars` parameter to `$ignore` command to ignore starred messages in channel. 

### Changed
 - `autoroledelay` setting to `autorole-delay`. (See #31)
 - `autorolesilent` setting to `autorole-silent`. (See #31)

## [2.3.0]
### Added
 - Adopt [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and [Semantic Versioning](https://semver.org/spec/v2.0.0.html). 
 - `$ruser` as an alias to `$randomuser`. (See #29)
 - `-o` parameter to `$randomuser` command to pick an online user. (See #29)

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
 - Fix typos in music commands (#25).

[Unreleased]: https://github.com/typicalbot/typicalbot/compare/2.3.0...HEAD
[2.3.0]: https://github.com/typicalbot/typicalbot/releases/tag/2.3.0
[2.2.0]: https://github.com/typicalbot/typicalbot/releases/tag/2.2.0