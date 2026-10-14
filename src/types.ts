export type DeviceType = 'ios' | 'android' | 'fullscreen';

export type MainTabType = 'beds' | 'opd' | 'ipd' | 'clinicallab' | 'billing' | 'birthtriage' | 'export';

export interface Bed {
  id: number;
  name: string;
  ward: 'ICU Ward' | 'HDU Ward' | 'Male Gen Ward' | 'Female Gen Ward' | 'Private Deluxe';
  rate: number;
  status: 'vacant' | 'occupied';
  patient?: {
    name: string;
    ipdNo: string;
    date: string;
    gender: 'Male' | 'Female' | 'Other';
    age: string;
    diagnosis?: string;
    doctor?: string;
  } | null;
}

export interface OPDRecord {
  id: string;
  uhid: string;
  timestamp: string;
  name: string;
  age: string;
  gender: string;
  phone: string;
  department: string;
  doctor: string;
  vitals: string;
  complaints: string;
}

export interface IPDAdmission {
  id: string;
  ipdNo: string;
  bedName: string;
  bedCost: number;
  timestamp: string;
  name: string;
  age: string;
  gender: string;
  diagnosis: string;
  doctor: string;
  advance: number;
  attendant: string;
}

export interface ClinicalNote {
  id: string;
  timestamp: string;
  bed: string;
  patientName: string;
  shift: string;
  nurse: string;
  orders: string;
  observations: string;
}

export interface LabReport {
  id: string;
  labId: string;
  patientName: string;
  ageGender: string;
  doctor: string;
  sampleDate: string;
  tests: string[];
  findings: string;
}

export interface DischargeBill {
  id: string;
  billNo: string;
  ipdNo: string;
  patientName: string;
  doctor: string;
  finalDiagnosis: string;
  condition: string;
  costs: {
    bed: number;
    icu: number;
    doctor: number;
    nursing: number;
    ot: number;
    surgeon: number;
    anesthesia: number;
    lab: number;
    radiology: number;
    medicines: number;
    nst: number;
    pediatrician: number;
  };
  discount: number;
  advance: number;
  gross: number;
  subtotal: number;
  net: number;
  advice: string;
  date: string;
}

export interface BirthCertificate {
  id: string;
  regNo: string;
  dateOfIssue: string;
  motherIpd: string;
  deliveryType: string;
  childName: string;
  gender: string;
  dob: string;
  time: string;
  weight: string;
  gynecologist: string;
  pediatrician: string;
}

export interface TriageRecord {
  id: string;
  timestamp: string;
  patientName: string;
  ageGender: string;
  priority: 'RED - Critical / Immediate (Priority 1)' | 'YELLOW - Urgent (Priority 2)' | 'GREEN - Non-Urgent (Priority 3)';
  complaints: string;
  action: string;
}
