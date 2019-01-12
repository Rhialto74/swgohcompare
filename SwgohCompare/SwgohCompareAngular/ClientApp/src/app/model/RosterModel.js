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
        function GearDetails(name, imageUrl, position, equipped) {
            this.name = name;
            this.imageUrl = imageUrl;
            this.position = position;
            this.equipped = equipped;
        }
        ;
        return GearDetails;
    }());
    RosterModel.GearDetails = GearDetails;
})(RosterModel = exports.RosterModel || (exports.RosterModel = {}));
//# sourceMappingURL=RosterModel.js.map