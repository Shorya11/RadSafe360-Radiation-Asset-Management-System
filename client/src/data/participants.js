/** @typedef {'core' | 'certified_rso'} ParticipantRole */

/**
 * @typedef {Object} Participant
 * @property {string} id
 * @property {string} name
 * @property {string} [email]
 * @property {string} [mobile]
 * @property {string} departmentId
 * @property {ParticipantRole} defaultRole
 */

/** @type {Participant[]} — derived from RSO meeting sheets (Raigarh CG) */
export const PARTICIPANTS = [
  {
    id: 'p-lalit',
    name: 'Lalit Kumar Goyal',
    email: 'lalit.goyal@jindalsteel.com',
    mobile: '9827477098',
    departmentId: 'cac',
    defaultRole: 'core',
  },
  {
    id: 'p-dhirendra',
    name: 'Dhirendra Prasad Kushwaha',
    email: 'dhirendra.kushwaha@jindalsteel.com',
    mobile: '8827477099',
    departmentId: 'cme-hese',
    defaultRole: 'core',
  },
  {
    id: 'p-rajeev',
    name: 'Rajeev Soni',
    email: 'rajeev.soni@jindalsteelodisha.com',
    mobile: '9777449834',
    departmentId: 'ohs',
    defaultRole: 'core',
  },
  {
    id: 'p-mandeep',
    name: 'Mandeep Rajput',
    email: 'mandeep.rajput@jindalsteel.com',
    mobile: '9109137541',
    departmentId: 'bf-2',
    defaultRole: 'certified_rso',
  },
  {
    id: 'p-bhishma',
    name: 'Bhishma Patel',
    email: 'bhisma.patel@jindalsteel.com',
    mobile: '8827427237',
    departmentId: 'bf-1',
    defaultRole: 'certified_rso',
  },
  {
    id: 'p-saurabh',
    name: 'Saurabh Tiwari',
    email: 'saurabh.tiwari@jindalsteel.com',
    mobile: '9425522401',
    departmentId: 'bf-1',
    defaultRole: 'certified_rso',
  },
  {
    id: 'p-nikhilesh',
    name: 'Nikhilesh Gawhade',
    email: 'nikhilesh.gawhade@jindalsteel.com',
    mobile: '9109979148',
    departmentId: 'sms-3',
    defaultRole: 'certified_rso',
  },
  {
    id: 'p-mohan',
    name: 'S Mohan Iyer',
    email: 'mohan.iyer@jindalsteel.com',
    mobile: '9109979175',
    departmentId: 'sms-2',
    defaultRole: 'certified_rso',
  },
  {
    id: 'p-ritesh',
    name: 'Ritesh Rai',
    email: 'ritesh.rai@jindalsteel.com',
    mobile: '8827477306',
    departmentId: 'sinter',
    defaultRole: 'certified_rso',
  },
  {
    id: 'p-suraj',
    name: 'Suraj Yadav',
    email: 'suraj.yadav@jindalsteel.com',
    mobile: '9109956841',
    departmentId: 'plate-mill',
    defaultRole: 'certified_rso',
  },
  {
    id: 'p-sagar',
    name: 'Sagar Vinayak Wanve',
    email: 'sagar.wanve@jindalsteel.in',
    mobile: '9109979042',
    departmentId: 'plate-mill',
    defaultRole: 'certified_rso',
  },
  {
    id: 'p-sanjay',
    name: 'Sanjay Kumar',
    email: 'sanjay.kumar@jindalsteel.com',
    mobile: '9109979120',
    departmentId: 'power-plant',
    defaultRole: 'certified_rso',
  },
  {
    id: 'p-kanhiya',
    name: 'Kanhiya Maurya',
    email: 'kanhiya.maurya@jindalsteel.com',
    mobile: '9109979088',
    departmentId: 'coal-washry',
    defaultRole: 'certified_rso',
  },
  {
    id: 'p-simanchal',
    name: 'Simanchal Panda',
    email: 'simanchal.panda@jindalsteel.com',
    mobile: '9437123456',
    departmentId: 'ohs',
    defaultRole: 'certified_rso',
  },
  {
    id: 'p-prasanta',
    name: 'Prasanta Kumar Mishra',
    email: 'prasanta.mishra@jindalsteel.com',
    mobile: '9437890123',
    departmentId: 'sms-2',
    defaultRole: 'certified_rso',
  },
]

export const PARTICIPANT_BY_ID = Object.fromEntries(
  PARTICIPANTS.map((p) => [p.id, p]),
)
