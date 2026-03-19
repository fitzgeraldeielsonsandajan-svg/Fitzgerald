import { BrowserRouter, Routes, Route } from "react-router-dom";
import Notes from "./pages/Notes";
import NoteDetail from "./pages/NoteDetail";
import CreateNote from "./pages/CreateNote";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="container">
        <h1 className="app-title"> NOTEPAD</h1>

        <Routes>
          <Route path="/" element={<Notes />} />
          <Route path="/note/:id" element={<NoteDetail />} />
          <Route path="/create" element={<CreateNote />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;