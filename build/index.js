"use strict";
var App = /** @class */ (function () {
    function App(window, patterns_container, handpan_notes_input, handpan_notes_result_element, number_of_bars_input, number_of_bars_result_element, regenerate_button, rhythm_inputs, rhythm_input_to_enable) {
        this.handpan_tune = new HandpanTune();
        this._running = false;
        this.window = window;
        this.document = window.document;
        this.patterns_container = patterns_container;
        this.handpan_notes_input = handpan_notes_input;
        this.handpan_notes_result_element = handpan_notes_result_element;
        this.number_of_bars_input = number_of_bars_input;
        this.number_of_bars_result_element = number_of_bars_result_element;
        this.rhythm_inputs = rhythm_inputs;
        this.regenerate_button = regenerate_button;
        this.rhythm_input_to_enable = rhythm_input_to_enable;
        this._currentPattern = new Pattern(0, this.handpan_tune);
        this._patternRenderer = new PatternRenderer(this.document, this.patterns_container);
    }
    App.prototype.run = function () {
        var _this = this;
        if (this._running) {
            throw 'Application is already running.';
        }
        this._running = true;
        this.activateHandpanTuner();
        this.regenerate_button.addEventListener('click', function () { return _this.refreshRandomPattern(); });
        // handpan_notes_result_element.value = 9;
        // handpan_notes_input.addEventListener('input', this.refreshRandomPattern);
        this.rhythm_input_to_enable.checked = true;
        this.number_of_bars_input.value = '2';
        this.refreshRandomPattern();
    };
    App.prototype.refreshRandomPattern = function () {
        // const handpan_notes = handpan_notes_input.value;
        var number_of_bars = Number(this.number_of_bars_input.value);
        var rhythm = App.getRadioButtonValue(this.rhythm_inputs);
        // handpan_notes_result_element.innerText = handpan_notes;
        this.number_of_bars_result_element.innerText = String(number_of_bars);
        this.patterns_container.setAttribute('data-rhythm', rhythm);
        this.patterns_container.innerHTML = '';
        var number_of_notes = number_of_bars * rhythm;
        this._currentPattern = new Pattern(rhythm, this.handpan_tune);
        for (var i = 0; i < number_of_notes; i++) {
            // Choose a "hit" type randomly in the list
            var handpan_hit = HandpanHit.createRandomHit(this._currentPattern);
            this._currentPattern.add(handpan_hit);
        }
        this._patternRenderer.renderPattern(this._currentPattern);
        console.info('Pattern:', this._currentPattern);
    };
    App.getRadioButtonValue = function (radios_list) {
        for (var _i = 0, radios_list_1 = radios_list; _i < radios_list_1.length; _i++) {
            var item = radios_list_1[_i];
            if (item.checked) {
                return item.value;
            }
        }
        return null;
    };
    App.prototype.activateHandpanTuner = function () {
        for (var position = 0; position <= 8; position++) {
            this.createTunerInputs(position);
        }
    };
    App.prototype.createTunerInputs = function (position) {
        var input = this.document.createElement('input');
        input.type = 'range';
        input.id = 'tuner_position_' + position;
        input.setAttribute('min', 'A');
        input.setAttribute('max', 'G');
    };
    return App;
}());
var Hand;
(function (Hand) {
    Hand[Hand["left"] = 0] = "left";
    Hand[Hand["right"] = 1] = "right";
})(Hand || (Hand = {}));
var HandpanHit = /** @class */ (function () {
    function HandpanHit(hit_type, hand, notes) {
        this.hit_type = hit_type;
        this.hand = hand;
    }
    /**
     * @param pattern to add logic instead of randomness when generating a pattern
     */
    HandpanHit.createRandomHit = function (pattern) {
        var random_boolean = Math.floor(Math.random() * 2);
        var hand = random_boolean ? Hand.left : Hand.right;
        var hit_type = HitType.getRandomHitType();
        return new HandpanHit(hit_type, hand, []);
    };
    return HandpanHit;
}());
var HandpanTune = /** @class */ (function () {
    function HandpanTune() {
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
    Object.defineProperty(HandpanTune.prototype, "tune", {
        get: function () {
            return this._tune;
        },
        enumerable: true,
        configurable: true
    });
    HandpanTune.prototype.getNoteByPosition = function (position) {
        for (var _i = 0, _a = this._tune; _i < _a.length; _i++) {
            var note = _a[_i];
            if (note.position === position) {
                return note;
            }
        }
        return null;
    };
    HandpanTune.prototype.getRandomNote = function () {
        return this._tune[Math.floor(Math.random() * this._tune.length)];
    };
    return HandpanTune;
}());
var HitType = /** @class */ (function () {
    function HitType(type, needs_notes) {
        if (!HitType.isValidHitType(type)) {
            throw 'Invalid hit type';
        }
        this._name = type;
        this._needs_notes = needs_notes;
    }
    Object.defineProperty(HitType.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HitType.prototype, "needs_notes", {
        get: function () {
            return this._needs_notes;
        },
        enumerable: true,
        configurable: true
    });
    HitType.fromName = function (name) {
        for (var _i = 0, _a = this.types; _i < _a.length; _i++) {
            var type = _a[_i];
            if (type.type === name) {
                return new HitType(type.type, type.needs_notes);
            }
        }
        throw 'Invalid hit type "' + name + '".';
    };
    HitType.getRandomHitType = function () {
        var random_type = this.types[Math.floor(Math.random() * this.types.length)];
        return new HitType(random_type.type, random_type.needs_notes);
    };
    ;
    HitType.isValidHitType = function (type) {
        var hitType = this.types.filter(function (item) {
            return item.type === type;
        });
        return hitType.length > 0;
    };
    ;
    HitType.types = [
        { "type": 'ding', "needs_notes": 0 },
        { "type": 'slam', "needs_notes": 0 },
        { "type": 'left_slam', "needs_notes": 0 },
        { "type": 'right_slam', "needs_notes": 0 },
        { "type": 'ghost', "needs_notes": 0 },
        { "type": 'punch', "needs_notes": 0 },
        { "type": 'any_note', "needs_notes": 0 },
        { "type": 'note', "needs_notes": 1 },
        { "type": 'double', "needs_notes": 2 },
        { "type": 'triple', "needs_notes": 3 },
        { "type": 'staccato', "needs_notes": 1 },
        { "type": 'brush_up', "needs_notes": 2 },
        { "type": 'brush_down', "needs_notes": 2 },
        { "type": 'harmonic', "needs_notes": 1 },
    ];
    return HitType;
}());
var MusicNote = /** @class */ (function () {
    function MusicNote(note, alteration, octave, position) {
        this._note = note;
        this._alteration = alteration;
        this._octave = octave;
        this._position = position;
    }
    Object.defineProperty(MusicNote.prototype, "note", {
        get: function () {
            return this._note;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MusicNote.prototype, "alteration", {
        get: function () {
            return this._alteration;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MusicNote.prototype, "octave", {
        get: function () {
            return this._octave;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MusicNote.prototype, "position", {
        get: function () {
            return this._position;
        },
        enumerable: true,
        configurable: true
    });
    return MusicNote;
}());
var Note;
(function (Note) {
    Note["A"] = "A";
    Note["B"] = "B";
    Note["C"] = "C";
    Note["D"] = "D";
    Note["E"] = "E";
    Note["F"] = "F";
    Note["G"] = "G";
})(Note || (Note = {}));
var NoteAlteration;
(function (NoteAlteration) {
    NoteAlteration["none"] = "";
    NoteAlteration["sharp"] = "#";
    NoteAlteration["b"] = "b";
})(NoteAlteration || (NoteAlteration = {}));
var Pattern = /** @class */ (function () {
    function Pattern(rhythm, handpan_tune) {
        this._hits = [];
        this.rhythm = rhythm;
        this._handpan_tune = handpan_tune;
    }
    Object.defineProperty(Pattern.prototype, "handpan_tune", {
        get: function () {
            return this._handpan_tune;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Pattern.prototype, "hits", {
        get: function () {
            return this._hits;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Pattern.prototype, "count", {
        get: function () {
            return this._hits.length;
        },
        enumerable: true,
        configurable: true
    });
    Pattern.prototype.add = function (hit) {
        this._hits.push(hit);
    };
    Pattern.prototype.first = function () {
        if (this._hits.length) {
            return this._hits[0];
        }
        return null;
    };
    Pattern.prototype.last = function () {
        if (this._hits.length) {
            return this._hits[this._hits.length - 1];
        }
        return null;
    };
    return Pattern;
}());
var PatternRenderer = /** @class */ (function () {
    function PatternRenderer(document, container) {
        this.document = document;
        this.container = container;
    }
    PatternRenderer.prototype.renderPattern = function (pattern) {
        var number_of_notes = pattern.count;
        var i = 0;
        for (var _i = 0, _a = pattern.hits; _i < _a.length; _i++) {
            var handpan_hit = _a[_i];
            var pattern_item = this.createPatternItem(pattern, handpan_hit);
            this.container.appendChild(pattern_item);
            // Alternate left/right
            pattern_item.classList.add(handpan_hit.hand === Hand.left ? 'hand-left' : 'hand-right');
            pattern_item.classList.add(handpan_hit.hit_type.name);
            // Add a separator to keep pattern a suite of 4 elements
            var needs_separator = i && (i + 1) % pattern.rhythm === 0 && (i + 1) < number_of_notes;
            if (needs_separator) {
                var pattern_item_separator = document.createElement('span');
                pattern_item_separator.className = 'pattern_time_separator';
                this.container.appendChild(pattern_item_separator);
            }
            i++;
        }
    };
    PatternRenderer.prototype.createPatternItem = function (pattern, handpan_hit) {
        var pattern_item = document.createElement('div');
        pattern_item.className = 'pattern_item';
        // Display handpan hit type
        var text_element = document.createElement('span');
        text_element.className = 'inner';
        text_element.innerText = handpan_hit.hit_type.name;
        pattern_item.appendChild(text_element);
        // Handle potential notes to display if necessary
        if (handpan_hit.hit_type.needs_notes) {
            var notes_element = document.createElement('div');
            notes_element.className = 'notes';
            // Choose as many random note in the list so we can display them as a helper
            var notes = [];
            for (var i = 0; i < handpan_hit.hit_type.needs_notes; i++) {
                // Pick a random note
                var note = pattern.handpan_tune.getRandomNote();
                var item_to_push = note.note + note.alteration + note.octave;
                notes.push(item_to_push);
            }
            notes_element.innerHTML = notes.join('<br>');
            pattern_item.appendChild(notes_element);
        }
        return pattern_item;
    };
    return PatternRenderer;
}());
