import {Banner} from '../core/model/banner';

export class Banners {
  public static readonly banners: Banner[] = [
    {
      id: 2003,
      name: 'Butterfly on Swordtip',
      typeName: 'Character event',
      type: 11,
      legendaryId: 1102,
      rareIds: [1105, 1106, 1109]
    },
    {
      id: 2004,
      name: 'Swirl of Heavenly Spear',
      typeName: 'Character event',
      type: 11,
      legendaryId: 'jingyuan',
      rareIds: [1202, 1206, 1001]
    },
    {
      id: 2005,
      name: 'Contract Zero',
      typeName: 'Character event',
      type: 11,
      legendaryId: 'silverwolf',
      rareIds: [1002, 1009, 1103]
    },
    {
      id: 2007,
      name: 'A lost soul',
      typeName: 'Character event',
      type: 11,
      legendaryId: 'blade',
      rareIds: [1008, 1206, 1105]
    },
    {
      id: 1001,
      name: null,
      typeName: 'Stellar Warp',
      type: 1,
      legendaryId: 0,
      rareIds: []
    },
    {
      id: 4001,
      name: null,
      typeName: 'Departure warp',
      type: 2,
      legendaryId: 0,
      rareIds: []
    },
    {
      id: 3003,
      name: null,
      typeName: 'Light cone warp',
      type: 12,
      legendaryId: 0,
      rareIds: []
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

