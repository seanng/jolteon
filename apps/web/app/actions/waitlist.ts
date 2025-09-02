'use server';

import { env } from '@/env';
import { google } from 'googleapis';

export const addToWaitlist = async (
  email: string
): Promise<{
  error?: string;
  success?: boolean;
}> => {
  if (!email) {
    return { error: 'Email is required.' };
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL,
        private_key: env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(
          /\\n/g,
          '\n'
        ),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId: env.GOOGLE_SHEET_ID,
      range: 'A1', // This will append to the first empty row of the first sheet
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[email, new Date().toISOString()]],
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Error adding to waitlist:', error);
    return { error: 'Something went wrong. Please try again later.' };
  }
};
