import { ProduceItem, FarmCluster, BatchTrace, FarmerProfile, ChatMessage, OrderRecord } from '../types';

export const INITIAL_PRODUCE: ProduceItem[] = [
  {
    id: 'apl-902',
    name: 'Organic Shimla Royal Apples',
    category: 'fruits',
    badge: 'Himachal GI Tag',
    batchId: '#APL-902',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCURZmuoNAUvhjn4Zj7ASUYehv3AFO7Gt0rsKdjWD4g2idjFjRkfTZuorvkWKBd9CPbUyq3UPNXAR-J_WQEVVx5y4AOXvFEufpqdataSEkBTqk3K5NKATQmZ6JOXczWHYlYdzcNBJTg-dOPzGWDirIv_uZ_dSMAj4VSis3kOQU_wLdsq6Q0TvYAr6XT3NScxgpTTrMee5DNWja-6D7W0q2yk_TpusRFlB4nvCW43j4PpNnsCrewIqdbdA',
    harvestTime: 'Harvested 18h ago',
    harvestHoursAgo: 18,
    origin: 'Kinnaur Valley',
    farmer: 'Rajesh Sharma Orchards',
    price: 220,
    unit: 'kg',
    growerSharePercent: 99,
    accreditation: ['NPOP Accredited (Govt of India)', 'Jaivik Bharat Logo'],
    distanceKm: 85,
    inStock: true,
    description: 'Crisp, high-altitude Royal Delicious apples with natural dew drops, zero synthetic wax coating.'
  },
  {
    id: 'tom-104',
    name: 'Nashik Red Vine Tomatoes',
    category: 'leafy',
    badge: 'Direct Picked',
    batchId: '#TOM-104',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4IciR2N6oOLCymUnphg00HPgZt0s9wp9K61DOuVu1RnEULOYHo8M-VXvGqw9n8SECD7QUYdINzzeXElda48BgfghtNg9Eg98Ff--5DfvMiIVSilqgKYKxCXYEIrHf3O_y7zaMG4wZW_Gb_6Mj1BzyyPjTMKh8scF-67YqVylE0SiS6BdRgHmj194wQdRHjd6cwKggF5ivOvQDvN5s24GJcnB18A_rVybFA3zcyl78MKYN2Q8_vYqqkQ',
    harvestTime: 'Picked 4h ago',
    harvestHoursAgo: 4,
    origin: 'Nashik Agro Belt',
    farmer: 'Ramesh Patel Farm',
    price: 45,
    unit: 'kg',
    growerSharePercent: 99,
    accreditation: ['NPOP Accredited (Govt of India)', 'PGS-India Participatory'],
    distanceKm: 42,
    inStock: true,
    description: 'Plump, sun-ripened red organic vine tomatoes clinging to fresh green stems in an earthen basket.'
  },
  {
    id: 'let-308',
    name: 'Hydroponic Butterhead Lettuce',
    category: 'leafy',
    badge: 'Living Root Intact',
    batchId: '#LET-308',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkdgh_DGCPamtyXwiKn9kjUTxm5b6JmiPsPbT9Tl8VbAoBwRb4ben_VdmzFdAO5VAlvXWl9aGdTHnUIHEZkFmKpkjaQ29NbW5CsH1yR-dlMV1-_MSxfwDN27fdBw6yZEr2PdIW4Vpjwm92mR2rtACRnAobqLUouGvWWatuGMher4420tDmvfDrbL6KwtsmVwaI2kqZM7jV0ZXD0AlumiyQlijabwOxPM81RMC2sz7wO8HgQVR2kk_hRw',
    harvestTime: 'Harvested 3h ago',
    harvestHoursAgo: 3,
    origin: 'Pune Micro-Greenhouse',
    farmer: 'EcoHarvest Hydroponics',
    price: 65,
    unit: 'bunch',
    growerSharePercent: 99,
    accreditation: ['Zero Chemical Hydroponic', 'Jaivik Bharat Logo'],
    distanceKm: 28,
    inStock: true,
    description: 'Vibrant curly green Butterhead lettuce with living roots intact placed in sterile organic setting.'
  },
  {
    id: 'mlk-881',
    name: 'Pure Raw A2 Gir Cow Milk',
    category: 'dairy',
    badge: '4°C Chilled Unpasteurized',
    batchId: '#MLK-881',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB836-7dWpy3UbZazFY0KEzGt5ix8c030WmPRWmXTT-VbGgnNCozPx9EOi3n8pr9zBINle5tXX0RE4blBoTu7jm6xo3xa7YTiAKb8b_Gbsu1dvU18TT9DIuSlX6ckSWR2POW3Zx03CYExLLR31AxtkV4xWZfk_0somP2kW7SlpgfIKSzCFxNHosPhlFaMYz0CEPTvKdFYNgustgN11Kh5DMqTpB9L88TVntTCqCLHKYV-sd2tdAt8koew',
    harvestTime: 'Milked 5:00 AM',
    harvestHoursAgo: 2,
    origin: 'Baramati Pastures',
    farmer: 'Nandini Organic Dairy',
    price: 95,
    unit: 'Litre',
    growerSharePercent: 99,
    accreditation: ['NPOP Accredited (Govt of India)', 'Jaivik Bharat Logo'],
    distanceKm: 65,
    inStock: true,
    description: 'Pure rich creamy raw A2 cow milk from free-range pastured Gir cows in glass bottles.'
  },
  {
    id: 'org-550',
    name: 'Nagpur GI Sweet Oranges',
    category: 'fruits',
    badge: 'Nagpur GI Santra',
    batchId: '#ORG-550',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZJCL3X6r8tJzGjQkM7owHETuqqU-H1RyrB12N6HJIQypUxTPrt7PALZbDRyPgF1Rd6XNsrreX_VD1dvR5aqNdT3mhi-Fu24C635XqwJKz1u5Pvl2QaUUk1VJYpvBlI2NNGZDqNFBTW__Nsnh6xh8l7oe8Xpu5RYy9zXwZub3r_VtgZH3hb7L9Jk2BLU0tRX0NhDdDUnsrnPc92stUnD75S82Zau6tUumNn1Nhc0nMkY_soTNGLzGgzw',
    harvestTime: 'Plucked 12h ago',
    harvestHoursAgo: 12,
    origin: 'Vidarbha Organic Hub',
    farmer: 'Vidarbha Agro Collective',
    price: 140,
    unit: 'kg',
    growerSharePercent: 99,
    accreditation: ['NPOP Accredited (Govt of India)', 'PGS-India Participatory'],
    distanceKm: 120,
    inStock: true,
    description: 'Crisp freshly plucked Nagpur mandarin oranges with bright green leaves attached in woven cane tray.'
  },
  {
    id: 'mng-012',
    name: 'Devgad Alphonso Mango Crate',
    category: 'fruits',
    badge: 'GI Tag Devgad',
    batchId: '#MNG-012',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTwE6xxS62A5eXK1c11AYmhNLnDnN69Q9VrCPqVXRNmSGwL50GXLjpw7R9mYzpPu3on93QLP9WnohVaBhlB9ch6zbuuTzA1E4Qrj1UifZ_NQP9MudgKD2DxYJJoGt6VhzLqRq_-gzPRGSvqOeAFhHRPY4aP17JOjtSZ4b_oC5qyoKVP8I6eAb5mitOWyCsHK6KiJv5NN7cKXfU4gc2G2GUbohZ6JGZyqHhh_rAkvgeUVI8ijVIkdeOUQ',
    harvestTime: 'Tree Ripened',
    harvestHoursAgo: 20,
    origin: 'Devgad Coastal Belt',
    farmer: 'Konkan Heritage Orchards',
    price: 850,
    unit: '3kg box',
    growerSharePercent: 99,
    accreditation: ['NPOP Accredited (Govt of India)', 'Jaivik Bharat Logo'],
    distanceKm: 140,
    inStock: true,
    description: 'Golden-yellow Devgad Alphonso mangoes cushioned in natural rice straw in authentic wooden crate.'
  },
  {
    id: 'spn-773',
    name: 'Organic Baby Spinach (Palak)',
    category: 'leafy',
    badge: 'Dawn Harvest',
    batchId: '#SPN-773',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdJ6xclTltEHkTV9l9AeqX3IW27OnnYdCO8DPwi1F0bRTkVcJRGp5AhteqJQGQdh39FYjHQWZsDJaNdec1onZpjgf8CwRWSUcPy41VP3oJQaYjm-SZsLxcJTngWGpkxebYSVW-eYDn1xgGwkwJZC-MO-QCmE_Hxba6WBwX4d-U_mHw8UNUfSpCpeLFe4DHgMWFlr06CY6t8DsjGBgYOzsqplYwchGaCyZYu5fQTHQURh3GOWDtkxFK-A',
    harvestTime: 'Harvested dawn today',
    harvestHoursAgo: 5,
    origin: 'Pune Riverbed Agro',
    farmer: 'Kisan Vikas Mandali',
    price: 40,
    unit: 'bunch (250g)',
    growerSharePercent: 99,
    accreditation: ['NPOP Accredited (Govt of India)', 'PGS-India Participatory'],
    distanceKm: 34,
    inStock: true,
    description: 'Crisp lush tender organic baby spinach leaves freshly harvested tied with natural jute twine.'
  },
  {
    id: 'oil-611',
    name: 'Wood-Churned Pure Mustard Oil',
    category: 'special',
    badge: 'Wood-Churned Kohlus',
    batchId: '#OIL-611',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2WNtgTSh-6q6Eqi4kSR3MAMKkq2gvpJ_2A1DoDgzKGzat6kATXSpmxYFmV4UwbQGja1xOmiV3vagTaBe4z8IjrJt377YedQESZFTfZ3YZ2pLHq-0VLH1DkfyqFvNUsDAHUMagxVPsvJWd26kQO_eVg-e72Vx8OVaZjLsx3RfvhW2PohwdsR6lNqVFoEu3SlDtbdx5EZz0USVkTD5QK0nGN5cT-qniMZ_gfXvQE6E9tTfQhynVKibbqg',
    harvestTime: 'Pressed 24h ago',
    harvestHoursAgo: 24,
    origin: 'Rajasthan Heritage Mill',
    farmer: 'Shekhawati Artisanal Press',
    price: 280,
    unit: '1L Glass Bottle',
    growerSharePercent: 99,
    accreditation: ['NPOP Accredited (Govt of India)', 'Jaivik Bharat Logo'],
    distanceKm: 145,
    inStock: true,
    description: 'Rich golden yellow cold-pressed artisanal mustard oil wood-churned at <38°C to retain pungent essential enzymes.'
  }
];

