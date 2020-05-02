import HitType from "./HitType";
import Pattern from "./Pattern";

export default class HandpanHit {
    public readonly hit_type: HitType;
    public readonly hand: Hand;

    private constructor(hit_type: HitType, hand: Hand) {
        this.hit_type = hit_type;
        this.hand = hand;
    }

    /**
     * @param pattern to add logic instead of randomness when generating a pattern
     */
    public static createRandomHit(pattern: Pattern): HandpanHit {
        let random_boolean = Math.floor(Math.random() * 2);
        let hand = random_boolean ? Hand.left : Hand.right;
        let hit_type = HitType.getRandomHitType();

        return new HandpanHit(hit_type, hand);
    }
}
