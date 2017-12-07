import DS from 'ember-data'; 
const { Model, attr, belongsTo } = DS;


export default Model.extend({

  user: belongsTo({ async: true }),

  name: attr('string'),
  status: attr('string'),
  desc: attr('string'),
  projectUrl: attr('string'),
  mapcNotes: attr('string'),
  tagline: attr('string'),
  address: attr('string'),
  state: attr('string'),
  zipCode: attr('string'),
  parcelId: attr('string'),
  programs: attr('string'),
  municipality: attr('string'),

  height: attr('number'),
  stories: attr('number'),
  yearCompl: attr('number'),
  prjarea: attr('number'),
  singfamhu: attr('number'),
  twnhsmmult: attr('number'),
  lgmultifam: attr('number'),
  tothu: attr('number'),
  gqpop: attr('number'),
  rptdemp: attr('number'),
  emploss: attr('number'),
  estemp: attr('number'),
  commsf: attr('number'),
  hotelrms: attr('number'),
  onsitepark: attr('number'),
  totalCost: attr('number'),
  teamMembershipCount: attr('number'),
  faRet: attr('number'),
  faOfcmd: attr('number'),
  faIndmf: attr('number'),
  faWhs: attr('number'),
  faRnd: attr('number'),
  faEdinst: attr('number'),
  faOther: attr('number'),
  faHotel: attr('number'),
  otherRate: attr('number'),
  affordable: attr('number'),
  latitude: attr('number'),
  longitude: attr('number'),

  rdv: attr('bool'),
  asofright: attr('bool'),
  over55: attr('bool'),
  clusteros: attr('bool'),
  phased: attr('bool'),
  stalled: attr('bool'),
  cancelled: attr('bool', { default: false }),
  private: attr('bool', { default: false }),
  fortyB: attr('bool'),
  mixedUse: attr('bool'),

  residential: attr('bool'),
  commercial: attr('bool'),

  createdAt: attr('date'),
  updatedAt: attr('date'),

});
