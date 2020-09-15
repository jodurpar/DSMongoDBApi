
export class bunyanLogger {
    name: string;
    level: string;
    stream: any;
}

export class logger {
    active: boolean;
    log: bunyanLogger;
}

