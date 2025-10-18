import React, { useState } from 'react';
import { toast } from 'react-toastify';

const FeedbackSupport = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("feedback");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name || !email || !message) {
      toast.error("Please fill all fields!");
      return;
    }

   
      toast.success("Thank you for your feedback!");
    
    setName("");
    setEmail("");
    setCategory("feedback");
    setMessage("");
  };

  return (
    console.log("we are at feedback page "),
     <div className="max-w-md mx-auto p-6 mt-16"> 
      <h2 className="text-2xl font-bold mb-4 text-green-600">Feedback & Support</h2>
      <p className="text-gray-600 mb-4">
        Help us improve MagicCoupon by sharing your feedback or reporting issues.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input 
          type="text" 
          placeholder="Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)}
          className="p-2 border rounded-md"
        />
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 border rounded-md"
        />

        <select 
          value={category} 
          onChange={(e) => setCategory(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="feedback">Feedback</option>
          <option value="bug">Report a Bug</option>
          <option value="suggestion">Suggestion</option>
        </select>

        <textarea 
          placeholder="Your message..." 
          rows="4" 
          value={message} 
          onChange={(e) => setMessage(e.target.value)}
          className="p-2 border rounded-md"
        ></textarea>

        <button 
          type="submit" 
          className="bg-green-600 text-white p-2 rounded-md hover:bg-green-700"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default FeedbackSupport;
