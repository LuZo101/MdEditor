import React, { useState } from "react";

export default function Sidebar(props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAscending, setIsAscending] = useState(true);

  const handleSortOrder = () => {
    setIsAscending(!isAscending);
  };

  const filteredNotes = props.notes.filter((note) => {
    const title = note.body.split("\n")[0].toLowerCase(); // Titel bis zum ersten Zeilenumbruch
    return title.includes(searchQuery.toLowerCase());
  });

  const sortedNotes = filteredNotes.sort((a, b) => {
    if (isAscending) {
      return a.updatedAt - b.updatedAt;
    } else {
      return b.updatedAt - a.updatedAt;
    }
  });

  const noteElements = sortedNotes.map((note, index) => (
    <div key={note.id}>
      <div
        className={`title ${
          note.id === props.currentNote.id ? "selected-note" : ""
        }`}
        onClick={() => props.setCurrentNoteId(note.id)}
      >
        <h4 className="text-snippet">{note.body.split("\n")[0]}</h4> {/* Titel bis zum ersten Zeilenumbruch */}
        <button
          className="delete-btn"
          onClick={() => props.deleteNote(note.id)}
        >
          <i className="gg-trash trash-icon"></i>
        </button>
      </div>
    </div>
  ));

  return (
    <section className="pane sidebar">
      <div className="sidebar--header">
        <h3>Notes</h3>
        <button className="new-note" onClick={props.newNote}>
          +
        </button>
      </div>
      <div className="search-bar" style={{ textAlign: "center" }}>
        <input
          type="text"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSortOrder}
            className="sort-btn"
        >
          {isAscending ? "Asc" : "Desc"}
        </button>
      </div>
      {noteElements}
    </section>
  );
}
