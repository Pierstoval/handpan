"use strict";
var App = /** @class */ (function () {
    function App(document, patterns_container, handpan_notes_input, handpan_notes_result_element, number_of_bars_input, number_of_bars_result_element, regenerate_button, rhythm_inputs, rhythm_input_to_enable) {
        this.handpan_tune = [
            // <0 => low notes below the handpan
            // 0 => ding
            // 1 => lowest note on the top-part of the handpan
            { "note": "C", "alter": "#", "octave": 3, "position": 0 },
            { "note": "G", "alter": "#", "octave": 3, "position": 1 },
            { "note": "A", "alter": "", "octave": 4, "position": 2 },
            { "note": "B", "alter": "", "octave": 4, "position": 3 },
            { "note": "C", "alter": "#", "octave": 4, "position": 4 },
            { "note": "D", "alter": "#", "octave": 4, "position": 5 },
            { "note": "E", "alter": "", "octave": 4, "position": 6 },
            { "note": "F", "alter": "#", "octave": 4, "position": 7 },
            { "note": "G", "alter": "#", "octave": 4, "position": 8 },
        ];
        this._running = false;
        this.document = document;
        this.patterns_container = patterns_container;
        this.handpan_notes_input = handpan_notes_input;
        this.handpan_notes_result_element = handpan_notes_result_element;
        this.number_of_bars_input = number_of_bars_input;
        this.number_of_bars_result_element = number_of_bars_result_element;
        this.rhythm_inputs = rhythm_inputs;
        this.regenerate_button = regenerate_button;
        this.rhythm_input_to_enable = rhythm_input_to_enable;
    }
    App.prototype.run = function () {
        var _this = this;
        if (this._running) {
            throw 'Application is already running.';
        }
        this._running = true;
        this.regenerate_button.addEventListener('click', function () { return _this.update(); });
        // handpan_notes_result_element.value = 9;
        // handpan_notes_input.addEventListener('input', this.update);
        this.rhythm_input_to_enable.checked = true;
        this.rhythm_inputs.forEach(function (el) { return el.addEventListener('change', function () { return _this.update(); }); });
        this.number_of_bars_input.value = '2';
        this.number_of_bars_input.addEventListener('input', function () { return _this.update(); });
        this.update();
    };
    App.prototype.update = function () {
        // const handpan_notes = handpan_notes_input.value;
        var number_of_bars = Number(this.number_of_bars_input.value);
        var rhythm = this.getRadioButtonValue(this.rhythm_inputs);
        // handpan_notes_result_element.innerText = handpan_notes;
        this.number_of_bars_result_element.innerText = String(number_of_bars);
        this.patterns_container.setAttribute('data-rhythm', rhythm);
        this.patterns_container.innerHTML = '';
        var left_switch = false;
        var number_of_notes = number_of_bars * rhythm;
        for (var i = 0; i < number_of_notes; i++) {
            // Choose a "hit" type randomly in the list
            var handpan_hit = HitType.getRandomHitType();
            var pattern_item = this.createPatternItem(handpan_hit);
            this.patterns_container.appendChild(pattern_item);
            // Alternate left/right
            pattern_item.classList.add(left_switch ? 'hand-left' : 'hand-right');
            pattern_item.classList.add(handpan_hit.type);
            left_switch = !left_switch;
            // Add a separator to keep pattern a suite of 4 elements
            var needs_separator = i && (i + 1) % rhythm === 0 && (i + 1) < number_of_notes;
            if (needs_separator) {
                var pattern_item_separator = document.createElement('span');
                pattern_item_separator.className = 'pattern_time_separator';
                this.patterns_container.appendChild(pattern_item_separator);
            }
        }
    };
    App.prototype.createPatternItem = function (handpan_hit) {
        var pattern_item = document.createElement('div');
        pattern_item.className = 'pattern_item';
        // Display handpan hit type
        var text_element = document.createElement('span');
        text_element.className = 'inner';
        text_element.innerText = handpan_hit.type;
        pattern_item.appendChild(text_element);
        // Handle potential notes to display if necessary
        if (handpan_hit.needs_notes) {
            var notes_element = document.createElement('div');
            notes_element.className = 'notes';
            // Choose as many random note in the list so we can display them as a helper
            var notes = [];
            for (var i = 0; i < handpan_hit.needs_notes; i++) {
                // Pick a random note
                var note = this.handpan_tune[Math.floor(Math.random() * this.handpan_tune.length)];
                var item_to_push = note.note + note.alter + note.octave;
                notes.push(item_to_push);
            }
            notes_element.innerHTML = notes.join('<br>');
            pattern_item.appendChild(notes_element);
        }
        return pattern_item;
    };
    App.prototype.getRadioButtonValue = function (radios_list) {
        for (var _i = 0, radios_list_1 = radios_list; _i < radios_list_1.length; _i++) {
            var item = radios_list_1[_i];
            if (item.checked) {
                return item.value;
            }
        }
        return null;
    };
    return App;
}());
var Hand;
(function (Hand) {
    Hand[Hand["left"] = 0] = "left";
    Hand[Hand["right"] = 1] = "right";
})(Hand || (Hand = {}));
var HandpanHit = /** @class */ (function () {
    function HandpanHit(type, hand, notes) {
        this.type = type;
        this.hand = hand;
    }
    HandpanHit.createRandomHitType = function () {
        var random_boolean = Math.floor(Math.random() * 2);
        var hand = random_boolean ? Hand.left : Hand.right;
        var hit_type = HitType.getRandomHitType();
        return new HandpanHit(hit_type, hand, []);
    };
    return HandpanHit;
}());
var HitType = /** @class */ (function () {
    function HitType(type, needs_notes) {
        if (!HitType.isValidHitType(type)) {
            throw 'Invalid hit type';
        }
        this._type = type;
        this._needs_notes = needs_notes;
    }
    Object.defineProperty(HitType.prototype, "type", {
        get: function () {
            return this._type;
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
