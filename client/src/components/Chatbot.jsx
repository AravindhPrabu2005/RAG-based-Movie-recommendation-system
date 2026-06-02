import React, { useState } from 'react';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi! Tell me what kind of movie you want to watch.'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: input })
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.reply || 'No response generated.'
        }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Something went wrong while fetching recommendations.'
        }
      ]);
    } finally {
      setLoading(false);
      setInput('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg flex flex-col h-[80vh]">
        <div className="p-4 border-b text-xl font-bold">Movie Chatbot</div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`max-w-[80%] rounded-2xl px-4 py-3 whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'ml-auto bg-black text-white'
                  : 'bg-slate-200 text-slate-900'
              }`}
            >
              {msg.content}
            </div>
          ))}

          {loading && (
            <div className="bg-slate-200 text-slate-900 max-w-[80%] rounded-2xl px-4 py-3">
              Thinking...
            </div>
          )}
        </div>

        <div className="p-4 border-t flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="I want a sci-fi movie with emotional depth..."
            className="flex-1 rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-black"
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="bg-black text-white px-5 py-3 rounded-xl hover:bg-slate-800 disabled:bg-slate-400"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;