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

export const getDatabaseSchema = async (): Promise<any> => {
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

    const collections = await db.listCollections().toArray();
    const schemaInfo: any = {
      databaseName: db.databaseName,
      collections: {},
      retrievedAt: new Date().toISOString()
    };

    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      const collection = db.collection(collectionName);
      
      const documentCount = await collection.countDocuments().catch(() => 0);
      
      const sampleDocs = await collection.find({}).limit(2).toArray();
      
      const fieldTypes: any = {};
      if (sampleDocs.length > 0) {
        sampleDocs.forEach(doc => {
          Object.keys(doc).forEach(key => {
            const value = doc[key];
            const type = Array.isArray(value) ? 'array' : typeof value;
            if (!fieldTypes[key]) {
              fieldTypes[key] = new Set();
            }
            fieldTypes[key].add(type);
          });
        });

        Object.keys(fieldTypes).forEach(key => {
          fieldTypes[key] = Array.from(fieldTypes[key]);
        });
      }

      schemaInfo.collections[collectionName] = {
        name: collectionName,
        documentCount: documentCount,
        fields: fieldTypes,
        sampleDocuments: sampleDocs.map(doc => {
          const { _id, ...docWithoutId } = doc;
          return docWithoutId;
        }).slice(0, 2)
      };
    }

    return {
      success: true,
      data: schemaInfo
    };

  } catch (error: any) {
    console.error('Database schema retrieval error:', error);
    return {
      success: false,
      error: error.message,
      retrievedAt: new Date().toISOString()
    };
  } finally {
    if (readonlyConnection) {
      await readonlyConnection.close();
    }
  }
};
