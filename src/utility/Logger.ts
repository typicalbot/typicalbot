import { Logger as WinstonLogger, createLogger, format, transports } from 'winston';

export default class Logger {
    readonly #logger: WinstonLogger;

    public constructor() {
        this.#logger = createLogger({
            level: 'info',
            format: format.simple(),
            transports: [
                new transports.Console(),
                new transports.File({ filename: 'combined.log' })
            ]
        });
    }

    public info(message: string): void {
        this.#logger.info(message);
    }

    public debug(message: string): void {
        this.#logger.debug(message);
    }

    public warn(message: string): void {
        this.#logger.warn(message);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public error(message: any): void {
        this.#logger.error(message.stack ? message.stack : message.toString());
    }
}
