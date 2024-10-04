import React, { useState } from 'react';

const ReplyComponent = ({ originalMessage, onSendReply }) => {
  const [replyMessage, setReplyMessage] = useState('');

  const handleSendReply = () => {
    onSendReply(replyMessage, originalMessage._id);
    setReplyMessage('');
  };

  return (
    <div>
      <div>
        Replying to: {originalMessage.message}
      </div>
      <input
        type="text"
        value={replyMessage}
        onChange={(e) => setReplyMessage(e.target.value)}
      />
      <button onClick={handleSendReply}>Send Reply</button>
    </div>
  );
};

export default ReplyComponent;
