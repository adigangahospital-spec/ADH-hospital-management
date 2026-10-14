import { Bed, OPDRecord, IPDAdmission, ClinicalNote, LabReport, DischargeBill, BirthCertificate, TriageRecord } from '../types';
import { DEFAULT_BEDS } from '../data/initialData';

const STORAGE_KEYS = {
  BEDS: 'adiganga_beds_state',
  OPD: 'adiganga_opd_records',
  IPD: 'adiganga_ipd_records',
  CLINICAL: 'adiganga_clinical_records',
  LAB: 'adiganga_lab_records',
  DISCHARGE: 'adiganga_discharge_records',
  BIRTH: 'adiganga_birth_records',
  TRIAGE: 'adiganga_triage_records',
};

export const storageService = {
  getBeds(): Bed[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BEDS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Failed reading beds from localStorage', e);
    }
    return DEFAULT_BEDS;
  },

  saveBeds(beds: Bed[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.BEDS, JSON.stringify(beds));
    } catch (e) {
      console.error('Failed saving beds', e);
    }
  },

  getRecords<T>(key: keyof typeof STORAGE_KEYS, defaultVal: T[] = []): T[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS[key]);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn(`Failed reading ${key}`, e);
    }
    return defaultVal;
  },

  saveRecord<T>(key: keyof typeof STORAGE_KEYS, item: T) {
    try {
      const existing = this.getRecords<T>(key);
      const updated = [item, ...existing];
      localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error(`Failed saving ${key}`, e);
      return [];
    }
  },

  getTotalRecordsCount(): number {
    let count = 0;
    (['OPD', 'IPD', 'CLINICAL', 'LAB', 'DISCHARGE', 'BIRTH', 'TRIAGE'] as (keyof typeof STORAGE_KEYS)[]).forEach(k => {
      count += this.getRecords(k).length;
    });
    return count;
  }
};
