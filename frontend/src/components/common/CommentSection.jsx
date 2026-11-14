import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { articlesApi } from '../../api/endpoints';
import { MessageSquare, Send, User } from 'lucide-react';

export default function CommentSection({ articleId, articleSlug }) {
  const navigate = useNavigate();
  // 1. KITA HAPUS 'token', cukup panggil 'user' saja
  const { user } = useAuthStore();

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tarik daftar komentar saat komponen dimuat
  useEffect(() => {
    if (articleId) {
      articlesApi
        .getComments(articleId)
        .then((res) => setComments(res.data.data || []))
        .catch((err) => console.error('Gagal memuat komentar:', err));
    }
  }, [articleId]);

  // Cek apakah ada draft komentar di memori lokal
  useEffect(() => {
    const draft = localStorage.getItem(`draft_comment_${articleSlug}`);
    if (draft) {
      setNewComment(draft);
      localStorage.removeItem(`draft_comment_${articleSlug}`);
    }
  }, [articleSlug]);

  // Fungsi Menangani Pengiriman Komentar
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (!user) {
      localStorage.setItem(`draft_comment_${articleSlug}`, newComment);
      navigate(`/masuk?redirect=/artikel/${articleSlug}`);
      return;
    }

    setIsSubmitting(true);
    try {
      // 2. TIDAK PERLU LAGI CEK TOKEN ATAU MENAMPILKAN ALERT ERROR

      // 3. KIRIM REQUEST LANGSUNG (Axios via HttpOnly Cookie akan mengurus sisanya!)
      const res = await articlesApi.addComment(articleId, { content: newComment });

      const createdComment = res.data.data;
      setComments([createdComment, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Detail Error:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Gagal mengirim komentar. Cek console untuk detailnya.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const BASE_URL = 'http://localhost:4000/';

  return (
    <div className='mt-12 border-t border-white/10 pt-8'>
      <h3 className='text-2xl font-heading font-bold text-ink mb-6 flex items-center gap-2'>
        <MessageSquare size={24} className='text-cyan' />
        Komentar ({comments.length})
      </h3>

      {/* FORM KOMENTAR */}
      <form onSubmit={handleSubmit} className='mb-10 flex gap-4'>
        <div className='w-10 h-10 shrink-0 rounded-full bg-charcoal border border-gray-700 flex items-center justify-center overflow-hidden'>
          {user?.avatar_url ? <img src={user.avatar_url.startsWith('http') ? user.avatar_url : `${BASE_URL}${user.avatar_url}`} alt='Avatar' className='w-full h-full object-cover' /> : <User size={20} className='text-gray-500' />}
        </div>
        <div className='flex-1 relative'>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder='Tulis pendapat Anda di sini...'
            className='w-full bg-obsidian border border-gray-700 rounded-lg p-3 pb-12 text-ink text-sm outline-none focus:border-cyan resize-none min-h-[100px]'
            required
          />
          <button
            type='submit'
            disabled={isSubmitting}
            className={`absolute bottom-3 right-3 flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${isSubmitting ? 'bg-gray-700 text-gray-500' : 'bg-cyan text-obsidian hover:bg-cyan/80'}`}
          >
            {user ? (isSubmitting ? 'Mengirim...' : 'Kirim') : 'Login untuk Kirim'}
            <Send size={14} />
          </button>
        </div>
      </form>

      {/* DAFTAR KOMENTAR */}
      <div className='space-y-6'>
        {comments.length === 0 ? (
          <p className='text-ink-muted text-sm italic text-center py-8'>Belum ada komentar. Jadilah yang pertama!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className='flex gap-4'>
              <div className='w-10 h-10 shrink-0 rounded-full bg-charcoal overflow-hidden'>
                {comment.user?.avatar_url ? (
                  <img src={comment.user.avatar_url.startsWith('http') ? comment.user.avatar_url : `${BASE_URL}${comment.user.avatar_url}`} alt={comment.user.name} className='w-full h-full object-cover' />
                ) : (
                  <div className='w-full h-full flex items-center justify-center bg-gray-800 text-white font-bold text-sm'>{comment.user?.name?.charAt(0).toUpperCase()}</div>
                )}
              </div>
              <div className='flex-1 bg-charcoal/30 rounded-lg p-4 border border-white/5'>
                <div className='flex items-center gap-2 mb-2'>
                  <span className='font-bold text-ink text-sm'>{comment.user?.name}</span>
                  {comment.user?.nik_verified && <span className='bg-emerald/20 text-emerald text-[10px] px-1.5 py-0.5 rounded font-bold'>Terverifikasi</span>}
                  <span className='text-xs text-ink-muted ml-auto'>{new Date(comment.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
                <p className='text-sm text-ink/90 leading-relaxed whitespace-pre-wrap'>{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
