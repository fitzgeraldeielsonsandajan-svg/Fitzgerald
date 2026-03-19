import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

interface Category {
  id: number;
  name: string;
}

function CreateNote() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    category: null as number | null,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/categories/');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/notes/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      navigate(`/note/${data.id}`);
    } catch (error) {
      console.error('Error creating note:', error);
      setLoading(false);
    }
  };

  return (
    <div className="create-page">
      <Link to="/" className="back-btn">← Back to Notes</Link>
      
      <div className="create-form-container">
        <h1>Create New Note</h1>
        <form onSubmit={handleSubmit} className="create-form">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter note title..."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
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
            <label htmlFor="body">Note Body</label>
            <textarea
              id="body"
              rows={12}
              value={formData.body}
              onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              placeholder="Write your note here..."
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="create-btn" disabled={loading}>
              {loading ? 'Creating...' : 'Create Note'}
            </button>
            <button type="button" onClick={() => navigate('/')} className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateNote;