export const REGIONAL_CLUSTERS: FarmCluster[] = [
  {
    id: 'sahyadri',
    name: 'Sahyadri Syndicate',
    region: 'Nashik Valley',
    pin: '422003',
    status: 'Dispatching Now',
    farmersCount: 42,
    crops: ['Tomatoes', 'Grapes', 'Spinach'],
    acreage: 180,
    soilNpk: 94,
    coordinates: '19.9975° N, 73.7898° E',
    transitHours: 4.5,
    leadFarmer: 'Ramesh Patel',
    leadFarmerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPj6nKLIfjo-hqdH7pGkGyrV2Y9mUC17sFdkcqCp9LKS7n9uNFOaCXCn8Kyam0BNt_oetrYpDc6MSTJxI7GUOcXHzebFVPS5m_PeEzgayd4O1hQsG72KTv4TNvMDJWXSlnKqNlQ9lWKY2elSywpuomzXGqrAVgjO-EB_Qrw9QxPjC1OtGxQgYDj8Xqr8Bp8TJeU_jys0MSyMZGvWO5oFAlZL1lxLIpxQ-NoQoj61gZMjPnwJ4ak6h8aQ',
    bio: 'Federation of 48 certified smallholder farmers • Direct D2C logistics corridor',
    chemicalResiduePpm: 0.00,
    humusPercent: 1.42
  },
  {
    id: 'malwa',
    name: 'Malwa Black Soil Collective',
    region: 'Indore Region',
    pin: '452010',
    status: 'Harvest Tomorrow',
    farmersCount: 65,
    crops: ['Sharbati Wheat', 'Mustard'],
    acreage: 340,
    soilNpk: 91,
    coordinates: '22.7196° N, 75.8577° E',
    transitHours: 11.2,
    leadFarmer: 'Devendra Malviya',
    leadFarmerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDn8pi7SOQImuAqbRQZOxUl3W1-o3S3aA8BZCMBB2tZg4BgGjy0U-ZHGN4hHBUTyGl9v6edVHz3NR8XTceDTDjBVMYDAAa29ZF36fmWkSpIrx09avFzOvQxz9J0fANLSfSoyoSiV4Gqj9zkH1TdFGrGv---W7fabwE4v2fawv8mY2FSVc54sgLNdXHBKRCvUlAK_gbl8f6xL9wRVXPoCj1eRxBvfM25qsBcepIkSp22M0nySz-jRY63Vw',
    bio: 'Heavy black cotton soil collective specializing in heirloom wheat and organic cold-pressed mustard.',
    chemicalResiduePpm: 0.00,
    humusPercent: 1.35
  },
  {
    id: 'konkan',
    name: 'Konkan Coastal Groves',
    region: 'Ratnagiri Foothills',
    pin: '415612',
    status: 'Curing Lots',
    farmersCount: 28,
    crops: ['Cashew', 'Moringa', 'Spices'],
    acreage: 110,
    soilNpk: 88,
    coordinates: '16.9902° N, 73.3120° E',
    transitHours: 7.8,
    leadFarmer: 'Konkan Agro Lead',
    leadFarmerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGwtYg_v0zjk2Q-dMNnRlIWLuHgBQYAc-NEVFHxQ6eMwLOAIdcB23icl5UMpVcuo0TyQznwqUTIR6-2Umepy25sdncUMCZ4Mg-1S0_7kpwP2X-FCiMxhGFRHy4t0lwFLur7G9wIdJZwXfBP7QMhLOOShy5tW8CI2oLYhKMK9llV_aTOw9bnYZ8rJwEBEATPS0rPyS48DKoZRlI-2Oq7RFpSgL8LhNt33J4bgPBAwIVLkyHoUki45OL6Q',
    bio: 'Coastal belt organic micro-orchards utilizing coastal sea-mist microclimates and laterite soils.',
    chemicalResiduePpm: 0.00,
    humusPercent: 1.58
  },
  {
    id: 'krishna',
    name: 'Krishna River Agro Basin',
    region: 'Sangli Plains',
    pin: '416416',
    status: 'Dormant cycle',
    farmersCount: 19,
    crops: ['Turmeric', 'Jaggery', 'Pulses'],
    acreage: 95,
    soilNpk: 89,
    coordinates: '16.8524° N, 74.5815° E',
    transitHours: 8.5,
    leadFarmer: 'Suresh Kadam',
    leadFarmerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdqD-TscARYhdR8hpmyZbsDFZ0RdYC2FNFrEM0khyOYcKrv8W5eeVc9jOssvAqll7F55uksAAhfaa3z3LcU2od_Eq5UfzHglx1CbF4bH6kFxcEwSXTKVEwcbWqdM8zLC8QDRF4Rs2CY2ao7_DZt9dHYxs5Z6aL4Q3ZTlTmkQXbWAOnFwcFDBA-3AtN71npSNtLB_fcZVGHBwisam4RwPTuyA0n7199Khy-JP8BBVPzSstCTkc57C3ypQ',
    bio: 'Riverbed alluvial farms using solar drip irrigation for ancient Salem turmeric and medicinal wild herbs.',
    chemicalResiduePpm: 0.00,
    humusPercent: 1.48
  }
];

