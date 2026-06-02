import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Chatbot from './components/Chatbot';
import MovieUpload from './components/MovieUpload';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/upload" element={<MovieUpload />} />
        <Route path="/" element={<Chatbot /> } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;