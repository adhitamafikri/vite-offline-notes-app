import React, {
  useRef,
  createContext,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import PouchDB from "pouchdb-browser";
import PouchDBFind from "pouchdb-find";

PouchDB.plugin(PouchDBFind);

export interface IPouchDBContext {
  getInfo: () => Promise<void>;
  getData: <T>(_id: string) => Promise<T>;
  findData: <T>(findOptions: {
    selector: Record<string, unknown>;
    fields?: string[];
    sort?: string[];
  }) => Promise<T | null>;
  addData: <T, R>(
    data: PouchDB.Core.PutDocument<{} & T>,
    docType: "user" | "note"
  ) => Promise<R>;
}

export const PouchDBContext = createContext<IPouchDBContext | undefined>(
  undefined
);

const dbName: string =
  import.meta.env.VITE_POUCHDB_NAME || "vite-pwa-notes-app";
export const PouchDBProvider = ({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) => {
  const pouchDBRef = useRef<PouchDB.Database | null>(null);

  const loadPouchDB = async () => {
    if (!pouchDBRef.current) {
      const db = new PouchDB(dbName);
      await db.createIndex({
        index: {
          fields: ["email", "title"],
          name: "vite-pwa-note-app-index",
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
    () => ({ getInfo, getData, findData, addData }),
    [getInfo, getData, findData, addData]
  );

  return (
    <PouchDBContext.Provider value={contextValue}>
      {children}
    </PouchDBContext.Provider>
  );
};