export const BATCH_DATA: Record<string, BatchTrace> = {
  '#NSK-8821': {
    batchId: '#NSK-8821',
    title: 'Heirloom Roma Tomatoes (Batch #NSK-8821)',
    origin: 'Origin: Plot 3B • Sahyadri Syndicate, Nashik Valley • Consignment Vol: 450 Kgs',
    consignmentVol: '450 Kgs',
    coldChainTemp: '4.2°C Stable',
    eta: 'Today, 02:30 PM',
    iconEmoji: '🍅',
    stages: [
      {
        stageNumber: '01',
        category: 'PLANTING',
        title: 'Seed & Sowing Selection',
        description: 'Non-GMO indigenous heirloom seeds planted on Nov 12 at Field Block 3B. Registered germination rate: 96.8%.',
        timestamp: 'Nov 12 • 08:00 AM',
        icon: 'eco'
      },
      {
        stageNumber: '02',
        category: 'BIO-NOURISHMENT',
        title: 'Growth & Bio-Fertilizer Cycle',
        description: 'Jeevamrutha organic ferment compost applied weekly. Zero synthetic growth accelerators or organophosphates.',
        timestamp: 'Weekly Applied',
        icon: 'compost'
      },
      {
        stageNumber: '03',
        category: 'FIELD PLUCKING',
        title: 'Harvest at Peak Brix Sugar',
        description: 'Plucked today 05:45 AM by Farmer Ramesh Patel & harvesting crew. Ambient field morning temp: 18.5°C.',
        timestamp: 'Today • 05:45 AM',
        statusBadge: 'Fresh Pick',
        icon: 'agriculture'
      },
      {
        stageNumber: '04',
        category: 'PACKHOUSE VERIFICATION',
        title: 'Quality Sorting & Grading A+',
        description: 'Grade A+ sorting completed at Nashik Farm Packhouse. Washed in ozonated water mist; infrared sugar refractometer brix 6.4.',
        timestamp: 'Today • 07:15 AM',
        icon: 'fact_check'
      },
      {
        stageNumber: '05',
        category: 'IN TRANSIT',
        title: 'Cold-Chain Dispatch',
        description: 'Reefer refrigerated van MH-15-EG-4402 loaded at steady 4.2°C at 08:30 AM en route to Bandra West Hub, Mumbai.',
        timestamp: '4.2°C Stable • 08:30 AM',
        statusBadge: 'Live GPS Reefer',
        icon: 'local_shipping',
        isColdChain: true
      }
    ]
  },
  '#IND-4419': {
    batchId: '#IND-4419',
    title: 'Golden Sharbati Wheat Flour (Batch #IND-4419)',
    origin: 'Origin: Parcel 8A • Malwa Black Soil Collective, Indore • Consignment Vol: 1,200 Kgs',
    consignmentVol: '1,200 Kgs',
    coldChainTemp: 'Ambient Dry (21°C)',
    eta: 'Tomorrow, 09:00 AM',
    iconEmoji: '🌾',
    stages: [
      {
        stageNumber: '01',
        category: 'SEED ORIGIN',
        title: 'Ancient Sharbati Seedline',
        description: 'Indigenous drought-resilient seed strain preserved for 4 generations in Malwa plains.',
        timestamp: 'Oct 04 • Field Log',
        icon: 'grain'
      },
      {
        stageNumber: '02',
        category: 'NATURAL CULTIVATION',
        title: 'Rainfed Black Soil Nutrition',
        description: 'Grown exclusively on retained rainwater with cow urine and neem cake pest repellents.',
        timestamp: '90-Day Cycle',
        icon: 'spa'
      },
      {
        stageNumber: '03',
        category: 'STONE GRINDING',
        title: 'Slow Cold-Stone Chakkis',
        description: 'Stone ground at <30 RPM to retain wheat germ, natural endosperm oils, and fiber.',
        timestamp: 'Yesterday • 04:00 PM',
        icon: 'filter_drama'
      },
      {
        stageNumber: '04',
        category: 'LAB CLEARANCE',
        title: 'Gluten & Purity Audit',
        description: 'Moisture 9.8%, protein 13.2%, 0.00 chemical pesticide detected by SGS accredited lab.',
        timestamp: 'Yesterday • 08:30 PM',
        icon: 'science'
      },
      {
        stageNumber: '05',
        category: 'ECO-PACKED DISPATCH',
        title: 'Sealed Unbleached Jute Bags',
        description: 'Consignment palletized in solar van on NH-3 highway heading to Mumbai.',
        timestamp: 'Today • 06:10 AM',
        icon: 'local_shipping'
      }
    ]
  },
  '#RTN-9022': {
    batchId: '#RTN-9022',
    title: 'Wild Konkan Raw Forest Honey (Batch #RTN-9022)',
    origin: 'Origin: Micro-Groves Sector C • Konkan Foothills • Consignment Vol: 180 Liters',
    consignmentVol: '180 Liters',
    coldChainTemp: 'Dry Store 24°C',
    eta: 'Today, 06:00 PM',
    iconEmoji: '🍯',
    stages: [
      {
        stageNumber: '01',
        category: 'FORAGING',
        title: 'Native Apis Cerana Flora',
        description: 'Collected from wild Jamun, Karvi, and Acacia blooms in Western Ghats reserves.',
        timestamp: 'March 18',
        icon: 'forest'
      },
      {
        stageNumber: '02',
        category: 'COLD EXTRACTION',
        title: 'Raw Gravity Settling',
        description: 'Zero heat treatment or micro-filtration; retains raw pollen grains, bee propolis, and live enzymes.',
        timestamp: 'March 22',
        icon: 'water_drop'
      },
      {
        stageNumber: '03',
        category: 'PURITY SPECTROMETRY',
        title: 'C-4 Sugar & NMR Purity Score',
        description: 'Tested 100% pure authentic nectar with zero invert sugar adulteration.',
        timestamp: 'March 25',
        icon: 'verified'
      },
      {
        stageNumber: '04',
        category: 'BOTTLING',
        title: 'Sterilized Amber Glass Jars',
        description: 'Hermetically capped with natural cork seal and lot identification QR stamp.',
        timestamp: 'Yesterday • 11:00 AM',
        icon: 'inventory_2'
      },
      {
        stageNumber: '05',
        category: 'TRANSIT',
        title: 'Courier Express Dispatch',
        description: 'Direct van delivery from Ratnagiri to Mumbai collection hub.',
        timestamp: 'Today • 04:30 AM',
        icon: 'local_shipping'
      }
    ]
  }
};

