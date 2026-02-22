/**
 * Timer — Countdown timer with tick events.
 */

export class Timer {
    constructor() {
        this.remaining = 0;
        this.intervalId = null;
        this.onTick = null;
        this.onTimeout = null;
    }

    /**
     * Start a countdown from `seconds`.
     */
    start(seconds) {
        this.stop();
        this.remaining = seconds;
        this._emit();

        this.intervalId = setInterval(() => {
            this.remaining--;
            this._emit();

            if (this.remaining <= 0) {
                this.stop();
                if (this.onTimeout) this.onTimeout();
            }
        }, 1000);
    }

    /**
     * Pause the timer.
     */
    pause() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    /**
     * Resume the timer from current remaining.
     */
    resume() {
        if (!this.intervalId && this.remaining > 0) {
            this.intervalId = setInterval(() => {
                this.remaining--;
                this._emit();

                if (this.remaining <= 0) {
                    this.stop();
                    if (this.onTimeout) this.onTimeout();
                }
            }, 1000);
        }
    }

    /**
     * Stop the timer entirely.
     */
    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    /**
     * Add time bonus (e.g. for matches).
     */
    addTime(seconds) {
        this.remaining += seconds;
        this._emit();
    }

    _emit() {
        if (this.onTick) this.onTick(this.remaining);
    }

    /**
     * Format seconds as mm:ss
     */
    static format(seconds) {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    }
}
