import { Bed } from '../types';

export const HOSPITAL_INFO = {
  name: 'ADIGANGA HOSPITAL',
  location: 'Chihut, Infront of Tarwan Gumti, Punpun, Patna - 804453',
  phone: '+91 7484970813',
  emergency: '24x7 Emergency Services Available',
  stationId: 'AGH/PATNA/2026',
  appsScriptUrl: 'https://script.google.com/macros/s/AKfycbwrox5DbixSh-AzxvOSxZU5yoo7x0PD7IISYT58Jd6WTsMPElIR29J6BnBtzKteNSGR/exec',
};

export const DEFAULT_BEDS: Bed[] = [
  {
    id: 1,
    name: 'Bed 01',
    ward: 'ICU Ward',
    rate: 2500,
    status: 'occupied',
    patient: {
      name: 'Rameshwar Prasad',
      ipdNo: 'AGH/IPD/2026/501',
      date: '12/10/2026',
      gender: 'Male',
      age: '58',
      diagnosis: 'Severe Pneumonia with Dyspnea',
      doctor: 'Dr. S. K. Verma'
    }
  },
  {
    id: 2,
    name: 'Bed 02',
    ward: 'ICU Ward',
    rate: 2500,
    status: 'vacant',
    patient: null
  },
  {
    id: 3,
    name: 'Bed 03',
    ward: 'HDU Ward',
    rate: 2000,
    status: 'occupied',
    patient: {
      name: 'Smt. Sunita Devi',
      ipdNo: 'AGH/IPD/2026/502',
      date: '13/10/2026',
      gender: 'Female',
      age: '42',
      diagnosis: 'Acute Gastroenteritis & Dehydration',
      doctor: 'Dr. Anita Roy'
    }
  },
  {
    id: 4,
    name: 'Bed 04',
    ward: 'HDU Ward',
    rate: 2000,
    status: 'vacant',
    patient: null
  },
  {
    id: 5,
    name: 'Bed 05',
    ward: 'Male Gen Ward',
    rate: 1000,
    status: 'vacant',
    patient: null
  },
  {
    id: 6,
    name: 'Bed 06',
    ward: 'Male Gen Ward',
    rate: 1000,
    status: 'vacant',
    patient: null
  },
  {
    id: 7,
    name: 'Bed 07',
    ward: 'Female Gen Ward',
    rate: 1000,
    status: 'vacant',
    patient: null
  },
  {
    id: 8,
    name: 'Bed 08',
    ward: 'Female Gen Ward',
    rate: 1000,
    status: 'vacant',
    patient: null
  },
  {
    id: 9,
    name: 'Bed 09',
    ward: 'Private Deluxe',
    rate: 3500,
    status: 'occupied',
    patient: {
      name: 'Pooja Kumari',
      ipdNo: 'AGH/IPD/2026/503',
      date: '13/10/2026',
      gender: 'Female',
      age: '26',
      diagnosis: 'Post-Elective LSCS (Day 1)',
      doctor: 'Dr. Meena Singh'
    }
  },
  {
    id: 10,
    name: 'Bed 10',
    ward: 'Private Deluxe',
    rate: 3500,
    status: 'vacant',
    patient: null
  }
];

export const DEPARTMENTS = [
  'General OPD',
  'Pediatrics',
  'Orthopedics',
  'Cardiology',
  'Gynecology & Obstetrics',
  'General Surgery',
  'ENT',
  'Emergency & Trauma'
];

export const LAB_PANELS = [
  'CBC (Complete Blood Count)',
  'Blood Sugar Fasting/PP',
  'LFT (Liver Function Test)',
  'KFT (Kidney Function Test)',
  'X-Ray Chest PA',
  '12-Lead ECG',
  'USG Abdomen & Pelvis',
  'Urine Routine & Microscopic',
  'Lipid Profile',
  'Widal / Typhoid Test',
  'Serum Electrolytes',
  'Dengue NS1 / IgM'
];
