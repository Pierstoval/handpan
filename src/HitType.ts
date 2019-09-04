
class HitType {
    public static readonly types = [
        {"type": 'ding',       "needs_notes": 0},
        {"type": 'slam',       "needs_notes": 0},
        {"type": 'left_slam',  "needs_notes": 0},
        {"type": 'right_slam', "needs_notes": 0},
        {"type": 'ghost',      "needs_notes": 0},
        {"type": 'punch',      "needs_notes": 0},
        {"type": 'any_note',   "needs_notes": 0},
        {"type": 'note',       "needs_notes": 1},
        {"type": 'double',     "needs_notes": 2}, // "power" chord
        {"type": 'triple',     "needs_notes": 3}, // chord
        {"type": 'staccato',   "needs_notes": 1}, // A note that you just "mute" with the side of the other hand
        {"type": 'brush_up',   "needs_notes": 2}, // 2 Notes you chain really fast up
        {"type": 'brush_down', "needs_notes": 2}, // 2 Notes you chain really fast down
        {"type": 'harmonic',   "needs_notes": 1},
    ];

    private readonly _name: string;
    private readonly _needs_notes: number;

    get name(): string {
        return this._name;
    }

    get needs_notes(): number {
        return this._needs_notes;
    }

    private constructor(type: string, needs_notes: number) {
        if (!HitType.isValidHitType(type)) {
            throw 'Invalid hit type';
        }

        this._name = type;
        this._needs_notes = needs_notes;
    }

    public static fromName(name: string): HitType {
        for (let type of this.types) {
            if (type.type === name) {
                return new HitType(type.type, type.needs_notes);
            }
        }

        throw 'Invalid hit type "'+name+'".';
    }

    public static getRandomHitType(): HitType {
        let random_type = this.types[Math.floor(Math.random() * this.types.length)];

        return new HitType(random_type.type, random_type.needs_notes);
    };

    private static isValidHitType(type: string): boolean {
        let hitType = this.types.filter(function(item) {
            return item.type === type;
        });

        return hitType.length > 0;
    };
}
