export const Message = ({ text, onLongPress }) => {
    let timer;
  
    const startTimer = () => {
      timer = setTimeout(() => {
        onLongPress();
      }, 500);
    };
  
    const clearTimer = () => {
      clearTimeout(timer);
    };
  
    return (
      <div
        onMouseDown={startTimer}
        onMouseUp={clearTimer}
        onMouseLeave={clearTimer}
        onTouchStart={startTimer}
        onTouchEnd={clearTimer}
        onTouchCancel={clearTimer}
        style={{ padding: '10px', border: '1px solid #ccc', margin: '5px' }}
      >
        {text}
      </div>
    );
  };