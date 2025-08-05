import React, { useState, useEffect } from 'react';
import '../App.css';
import { Icon } from "@iconify/react";
import DeleteConfirmModal from './DeleteConfirmModal';
import EditNoteModal from './EditNoteModal';
import LoadingSpinner from './LoadingSpinner';
import useModalStore from '../store/modalStore';
import useNotesStore from '../store/notesStore';
import oops from '../assets/oops.png';
import note from '../assets/note.png';
import useAuthStore from '../store/useAuthStore';



const Dashboard = () => {
  const { user, logout } = useAuthStore();
  const { openDeleteModal, openEditModal, openAddModal } = useModalStore();
  const { userNotes, deleteNote, getNotes, loading } = useNotesStore();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getNotes();
  }, []);

  const handleDelete = (noteId) => {
    deleteNote(noteId);
  };

  const safeNotes = Array.isArray(userNotes) ? userNotes : [];

  const filteredNotes = safeNotes?.filter(note =>
  note?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
  note?.desc?.toLowerCase().includes(searchQuery.toLowerCase())
  );


  const isSearching = searchQuery.trim() !== '';
  const noNotes = userNotes?.length === 0;
  const noSearchResults = isSearching && filteredNotes.length === 0;

  return (
    <>
      <DeleteConfirmModal onDelete={handleDelete} />
      <EditNoteModal />

      <div className="dashboard-bg container">
        <div className="top">
          <h2 className="title">Hi, {user?.name}</h2>
          <div className="inpBg">
            <Icon icon="lets-icons:search-duotone" />
            <input
              type="search"
              name="search"
              id="search"
              className="inp"
              placeholder="Search Notes"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : noNotes && !isSearching ? (
          <div className="notFound">
            <img src={note} alt="No notes" className="note" />
            <div className="notFoundText">
              You Have No Notes <br />
              Click On Add Note Button To Add A Note
            </div>
            <button className="custom-btn" onClick={openAddModal}>Add Note</button>
          </div>
        ) : noSearchResults ? (
          <div className="oops">
            <img src={oops} alt="No results" className="oopsImg" />
            <div className="notFoundText">
              No Search Results Found for “<span className="title-change">{searchQuery}</span>”
            </div>
          </div>
        ) : (
          <div className="row">
            {filteredNotes?.map((note, index) => (
              <div className="col-md-4" key={note._id}>
                <div className="noteCard">
                  <div className="card-top">
                    <h4 className="note-count">Note {index + 1}</h4>
                    {note.important && <div className="important">Important</div>}
                  </div>

                  <h3 className="note-title">{note.title}</h3>
                  <p className="note-desc">{note.desc}</p>

                  <div className="card-bottom">
                    <span className="note-date">{note.date}</span>
                    <div className="buttons">
                      <button
                        className="card-btn trash"
                        onClick={() => openDeleteModal(note._id, note.title)}
                      >
                        <Icon icon="cuida:trash-outline" />
                      </button>
                      <button
                        className="card-btn edit"
                        onClick={() => openEditModal(note)}
                      >
                        <Icon icon="iconoir:edit" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
