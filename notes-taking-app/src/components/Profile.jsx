import React, {useEffect} from 'react'
import userImg from '../assets/user.png'
import { Icon } from "@iconify/react";
import '../App.css'
import useNotesStore from '../store/notesStore';
import useModalStore from '../store/modalStore';
import DeleteConfirmModal from './DeleteConfirmModal';
import note from '../assets/note.png'
import useAuthStore from '../store/useAuthStore';
import LoadingSpinner from './LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import EditNoteModal from './EditNoteModal';



const Profile = () => {
  const { openAddModal , openDeleteModal, openEditModal } = useModalStore();
  const { getNotes, userNotes, deleteNote, loading: notesLoading} = useNotesStore();
  const navigate = useNavigate();
  const {user, logout, updateProfilePic, loading} = useAuthStore();


  useEffect(() => {
    getNotes();
  }, []);

  const importantNotes = userNotes.filter((note) => note.important);
  const normalNotes = userNotes.filter((note) => !note.important);



  const handleDelete = (noteId) => {
    deleteNote(noteId);
  };

    const handleLogout = () => {
    logout();
    navigate('/'); // 👈 redirect to root after logout
  };

  const joinDate = user?.createdAt
  ? new Date(user.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  : 'N/A';


  const fileInputRef = React.useRef();

const handleImageClick = () => {
  fileInputRef.current.click();
};

const handleImageChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'notesTaking'); 
  try {
    const res = await fetch('https://api.cloudinary.com/v1_1/djglsull9/image/upload', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    const imageUrl = data.secure_url;


  console.log('image', imageUrl);
  

    await updateProfilePic(imageUrl); // <- From zustand store
  } catch (err) {
    console.error('Image upload failed:', err);
  }
};




  return (
    <>
    <DeleteConfirmModal onDelete={handleDelete} />
    <EditNoteModal/>
    
    <div className='profileBg container'>
        <div className="info">
            <div className="user">

              {loading ? <LoadingSpinner/> : <img src={ !user?.image ? userImg : user?.image} alt="user" className="userImg"/>}
            
                
             
                <div className='userInfo'>
                    <h2>{user?.name}</h2>
                    <div className="joinDate">Joined In {joinDate}</div>
                </div>
            </div>

            <div className="statsBg">
                <div className='stats'>
                    <div className='stat'>Total Notes : {userNotes.length}</div>
                     <div className='stat'>Important Notes : {importantNotes.length}</div>
                </div>
                <div className="stats-buttons">
                    <>
                      <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      <button className='custom-btn' onClick={handleImageClick}>
                        {!user?.image ? 'Add' : 'Update'} Profile Pic
                      </button>
                    </>
                    <button className='custom-btn'  onClick={handleLogout} >logout</button>
                </div>
            </div>
        </div>


        <h2 className='profile-title'>
            Your <span className='title-change'>
                 Important
                </span> Notes
        </h2>

        <div className="row">
        {notesLoading ? 
        (<LoadingSpinner/>) 
        : 
        ( importantNotes.length > 0 ? importantNotes.map((note, index) => (
          <div className='col-md-4' key={note.id}>
            <div className='noteCard'>
              <div className='card-top'>
                <h4 className='note-count'>Note {index + 1}</h4>
                <div className='important'>Important</div>
              </div>
              <h3 className='note-title'>{note.title}</h3>
              <p className='note-desc'>{note.desc}</p>
              <div className='card-bottom'>
                <span className='note-date'>{note.date}</span>
                <div className='buttons'>
                  <button
                    className='card-btn trash'
                    onClick={() => openDeleteModal(note._id, note.title)}
                  >
                    <Icon icon='cuida:trash-outline' />
                  </button>
                  <button className='card-btn edit' onClick={() => openEditModal(note)}>
                    <Icon icon='iconoir:edit' />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))  : (
           <div className="notFound">
                <img src={note} alt="No notes" className='note' />
                <div className='notFoundText'>
                  You Have No Important Notes <br /> Click On Add Note Button To Add The Note
                </div>
                <button className='custom-btn' onClick={openAddModal}>Add Note</button>
            </div>
        ) )}
        </div>


        <h2 className='profile-title mt-5'>
            Your <span className='title-change'>
                 Normal
                </span> Notes
        </h2>


        <div className="row">
            {notesLoading ? <LoadingSpinner/> : normalNotes.length > 0 ? normalNotes.map((note, index) => (
              <div className='col-md-4' key={note.id}>
                <div className='noteCard'>
                  <div className='card-top'>
                    <h4 className='note-count'>Note {index + 1}</h4>
                  </div>
                  <h3 className='note-title'>{note.title}</h3>
                  <p className='note-desc'>{note.desc}</p>
                  <div className='card-bottom'>
                    <span className='note-date'>{note.date}</span>
                    <div className='buttons'>
                      <button
                        className='card-btn trash'
                        onClick={() => openDeleteModal(note._id, note.title)}
                      >
                        <Icon icon='cuida:trash-outline' />
                      </button>
                      <button className='card-btn edit' onClick={() => openEditModal(note)}>
                        <Icon icon='iconoir:edit' />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="notFound">
                <img src={note} alt="No notes" className='note' />
                <div className='notFoundText'>
                  You Have No Notes <br /> Click On Add Note Button To Add The Note
                </div>
                <button className='custom-btn' onClick={openAddModal}>Add Note</button>
              </div>
            )}
        </div>



    </div>
    </>
  )
}

export default Profile;