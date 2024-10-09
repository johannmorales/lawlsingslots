type Log = {
    interactionId?: string;
    kickUsername?: string;
    discordId?: string;
    discordUsername?: string;
    message: string;
};
export declare function createStreamLogger(label: string): {
    info: ({ message, ...other }: Log, ...args: any[]) => void;
};
export {};
//# sourceMappingURL=index.d.ts.map