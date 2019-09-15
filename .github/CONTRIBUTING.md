# Contributing to TypicalBot

Thank you for taking the time to consider making a contribution to TypicalBot!

What follows is a set of guidelines for contributing to TypicalBot and its repositories. These are mostly guidelines, not rules. Use your best judgment.

#### Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Making Contributions](#making-contributions)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements and Features](#suggesting-enhancements-and-features)
  - [Pull Requests](#pull-requests)
- [Style Guides](#style-guides)
  - [CHANGELOG](#changelog)
  - [Git Commit Messages](#git-commit-messages)
  - [JavaScript Style Guide](#javascript-style-guide)
  - [Documentation](#documentation)
- [Getting Help](#getting-help)

## Code of Conduct

This project and everyone participating in it is governed by the [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to [support@typicalbot.com](mailto:support@typicalbot.com).

## Making Contributions

### Reporting Bugs

Before creating bug reports, please check [this list](#before-submitting-a-bug-report) as you might find out that you don't need to create one. When you are creating a bug report, [please include as many details as possible](#submitting-a-bug-report). Please fill out the template completely, since doing so helps contributors resolve issues faster.

#### Before Submitting A Bug Report

- Search [previous issues](https://github.com/search?q=+is%3Aissue+user%3Atypicalbot) to see if the problem you are experiencing has already been reported. If it has and the issue is still open, comment on that issue instead of opening a new one.
- Try reproducing the problem on the latest commit in the [master](https://github.com/typicalbot/typicalbot/tree/master) branch.

#### Submitting A Bug Report

When submitting a bug report issue, keep these guidelines in mind so that the problem can be resolved as swifly as possible.

- Use a clear and descriptive title for the issue to identify the problem.
- Describe the exact steps that reproduce the problem in as many details as possible. When listing steps, explain how you did each step.
- Describe the behavior you observed after following the steps and point out exactly what the problem is with that behavior. Explain what behavior you expected.
- Provide specific examples to demonstrate the steps.
- If possible, include screenshots and animated GIFs which demonstrate the problem.

### Suggesting Enhancements and Features

Before creating enhancement suggestions, please check [this list](#before-submitting-a-suggestion) as you might find out that you don't need to create one. When you are creating an enhancement suggestion, [please include as many details as possible](#submitting-an-enhancement-suggestion).

#### Before Submitting A Suggestion

- Check to see if the enhancement or feature you're thinking of has already been completed for an upcoming release.
- Search [previous suggestions](https://github.com/search?q=+is%3Aissue+user%3Atypicalbot) to see if your enhancement or feature has already been suggested. If it has and the issue is still open, comment on that issue instead of opening a new one.

#### Submitting A Suggestion

- Use a clear and descriptive title for the issue to identify the enhancement or feature you are suggesting.
- Provide a step-by-step description of the suggested enhancement or feature in as many details as possible.
- Provide specific examples to demonstrate the steps.
- Explain why this enhancement would be useful to most TypicalBot users.

### Pull Requests

In order to have your pull request considered for review, it must meet the following requirements:

- A completed [pull request template](https://github.com/typicalbot/typicalbot/blob/master/.github/PULL_REQUEST_TEMPLATE.md). If the pull request template is not completed, you'll be asked to complete it before your pull request will be considered for merging.
- Compliance with the [style guides](#style-guides). If your pull request doesn't comply with one or more of styleguides, you'll be asked to bring it to complaince before your pull request will be considered for merging.
- Completed documentation and tests, if applicable.

> Note: The reviewer(s) of your pull request may request changes or ask you to complete additional tasks, tests, or other changes before your pull request will be accepted and merged.

## Style Guides

### CHANGELOG

All changes must be tracked in the [CHANGELOG](https://github.com/typicalbot/typicalbot/blob/master/CHANGELOG.md). Use [Keepachangelog.org](https://keepachangelog.com/en/1.0.0/) as a guide for adding changes to the CHANGELOG.

### Git Commit Messages

- Use the imperative mood (i.e. "Move command to..." not "Moves command to...").
- Use the present tense (i.e. "Add feature" not "Added feature").
- Keep commits discrete. Avoid including multiple unrelated changes in a single commit.
- Keep commits self-contained: avoid spreading a single change across multiple commits.
- Reference issues and pull requests liberally after the first line.

### JavaScript Style Guide

All JavaScript code must adhere to the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript), with the exception of [indents (19.1)](https://github.com/airbnb/javascript#whitespace--spaces). Use soft tabs (space character) set to 4 spaces.

### Documentation

All code must be documented using [ESDoc tags](https://esdoc.org/manual/tags.html).

## Getting Help

If you have any questions or run into any trouble, please reach out to us in the [TypicalBot Lounge](https://discord.gg/typicalbot) Discord server.
