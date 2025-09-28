import React from 'react';

const Notification = ({ message, type, visible }) => {
  if (!visible) {
    return null;
  }

  const notificationClass = `notification ${type === 'error' ? 'error' : 'success'}`;

  return (
    <div className={notificationClass}>
      {message}
    </div>
  );
};

export default Notification;