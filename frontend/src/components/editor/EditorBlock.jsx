import React from 'react';
import { Type, Quote, Image as ImageIcon, Trash2 } from 'lucide-react';
import RichTextEditor from './RichTextEditor';

const EditorBlock = ({ block, index, updateBlock, removeBlock, addBlock, handleBlockImageChange }) => {
  return (
    <div className='relative group flex flex-col gap-2'>
      <button onClick={() => removeBlock(block.id)} className='absolute -left-12 top-2 p-2 text-gray-700 hover:text-hoax opacity-0 group-hover:opacity-100 transition' title='Hapus Blok'>
        <Trash2 size={18} />
      </button>

      {/* BLOK TEKS */}
      {block.type === 'richtext' && (
        <div className='flex flex-col gap-1'>
          <RichTextEditor value={block.value} onChange={(val) => updateBlock(block.id, 'value', val)} />
          {block.value.length > 100 && (
            <input
              type='text'
              placeholder='Referensi/Sitasi (Wajib jika mengandung fakta/data dari luar)...'
              value={block.reference}
              onChange={(e) => updateBlock(block.id, 'reference', e.target.value)}
              className='w-full bg-charcoal/50 text-xs px-3 py-2 mt-1 rounded text-ink-muted outline-none border border-transparent focus:border-gray-700'
            />
          )}
        </div>
      )}

      {/* BLOK KUTIPAN */}
      {block.type === 'quote' && (
        <div className='flex flex-col gap-2 border-l-4 border-cyan pl-4 py-4 my-2 bg-charcoal/30 rounded-r-lg'>
          <textarea
            placeholder='Tulis kutipan narasumber/fakta di sini...'
            value={block.value}
            onChange={(e) => updateBlock(block.id, 'value', e.target.value)}
            className='w-full bg-transparent text-xl font-medium italic text-cyan outline-none resize-none'
            rows={2}
            onInput={(e) => {
              e.target.style.height = 'auto';
              e.target.style.height = e.target.scrollHeight + 'px';
            }}
          />
          <input
            type='text'
            placeholder='Sumber Kutipan (Contoh: Budi, Warga Setempat)...'
            value={block.reference}
            onChange={(e) => updateBlock(block.id, 'reference', e.target.value)}
            className='w-full bg-transparent text-sm text-ink-muted outline-none border-b border-gray-800 focus:border-cyan pb-1'
          />
        </div>
      )}

      {/* BLOK GAMBAR INLINE */}
      {block.type === 'image' && (
        <div className='flex flex-col gap-2 my-4'>
          {/* PERUBAHAN DI SINI: Cek block.preview ATAU block.value */}
          {block.preview || block.value ? (
            <img src={block.preview || block.value} alt='Inline' className='w-full rounded-lg shadow-md' />
          ) : (
            <label className='w-full h-48 flex items-center justify-center border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-cyan hover:bg-gray-900 transition'>
              <span className='text-sm text-gray-500 font-medium'>Klik untuk unggah gambar pendukung</span>
              <input type='file' accept='image/*' className='hidden' onChange={(e) => handleBlockImageChange(block.id, e)} />
            </label>
          )}

          {/* Tampilkan input sumber jika ada preview atau value */}
          {(block.preview || block.value) && (
            <input
              type='text'
              placeholder='Tuliskan keterangan dan sumber foto di sini...'
              value={block.source || ''}
              onChange={(e) => updateBlock(block.id, 'source', e.target.value)}
              className='w-full bg-transparent text-sm text-ink-muted italic border-b border-gray-800 outline-none focus:border-cyan pb-1 text-center'
            />
          )}
        </div>
      )}

      {/* TOOLBAR TAMBAH BLOK BARU */}
      <div className='opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 py-3 transition duration-300'>
        <div className='h-px bg-gray-800 flex-1'></div>
        <button type='button' onClick={() => addBlock('richtext', index)} className='p-2 rounded-full bg-charcoal border border-gray-700 hover:text-cyan hover:border-cyan transition shadow-lg' title='Tambah Teks'>
          <Type size={16} />
        </button>
        <button type='button' onClick={() => addBlock('quote', index)} className='p-2 rounded-full bg-charcoal border border-gray-700 hover:text-cyan hover:border-cyan transition shadow-lg' title='Tambah Kutipan'>
          <Quote size={16} />
        </button>
        <button type='button' onClick={() => addBlock('image', index)} className='p-2 rounded-full bg-charcoal border border-gray-700 hover:text-cyan hover:border-cyan transition shadow-lg' title='Tambah Gambar'>
          <ImageIcon size={16} />
        </button>
        <div className='h-px bg-gray-800 flex-1'></div>
      </div>
    </div>
  );
};

export default EditorBlock;
