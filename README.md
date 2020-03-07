<p align="center">
    <h1 align="center">TypicalBot</h1>
</p>
<p align="center">
    <i>A stable, lightning fast, easy to use, <a href="https://discordapp.com">Discord</a> bot built using <a href="https://discord.js.org">Discord.js</a> and <a href="https://nodejs.org">Node.js</a>.<br>Try out TypicalBot using our hosted version at <a href="https://typicalbot.com/invite">typicalbot.com/invite</a>.</i>
</p>
<p align="center">
    <a href="https://discord.gg/typicalbot"><img src="https://discordapp.com/api/guilds/163038706117115906/embed.png?style=shield" alt="Discord"></a>
</p>

TypicalBot is an ironically named multipurpose Discord bot that is far from typical, developed in [discord.js](https://github.com/discordjs/discord.js).

## Introduction

TypicalBot is an ironically named multipurpose Discord bot that is far from typical, developed in [discord.js](https://github.com/discordjs/discord.js).

## Table of Contents

- [Ecosystem](#ecosystem)
- [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
- [Maintainers](#maintainers)
- [Contributors](#contributors)
- [Show Your Support](#show-your-support)
- [License](#license)

## Ecosystem

| Project | Description |
|---------|-------------|
| [typicalbot-cluster-manager](https://github.com/sylkellc/typicalbot-cluster-manager) | Inter-process communication manager |

## Getting Started

This section provides a quick-start guide.

### Prerequisites

- [Node.js](https://nodejs.org/en/): Node.js 12.x or newer is required.
- [RethinkDB](https://rethinkdb.com/): RethinkDB is required.
- [PM2](http://pm2.keymetrics.io/): PM2 is required.

**Windows Only**
- [Windows Build Tools](https://github.com/felixrieseberg/windows-build-tools): Python 2.7 and VisualStudio is required to compile dependencies.
- [OpenSSL](http://slproweb.com/products/Win32OpenSSL.html): OpenSSL is required for bignum, use version 1.0.X (Do not use version 1.1.X or the Light version).
- [GTK+](http://ftp.gnome.org/pub/GNOME/binaries/win64/gtk+/): GTK 2 is required for canvas, use version 2.X.X (Do not use version 3.X.X)

### Installation

0. Make sure all prerequisites above are installed.
1. Clone the repository, ie. `git clone https://github.com/typicalbot/typicalbot.git`
2. Start RethinkDB database `rethinkdb`
3. Install all necessary packages to setup the environment: `npm run build:database`
4. While the above is running create your `config.json` file using the example file provided in the repo.
5. Run `npm run build:instance`
6. Profit!

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/nsylke"><img src="https://avatars1.githubusercontent.com/u/19676879?v=4" width="100px;" alt=""/><br /><sub><b>Nicholas Sylke</b></sub></a><br /><a href="#business-nsylke" title="Business development">💼</a> <a href="https://github.com/sylkellc/typicalbot/commits?author=nsylke" title="Code">💻</a> <a href="#financial-nsylke" title="Financial">💵</a> <a href="#ideas-nsylke" title="Ideas, Planning, & Feedback">🤔</a> <a href="#infra-nsylke" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#maintenance-nsylke" title="Maintenance">🚧</a> <a href="#projectManagement-nsylke" title="Project Management">📆</a> <a href="https://github.com/sylkellc/typicalbot/pulls?q=is%3Apr+reviewed-by%3Ansylke" title="Reviewed Pull Requests">👀</a> <a href="#security-nsylke" title="Security">🛡️</a></td>
    <td align="center"><a href="https://github.com/tjrgg"><img src="https://avatars1.githubusercontent.com/u/11968358?v=4" width="100px;" alt=""/><br /><sub><b>Tyler Richards</b></sub></a><br /><a href="https://github.com/sylkellc/typicalbot/commits?author=tjrgg" title="Code">💻</a> <a href="#ideas-tjrgg" title="Ideas, Planning, & Feedback">🤔</a> <a href="#maintenance-tjrgg" title="Maintenance">🚧</a> <a href="#projectManagement-tjrgg" title="Project Management">📆</a> <a href="#question-tjrgg" title="Answering Questions">💬</a></td>
    <td align="center"><a href="https://pikaard.com"><img src="https://avatars0.githubusercontent.com/u/19532144?v=4" width="100px;" alt=""/><br /><sub><b>Bryan Pikaard</b></sub></a><br /><a href="https://github.com/sylkellc/typicalbot/commits?author=bwpikaard" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/Skillz4Killz"><img src="https://avatars3.githubusercontent.com/u/23035000?v=4" width="100px;" alt=""/><br /><sub><b>Skillz4Killz</b></sub></a><br /><a href="https://github.com/sylkellc/typicalbot/commits?author=Skillz4Killz" title="Code">💻</a></td>
    <td align="center"><a href="http://androz2091.fr"><img src="https://avatars1.githubusercontent.com/u/42497995?v=4" width="100px;" alt=""/><br /><sub><b>Androz</b></sub></a><br /><a href="https://github.com/sylkellc/typicalbot/commits?author=Androz2091" title="Code">💻</a></td>
    <td align="center"><a href="http://www.akshin.com/"><img src="https://avatars1.githubusercontent.com/u/43317227?v=4" width="100px;" alt=""/><br /><sub><b>Akshin Vemana</b></sub></a><br /><a href="https://github.com/sylkellc/typicalbot/commits?author=AkshinVemana" title="Code">💻</a> <a href="#question-AkshinVemana" title="Answering Questions">💬</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://cheezewerks.com/"><img src="https://avatars2.githubusercontent.com/u/25778864?v=4" width="100px;" alt=""/><br /><sub><b>Braxton</b></sub></a><br /><a href="https://github.com/sylkellc/typicalbot/commits?author=SirPacker" title="Code">💻</a> <a href="#question-SirPacker" title="Answering Questions">💬</a></td>
    <td align="center"><a href="https://github.com/TobiasFeld22"><img src="https://avatars3.githubusercontent.com/u/18636103?v=4" width="100px;" alt=""/><br /><sub><b>Tobias Feld</b></sub></a><br /><a href="https://github.com/sylkellc/typicalbot/commits?author=TobiasFeld22" title="Code">💻</a> <a href="#question-TobiasFeld22" title="Answering Questions">💬</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

## Show Your Support

If you like what we do, consider supporting us on [Patreon](https://patreon.com/typicalbot).

## License

TypicalBot is an open source software licensed under the [Apache 2.0 license](LICENSE).
