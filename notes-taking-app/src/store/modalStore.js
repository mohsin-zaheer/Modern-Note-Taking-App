import { create } from 'zustand';

const useModalStore = create((set) => ({
  isAddModalOpen: false,
  openAddModal: () => set({ isAddModalOpen: true }),
  closeAddModal: () => set({ isAddModalOpen: false }),

  isDeleteModalOpen: false,
  noteToDelete: null,
  noteTitleToDelete: '',
  openDeleteModal: (noteId, noteTitle) => set({ isDeleteModalOpen: true, noteToDelete: noteId, noteTitleToDelete: noteTitle  }),
  closeDeleteModal: () => set({ isDeleteModalOpen: false, noteToDelete: null, noteTitleToDelete: '' }),

  isEditModalOpen: false,
  editNote: null,

  openEditModal: (note) =>
    set({ isEditModalOpen: true, editNote: note }),
  closeEditModal: () => set({ isEditModalOpen: false, editNote: null }),
}));

export default useModalStore;
