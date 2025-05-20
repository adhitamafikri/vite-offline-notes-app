"use client";

import React, {
  useRef,
  createContext,
  useMemo,
  useCallback,
  useEffect,
} from "react";

export interface IPouchDBContext {
  getInfo: () => Promise<void>;
  getData: <T>(_id: string) => Promise<T>;
  findData: <T>(findOptions: {
    selector: Record<string, unknown>;
    fields?: string[];
    sort?: string[];
  }) => Promise<T | null>;
  findAllData: <T>(findOptions: {
    selector: Record<string, unknown>;
    fields?: string[];
    sort?: string[];
  }) => Promise<T[]>;
  addData: <T, R>(
    data: PouchDB.Core.PutDocument<{} & T>,
    docType: "user" | "note"
  ) => Promise<R>;
}

export const PouchDBContext = createContext<IPouchDBContext | undefined>(
  undefined
);

const dbName: string = process.env.NEXT_PUBLIC_POUCHDB_NAME || "pwa-notes-app";
export const PouchDBProvider = ({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) => {
  const pouchDBRef = useRef<PouchDB.Database | null>(null);

  const loadPouchDB = async () => {
    if (!pouchDBRef.current) {
      const PouchDB = (await import("pouchdb")).default;
      PouchDB.plugin((await import("pouchdb-find")).default);
      const db = new PouchDB(dbName);
      await db.createIndex({
        index: {
          fields: ["email", "title"],
          name: "pwa-note-app-index",
        },
      });
      pouchDBRef.current = db;
    }
    return pouchDBRef.current as PouchDB.Database;
  };

  // create a db in the indexedDB
  useEffect(() => {
    loadPouchDB();
  }, []);

  const getInfo = useCallback(async () => {
    const db = await loadPouchDB();
    const info = await db.info();
    console.log("db info:", info);
  }, []);

  const getData = useCallback(async <T,>(_id: string): Promise<T> => {
    try {
      const db = await loadPouchDB();
      const result = await db.get<T>(_id);
      return result as T;
    } catch (error) {
      console.error("Error getting PouchDB info", error);
      throw error;
    }
  }, []);

  const findData = useCallback(
    async <T,>(findOptions: {
      selector: Record<string, unknown>;
      fields?: string[];
      sort?: string[];
    }): Promise<T | null> => {
      try {
        const db = await loadPouchDB();
        const result = await db.find(findOptions);
        console.log("result", result);
        return result.docs[0] as T | null;
      } catch (error) {
        console.error("Error finding data from PouchDB: ", error);
        throw error;
      }
    },
    []
  );

  const findAllData = useCallback(
    async <T,>(findOptions: {
      selector: Record<string, unknown>;
      fields?: string[];
      sort?: string[];
    }): Promise<T[]> => {
      try {
        const db = await loadPouchDB();
        const result = await db.find(findOptions);
        console.log("result", result);
        return result.docs as T[];
      } catch (error) {
        console.error("Error finding data from PouchDB: ", error);
        throw error;
      }
    },
    []
  );

  const addData = useCallback(
    async <T, R>(
      data: PouchDB.Core.PutDocument<{} & T>,
      docType: "user" | "note"
    ): Promise<R> => {
      try {
        const db = await loadPouchDB();
        const result = await db.put<T>({ ...data, docType });
        return result as R;
      } catch (error) {
        console.error("Error adding data into PouchDB: ", error);
        throw error;
      }
    },
    []
  );

  const contextValue = useMemo(
    () => ({ getInfo, getData, findData, findAllData, addData }),
    [getInfo, getData, findData, findAllData, addData]
  );

  return (
    <PouchDBContext.Provider value={contextValue}>
      {children}
    </PouchDBContext.Provider>
  );
};
