"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RosterModel;
(function (RosterModel) {
    var CharacterGear = /** @class */ (function () {
        function CharacterGear() {
            this.gearSlots = [];
        }
        return CharacterGear;
    }());
    RosterModel.CharacterGear = CharacterGear;
    var GearDetails = /** @class */ (function () {
        function GearDetails(name, imageUrl) {
            this.name = name;
            this.imageUrl = imageUrl;
        }
        ;
        return GearDetails;
    }());
    RosterModel.GearDetails = GearDetails;
})(RosterModel = exports.RosterModel || (exports.RosterModel = {}));
//# sourceMappingURL=RosterModel.js.map