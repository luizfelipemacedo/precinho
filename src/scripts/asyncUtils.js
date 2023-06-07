export function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
}
export const until = (predFn) => {
        const poll = (done) => (predFn() ? done() : setTimeout(() => poll(done), 100));
        return new Promise(poll);
};
    