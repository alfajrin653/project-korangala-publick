import React, { useRef } from 'react';
import { Bold, Italic, Underline, Link as LinkIcon, List, ListOrdered, Heading2 } from 'lucide-react';

const RichTextEditor = ({ value, onChange }) => {
  const editorRef = useRef(null);

  const handleFormat = (command, val = null) => {
    document.execCommand(command, false, val);
    if (editorRef.current) {
      editorRef.current.focus();
      onChange(editorRef.current.innerHTML);
    }
  };

  const addLink = () => {
    const url = prompt('Masukkan URL (contoh: https://...):');
    if (url) handleFormat('createLink', url);
  };

  // FUNGSI PEMBERSIH: Mencegah background putih & font luar ikut ter-copy
  const handlePaste = (e) => {
    e.preventDefault();

    // Ambil hanya teks mentah (plain text) dari clipboard, abaikan HTML/gaya luar
    const text = e.clipboardData.getData('text/plain');

    // Masukkan teks mentah tersebut secara bersih ke posisi kursor
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    selection.deleteFromDocument();

    const range = selection.getRangeAt(0);
    range.insertNode(document.createTextNode(text));

    // Pindahkan kursor ke akhir teks yang baru dimasukkan
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);

    // Kirim perubahan terbaru ke komponen induk
    if (editorRef.current && onChange) {
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div className='border border-gray-800 rounded-lg overflow-hidden bg-charcoal focus-within:border-cyan transition'>
      <div className='flex flex-wrap items-center gap-1 bg-obsidian p-2 border-b border-gray-800'>
        <button type='button' onClick={() => handleFormat('formatBlock', 'H2')} className='p-1.5 text-gray-400 hover:bg-gray-800 hover:text-cyan rounded transition' title='Subjudul'>
          <Heading2 size={16} />
        </button>
        <div className='w-px h-4 bg-gray-700 mx-1'></div>
        <button type='button' onClick={() => handleFormat('bold')} className='p-1.5 text-gray-400 hover:bg-gray-800 hover:text-cyan rounded transition' title='Bold (Tebal)'>
          <Bold size={16} />
        </button>
        <button type='button' onClick={() => handleFormat('italic')} className='p-1.5 text-gray-400 hover:bg-gray-800 hover:text-cyan rounded transition' title='Italic (Miring)'>
          <Italic size={16} />
        </button>
        <button type='button' onClick={() => handleFormat('underline')} className='p-1.5 text-gray-400 hover:bg-gray-800 hover:text-cyan rounded transition' title='Underline (Garis Bawah)'>
          <Underline size={16} />
        </button>
        <div className='w-px h-4 bg-gray-700 mx-1'></div>
        <button type='button' onClick={() => handleFormat('insertUnorderedList')} className='p-1.5 text-gray-400 hover:bg-gray-800 hover:text-cyan rounded transition' title='Bullet List'>
          <List size={16} />
        </button>
        <button type='button' onClick={() => handleFormat('insertOrderedList')} className='p-1.5 text-gray-400 hover:bg-gray-800 hover:text-cyan rounded transition' title='Numbered List'>
          <ListOrdered size={16} />
        </button>
        <div className='w-px h-4 bg-gray-700 mx-1'></div>
        <button type='button' onClick={addLink} className='p-1.5 text-gray-400 hover:bg-gray-800 hover:text-cyan rounded transition' title='Hyperlink'>
          <LinkIcon size={16} />
        </button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning={true}
        onPaste={handlePaste} // <--- KUNCI UTAMA PEMBERSIH FORMAT LUAR
        onBlur={(e) => onChange(e.currentTarget.innerHTML)}
        className='p-4 min-h-[120px] outline-none text-ink leading-relaxed [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mb-2 [&>a]:text-cyan [&>a]:underline'
        dangerouslySetInnerHTML={{ __html: value }}
      />
    </div>
  );
};

export default RichTextEditor;
