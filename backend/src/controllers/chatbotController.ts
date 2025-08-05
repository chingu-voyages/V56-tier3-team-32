import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const executeDbQuery = async (
  query: any,
  collection: string,
  operation: string = 'find'
): Promise<any> => {
  let readonlyConnection: mongoose.Connection | null = null;
  
  try {
    const readonlyUri = process.env.SURGERY_DATABASE_CONNECTION_READONLY_CREDENTIALS;
    
    if (!readonlyUri) {
      throw new Error('Readonly database connection string not found in environment variables');
    }

    readonlyConnection = mongoose.createConnection(readonlyUri);
    
    await new Promise((resolve, reject) => {
      readonlyConnection!.once('open', resolve);
      readonlyConnection!.once('error', reject);
    });

    const db = readonlyConnection.db;
    if (!db) {
      throw new Error('Failed to access database from connection');
    }
    const targetCollection = db.collection(collection);

    const method = targetCollection[operation as keyof typeof targetCollection] as any;
    
    if (typeof method !== 'function') {
      throw new Error(`Unsupported operation: ${operation}`);
    }
    
    let result = await method(query);
    
    if (result && typeof result.toArray === 'function') {
      result = await result.toArray();
    }

    return {
      success: true,
      data: result,
      collection,
      operation,
      queryExecutedAt: new Date().toISOString()
    };

  } catch (error: any) {
    console.error('Database query execution error:', error);
    return {
      success: false,
      error: error.message,
      collection,
      operation,
      queryExecutedAt: new Date().toISOString()
    };
  } finally {
    if (readonlyConnection) {
      await readonlyConnection.close();
    }
  }
};
