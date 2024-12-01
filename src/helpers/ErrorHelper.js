
export function triggerError(msg) {
    const event = new CustomEvent("global-error", { detail: msg });
    window.dispatchEvent(event);
}