export const FARMER_PROFILES: Record<string, FarmerProfile> = {
  'ramesh': {
    id: 'ramesh',
    name: 'Ramesh Patel',
    role: 'Lead Farmer & Agro Collective Steward',
    farmName: 'Patel Natural Organics',
    location: 'Nashik Sector 4, Maharashtra',
    distanceKm: 142,
    rating: 4.9,
    reviewCount: 340,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrYVwyksGn8MIJkXTo81PfoqJ_6mrI57ANW5a0g_E3iJvp48cdAftf7vdmHstoK0g49hlNm07p_qtd75-OyiDCC1xxRb_P0-a55r1VsaWi9M35VgAEmTc4mqp74Sni7on8_CXtFn34QbeOBCp750d8DWA30CjlOQtcRYa4sA8dQcGo2OrOGgr4xzZd-K8jtFd69bg_euR9oEqNsRsKh688yOAZuf8HC74V3cmFbgSgQ9RNQrJ6N4mgXw',
    verified: true,
    seasonsCount: 19,
    escrowFulfillmentPercent: 99.4,
    acreage: 8.5,
    soilWater: 'Black Cotton • Borewell pH 7.2',
    quote: 'We pick before sunrise and dispatch before noon. Your food should never sit in intermediate wholesale mandis.',
    seasonalHarvests: ['San Marzano Tomatoes', 'Crisp Karela', 'Country Dhaniya', 'Fenugreek Leaves'],
    certifications: [
      'PGS-India Certified Organic (#PGS-99238)',
      'Zero Chemical Residue Lab Tested 2025'
    ],
    directItems: [
      {
        id: 'dir-tom',
        name: 'Vine Tomatoes',
        description: 'Picked at dawn • 1kg crate',
        price: 68,
        unit: 'kg',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDgFjzQNkhD82lFlZ_A07R-AvQU-PTz4rAvYXjqnj7F-Bim-Qjw9Ah9DarGOV4Ji7vSjLrwNxypYWtA6b2FEScTTmb3Fmy4hRTpYloEZoOSIv0HL-k5GJlD1ag4kaHgjAxz0neBvaz2GkLYdTb-9O5Hgw-ezliu62-LC6XTOj9yyCS1ZHbFvp4_zrwsCeRnRuvFFc0mIvJw9jqufHhirG5vhgKnyzorqNFlEFgaSh-VCK_7ha01a_DIEw'
      },
      {
        id: 'dir-kar',
        name: 'Crisp Small Karela',
        description: 'Field 2 • 500g bunch',
        price: 42,
        unit: 'pack',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC13FgjkMSPfLgAQj1qHBVQQVoE7jtsFzDTxFF1cgm2OJqgZ-8rO64hJ5cKrK4gwEveMqvjgK0ioD4UVUSC0t7rAU1ZZS-Ny_1o_a0yBmDBhY_pRkhzMtquAZsRcB9acsAOGq7zb42KYg9Om_fUwdW8mLKZa_Ir16vhPHkP5oCbSCN75HaTEHrb2xapXlO281uAw0BV8pWXsqFTdyFEkrq8c4e4Gt37Zg-SBTHsibhCMCBBKXPGfLGe8Q'
      },
      {
        id: 'dir-dhn',
        name: 'Country Dhaniya Bunch',
        description: 'Intense aroma • 250g',
        price: 25,
        unit: 'bunch',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtvtjmo-pOhQCWWB8qWMGFg8WMq7Xizj6e-9ufYYhWpAMpbv6nuI7BHPLb-cWaCSTNAyFuKFhlQdIiLG1kf3UhLWEeHoXTr_FGElWzUmqIsRoagpDeANIiwdj396UtiV_gpTomiNRasfZuMfFs9A4ks-cDl6gr-PzNQt1pwHBS4x7uYrn7RcBJRVtV0ptMd0sw6xQS_E_NXSLLGK_4OOLZWyXoYEQhBvunNqM3T6f8PG4uWBXlgTLXJQ'
      }
    ]
  },
  'savita': {
    id: 'savita',
    name: 'Savita Shinde',
    role: 'Organic Orchard Steward',
    farmName: 'Shinde Natural Orchards',
    location: 'Dindori, Nashik',
    distanceKm: 135,
    rating: 4.9,
    reviewCount: 184,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGwtYg_v0zjk2Q-dMNnRlIWLuHgBQYAc-NEVFHxQ6eMwLOAIdcB23icl5UMpVcuo0TyQznwqUTIR6-2Umepy25sdncUMCZ4Mg-1S0_7kpwP2X-FCiMxhGFRHy4t0lwFLur7G9wIdJZwXfBP7QMhLOOShy5tW8CI2oLYhKMK9llV_aTOw9bnYZ8rJwEBEATPS0rPyS48DKoZRlI-2Oq7RFpSgL8LhNt33J4bgPBAwIVLkyHoUki45OL6Q',
    verified: true,
    seasonsCount: 12,
    escrowFulfillmentPercent: 99.8,
    acreage: 24,
    soilWater: 'Red Loam • Micro-Mist Irrigation',
    quote: '“Cultivating Bhagwa pomegranates and cold-pressed cold-hardened jaggery with ancestral bio-cultures. 12 years pesticide-free.”',
    seasonalHarvests: ['Bhagwa Pomegranate', 'Desi Lemons', 'Wild Turmeric'],
    certifications: ['NPOP Certified Organic', 'Jaivik Bharat'],
    directItems: []
  },
  'arjun': {
    id: 'arjun',
    name: 'Arjun Deshmukh',
    role: 'Hydro-Organic Pioneer',
    farmName: 'Godavari Hydro-Organic',
    location: 'Niphad, Maharashtra',
    distanceKm: 155,
    rating: 4.8,
    reviewCount: 212,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByGS1c7EaI2coVrAY7HCparhjcyfrRmABRsYraEkzGftgS6Wi3Kuc63LZRUfd-pz2IYZGflqQ1tNf3Lhe5zykX-HQieHGDQYUupVnmk5CVCF6FKw9fJUzXAsxkj61tFSsHVyOibo2eAJy76sX3g0yoY9vWNw_PcN5Dd15YG2vd8k4cWQdBT8Ge7XwIk5iJ-dndoMxwC7WEWhwUhw-LEHbQU0C7bgmNlzS-J4yVIDF61MAQBpX1xoRm8w',
    verified: true,
    seasonsCount: 8,
    escrowFulfillmentPercent: 98.9,
    acreage: 36,
    soilWater: 'Hydro-Sterile • Solar Chilled Water',
    quote: '“Microgreens, crisp baby spinach and heirloom broccoli. Harvested at sunrise and cooled in solar chambers within 30 minutes.”',
    seasonalHarvests: ['Baby Spinach', 'Sweet Basil', 'Purple Cabbage'],
    certifications: ['Zero Chemical Hydroponic', 'FSSAI High Hygiene'],
    directItems: []
  },
  'mahadev': {
    id: 'mahadev',
    name: 'Mahadev Rao',
    role: 'Indigenous Seed Preserver',
    farmName: 'Deola Heritage Seeds Collective',
    location: 'Deola, Nashik',
    distanceKm: 170,
    rating: 5.0,
    reviewCount: 340,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdqD-TscARYhdR8hpmyZbsDFZ0RdYC2FNFrEM0khyOYcKrv8W5eeVc9jOssvAqll7F55uksAAhfaa3z3LcU2od_Eq5UfzHglx1CbF4bH6kFxcEwSXTKVEwcbWqdM8zLC8QDRF4Rs2CY2ao7_DZt9dHYxs5Z6aL4Q3ZTlTmkQXbWAOnFwcFDBA-3AtN71npSNtLB_fcZVGHBwisam4RwPTuyA0n7199Khy-JP8BBVPzSstCTkc57C3ypQ',
    verified: true,
    seasonsCount: 35,
    escrowFulfillmentPercent: 100,
    acreage: 52,
    soilWater: 'Alluvial Loam • Well Water pH 7.4',
    quote: '“Preserving 24 native varieties of onions, garlic, and cold-pressed groundnut oils using stone kolhu expellers run on solar energy.”',
    seasonalHarvests: ['Nashik Red Onions', 'Cold Wood-Pressed Oil', 'Native Garlic'],
    certifications: ['Heritage Seed Bank Accredited', 'PGS-India Participatory'],
    directItems: []
  }
};

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'farmer',
    farmerId: 'ramesh',
    text: 'Namaste Priya ji! Just finished picking these vine tomatoes from field 4. Extra firm, vibrant red, and sweet!',
    timestamp: '07:18 AM',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdCPYbV4VwYBwcbd7wfa4vNs5tKpvdYSDeD1I1s8uxMvcLUv-YHCMaHGmQSLDD8HSjf2JM5HryeRwWBKrooRjevFIWEJlpfEBCfhuiBicF2OsUvl0XFqd3LCey8d4SydzMu0gE6WdzQx6-0f61E4jJtyYXBjqoZtDV1sih_toZCMZPEUYAM28MZ6kFATg1VU3dDz7mc-aNzySlugcHjl_KXOvckrQt3KROwVyyX24Wg9sUMOv39pHk3g',
    photoCaption: 'Field 4 • 07:15 AM Live Snap'
  },
  {
    id: 'msg-2',
    sender: 'farmer',
    farmerId: 'ramesh',
    text: 'Voice Note: Explaining our sour buttermilk & neem oil bio-spray instead of pesticides',
    timestamp: '07:22 AM',
    audioDuration: '0:34'
  },
  {
    id: 'msg-3',
    sender: 'consumer',
    text: 'Thank you Ramesh! The harvest looks marvelous. Could you please ensure they are packed in biodegradable crates? We preserve them for kitchen composting.',
    timestamp: '07:40 AM'
  },
  {
    id: 'msg-4',
    sender: 'system',
    text: 'Reefer Truck Departed',
    timestamp: '08:45 AM',
    systemTelemetry: {
      title: 'Dispatch Reefer Truck Departed',
      hub: 'Nashik Rural Hub • Reefer Unit #RE-4402',
      temp: '3.8°C (Optimal)',
      eta: 'Today, 3:30 PM'
    }
  },
  {
    id: 'msg-5',
    sender: 'farmer',
    farmerId: 'ramesh',
    text: 'Bilkul Priya ji! 100% unbleached pulp cartons lined with vetiver grass used. Safe travels for your harvest!',
    timestamp: '08:52 AM'
  }
];

