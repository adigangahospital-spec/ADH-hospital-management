export const REACT_NATIVE_FILES = {
  'App.tsx': `import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, StatusBar, TouchableOpacity, ScrollView, TextInput, Alert, Modal } from 'react-native';
import { 
  Bed, 
  Activity, 
  Users, 
  FileText, 
  CreditCard, 
  AlertTriangle, 
  Plus, 
  Printer, 
  CheckCircle2, 
  ChevronRight,
  Baby
} from 'lucide-react-native';

// AdiGanga Hospital React Native Mobile Application
// Chihut, Infront of Tarwan Gumti, Punpun, Patna - 804453
// Contact: +91 7484970813

interface BedItem {
  id: number;
  name: string;
  ward: string;
  rate: number;
  status: 'vacant' | 'occupied';
  patient?: {
    name: string;
    ipdNo: string;
    date: string;
  } | null;
}

const INITIAL_BEDS: BedItem[] = [
  { id: 1, name: 'Bed 01', ward: 'ICU Ward', rate: 2500, status: 'occupied', patient: { name: 'Rameshwar Prasad', ipdNo: 'AGH/IPD/2026/501', date: '12/10/2026' } },
  { id: 2, name: 'Bed 02', ward: 'ICU Ward', rate: 2500, status: 'vacant', patient: null },
  { id: 3, name: 'Bed 03', ward: 'HDU Ward', rate: 2000, status: 'occupied', patient: { name: 'Sunita Devi', ipdNo: 'AGH/IPD/2026/502', date: '13/10/2026' } },
  { id: 4, name: 'Bed 04', ward: 'HDU Ward', rate: 2000, status: 'vacant', patient: null },
  { id: 5, name: 'Bed 05', ward: 'Male Gen Ward', rate: 1000, status: 'vacant', patient: null },
  { id: 6, name: 'Bed 06', ward: 'Male Gen Ward', rate: 1000, status: 'vacant', patient: null },
  { id: 7, name: 'Bed 07', ward: 'Female Gen Ward', rate: 1000, status: 'vacant', patient: null },
  { id: 8, name: 'Bed 08', ward: 'Female Gen Ward', rate: 1000, status: 'vacant', patient: null },
  { id: 9, name: 'Bed 09', ward: 'Private Deluxe', rate: 3500, status: 'occupied', patient: { name: 'Pooja Kumari', ipdNo: 'AGH/IPD/2026/503', date: '13/10/2026' } },
  { id: 10, name: 'Bed 10', ward: 'Private Deluxe', rate: 3500, status: 'vacant', patient: null },
];

export default function App() {
  const [currentTab, setCurrentTab] = useState<'beds' | 'opd' | 'ipd' | 'billing'>('beds');
  const [beds, setBeds] = useState<BedItem[]>(INITIAL_BEDS);
  
  // OPD Form State
  const [opdName, setOpdName] = useState('');
  const [opdAge, setOpdAge] = useState('');
  const [opdPhone, setOpdPhone] = useState('');
  const [opdDoctor, setOpdDoctor] = useState('Dr. S. K. Verma');
  const [opdComplaints, setOpdComplaints] = useState('');

  // IPD Admission Modal
  const [selectedBed, setSelectedBed] = useState<BedItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [admitName, setAdmitName] = useState('');

  const occupiedCount = beds.filter(b => b.status === 'occupied').length;

  const handleVacate = (id: number) => {
    setBeds(prev => prev.map(b => b.id === id ? { ...b, status: 'vacant', patient: null } : b));
    Alert.alert('Bed Vacated', 'Bed is now clean and available for admission.');
  };

  const handleAdmit = () => {
    if (!admitName || !selectedBed) {
      Alert.alert('Missing Field', 'Please enter patient name.');
      return;
    }
    setBeds(prev => prev.map(b => b.id === selectedBed.id ? {
      ...b,
      status: 'occupied',
      patient: {
        name: admitName,
        ipdNo: \`AGH/IPD/2026/\${Math.floor(100 + Math.random() * 900)}\`,
        date: new Date().toLocaleDateString()
      }
    } : b));
    setModalVisible(false);
    setAdmitName('');
    Alert.alert('Patient Admitted', \`Patient assigned to \${selectedBed.name}\`);
  };

  const handleSaveOPD = () => {
    if (!opdName) {
      Alert.alert('Required', 'Patient name is mandatory.');
      return;
    }
    Alert.alert('OPD Registered', \`UHID AGH/OPD/\${Date.now().toString().slice(-4)} generated for \${opdName}\`);
    setOpdName('');
    setOpdAge('');
    setOpdPhone('');
    setOpdComplaints('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      
      {/* Native Hospital Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>ADIGANGA HOSPITAL</Text>
          <Text style={styles.headerSubtitle}>Punpun, Patna - 804453 | +91 7484970813</Text>
        </View>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>{occupiedCount}/10 BEDS</Text>
        </View>
      </View>

      {/* Screen Body */}
      <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: 100 }}>
        {currentTab === 'beds' && (
          <View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>10-Bed Ward & ICU Matrix</Text>
              <Text style={styles.sectionMeta}>{10 - occupiedCount} Vacant</Text>
            </View>

            {beds.map((bed) => (
              <View key={bed.id} style={[styles.bedCard, bed.status === 'occupied' ? styles.bedOccupied : styles.bedVacant]}>
                <View style={styles.bedTop}>
                  <View>
                    <Text style={styles.bedWard}>{bed.ward}</Text>
                    <Text style={styles.bedName}>{bed.name}</Text>
                  </View>
                  <View style={[styles.statusTag, bed.status === 'occupied' ? styles.tagOccupied : styles.tagVacant]}>
                    <Text style={bed.status === 'occupied' ? styles.tagTextOccupied : styles.tagTextVacant}>
                      {bed.status.toUpperCase()}
                    </Text>
                  </View>
                </View>

                {bed.status === 'occupied' && bed.patient ? (
                  <View style={styles.patientBox}>
                    <Text style={styles.patientName}>👤 {bed.patient.name}</Text>
                    <Text style={styles.patientDetail}>IPD: {bed.patient.ipdNo} · Adm: {bed.patient.date}</Text>
                    <TouchableOpacity style={styles.vacateBtn} onPress={() => handleVacate(bed.id)}>
                      <Text style={styles.vacateBtnText}>Vacate Bed</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity 
                    style={styles.admitBtn} 
                    onPress={() => { setSelectedBed(bed); setModalVisible(true); }}
                  >
                    <Text style={styles.admitBtnText}>Assign Bed (₹{bed.rate}/d)</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        )}

        {currentTab === 'opd' && (
          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Outpatient OPD Registration</Text>
            
            <Text style={styles.label}>Patient Full Name *</Text>
            <TextInput 
              style={styles.input} 
              placeholder="e.g. Ramesh Chandra" 
              value={opdName} 
              onChangeText={setOpdName} 
            />

            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.label}>Age (Yrs)</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="35" 
                  keyboardType="numeric"
                  value={opdAge} 
                  onChangeText={setOpdAge} 
                />
              </View>
              <View style={{ flex: 1.5 }}>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="10-digit Mobile" 
                  keyboardType="phone-pad"
                  value={opdPhone} 
                  onChangeText={setOpdPhone} 
                />
              </View>
            </View>

            <Text style={styles.label}>Consulting Doctor</Text>
            <TextInput 
              style={styles.input} 
              value={opdDoctor} 
              onChangeText={setOpdDoctor} 
            />

            <Text style={styles.label}>Chief Complaints & Vitals</Text>
            <TextInput 
              style={[styles.input, { height: 70 }]} 
              placeholder="Fever, cough x 3 days | BP: 120/80" 
              multiline 
              value={opdComplaints} 
              onChangeText={setOpdComplaints} 
            />

            <TouchableOpacity style={styles.primaryBtn} onPress={handleSaveOPD}>
              <Text style={styles.primaryBtnText}>Register & Generate OPD Slip</Text>
            </TouchableOpacity>
          </View>
        )}

        {currentTab === 'billing' && (
          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Final Discharge & Bill Calculator</Text>
            <Text style={styles.helperText}>Calculates bed stay, ICU, nursing, doctor visits, medicines and discounts.</Text>
            
            <View style={styles.billSummaryBox}>
              <Text style={styles.billLine}>Room Charges: ₹7,500.00</Text>
              <Text style={styles.billLine}>Doctor Visits: ₹2,000.00</Text>
              <Text style={styles.billLine}>Nursing Care: ₹1,500.00</Text>
              <Text style={styles.billLine}>Pharmacy & OT: ₹6,300.00</Text>
              <View style={styles.divider} />
              <Text style={styles.billTotal}>Gross Total: ₹17,300.00</Text>
              <Text style={styles.billAdvance}>Less Advance Paid: - ₹5,000.00</Text>
              <Text style={styles.billNet}>NET PAYABLE: ₹12,300.00</Text>
            </View>

            <TouchableOpacity style={styles.primaryBtn} onPress={() => Alert.alert('Bill Generated', 'Bill AGH/BL/2026/102 ready to print.')}>
              <Text style={styles.primaryBtnText}>Print Official Discharge Bill</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Modal for Quick Bed Admission */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Admit to {selectedBed?.name}</Text>
            <Text style={styles.modalSubtitle}>{selectedBed?.ward} · ₹{selectedBed?.rate}/day</Text>
            
            <Text style={styles.label}>Patient Full Name</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Enter patient name" 
              value={admitName} 
              onChangeText={setAdmitName} 
            />

            <View style={styles.row}>
              <TouchableOpacity style={[styles.modalBtn, styles.cancelBtn]} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, styles.confirmBtn]} onPress={handleAdmit}>
                <Text style={styles.confirmBtnText}>Confirm Admission</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Native Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => setCurrentTab('beds')}
        >
          <Bed size={22} color={currentTab === 'beds' ? '#0d9488' : '#64748b'} />
          <Text style={[styles.navText, currentTab === 'beds' && styles.navTextActive]}>10 Beds</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => setCurrentTab('opd')}
        >
          <Users size={22} color={currentTab === 'opd' ? '#0d9488' : '#64748b'} />
          <Text style={[styles.navText, currentTab === 'opd' && styles.navTextActive]}>OPD</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => setCurrentTab('billing')}
        >
          <CreditCard size={22} color={currentTab === 'billing' ? '#0d9488' : '#64748b'} />
          <Text style={[styles.navText, currentTab === 'billing' && styles.navTextActive]}>Billing</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#0f172a',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    color: '#94a3b8',
    fontSize: 10,
    marginTop: 2,
  },
  headerBadge: {
    backgroundColor: '#134e4a',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#14b8a6',
  },
  headerBadgeText: {
    color: '#2dd4bf',
    fontSize: 11,
    fontWeight: '700',
  },
  body: {
    flex: 1,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  sectionMeta: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
  },
  bedCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
  },
  bedVacant: {
    borderColor: '#e2e8f0',
  },
  bedOccupied: {
    borderColor: '#fecdd3',
    backgroundColor: '#fff1f2',
  },
  bedTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bedWard: {
    fontSize: 10,
    color: '#64748b',
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  bedName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 2,
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagVacant: {
    backgroundColor: '#dcfce7',
  },
  tagOccupied: {
    backgroundColor: '#ffe4e6',
  },
  tagTextVacant: {
    color: '#15803d',
    fontSize: 10,
    fontWeight: '800',
  },
  tagTextOccupied: {
    color: '#b91c1c',
    fontSize: 10,
    fontWeight: '800',
  },
  admitBtn: {
    backgroundColor: '#0d9488',
    paddingVertical: 9,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  admitBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  patientBox: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#fecdd3',
  },
  patientName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e293b',
  },
  patientDetail: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  vacateBtn: {
    backgroundColor: '#e11d48',
    paddingVertical: 6,
    borderRadius: 6,
    marginTop: 8,
    alignItems: 'center',
  },
  vacateBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
    marginTop: 10,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    color: '#0f172a',
    backgroundColor: '#ffffff',
  },
  row: {
    flexDirection: 'row',
  },
  primaryBtn: {
    backgroundColor: '#0d9488',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 16,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  billSummaryBox: {
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    padding: 12,
    marginTop: 12,
  },
  billLine: {
    fontSize: 12,
    color: '#334155',
    marginBottom: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#cbd5e1',
    marginVertical: 6,
  },
  billTotal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  billAdvance: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
    marginTop: 2,
  },
  billNet: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f766e',
    marginTop: 4,
  },
  helperText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 64,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 4,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 64,
  },
  navText: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
    marginTop: 2,
  },
  navTextActive: {
    color: '#0d9488',
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0f172a',
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 8,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 14,
  },
  cancelBtn: {
    backgroundColor: '#f1f5f9',
    marginRight: 8,
  },
  confirmBtn: {
    backgroundColor: '#0d9488',
  },
  cancelBtnText: {
    color: '#475569',
    fontWeight: '600',
  },
  confirmBtnText: {
    color: '#ffffff',
    fontWeight: '700',
  },
});
`,
  'package.json': `{
  "name": "adiganga-hospital-mobile",
  "version": "1.0.0",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "build:apk": "eas build -p android --profile preview"
  },
  "dependencies": {
    "expo": "~52.0.0",
    "expo-status-bar": "~2.0.0",
    "react": "18.3.1",
    "react-native": "0.76.6",
    "lucide-react-native": "^0.475.0",
    "react-native-svg": "15.8.0",
    "@react-native-async-storage/async-storage": "1.23.1"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0",
    "@types/react": "~18.3.12",
    "typescript": "^5.3.3"
  },
  "private": true
}`,
  'eas.json': `{
  "cli": {
    "version": ">= 12.0.0"
  },
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  }
}`,
  'app.json': `{
  "expo": {
    "name": "AdiGanga Hospital",
    "slug": "adiganga-hospital",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#0f172a"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.adigangahospital.patna"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#0f172a"
      },
      "package": "com.adigangahospital.patna"
    }
  }
}`,
  'GoogleAppsScript_API.gs': `/**
 * AdiGanga Hospital - Google Apps Script Web App API
 * Deploy this in Google Sheets: Extensions > Apps Script > Deploy > New Deployment > Web App
 * Access: Anyone
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheetName = e.parameter.sheetName || "Default";
    var rowData = JSON.parse(e.parameter.rowData || "[]");

    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    }

    sheet.appendRow(rowData);

    return ContentService.createTextOutput(JSON.stringify({
      status: "SUCCESS",
      message: "Row appended to " + sheetName
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "ERROR",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
`,
  'README.md': `# AdiGanga Hospital Mobile App (React Native & Android APK Guide)

## Method 1: Instant 1-Tap Install on Android / iPhone (No PC Required)
Open this web link on your mobile browser (Chrome on Android or Safari on iPhone):
1. On Android: Tap Chrome menu (3 dots ⋮) -> **"Install App"** or **"Add to Home screen"**.
2. On iPhone: Tap Safari **Share** icon -> **"Add to Home Screen"**.
The hospital app will immediately install as an offline-ready mobile application on your phone!

---

## Method 2: Build Direct Android APK File (.apk) with EAS
To generate a standalone installable \`.apk\` file:

\`\`\`bash
# 1. Install EAS CLI
npm install -g eas-cli

# 2. Login to your free Expo account
eas login

# 3. Build standalone APK
eas build -p android --profile preview
\`\`\`
Expo will compile the app in the cloud and give you a direct download link to install \`adiganga-hospital.apk\` on your Android device!

---

## Method 3: Instant Live Preview with Expo Go
1. Install **Expo Go** from Google Play Store or Apple App Store.
2. Run \`npx expo start\` in this directory.
3. Scan the QR code in your terminal with the Expo Go app.
`
};
