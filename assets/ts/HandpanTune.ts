import MusicNote from "./MusicNote";
import HandpanTuneRenderer from "./HandpanTuneRenderer";
import {Note} from "./Note";
import {NoteAlteration} from "./NoteAlteration";

export default class HandpanTune {
    private readonly _notes: Array<MusicNote>;

    private renderer: HandpanTuneRenderer;

    constructor(renderer: HandpanTuneRenderer) {
        this.renderer = renderer;

        // position <0 => low notes below the handpan
        // position 0 => ding
        // position 1 => lowest note on the top-part of the handpan

        // TODO: make this configurable by the end user
        this._notes = [
            new MusicNote(Note.C, NoteAlteration.sharp, 3, true, 0),
            new MusicNote(Note.G, NoteAlteration.none, 3, false, 0),
            new MusicNote(Note.A, NoteAlteration.none, 4, false, 1),
            new MusicNote(Note.B, NoteAlteration.none, 4, false, 2),
            new MusicNote(Note.C, NoteAlteration.sharp, 4, false, 3),
            new MusicNote(Note.D, NoteAlteration.sharp, 4, false, 4),
            new MusicNote(Note.E, NoteAlteration.none, 4, false, 5),
            new MusicNote(Note.F, NoteAlteration.sharp, 4, false, 6),
            new MusicNote(Note.G, NoteAlteration.sharp, 4, false, 7),
        ];
    }

    get notes(): Array<MusicNote> {
        return this._notes;
    }

    public getNoteByPosition(position: number): MusicNote | null {
        for (let note of this._notes) {
            if (note.position === position) {
                return note;
            }
        }

        return null;
    }

    public render(): void {
        this.renderer.render(this);
    }

    public numberOfDings(): number {
        let numberOfDings = 0;

        for (const note of this._notes) {
            if (note.position <= 0) {
                numberOfDings++;
            }
        }

        return numberOfDings;
    }

    public numberOfNotes(): number {
        return this.notes.length - this.numberOfDings();
    }
}
