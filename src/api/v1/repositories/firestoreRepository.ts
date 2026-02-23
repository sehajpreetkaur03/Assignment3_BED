import { db } from "../../../../config/firebaseConfig";

export const createDocument = async <T>(
  collectionName: string,
  data: Partial<T>,
  docId?: string
): Promise<string> => {
  try {
    if (docId) {
      await db.collection(collectionName).doc(docId).set(data);
      return docId;
    }
    const docRef = await db.collection(collectionName).add(data);
    return docRef.id;
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to create document in ${collectionName}: ${msg}`);
  }
};

export const getAllDocuments = async <T>(collectionName: string): Promise<T[]> => {
  try {
    const snapshot = await db.collection(collectionName).get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as T) })) as T[];
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to retrieve documents in ${collectionName}: ${msg}`);
  }
};

export const getDocById = async <T>(
  collectionName: string,
  docId: string
): Promise<T | null> => {
  try {
    const snapshot = await db.collection(collectionName).doc(docId).get();
    if (!snapshot.exists) return null;
    return { id: snapshot.id, ...(snapshot.data() as T) } as T;
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to retrieve document in ${collectionName}: ${msg}`);
  }
};

export const updateDocument = async <T>(
  collectionName: string,
  docId: string,
  data: Partial<T>
): Promise<void> => {
  try {
    await db.collection(collectionName).doc(docId).update(data);
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to update document in ${collectionName}: ${msg}`);
  }
};

export const deleteDocument = async (
  collectionName: string,
  docId: string
): Promise<void> => {
  try {
    await db.collection(collectionName).doc(docId).delete();
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to delete document in ${collectionName}: ${msg}`);
  }
};