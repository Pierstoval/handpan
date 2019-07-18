
class HandpanHit {
    private readonly type: HitType;
    private readonly hand: Hand;

    private constructor(type: HitType, hand: Hand, notes) {
        this.type = type;
        this.hand = hand;
    }

    public static createRandomHitType(): HandpanHit {
        let random_boolean = Math.floor(Math.random() * 2);
        let hand = random_boolean ? Hand.left : Hand.right;
        let hit_type = HitType.getRandomHitType();

        return new HandpanHit(hit_type, hand, []);
    }
}
