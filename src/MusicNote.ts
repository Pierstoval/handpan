class MusicNote {
    private readonly _note: Note;
    private readonly _alteration: NoteAlteration;
    private readonly _octave: number;
    private readonly _position: number;

    get note(): Note {
        return this._note;
    }

    get alteration(): NoteAlteration {
        return this._alteration;
    }

    get octave(): number {
        return this._octave;
    }

    get position(): number {
        return this._position;
    }

    constructor(note: Note, alteration: NoteAlteration, octave: number, position: number) {
        this._note = note;
        this._alteration = alteration;
        this._octave = octave;
        this._position = position;
    }
}
