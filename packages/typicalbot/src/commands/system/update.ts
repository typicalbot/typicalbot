import { exec } from 'child_process';
import Command from '../../structures/Command';
import Constants from '../../utility/Constants';
import { TypicalGuildMessage } from '../../types/typicalbot';
import { MessageEmbed } from 'discord.js';

export default class extends Command {
    permission = Constants.PermissionsLevels.TYPICALBOT_MAINTAINER;
    mode = Constants.Modes.STRICT;

    execute(message: TypicalGuildMessage) {
        const path = process.cwd();

        exec('git pull', { cwd: path }, (err, stdout, stderr) => {
            if (err) return console.error(err);

            const embed = new MessageEmbed().setTitle('TypicalBot Updater').setFooter('TypicalBot', Constants.Links.ICON).setColor(0x00adff);

            if (stdout) embed.addField('» STDOUT', stdout.toString().substring(0, 1024));
            if (stderr) embed.addField('» STDERR', stderr.toString().substring(0, 1024));

            message.send(embed);
        });
    }
};
