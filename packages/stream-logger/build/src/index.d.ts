type Log = {
    interactionId?: string;
    kickUsername?: string;
    discordId?: string;
    discordUsername?: string;
    message: string;
};
export declare function createStreamLogger(label: string): {
    info: (log: Log) => void;
    error: (log: Log) => void;
};
export {};
//# sourceMappingURL=index.d.ts.map