import {Banner} from "../core/model/banner";

export class Banners {
  public static readonly banners: Banner[] = [
    {
      id: 2003,
      name: "Butterfly on Swordtip",
      typeName: 'Character event',
      type: 11,
      legendary_id: 1683400200000276500,
      rare_ids: [1683274200000301600]
    },
    {
      id: 2004,
      name: "Swirl of Heavenly Spear",
      typeName: 'Character event',
      type: 11,
      legendary_id: 0,
      rare_ids: []
    },
    {
      id: 1001,
      name: null,
      typeName: 'Stellar Warp',
      type: 1,
      legendary_id: 0,
      rare_ids: []
    },
    {
      id: 4001,
      name: null,
      typeName: 'Departure warp',
      type: 2,
      legendary_id: 0,
      rare_ids: []
    },
    {
      id: 3003,
      name: null,
      typeName: 'Light cone warp',
      type: 12,
      legendary_id: 0,
      rare_ids: []
    }
  ];
}

// 2003: {
//   id: 2003,
//   "name": "Butterfly on Swordtip",
//   "type": 11
// },
// 2004: {
//   "name": "Swirl of Heavenly Spear",
//   "type": 11
// },
// 4001: {
//   "name": "Stellar Warp",
//   "type": 2
// }

