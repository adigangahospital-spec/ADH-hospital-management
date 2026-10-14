import { HOSPITAL_INFO } from '../data/initialData';

export async function syncToGoogleSheet(sheetName: string, rowData: (string | number)[]): Promise<{ success: boolean; message: string }> {
  try {
    const formData = new URLSearchParams();
    formData.append('sheetName', sheetName);
    formData.append('rowData', JSON.stringify(rowData));

    await fetch(HOSPITAL_INFO.appsScriptUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    return {
      success: true,
      message: `Successfully synchronized to Google Sheet "${sheetName}"!`,
    };
  } catch (error) {
    console.error('Google Sheet sync error:', error);
    return {
      success: false,
      message: 'Network issue syncing with Google Sheet. Record saved locally.',
    };
  }
}
