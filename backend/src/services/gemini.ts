import mongoose from 'mongoose';
import {
  GoogleGenerativeAI,
  SchemaType,
  FunctionDeclaration,
} from '@google/generative-ai';
import * as fs from 'fs';
import * as path from 'path';

export async function askGemini(question: string): Promise<string> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error(
      'Required API key is not set in the environment configuration'
    );
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  const getDatabaseSchemaDeclaration: FunctionDeclaration = {
    name: 'getDatabaseSchema',
    description:
      'Retrieves the database schema including collection names, field types, document counts, and sample documents. Use this when you need to understand the database structure to answer questions.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {},
      required: [],
    },
  };

  const executeDbQueryDeclaration: FunctionDeclaration = {
    name: 'executeDbQuery',
    description:
      'Executes a MongoDB query on a specific collection. Use this to retrieve actual data from the database. Supports all MongoDB supported readonly operations.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        query: {
          type: SchemaType.STRING,
          description:
            'MongoDB query as JSON string (e.g., \'{"status": "active"}\' or \'{}\' for all documents)',
        },
        collection: {
          type: SchemaType.STRING,
          description:
            'Name of the collection to query (e.g., "patients", "statuses")',
        },
        operation: {
          type: SchemaType.STRING,
          description:
            'MongoDB operation to perform (e.g. find, findOne, countDocuments, aggregate)',
        },
      },
      required: ['query', 'collection', 'operation'],
    },
  };

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    tools: [{ functionDeclarations: [getDatabaseSchemaDeclaration] }],
  });

  // Read the README for context
  const readmePath = path.join(__dirname, '..', '..', 'ai-context.md');
  let readmeContent = '';

  try {
    readmeContent = fs.readFileSync(readmePath, 'utf-8');
    console.log('README.md loaded successfully');
  } catch (err) {
    console.warn('README.md not found or unreadable. Proceeding without it.');
  }

  const prompt = `You are an AI assistant for the SurgeVenger medical application.
This app helps track surgery patient status in real-time.

Here is the README for additional context:
${readmeContent}
---
User Question: ${question}

Please provide helpful, concise answers about navigating and using this application. 

If you need to understand the database structure to answer the question, you can call the getDatabaseSchema function first. After retrieving the database schema, you will then have access to the executeDbQuery function to run actual database queries and retrieve real data.

Available functions:
1. getDatabaseSchema() - Always available to understand database structure
2. executeDbQuery(query, collection, operation) - Only available after calling getDatabaseSchema`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;

    const functionCalls = response.functionCalls();

    if (functionCalls && functionCalls.length > 0) {
      let currentChat = model.startChat({
        history: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
          {
            role: 'model',
            parts: [{ functionCall: functionCalls[0] }],
          },
        ],
      });

      if (functionCalls[0].name === 'getDatabaseSchema') {
        const schemaResult = await getDatabaseSchema();

        const schemaResponse = await currentChat.sendMessage([
          {
            functionResponse: {
              name: 'getDatabaseSchema',
              response: schemaResult,
            },
          },
        ]);

        const additionalFunctionCalls = schemaResponse.response.functionCalls();

        if (additionalFunctionCalls && additionalFunctionCalls.length > 0) {
          const expandedModel = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            tools: [
              {
                functionDeclarations: [
                  getDatabaseSchemaDeclaration,
                  executeDbQueryDeclaration,
                ],
              },
            ],
          });

          const expandedChat = expandedModel.startChat({
            history: [
              {
                role: 'user',
                parts: [{ text: prompt }],
              },
              {
                role: 'model',
                parts: [{ functionCall: functionCalls[0] }],
              },
              {
                role: 'function',
                parts: [
                  {
                    functionResponse: {
                      name: 'getDatabaseSchema',
                      response: schemaResult,
                    },
                  },
                ],
              },
              {
                role: 'model',
                parts: [{ functionCall: additionalFunctionCalls[0] }],
              },
            ],
          });

          if (additionalFunctionCalls[0].name === 'executeDbQuery') {
            const queryArgs = additionalFunctionCalls[0].args as any;
            let queryResult;

            try {
              const parsedQuery = queryArgs.query
                ? JSON.parse(queryArgs.query)
                : {};
              queryResult = await executeDbQuery(
                parsedQuery,
                queryArgs.collection,
                queryArgs.operation
              );
            } catch (e) {
              queryResult = 'Failed to parse query.';
            }

            const finalResponse = await expandedChat.sendMessage([
              {
                functionResponse: {
                  name: 'executeDbQuery',
                  response: queryResult,
                },
              },
            ]);

            return finalResponse.response.text();
          }
        }

        return schemaResponse.response.text();
      }
    } else {
      return response.text();
    }

    return 'Unable to process request';
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw new Error('Failed to get response from Gemini API');
  }
}

