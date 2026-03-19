import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

interface Note {
  id: number;
  title: string;
  body: string;
  category: number | null;
  created_at: string;
  updated_at: string;
}

interface Category {
  id: number;
  name: string;
}

function NoteDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [note, setNote] = useState<Note | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    category: null as number | null,
  });

  useEffect(() => {
    fetchNote();
    fetchCategories();
  }, [id]);

  const fetchNote = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/notes/${id}/`);
      const data = await response.json();
      setNote(data);
      setFormData({
        title: data.title,
        body: data.body,
        category: data.category,
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching note:', error);
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/categories/');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const getCategoryName = (categoryId: number | null) => {
    if (!categoryId) return 'Uncategorized';
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  const handleSave = async () => {
    try {
      await fetch(`http://localhost:8000/api/notes/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      setEditing(false);
      fetchNote();
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this note?')) {
      try {
        await fetch(`http://localhost:8000/api/notes/${id}/`, {
          method: 'DELETE',
        });
        navigate('/');
      } catch (error) {
        console.error('Error deleting note:', error);
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading note...</div>;
  }

  if (!note) {
    return <div className="not-found">Note not found</div>;
  }

  return (
    <div className="note-detail-page">
      <Link to="/" className="back-btn">← Back to Notes</Link>
      
      <div className="note-detail">
        {editing ? (
          <div className="edit-form">
            <h2>Edit Note</h2>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select
                value={formData.category || ''}
                onChange={(e) => setFormData({ ...formData, category: e.target.value ? Number(e.target.value) : null })}
              >
                <option value="">Uncategorized</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Body</label>
              <textarea
                rows={10}
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              />
            </div>
            <div className="form-actions">
              <button onClick={handleSave} className="save-btn">Save Changes</button>
              <button onClick={() => setEditing(false)} className="cancel-btn">Cancel</button>
            </div>
          </div>
        ) : (
          <div className="note-content">
            <div className="note-header">
              <h1 className="note-title">{note.title}</h1>
              <span className="note-category-badge">{getCategoryName(note.category)}</span>
            </div>
            <div className="note-meta">
              <span>Created: {new Date(note.created_at).toLocaleString()}</span>
              <span>Updated: {new Date(note.updated_at).toLocaleString()}</span>
            </div>
            <div className="note-body">
              {note.body}
            </div>
            <div className="note-actions">
              <button onClick={() => setEditing(true)} className="edit-btn">Edit</button>
              <button onClick={handleDelete} className="delete-btn">Delete</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default NoteDetail;
