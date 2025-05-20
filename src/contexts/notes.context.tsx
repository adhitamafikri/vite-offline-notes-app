"use client";

import { createContext, useCallback, useMemo } from "react";
// import { v4 as uuidv4 } from "uuid";
// import { useRouter } from "next/navigation";
import { usePouchDB } from "@/hooks/use-pouchdb";
import { Note } from "@/models/Note";

export interface INotesContext {
  // getAllNotes: () => Note[];
  getAllNotes: () => Promise<void>;
}

export const NotesContext = createContext<INotesContext | undefined>(undefined);

export const NotesProvider = ({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) => {
  // const router = useRouter();
  const { pouchDB } = usePouchDB();

  const getAllNotes = useCallback(async (): Promise<void> => {
    const result = await pouchDB.findAllData<Note[]>({
      selector: { docType: "note" },
    });
    console.log("getAllNotes result: ", result);
  }, [pouchDB]);

  const contextValue = useMemo(() => ({ getAllNotes }), [getAllNotes]);

  return (
    <NotesContext.Provider value={contextValue}>
      {children}
    </NotesContext.Provider>
  );
};
