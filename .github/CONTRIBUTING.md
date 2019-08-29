# Contributing to TypicalBot

Thank you for considering making a contribution to TypicalBot! This guide explains how to setup your environment for TypicalBot development and where to get help if you encounter trouble.

## Follow the Code of Conduct

In order to foster a more inclusive community, TypicalBot has adopted the [Contributor Covenant](CODE_OF_CONDUCT.md).

## Making Chanes

### Development Setup

In order to make changes to TypicalBot, you'll need:

* A text editor or IDE. We use and recommend [Visual Studio Code](https://code.visualstudio.com).
* [Node.js](https://nodejs.org/en/) version 10 or higher. 
* [RethinkDB](https://rethinkdb.com/) version 2.3 or higher.
* [PM2] version 3.4.X or higher.
* [TypicalBot Cluster Manager](https://github.com/typicalbot/typicalbot-cluster-manager) version 1.0 or higher.
* [git](https://git-scm.com) and a [GitHub account](https://github.com/join).

TypicalBot uses a pull request model for contributions. Fork [typicalbot/typicalbot](https://github.com/typicalbot/typicalbot) and clone your fork.

Configure your Git username and email with
```
git config user.name 'First Last'
git config user.email user@example.com
```

Before importing the project into IntelliJ make sure to run `./gradlew check` at least once so all required files are generated.

### Creating Commits and Writing Commit Messages

The commit messages that accompany your code changes are an important piece of documentation, and help make your contribution easier to review. Please consider reading [How to Write a Git Commit Message](https://chris.beams.io/posts/git-commit). Minimally, follow these guidelines when writing commit messages.

* Keep commits discrete: avoid including multiple unrelated changes in a single commit.
* Keep commits self-contained: avoid spreading a single change across multiple commits. A single commit should make sense in isolation.
* If your commit pertains to a GitHub issue, include (`See #123`) in the commit message on a separate line.

## Submitting Your Change

All code contributions should be submitted via a [pull request](https://help.github.com/articles/using-pull-requests) from a [forked GitHub repository](https://help.github.com/articles/fork-a-repo).

Once received, the pull request will be reviewed by a TypicalBot maintainer.

## Getting Help

If you run into any trouble, please reach out to us in the #support channel of the [TypicalBot Lounge](https://discord.gg/typicalbot) Discord guild.

## Thank You

We deeply appreciate your effort toward improving TypicalBot.