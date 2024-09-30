import React, { useState, useEffect } from 'react';

interface Comment {
  _id: string;
  content: string;
  timestamp: string;
}

const ChatBox: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    const response = await fetch('/api/data');
    const data = await response.json();
    setComments(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const response = await fetch('/api/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: newComment }),
    });

    if (response.ok) {
      setNewComment('');
      fetchComments();
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Reviews and Experiences</h2>
      <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
        {comments.map((comment) => (
          <div key={comment._id} className="bg-gray-100 p-3 rounded-lg">
            <p>{comment.content}</p>
            <p className="text-sm text-gray-500 mt-1">
              {new Date(comment.timestamp).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="mt-4">
        <textarea
          className="w-full p-2 border border-gray-300 rounded-md"
          rows={3}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Type your comment here..."
        ></textarea>
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ChatBox;