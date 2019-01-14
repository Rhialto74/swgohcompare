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
    var MapObjectLookup = /** @class */ (function () {
        function MapObjectLookup(statName, statValueP1, statValueP2, players) {
            this.statName = statName;
            this.statValueP1 = statValueP1;
            this.statValueP2 = statValueP2;
            this.players = players;
        }
        ;
        return MapObjectLookup;
    }());
    RosterModel.MapObjectLookup = MapObjectLookup;
})(RosterModel = exports.RosterModel || (exports.RosterModel = {}));
//# sourceMappingURL=RosterModel.js.map