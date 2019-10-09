/**
 * @license
 * Copyright 2019 Bryan Pikaard, Nicholas Sylke and the TypicalBot contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const { Server } = require('veza');
const config = require('../config');

const node = new Server("manager")
    .on('error', (error, client) => console.error(`[IPC] Error from ${client.name}`, error)) // eslint-disable-line no-console
    .on('connect', client => console.log(`[IPC] Client Connected: ${client.name}`)) // eslint-disable-line no-console
    .on('disconnect', client => console.log(`[IPC] Client Destroyed: ${client.name}`)) // eslint-disable-line no-console
    .on('message', async message => {
        const { event, data } = message.data;

        if (event === "collectData") {
            message.reply(
                await Promise
                    .all(Array.from(node.sockets)
                        .filter(c => /\d+$/.test(c[0]))
                        .map(s => s[1].send({
                            event: "collectData",
                            data
                        }, { receptive: true })))
                    .then(results => results.reduce((a, c) => a + c))
            );
        } else if (event === "sendTo") {
            node.sendTo(message.data.to, data, { receptive: true }).then(reply => message.reply(reply));
        }
    });

node.listen(config.port).catch(error => console.error('[IPC] Disconnected!', error)); // eslint-disable-line no-console
