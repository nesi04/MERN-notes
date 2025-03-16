import React, { useEffect, useState } from 'react'
import NavBar from '../../components/NavBar'
import NoteCard from '../../components/cards/NoteCard'
import { MdAdd } from 'react-icons/md'
import AddEditNotes from './AddEditNotes'
import Modal from 'react-modal'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import moment from 'moment'
import Toast from '../../components/ToastMessage/Toast'
import EmptyCard from '../../components/EmptyCard/EmptyCard'

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown:false,
    type:'add',
    data:null,
  });

  const[showToastMessage,setShowToastMessage]=useState({
    isShown:false,
    message:"",
    type:"add",
  });
  const [userInfo,setUserInfo]=useState(null);
  const [allNotes,setAllNotes]=useState([]);
  const [isSearch,setIsSearch]=useState(false);
  const navigate = useNavigate();

  const handleEdit=(noteDetails)=>{
    setOpenAddEditModal({isShown:true,data:noteDetails,type:"edit"});
  };
  const showToastMsg=(message,type)=>{
    setShowToastMessage({
      isShown:true,
      message,
      type,
    })
  };
  
  const handleCloseToast=()=>{
    setShowToastMessage({
      isShown:false,
      message:"",
    })
  };
  
  const getUserInfo =async()=>{
    try{
      const response = await axiosInstance.get("/get-user");
      if(response.data&&response.data.user){
        setUserInfo(response.data.user);
      }
    }catch(error){
      if(error.response.status===401){
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  const getAllNotes = async()=>{
    try {
      const response = await axiosInstance.get('/get-notes');
      if(response.data&&response.data.notes){
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  const deleteNote = async (data)=>{
    const noteId = data._id
        try{
            const response =await axiosInstance.delete("/delete-note/"+noteId);
            if(response.data&&!response.data.error){
                showToastMsg("Note Deleted successfully",'delete');
               getAllNotes();
               
            }
        }catch(error){
            if(error.response&&error.response.data&&error.response.data.message){
                console.log("Unexpected error")
            }
        }
  }

  const onSearchNote = async (query)=>{
    try {
      const response = await axiosInstance.get('/search-notes',{
        params:{query},
      });
      if(response.data&&response.data.notes){
        setIsSearch(true);
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleClearSearch =()=>{
    setIsSearch(false);
    getAllNotes();
  };
  const updateIsPinned = async(noteData)=>{
    const noteId = noteData._id
        try{
            const response =await axiosInstance.put("/update-note-pinned/"+noteId,{
                "isPinned":!noteData.isPinned,
            });
            if(response.data&&response.data.note){
                showToastMsg("Note updated successfully");
               getAllNotes()
                
            }
        }catch(error){
            console.log(error);
        }
  }

  useEffect(()=>{
    getAllNotes();  
    getUserInfo();
    return ()=>{};
  },[]);
  
  return (
    <div>
      <NavBar userInfo={userInfo} onSearchNote={onSearchNote} handleClearSearch={handleClearSearch}/>
      <div className="container mx-auto">
        {allNotes.length>0?<div className="grid grid-cols-3 gap-4 mt-8">
          {allNotes.map((item,index)=>(
            <NoteCard  key={item._id} title={item.title} date={moment(item.createdOn).format('Do MMM YYYY')} content={item.content} tags={item.tags} isPinned={item.isPinned} onEdit={()=>{handleEdit(item)}} onDelete={()=>{deleteNote(item)}} onPinNote={()=>{updateIsPinned(item)}}/>
          ))}
        
      </div>:<EmptyCard isSearch={isSearch}></EmptyCard>}
      </div>
      <button className='size-16 flex justify-center items-center rounded-2xl bg-accent hover:bg-secondary absolute right-10 bottom-10' onClick={()=>{
        setOpenAddEditModal({
          isShown:true,
          type:'add',
          data:null,
        });
      }}>
        <MdAdd className='text-[32px] text-white'></MdAdd>
      </button>
      <Modal isOpen={openAddEditModal.isShown} onRequestClose={()=>{ setOpenAddEditModal({ isShown: false, type: 'add', data: null });
        }} style={{overlay:{backgroundColor:'rgba(0,0,0,0.2',},
      }}
      contentLabel="" className="w-[40%] max-h-3/4 bg-base-300 rounded-md mx-auto mt-20 p-5 overflow-scroll">
      <AddEditNotes  type={openAddEditModal.type} noteData={openAddEditModal.data} onClose={()=>{
        setOpenAddEditModal({
          isShown:false,
          type:'add',
          data:null,
        });
      
      }}
      getAllNotes={getAllNotes}
      showToastMessage={showToastMsg}/>
      </Modal>
      <Toast isShown={showToastMessage.isShown} message={showToastMessage.message} type={showToastMessage.type} onClose={handleCloseToast}></Toast>

    </div>

  )
}

export default Home