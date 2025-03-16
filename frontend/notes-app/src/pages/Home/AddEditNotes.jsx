import React, { useState } from 'react'
import TagInput from '../../components/Input/TagInput'
import { MdClose } from 'react-icons/md';
import axiosInstance from '../../utils/axiosInstance';

const AddEditNotes = ({noteData,type,getAllNotes,onClose,showToastMessage}) => {
    const [title,setTitle] = useState(noteData?.title||'');
    const [content,setContent]=useState(noteData?.content||'');
    const [tags,setTags]=useState(noteData?.tags||[]);
    const[error,setError]=useState(null);

    const addNewNote = async()=>{
        try{
            const response =await axiosInstance.post("/add-note",{
                title,content,tags
            });
            if(response.data&&response.data.note){
                showToastMessage("Note added successfully");
               getAllNotes();
               onClose();
            }
        }catch(error){
            if(error.response&&error.response.data&&error.response.data.message){
                setError(error.response.data.message);
            }
        }
    };

    const editNote = async()=>{
        const noteId = noteData._id
        try{
            const response =await axiosInstance.put("/edit-note/"+noteId,{
                title,content,tags
            });
            if(response.data&&response.data.note){
                showToastMessage("Note updated successfully");
               getAllNotes()
               onClose()
            }
        }catch(error){
            if(error.response&&error.response.data&&error.response.data.message){
                setError(error.response.data.message);
            }
        }

    };


    const handleAddNote = ()=>{
        if(!title){
            setError('Title is required');
            return;
        }
        if(!content){
            setError('Content is required');
            return;
        }
        setError(null);
        if(type==='edit'){
            editNote();
        }else{
            addNewNote();
        }
    };
  return (
    <div className='relative'>
        <button className='size-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-accent/10' onClick={onClose}>
        <MdClose className='text-primary'></MdClose></button>
        <div className="flex flex-col gap-2">
            <label className='input-label text-accent'>TITLE</label>
            <input type="text" className='text-2xl text-primary outline-none' placeholder='add title here' value={title} onChange={({target})=>setTitle(target.value)} />
        </div>
        <div className="flex flex-col gap-2 mt-4">
        <label className='input-label text-accent'>CONTENT</label>
        <textarea className='text-sm outline-none  p-2 rounded' placeholder='content' rows={10} 
        value={content} onChange={({target})=>setContent(target.value)}
        ></textarea>
        </div>  
        <div className="mt-3">
            <label  className="input-label">TAGS</label>
            <TagInput tags={tags} setTags={setTags}/>
        </div>
        {error && <p className='text-red-500 text-xs'>{error}</p>}
        <button className='btn-primary bg-accent hover:bg-secondary font-medium mt-5 p-3' onClick={handleAddNote}>{type==='edit'?'UPDATE':'ADD'}</button>
    </div>
  )
}

export default AddEditNotes