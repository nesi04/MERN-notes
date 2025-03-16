import React from 'react'
import { MdOutlinePushPin } from 'react-icons/md'
import { MdCreate, MdDelete } from 'react-icons/md'

const NoteCard = ({ title, date, content, tags, isPinned, onEdit, onDelete, onPinNote }) => {
  return (
    <div className="border rounded p-3 bg-accent-content hover:shadow-xl transition-all ease-in-out text-sm max-w-full">
      {/* Title & Pin */}
      <div className="flex items-start justify-between gap-2">
        <div className="w-full">
          <h6 className="text-sm font-medium text-accent truncate max-w-full">{title}</h6>
          <span className="text-xs text-secondary block">{date}</span>
        </div>
        <MdOutlinePushPin 
          className={`icon-btn ${isPinned ? 'text-white' : 'text-accent'}`} 
          onClick={onPinNote} 
        />
      </div>

      {/* Content */}
      <p className="text-xs mt-2 line-clamp-2">{content?.slice(0, 100)}</p>

      {/* Tags & Actions */}
      <div className="flex flex-wrap items-center justify-between mt-2 gap-2">
        <div className="text-xs text-secondary/60 flex flex-wrap gap-1">
          {tags.map((item, index) => (
            <span key={index} className="whitespace-nowrap">#{item}</span>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <MdCreate className="icon-btn text-sm hover:text-green-600" onClick={onEdit} />
          <MdDelete className="icon-btn text-sm hover:text-red-600" onClick={onDelete} />
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
