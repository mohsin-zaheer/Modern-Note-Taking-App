// components/EditNoteModal.jsx
import React, { useState, useEffect, useRef } from 'react';
import useModalStore from '../store/modalStore';
import useNotesStore from '../store/notesStore';
import '../App.css'; // or your modal styles
import styles from '../assets/stylesheets/modal.module.css';  
import { toast } from 'react-toastify'; // reuse the same CSS


const EditNoteModal = () => {
  const { isEditModalOpen, editNote, closeEditModal } = useModalStore();
  const { updateNote } = useNotesStore();

  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [important, setImportant] = useState(false);
    
  
  const modalRef = useRef(null);


  useEffect(() => {
    if (editNote) {
      setTitle(editNote.title);
      setDesc(editNote.desc);
      setImportant(editNote.important);
    }
  }, [editNote]);


    const handleSave = async () => {
      if (!title.trim() || !desc.trim()) {
        toast.error('Title and Description are required!');
        return;
      }

      try {
        const updatedNote = {
          ...editNote,
          title,
          desc,
          important,
        };

        await updateNote(updatedNote);
        toast.success('Note updated successfully!');
        closeEditModal();
      } catch (error) {
        toast.error(error.message || 'Failed to update note');
      }
    };
  
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
          closeEditModal();
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [closeEditModal]);

    if (!isEditModalOpen || !editNote) return null;


  return (
    <div className={styles.overlay}>
      <div className={styles.modal} ref={modalRef}>
        <h2 className={styles.title}>Edit Note</h2>
        <input
          type="text"
          placeholder="Title"
          className={styles.input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Description"
          className={styles.textarea}
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <div className={styles.isImportantBg}>
          <label>
            <input
              type="checkbox"
              checked={important}
              onChange={() => setImportant(!important)}
            />
            Important
          </label>
        </div>
        <div className={styles.actions}>
          <button className={styles.saveBtn} onClick={handleSave}>Save</button>
          <button className={styles.cancelBtn} onClick={closeEditModal}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EditNoteModal;
