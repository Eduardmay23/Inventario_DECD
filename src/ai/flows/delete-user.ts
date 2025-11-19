
'use server';
/**
 * @fileOverview A Genkit flow to securely delete a Firebase user.
 *
 * - deleteUser - A function that handles the complete user deletion process.
 * - DeleteUserInput - The input type for the deleteUser function.
 * - DeleteUserOutput - The return type for the deleteUser function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import * as admin from 'firebase-admin';
import { firebaseConfig } from '@/firebase/config';

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: `https://${firebaseConfig.projectId}.firebaseio.com`,
  });
}

const DeleteUserInputSchema = z.object({
  uid: z.string().describe('The UID of the user to delete.'),
});
export type DeleteUserInput = z.infer<typeof DeleteUserInputSchema>;

const DeleteUserOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});
export type DeleteUserOutput = z.infer<typeof DeleteUserOutputSchema>;

export async function deleteUser(input: DeleteUserInput): Promise<DeleteUserOutput> {
  return deleteUserFlow(input);
}

const deleteUserFlow = ai.defineFlow(
  {
    name: 'deleteUserFlow',
    inputSchema: DeleteUserInputSchema,
    outputSchema: DeleteUserOutputSchema,
  },
  async ({ uid }) => {
    try {
      await admin.auth().deleteUser(uid);
      return {
        success: true,
        message: `Successfully deleted user ${uid} from Firebase Authentication.`,
      };
    } catch (error: any) {
      console.error(`Failed to delete user ${uid}:`, error);
      return {
        success: false,
        message: error.message || 'An unknown error occurred while deleting the user.',
      };
    }
  }
);
