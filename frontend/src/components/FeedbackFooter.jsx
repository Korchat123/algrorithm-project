import { useState } from 'react';
import { MessageSquare, CheckCircle } from 'lucide-react';

export function FeedbackFooter() {
  const [content, setContent] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ content, email })
      });
      if (res.ok) {
        setStatus('success');
        setContent('');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  return (
    <footer className="feedback-footer">
      <div className="feedback-container">
        <p className="eyebrow">Improvement</p>
        <h2>Feedback</h2>
        <p>Send a note to help improve Algorithm Lab.</p>
        
        {status === 'success' ? (
          <div className="hint-box done">
            <CheckCircle size={20} /> Thank you! Your feedback has been sent.
          </div>
        ) : (
          <form className="feedback-form" onSubmit={handleSubmit}>
            <label className="sr-only" htmlFor="feedback-email">Email</label>
            <input 
              id="feedback-email"
              className="feedback-email"
              type="email" 
              placeholder="Your email (optional)" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label className="sr-only" htmlFor="feedback-note">Feedback note</label>
            <textarea 
              id="feedback-note"
              className="feedback-note"
              placeholder="How can we improve?" 
              required 
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <button type="submit">
              <MessageSquare size={18} /> Send Improvement
            </button>
          </form>
        )}
        {status === 'error' && <p className="text-error">Failed to send feedback. Please try again.</p>}
      </div>
    </footer>
  );
}
