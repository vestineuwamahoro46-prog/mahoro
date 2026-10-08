import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, Loader2, Save, X, FileText } from 'lucide-react';
import { api } from '../../lib/api.js';
import type { BlogPost } from '../../types/research.js';
import { useAuth } from '../../context/AuthContext.js';

export const AdminBlogPage: React.FC = () => {
  const { hasRole, user } = useAuth();
  const [blog, setBlog] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<BlogPost> | null>(null);
  const [saving, setSaving] = useState(false);

  const canEdit = hasRole('SUPER_ADMIN', 'ADMIN', 'CONTENT_EDITOR');

  const loadBlog = () => {
    setLoading(true);
    api.getAdminBlog()
      .then((data) => setBlog(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadBlog();
  }, []);

  const handleOpenCreate = () => {
    setEditingItem({
      title: '',
      category: 'Compliance Practice',
      featuredImage: '/src/assets/images/blog_forensic_investigation_1791454491528.jpg',
      content: '',
      author: user?.name || 'MAHORO Cesar',
      authorRole: 'Lead Investigator & AML/CFT Compliance Specialist',
      readingTime: '5 min read',
      published: true,
      tags: ['AML/CFT', 'Rwanda', 'Beneficial Ownership'],
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item: BlogPost) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.title || !editingItem?.content) {
      alert('Title and content are required.');
      return;
    }

    setSaving(true);
    try {
      await api.saveBlog(editingItem, editingItem.id);
      setModalOpen(false);
      loadBlog();
    } catch (err: any) {
      alert(err.message || 'Failed to save blog post.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete blog post "${title}"?`)) return;
    try {
      await api.deleteBlog(id);
      loadBlog();
    } catch (err: any) {
      alert(err.message || 'Failed to delete blog post.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <h1 className="text-2xl font-serif font-bold text-stone-900">
            Research Blog & Essay Management
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Publish academic monographs, legal analysis, and empirical essays.
          </p>
        </div>

        {canEdit && (
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Write New Essay</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-stone-400 gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="text-xs">Loading blog posts...</span>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600">
              <tr>
                <th className="p-4 font-semibold">Essay Title</th>
                <th className="p-4 font-semibold">Author</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Reading Time</th>
                <th className="p-4 font-semibold">Published</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {blog.map((item) => (
                <tr key={item.id} className="hover:bg-stone-50/50">
                  <td className="p-4 max-w-sm">
                    <span className="font-medium text-stone-900 block leading-snug">{item.title}</span>
                  </td>
                  <td className="p-4 text-stone-800 font-medium">{item.author}</td>
                  <td className="p-4 text-stone-600">{item.category}</td>
                  <td className="p-4 text-stone-500 font-mono text-[11px]">{item.readingTime}</td>
                  <td className="p-4">
                    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold ${item.published ? 'bg-emerald-50 text-emerald-800' : 'bg-stone-100 text-stone-600'}`}>
                      {item.published ? 'Live' : 'Draft'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {canEdit && (
                        <>
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 text-stone-600 hover:text-stone-900 rounded hover:bg-stone-100 cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id, item.title)}
                            className="p-1.5 text-rose-600 hover:text-rose-800 rounded hover:bg-rose-50 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create / Edit Modal */}
      {modalOpen && editingItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-stone-200 overflow-hidden">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <h3 className="text-sm font-serif font-bold text-stone-900">
                {editingItem.id ? 'Edit Research Essay' : 'Draft New Research Essay'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Essay Title *</label>
                <input
                  type="text"
                  required
                  value={editingItem.title || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Author Name</label>
                  <input
                    type="text"
                    value={editingItem.author || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, author: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Category</label>
                  <input
                    type="text"
                    value={editingItem.category || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Author Role / Affiliation</label>
                  <input
                    type="text"
                    value={editingItem.authorRole || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, authorRole: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Reading Time</label>
                  <input
                    type="text"
                    value={editingItem.readingTime || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, readingTime: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Essay Body Content *</label>
                <textarea
                  rows={8}
                  required
                  value={editingItem.content || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
                  placeholder="Enter markdown or longform text..."
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-xs font-serif leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="pubBlogCheck"
                  checked={editingItem.published}
                  onChange={(e) => setEditingItem({ ...editingItem, published: e.target.checked })}
                  className="w-4 h-4 rounded text-stone-900"
                />
                <label htmlFor="pubBlogCheck" className="text-stone-700 font-medium cursor-pointer">
                  Publish essay on public blog
                </label>
              </div>

              <div className="pt-4 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded-lg text-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-stone-900 text-white rounded-lg font-semibold flex items-center gap-1.5"
                >
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>Save Essay</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
