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
import { Server } from 'veza';
import config from '../config.json';

const regex = /\d+$/;

const node = new Server('manager')
    .on('error', (error, client) =>
        console.error(
            `[IPC] Error from ${client ? client.name : `Unknown Client`}`,
            error
        )
    )
    .on('connect', client =>
        console.log(`[IPC] Client Connected: ${client.name}`)
    )
    .on('disconnect', client =>
        console.log(`[IPC] Client Destroyed: ${client.name}`)
    )
    .on('message', async message => {
        const { event, data } = message.data;

        if (event === 'collectData') {
            const sockets = Array.from(node.sockets);
            const results = await Promise.all(
                sockets
                    .filter(c => regex.test(c[0]))
                    .map(s =>
                        s[1].send(
                            {
                                event: 'collectData',
                                data
                            },
                            { receptive: true }
                        )
                    )
            );
            message.reply((results as string[]).reduce((a, c) => a + c));
        } else if (event === 'sendTo') {
            const reply = await node.sendTo(message.data.to, data, {
                receptive: true
            });
            message.reply(reply);
        }
    });

node.listen(config.port).catch(error =>
    console.error('[IPC] Disconnected!', error)
);
