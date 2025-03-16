import React, { useState } from 'react';
import { MdAdd, MdClose } from 'react-icons/md';

const TagInput = ({ tags, setTags }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const addNewTag = () => {
    if (inputValue.trim() !== '') {
      setTags([...tags, inputValue]);
      setInputValue('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      addNewTag();
    }
  };

const handleRemoveTag  = (tagToRemove)=>{
      setTags(tags.filter((tag)=>tag!==tagToRemove));
};

  return (
    <div>
      {tags?.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap mt-2">
          {tags.map((tag, index) => (
            <span key={index} className="flex items-center gap-2 text-sm px-3 py-1 rounded bg-primary/10">
              #{tag}
              <button onClick={() =>handleRemoveTag(tag)} className="text-red-500">
                <MdClose />
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="flex items-center gap-4 mt-3">
        <input
          type="text"
          placeholder="Add tags"
          className="text-sm bg-transparent border px-3 py-2 outline-none rounded"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={addNewTag}
          className="size-8 flex items-center justify-center rounded border border-accent hover:bg-primary/10"
        >
          <MdAdd className="text-2xl text-accent hover:text-primary" />
        </button>
      </div>
    </div>
  );
};

export default TagInput;
