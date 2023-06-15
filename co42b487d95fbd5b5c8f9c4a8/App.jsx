import React from "react";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import Split from "react-split";
import { nanoid } from "nanoid";
import {
  onSnapshot,
  addDoc,
  doc,
  deleteDoc,
  setDoc
} from "firebase/firestore";
import { notesCollection, db } from "./firebase";

export default function App() {
  const [notes, setNotes] = React.useState([]);
  const [currentNoteId, setCurrentNoteId] = React.useState("");
  const [tempNoteText, setTempNoteText] = React.useState("");
  const [searchQuery, setSearchQuery] = React.useState("");

  const currentNote =
    notes.find((note) => note.id === currentNoteId) || notes[0];

  const sortedNotes = notes.sort((a, b) => b.updatedAt - a.updatedAt);
  const filteredNotes = searchQuery
    ? sortedNotes.filter((note) =>
        note.body.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : sortedNotes;

  React.useEffect(() => {
    const unsubscribe = onSnapshot(notesCollection, function (snapshot) {
      const notesArr = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id
      }));
      setNotes(notesArr);
    });
    return unsubscribe;
  }, []);

  React.useEffect(() => {
    if (!currentNoteId) {
      setCurrentNoteId(notes[0]?.id);
    }
  }, [notes]);

  React.useEffect(() => {
    if (currentNote) {
      setTempNoteText(currentNote.body);
    }
  }, [currentNote]);

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (tempNoteText !== currentNote.body) {
        updateNote();
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [tempNoteText]);

  async function createNewNote() {
    const newNote = {
      body: "# Type your markdown note's title here",
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    const newNoteRef = await addDoc(notesCollection, newNote);
    setCurrentNoteId(newNoteRef.id);
  }

  async function updateNote() {
    const docRef = doc(db, "notes", currentNoteId);
    await setDoc(
      docRef,
      { body: tempNoteText, updatedAt: Date.now() },
      { merge: true }
    );
  }

  async function deleteNote(noteId) {
    const docRef = doc(db, "notes", noteId);
    await deleteDoc(docRef);
  }

  const createdAt = currentNote
    ? new Date(currentNote.createdAt).toLocaleString()
    : "";
  const updatedAt = currentNote
    ? new Date(currentNote.updatedAt).toLocaleString()
    : "";

  const title = currentNote?.body.split("\n")[0]; // Titel bis zum ersten Zeilenumbruch

  return (
    <main>
      {notes.length > 0 ? (
        <Split sizes={[30, 70]} direction="horizontal" className="split">
          <Sidebar
            notes={sortedNotes}
            currentNote={currentNote}
            setCurrentNoteId={setCurrentNoteId}
            newNote={createNewNote}
            deleteNote={deleteNote}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <div className="editor-wrapper">
            <div className="title">
              {title && <h3>{title}</h3>}
              <div className="date-info">
                <div className="created-at-info">
                  Created: {createdAt}
                </div>
                <div className="updated-at-info">
                  Last Updated: {updatedAt}
                </div>
              </div>
            </div>
            <Editor
              tempNoteText={tempNoteText}
              setTempNoteText={setTempNoteText}
              currentNote={currentNote}
              updateNote={updateNote}
            />
          </div>
        </Split>
      ) : (
        <div className="no-notes">
          <h1>You have no notes</h1>
          <button className="first-note" onClick={createNewNote}>
            Create one now
          </button>
        </div>
      )}
    </main>
  );
}
