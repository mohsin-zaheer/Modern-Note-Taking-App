import React, {useEffect, useRef}from 'react';
import useModalStore from '../store/modalStore';
import useNotesStore from '../store/notesStore';
import styles from '../assets/stylesheets/modal.module.css'; // reuse the same CSS
import { toast } from 'react-toastify';


const DeleteConfirmModal = ({ onDelete }) => {
  const { isDeleteModalOpen, closeDeleteModal, noteToDelete, noteTitleToDelete, } = useModalStore();
  const { deleteNote } = useNotesStore();




  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeDeleteModal();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeDeleteModal]);

  if (!isDeleteModalOpen) return null;

  
   const handleDelete = async () => {
    try {
      await deleteNote(noteToDelete);
      toast.success('Note deleted successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to delete note!');
    } finally {
      closeDeleteModal();
    }
  };


  return (
    <div className={styles.overlay}>
      <div className={styles.modal} ref={modalRef}>
         <h2 className={styles.modalTitle}>Delete Note "<span className={styles.change}>{noteTitleToDelete}</span>"</h2>
        <p>Are you sure you want to delete this note?</p>
        <div className={styles.actions}>
          <button className={styles.saveBtn}  onClick={handleDelete} >Yes</button>
          <button className={styles.cancelBtn} onClick={closeDeleteModal} >No</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
