import Command from '../../lib/structures/Command';
import { TypicalGuildMessage } from '../../lib/types/typicalbot';
import { Modes, PermissionsLevels } from '../../lib/utils/constants';
import { MessageEmbed } from 'discord.js';
import v8 from 'v8';
import heapdump from 'heapdump';

const formatSize = (size: number) => {
    const kb = size / 1024;
    const mb = kb / 1024;
    const gb = mb / 1024;

    if (kb) {
        return `${kb.toFixed(0)}KB`;
    } else if (kb > 1024 && mb < 1024) {
        return `${mb.toFixed(0)}MB`;
    }


    return `${gb.toFixed(0)}GB`;
};

export default class extends Command {
    permission = PermissionsLevels.BOT_OWNER;
    mode = Modes.STRICT;

    async execute(message: TypicalGuildMessage, parameters?: string) {
        if (parameters === 'snapshot')
            return heapdump.writeSnapshot(`${__dirname}/${Date.now()}.heapsnapshot`, (err) => {
                if (err) {
                    return message.error('Failed to create heap snapshot.');
                }

                message.send('Successfully created heap snapshot.');
            });

        const heap = v8.getHeapStatistics();
        const heapContent = [
            `Allocated Memory : ${formatSize(heap.malloced_memory)}`,
            `Heap Size Limit  : ${formatSize(heap.heap_size_limit)}`,
            `Used Heap Size   : ${formatSize(heap.used_heap_size)}/${formatSize(heap.total_heap_size)}`,
            `Physical Size    : ${formatSize(heap.total_physical_size)}`
        ];

        if (!message.embeddable)
            return message.send([
                '**Heap Statistics**',
                '```swift',
                ...heapContent,
                '```'
            ].join('\n'));

        message.send(new MessageEmbed()
            .setTitle('Heap Statistics')
            .setDescription([
                '```swift',
                ...heapContent,
                '```'
            ].join('\n')));
    }
}
