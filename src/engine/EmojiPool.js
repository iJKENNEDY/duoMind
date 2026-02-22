/**
 * EmojiPool — Curated emoji lists by category.
 * Provides random pairs for each level.
 */

const EMOJI_CATEGORIES = {
    animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🦁', '🐯', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞'],
    food: ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥝', '🍍', '🥭', '🍆', '🥑', '🌽', '🌶️', '🍔', '🍕', '🌮', '🍣', '🍩', '🧁', '🍰', '🎂', '🍫', '🍬', '🍭'],
    nature: ['🌸', '🌻', '🌺', '🌹', '🌷', '🌵', '🎄', '🌿', '☘️', '🍀', '🍁', '🍂', '🌊', '🌈', '⭐', '🌙', '☀️', '⚡', '❄️', '🔥', '💧', '🌍', '🪨', '💎', '🌋', '🏔️', '🌾', '🍄', '🐚', '🪸'],
    faces: ['😀', '😂', '🥹', '😍', '🤩', '😎', '🥳', '😇', '🤠', '🤡', '👻', '💀', '👽', '🤖', '😺', '🙈', '🙉', '🙊', '💩', '🎃', '😈', '👹', '👺', '🫠', '🥶', '🥵', '🤯', '😴', '🤮', '🫣'],
    objects: ['🎮', '🎯', '🎲', '🧩', '🎪', '🎨', '🎸', '🥁', '🎹', '📷', '💡', '🔮', '⏰', '🧲', '🪄', '🎀', '🎁', '🏆', '🥇', '🎖️', '🗝️', '💰', '💎', '🧸', '🪆', '🎭', '🛸', '🚀', '⚽', '🏀'],
    symbols: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '✨', '🌟', '💫', '⚡', '🔥', '🌀', '🎵', '🎶', '💥', '💢', '💣', '🃏', '♟️'],
};

const ALL_EMOJIS = Object.values(EMOJI_CATEGORIES).flat();

export class EmojiPool {
    /**
     * Get `count` unique emojis, duplicated to form pairs, then shuffled.
     * @param {number} count - Number of pairs needed
     * @returns {string[]} Array of emojis (length = count * 2)
     */
    static getRandomPairs(count) {
        const pool = [...ALL_EMOJIS];
        const selected = [];

        const safeCount = Math.min(count, pool.length);

        for (let i = 0; i < safeCount; i++) {
            const idx = Math.floor(Math.random() * pool.length);
            selected.push(pool.splice(idx, 1)[0]);
        }

        const pairs = [...selected, ...selected];
        return EmojiPool.shuffle(pairs);
    }

    /**
     * Fisher-Yates shuffle
     */
    static shuffle(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    /**
     * Get a random emoji for decorative use
     */
    static getRandomEmoji() {
        return ALL_EMOJIS[Math.floor(Math.random() * ALL_EMOJIS.length)];
    }
}
