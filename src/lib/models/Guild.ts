import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
class Guild {
    /**
     * Guild ID provided by Discord
     */
    @PrimaryColumn()
    id!: string;

    /**
     * An API key to access https://api.typicalbot.com
     *
     * Previously 'apiKey'
     */
    @Column()
    key?: string;

    /**
     * Locale the Guild is using the bot in
     *
     * Previously 'language'
     */
    @Column()
    locale?: string;

    /**
     * Terms of Service version accepted
     */
    @Column()
    tosVersion?: number;

    /**
     * Privacy Policy version accepted
     */
    @Column()
    ppVersion?: number;
}

export default Guild;