export const INITIAL_ORDERS: OrderRecord[] = [
  {
    id: 'FD-8921',
    date: '30 Sep 2026',
    items: [
      { name: 'Vine-Ripened Country Tomatoes', quantity: 3, price: 45, farmerName: 'Ramesh Patel Farm' },
      { name: 'Hydroponic Baby Spinach', quantity: 2, price: 40, farmerName: 'Ramesh Patel Farm' },
      { name: 'Organic Shimla Royal Delicious Apples', quantity: 2, price: 220, farmerName: 'Green Valley Orchards' },
      { name: 'Raw Pure A2 Gir Cow Milk', quantity: 2, price: 95, farmerName: 'Nandini Organic Pastoral Dairy' }
    ],
    subtotal: 845.00,
    logisticsFee: 45.00,
    platformFee: 8.45,
    discount: 0,
    total: 898.45,
    escrowStatus: 'Locked',
    reeferTemp: '3.8°C',
    slot: 'Today 11:30 AM – 1:00 PM',
    driverName: 'Santosh Yadav',
    vanNumber: 'MH-15-EG-4402',
    eta: 'Today 12:15 PM'
  },
  {
    id: 'FD-8740',
    date: '26 Sep 2026',
    items: [
      { name: 'Devgad Alphonso Mango Crate', quantity: 1, price: 850, farmerName: 'Konkan Heritage Orchards' },
      { name: 'Wood-Churned Pure Mustard Oil', quantity: 1, price: 280, farmerName: 'Shekhawati Artisanal Press' }
    ],
    subtotal: 1130.00,
    logisticsFee: 30.00,
    platformFee: 11.30,
    discount: 50.00,
    total: 1121.30,
    escrowStatus: 'Inspected & Released',
    reeferTemp: 'Ambient Dry',
    slot: 'Delivered',
    driverName: 'Mahesh K.',
    vanNumber: 'MH-04-AX-9912',
    eta: 'Delivered (Priya Sharma accepted)',
    rating: 5,
    reviewComment: 'Incredible sweetness in the Alphonso mangoes and authentic wood-pressed mustard oil aroma. Perfectly packed.',
    ratedAt: '26 Sep 2026'
  },
  {
    id: 'FD-8512',
    date: '18 Sep 2026',
    items: [
      { name: 'A2 Gir Cow Cultured Bilona Ghee', quantity: 1, price: 580, farmerName: 'Nandini Organic Pastoral Dairy' },
      { name: 'Vine-Ripened Country Tomatoes', quantity: 2, price: 45, farmerName: 'Ramesh Patel Farm' },
      { name: 'Hydroponic Baby Spinach', quantity: 2, price: 40, farmerName: 'Ramesh Patel Farm' }
    ],
    subtotal: 750.00,
    logisticsFee: 40.00,
    platformFee: 7.50,
    discount: 0,
    total: 797.50,
    escrowStatus: 'Inspected & Released',
    reeferTemp: '4.1°C',
    slot: 'Delivered',
    driverName: 'Santosh Yadav',
    vanNumber: 'MH-15-EG-4402',
    eta: 'Delivered & Inspected'
  },
  {
    id: 'FD-8304',
    date: '09 Sep 2026',
    items: [
      { name: 'Organic Shimla Royal Delicious Apples', quantity: 3, price: 220, farmerName: 'Green Valley Orchards' },
      { name: 'Raw Pure A2 Gir Cow Milk', quantity: 3, price: 95, farmerName: 'Nandini Organic Pastoral Dairy' }
    ],
    subtotal: 945.00,
    logisticsFee: 35.00,
    platformFee: 9.45,
    discount: 0,
    total: 989.45,
    escrowStatus: 'Inspected & Released',
    reeferTemp: '3.6°C',
    slot: 'Delivered',
    driverName: 'Vikram Joshi',
    vanNumber: 'MH-12-BQ-8819',
    eta: 'Delivered & Inspected'
  },
  {
    id: 'FD-8120',
    date: '28 Aug 2026',
    items: [
      { name: 'Stone-Ground Sharbati Atta', quantity: 2, price: 160, farmerName: 'Malwa Black Soil Collective' },
      { name: 'Wood-Churned Pure Mustard Oil', quantity: 2, price: 280, farmerName: 'Shekhawati Artisanal Press' },
      { name: 'Vine-Ripened Country Tomatoes', quantity: 3, price: 45, farmerName: 'Ramesh Patel Farm' }
    ],
    subtotal: 1015.00,
    logisticsFee: 40.00,
    platformFee: 10.15,
    discount: 40.00,
    total: 1025.15,
    escrowStatus: 'Inspected & Released',
    reeferTemp: 'Ambient Dry',
    slot: 'Delivered',
    driverName: 'Santosh Yadav',
    vanNumber: 'MH-15-EG-4402',
    eta: 'Delivered & Inspected'
  },
  {
    id: 'FD-7980',
    date: '15 Aug 2026',
    items: [
      { name: 'Raw Pure A2 Gir Cow Milk', quantity: 4, price: 95, farmerName: 'Nandini Organic Pastoral Dairy' },
      { name: 'Hydroponic Baby Spinach', quantity: 3, price: 40, farmerName: 'Ramesh Patel Farm' },
      { name: 'Organic Shimla Royal Delicious Apples', quantity: 1, price: 220, farmerName: 'Green Valley Orchards' }
    ],
    subtotal: 720.00,
    logisticsFee: 35.00,
    platformFee: 7.20,
    discount: 0,
    total: 762.20,
    escrowStatus: 'Inspected & Released',
    reeferTemp: '3.9°C',
    slot: 'Delivered',
    driverName: 'Vikram Joshi',
    vanNumber: 'MH-12-BQ-8819',
    eta: 'Delivered & Inspected'
  }
];

