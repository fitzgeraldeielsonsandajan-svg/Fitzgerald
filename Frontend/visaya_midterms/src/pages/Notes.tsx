import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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

function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotes();
    fetchCategories();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/notes/');
      const data = await response.json();
      setNotes(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching notes:', error);
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

  const deleteNote = async (id: number) => {
    if (confirm('Are you sure you want to delete this note?')) {
      try {
        await fetch(`http://localhost:8000/api/notes/${id}/`, {
          method: 'DELETE',
        });
        fetchNotes();
      } catch (error) {
        console.error('Error deleting note:', error);
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading notes...</div>;
  }

  return (
    <div className="notes-page">
      <Link to="/create" className="create-btn">+ Create New Note</Link>
      
      <div className="notes-grid">
        {notes.length === 0 ? (
          <p className="no-notes">No notes yet. Create your first note!</p>
        ) : (
          notes.map(note => (
            <div key={note.id} className="note-card">
              <h3 className="note-title">{note.title}</h3>
              <p className="note-preview">
                {note.body.substring(0, 100)}
                {note.body.length > 100 && '...'}
              </p>
              <div className="note-meta">
                <span className="note-category">{getCategoryName(note.category)}</span>
                <span className="note-date">
                  {new Date(note.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="note-actions">
                <Link to={`/note/${note.id}`} className="view-btn">View</Link>
                <button onClick={() => deleteNote(note.id)} className="delete-btn">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Notes;
