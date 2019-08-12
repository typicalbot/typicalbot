## Introduction

TypicalBot is a multipurpose Discord bot developed in [discord.js](https://github.com/discordjs/discord.js). TypicalBot is the ironically named bot that is far from typical. 

## Table of Contents

- [Ecosystem](#ecosystem)
- [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
- [Maintainers](#maintainers)
- [License](#license)

## Ecosystem

| Project | Description |
|---------|-------------|
| [typicalbot-cluster-manager](https://github.com/typicalbot/typicalbot-cluster-manager) | Inter-process communication manager |
| [typicalbot-api](https://github.com/typicalbot/typicalbot-api) | Internal API |

## Getting Started

This section provides a quick-start guide.

### Prerequisites

- [Node.js](https://nodejs.org/en/): Node.js 10.0.0 or newer is required.
- [RethinkDB](https://rethinkdb.com/): RethinkDB is required. 
- [PM2](http://pm2.keymetrics.io/): PM2 is required.
- [TypicalBot Cluster Manager](https://github.com/typicalbot/typicalbot-cluster-manager): TypicalBot Cluster Manager is required. 

**Windows Only**
- [Windows Build Tools](https://github.com/felixrieseberg/windows-build-tools): Python 2.7 and VisualStudio is required to compile dependencies. 
- [OpenSSL](http://slproweb.com/products/Win32OpenSSL.html): OpenSSL is required for bignum, use version 1.0.X (Do not use version 1.1.X or the Light version).
- [GTK+](http://ftp.gnome.org/pub/GNOME/binaries/win64/gtk+/): GTK 2 is required for canvas, use version 2.X.X (Do not use version 3.X.X) 

### Installation

1. Make sure all prerequisites are installed.
2. Fork the TypicalBot repository: https://github.com/typicalbot/typicalbot/fork
3. Clone your forked repository, ie. `git clone git@github.com/<YOUR-USERNAME>/typicalbot.git`
4. Start Rethink database. 
5. Start TypicalBot Cluster Manager.
6. Open command prompt and run `npm run pm2-gen`.
7. You're done!

## Maintainers

- Nicholas Sylke ([@nsylke](https://github.com/nsylke))
- Bryan Pikaard ([@HyperCoder2975](https://github.com/HyperCoder2975))

## License

TypicalBot is an open source software licensed under the [Apache 2.0 license](LICENSE).