let readonlyConnection: mongoose.Connection | null = null;
let isConnecting = false;

const getReadonlyConnection = async (): Promise<mongoose.Connection> => {
  while (isConnecting) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  if (readonlyConnection && readonlyConnection.readyState === 1) {
    return readonlyConnection;
  }

  isConnecting = true;

  try {
    const readonlyUri =
      process.env.SURGERY_DATABASE_CONNECTION_READONLY_CREDENTIALS;

    if (!readonlyUri) {
      throw new Error(
        'Readonly database connection string not found in environment variables'
      );
    }

    readonlyConnection = mongoose.createConnection(readonlyUri);

    await new Promise((resolve, reject) => {
      readonlyConnection!.once('open', resolve);
      readonlyConnection!.once('error', reject);
    });

    readonlyConnection.on('error', (error) => {
      console.error('Readonly database connection error:', error);
    });

    readonlyConnection.on('disconnected', () => {
      console.warn('Readonly database connection lost');
      readonlyConnection = null;
    });

    console.log('Readonly database connected successfully');
    return readonlyConnection;
  } finally {
    isConnecting = false;
  }
};

export const executeDbQuery = async (
  query: any,
  collection: string,
  operation: string = 'find'
): Promise<any> => {
  try {
    const connection = await getReadonlyConnection();

    const db = connection.db;
    if (!db) {
      throw new Error('Failed to access database from connection');
    }
    const targetCollection = db.collection(collection);

    const method = targetCollection[
      operation as keyof typeof targetCollection
    ] as any;

    if (typeof method !== 'function') {
      throw new Error(
        `Operation '${operation}' is not available on collection`
      );
    }

    let result = await method.call(targetCollection, query);

    if (result && typeof result.toArray === 'function') {
      result = await result.toArray();
    }

    return {
      success: true,
      data: result,
      collection,
      operation,
      queryExecutedAt: new Date().toISOString(),
    };
  } catch (error: any) {
    return {
      success: false,
      error: 'Query failed.',
      collection,
      operation,
      queryExecutedAt: new Date().toISOString(),
    };
  }
};

export const getDatabaseSchema = async (): Promise<any> => {
  try {
    const connection = await getReadonlyConnection();

    const db = connection.db;
    if (!db) {
      throw new Error('Failed to access database from connection');
    }

    const collections = await db.listCollections().toArray();
    const schemaInfo: any = {
      databaseName: db.databaseName,
      collections: {},
      retrievedAt: new Date().toISOString(),
    };

    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      const collection = db.collection(collectionName);

      const documentCount = await collection.countDocuments().catch(() => 0);

      const sampleDocs = await collection.find({}).limit(2).toArray();

      const fieldTypes: any = {};
      if (sampleDocs.length > 0) {
        sampleDocs.forEach((doc) => {
          Object.keys(doc).forEach((key) => {
            const value = doc[key];
            const type = Array.isArray(value) ? 'array' : typeof value;
            if (!fieldTypes[key]) {
              fieldTypes[key] = new Set();
            }
            fieldTypes[key].add(type);
          });
        });

        Object.keys(fieldTypes).forEach((key) => {
          fieldTypes[key] = Array.from(fieldTypes[key]);
        });
      }

      schemaInfo.collections[collectionName] = {
        name: collectionName,
        documentCount: documentCount,
        fields: fieldTypes,
        sampleDocuments: sampleDocs
          .map((doc) => {
            const { _id, ...docWithoutId } = doc;
            return docWithoutId;
          })
          .slice(0, 2),
      };
    }

    return {
      success: true,
      data: schemaInfo,
    };
  } catch (error: any) {
    console.error('Database schema retrieval error:', error);
    return {
      success: false,
      error: error.message,
      retrievedAt: new Date().toISOString(),
    };
  }
};
