import MusicNote from "./MusicNote";

export default class HandpanTune {
    private readonly _tune: Array<MusicNote>;

    constructor() {
        // position <0 => low notes below the handpan
        // position 0 => ding
        // position 1 => lowest note on the top-part of the handpan

        // TODO: make this configurable by the end user
        this._tune = [
            new MusicNote(Note.C, NoteAlteration.sharp, 3, 0),
            new MusicNote(Note.G, NoteAlteration.none, 3, 1),
            new MusicNote(Note.A, NoteAlteration.none, 4, 2),
            new MusicNote(Note.B, NoteAlteration.none, 4, 3),
            new MusicNote(Note.C, NoteAlteration.sharp, 4, 4),
            new MusicNote(Note.D, NoteAlteration.sharp, 4, 5),
            new MusicNote(Note.E, NoteAlteration.none, 4, 6),
            new MusicNote(Note.F, NoteAlteration.sharp, 4, 7),
            new MusicNote(Note.G, NoteAlteration.sharp, 4, 8),
        ];
    }

    get tune(): Array<MusicNote> {
        return this._tune;
    }

    public getNoteByPosition(position: number): MusicNote | null {
        for (let note of this._tune) {
            if (note.position === position) {
                return note;
            }
        }

        return null;
    }

    public getRandomNote(): MusicNote {
        return this._tune[Math.floor(Math.random() * this._tune.length)]
    }
}