export interface ConsumptionDataPoint {
  period: string;
  spending: number;
  ordersCount: number;
  farmerDirect: number;
  kgProduce: number;
}

export const WEEKLY_CONSUMPTION_TREND: ConsumptionDataPoint[] = [
  { period: 'W1 Aug', spending: 640, ordersCount: 1, farmerDirect: 602, kgProduce: 4.8 },
  { period: 'W2 Aug', spending: 762, ordersCount: 1, farmerDirect: 717, kgProduce: 6.2 },
  { period: 'W3 Aug', spending: 480, ordersCount: 1, farmerDirect: 452, kgProduce: 3.5 },
  { period: 'W4 Aug', spending: 1025, ordersCount: 2, farmerDirect: 965, kgProduce: 9.4 },
  { period: 'W1 Sep', spending: 520, ordersCount: 1, farmerDirect: 489, kgProduce: 4.2 },
  { period: 'W2 Sep', spending: 989, ordersCount: 2, farmerDirect: 931, kgProduce: 8.1 },
  { period: 'W3 Sep', spending: 798, ordersCount: 1, farmerDirect: 751, kgProduce: 6.5 },
  { period: 'W4 Sep', spending: 2020, ordersCount: 2, farmerDirect: 1902, kgProduce: 14.8 }
];

