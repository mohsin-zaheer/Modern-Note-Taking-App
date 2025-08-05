import React, {useRef, useEffect, useState} from 'react';
import useModalStore from '../store/modalStore';
import useNotesStore from '../store/notesStore';
import styles from '../assets/stylesheets/modal.module.css'; // create this file
import { toast } from 'react-toastify';

const AddNewModal = () => {
  const { isAddModalOpen, closeAddModal } = useModalStore();

  const { addNote } = useNotesStore();

  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [important, setImportant] = useState(false);

  const modalRef = useRef(null);



  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeAddModal();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [closeAddModal]);

  if (!isAddModalOpen) return null;



  const handleSave = async () => {
    if (!title.trim() || !desc.trim()) {
      alert('Title and Description are required!');
      return;
    }

    const today = new Date();
    const date = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

    const newNote = {
      title,
      desc,
      date,
      important,
    };

    await addNote(newNote);

    toast.success('Note added successfully!');

    
    closeAddModal();

    // Optionally reset fields
    setTitle('');
    setDesc('');
    setImportant(false);
  };


  return (
    <div className={styles.overlay}>
      <div className={styles.modal} ref={modalRef}>
        <h2 className={styles.title}>Add New Note</h2>
        <input
          type="text"
          placeholder="Title"
          className={styles.input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Note content..."
          className={styles.textarea}
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        ></textarea>
        <div className={styles.isImportantBg}>
          <input
            type="checkbox"
            name="isImportant"
            id="isImportant"
            checked={important}
            onChange={(e) => setImportant(e.target.checked)}
          />
          <label htmlFor="isImportant">is Important</label>
        </div>
        <div className={styles.actions}>
          <button onClick={closeAddModal} className={styles.cancelBtn}>Cancel</button>
          <button onClick={handleSave} className={styles.saveBtn}>Save Note</button>
        </div>
      </div>
    </div>
  );
};

export default AddNewModal;
