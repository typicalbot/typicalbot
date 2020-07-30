/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2020 Vercel, Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
const sectionLabelMap = {
    'BREAKING CHANGES': 'type: breaking',
    'Features': 'type: feat',
    'Refactors': 'type: refactor',
    'Fixes': 'type: fix',
};

const fallbackSection = 'Chores';
const prNumberRegex = /\(#([-0-9]+)\)/;

const getCommitPullRequest = async (commit, github) => {
    const match = prNumberRegex.exec(commit.title);

    if (!match) {
        return null;
    }

    const number = parseInt(match[1], 10);

    if (!number) {
        return null;
    }

    const { data } = await github.connection.pullRequests.get({
        owner: github.repoDetails.user,
        repo: github.repoDetails.repo,
        number
    });

    return data;
};


const getSectionForPullRequest = (pullRequest) => {
    const { labels } = pullRequest;

    for (const [section, label] of Object.entries(sectionLabelMap)) {
        if (labels.some((prLabel) => prLabel.name === label)) {
            return section;
        }
    }

    return null;
};

const groupByLabels = async (commits, github) => {
    const sections = Object.keys(sectionLabelMap).reduce((sections, section) => {
        sections[section] = [];
        return sections;
    }, {});
    sections.__fallback = [];

    for (const commit of commits) {
        const pullRequest = await getCommitPullRequest(commit, github)

        if (pullRequest) {
            const section = getSectionForPullRequest(pullRequest)

            if (section) {
                sections[section].push({
                    title: pullRequest.title,
                    number: pullRequest.number
                });

                continue;
            }

            sections.__fallback.push({
                title: pullRequest.title,
                number: pullRequest.number
            });

            continue;
        }

        sections.__fallback.push({
            title: commit.title
        });
    }

    return sections;
};

const buildChangelog = (sections, authors) => {
    let text = '';

    for (const section in sections) {
        const changes = sections[section];

        if (changes.length === 0) {
            continue;
        }

        const title = section === '__fallback' ? fallbackSection : section;
        text += `### ${title}\n\n`;

        for (const change of changes) {
            const numberText = change.number != null ? `: #${change.number}` : '';

            text += `- ${change.title}${numberText}\n`;
        }

        text += '\n';
    }

    if (authors.size > 0) {
        text += '### Credits \n\n';
        text += 'Huge thanks to ';

        let index = 1;
        authors.forEach((author) => {
            text += `@${author}`;

            const penultimate = index === authors.size - 1;
            const notLast = index !== authors.size;

            if (penultimate) {
                if (authors.size > 2) {
                    text += ',';
                }

                text += ' and ';
            } else if (notLast) {
                text += ', ';
            }

            index += 1;
        });

        text += ' for helping!';
        text += '\n';
    }

    return text;
}

module.exports = async (markdown, metadata) => {
    const { commits, authors, githubConnection, repoDetails } = metadata;

    const github = { connection: githubConnection, repoDetails };

    const sections = await groupByLabels(commits.all, github);
    const changelog = buildChangelog(sections, authors);

    return changelog;
}
