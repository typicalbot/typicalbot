<p align="center">
    <h1 align="center">TypicalBot</h1>
</p>
<p align="center">
    <a target="_blank" href="https://discord.gg/typicalbot"><img src="https://discordapp.com/api/guilds/163038706117115906/embed.png?style=shield" alt="Discord"></a>
    <a target="_blank" href="https://translate.typicalbot.com/project/typicalbot"><img src="https://badges.crowdin.net/typicalbot/localized.svg" alt="Crowdin"></a>
    <a target="_blank" href="https://stackshare.io/typicalbot-llc/typicalbot"><img src="https://img.shields.io/badge/tech-stack-0690fa.svg?style=flat" alt="StackShare"></a>
</p>

## About TypicalBot

TypicalBot is far from typical. It's stable, lightning fast, and easy to use— TypicalBot will seamlessly help you moderate your server and provide entertainment for its members, no problem at all!

 - [Multilingual](https://translate.typicalbot.com)
 - Moderation
 - Customization
 - Entertainment

## Table of Contents

- [Ecosystem](#ecosystem)
- [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
- [Show Your Support](#show-your-support)
- [Security Vulnerabilities](#security-vulnerabilities)
- [License](#license)

## Ecosystem

| Project | Description |
|---------|-------------|
| [typicalbot-cluster-manager](https://github.com/typicalbot/typicalbot-cluster-manager) | Inter-process communication manager |

## Getting Started

This section provides a quick-start guide.

### Prerequisites

- [Node.js](https://nodejs.org/en/): Node.js 12.x or newer is required.
- [RethinkDB](https://rethinkdb.com/): RethinkDB is required.
- [PM2](http://pm2.keymetrics.io/): PM2 is required.

**Windows Only**
- [Windows Build Tools](https://github.com/felixrieseberg/windows-build-tools): Python 2.7 and VisualStudio is required to compile dependencies.
- [GTK+](http://ftp.gnome.org/pub/GNOME/binaries/win64/gtk+/): GTK 2 is required for canvas, use version 2.X.X (Do not use version 3.X.X)

### Installation

0. Make sure all prerequisites above are installed.
1. Clone the repository, ie. `git clone https://github.com/typicalbot/typicalbot.git`
2. Install the dependencies with `npm install`
3. Start RethinkDB database with `rethinkdb`
4. Run `npm run build:database` to build the database structure.
5. While the above is running create your `config.json` file using the example file provided in the repo.
6. Run `npm run build:instance`
7. Profit!

## Show Your Support

If you like what we do, consider supporting us on [Patreon](https://patreon.com/typicalbot).

## Security Vulnerabilities

Please review our [security policy](https://github.com/typicalbot/typicalbot/security/policy) on how to report security vulnerabilities.

## License

TypicalBot is an open source software licensed under the [Apache 2.0 license](LICENSE).