export const MONTHLY_CONSUMPTION_TREND: ConsumptionDataPoint[] = [
  { period: 'Apr 2026', spending: 1850, ordersCount: 3, farmerDirect: 1740, kgProduce: 16.5 },
  { period: 'May 2026', spending: 2420, ordersCount: 4, farmerDirect: 2280, kgProduce: 21.0 },
  { period: 'Jun 2026', spending: 2100, ordersCount: 3, farmerDirect: 1980, kgProduce: 18.2 },
  { period: 'Jul 2026', spending: 2890, ordersCount: 5, farmerDirect: 2720, kgProduce: 24.8 },
  { period: 'Aug 2026', spending: 2907, ordersCount: 5, farmerDirect: 2736, kgProduce: 23.9 },
  { period: 'Sep 2026', spending: 4327, ordersCount: 6, farmerDirect: 4073, kgProduce: 33.6 }
];

export const CATEGORY_SPENDING_BREAKDOWN = [
  { name: 'A2 Dairy & Cultured Ghee', value: 3850, percentage: 32, color: '#006c49', itemsCount: 18 },
  { name: 'Heirloom Fruits & Orchards', value: 3420, percentage: 28, color: '#10b981', itemsCount: 14 },
  { name: 'Fresh Farm Greens & Veggies', value: 2780, percentage: 23, color: '#38bdf8', itemsCount: 22 },
  { name: 'Wood-Pressed Oils & Grains', value: 2040, percentage: 17, color: '#f59e0b', itemsCount: 9 }
];
