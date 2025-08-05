import { create } from "zustand";
import { toast } from 'react-toastify';

const useNotesStore = create((set) => ({
  userNotes: [],
  loading: false,
  error: null,

  getNotes: async () => {
    const token = JSON.parse(localStorage.getItem('user'))?.token;
    if (!token) {
      toast.error('No token found. Please log in again.');
      return;
    }

    try {
      set({ loading: true });
      const res = await fetch('http://localhost:5000/api/notes', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) throw new Error('Unauthorized');

      const data = await res.json();
      set({ userNotes: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
      toast.error(error.message || 'Failed to fetch notes');
    }
  },

  addNote: async (newNote) => {
    const token = JSON.parse(localStorage.getItem('user'))?.token;
    if (!token) {
      toast.error('No token found. Please log in again.');
      return;
    }

    console.log("Submitting note:", newNote);


    try {
      const res = await fetch('http://localhost:5000/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newNote),
      });

      if (res.status === 401) throw new Error('Unauthorized');

      const savedNote = await res.json();
      set((state) => ({
        userNotes: [...state.userNotes, savedNote],
      }));
    } catch (error) {
      set({ error: error.message });
      toast.error(error.message || 'Add failed!');
    }
  },

  deleteNote: async (id) => {
    const token = JSON.parse(localStorage.getItem('user'))?.token;
    if (!token) {
      toast.error('No token found. Please log in again.');
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/notes/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) throw new Error('Unauthorized');

      set((state) => ({
        userNotes: state.userNotes.filter((note) => note._id !== id),
      }));
    } catch (error) {
      set({ error: error.message });
      toast.error(error.message || 'Delete failed!');
    }
  },

  updateNote: async (updatedNote) => {
    const token = JSON.parse(localStorage.getItem('user'))?.token;
    if (!token) {
      toast.error('No token found. Please log in again.');
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/notes/${updatedNote._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedNote),
      });

      if (res.status === 401) throw new Error('Unauthorized');

      const newNote = await res.json();
      set((state) => ({
        userNotes: state.userNotes.map((note) =>
          note._id === newNote._id ? newNote : note
        ),
      }));
    } catch (error) {
      set({ error: error.message });
      toast.error(error.message || 'Update failed!');
    }
  },
}));

export default useNotesStore;
