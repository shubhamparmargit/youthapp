import React, { useState, useEffect } from "react";

const TextTruncate = ({ text = "", maxLines }) => {
  const [expanded, setExpanded] = useState(false);
  const [totalLines, setTotalLines] = useState(0);

  const calculateLines = (text) => {
    if (!text) return 0;

    const tempElement = document.createElement("div");
    tempElement.style.visibility = "hidden";
    tempElement.style.position = "absolute";
    tempElement.style.width = "100%";
    tempElement.style.lineHeight = "1.5";
    tempElement.style.fontSize = "14px";
    tempElement.style.wordWrap = "break-word";
    tempElement.innerHTML = text;

    document.body.appendChild(tempElement);

    const lineHeight = parseFloat(window.getComputedStyle(tempElement).lineHeight);
    const totalHeight = tempElement.clientHeight;

    const totalLines = Math.ceil(totalHeight / lineHeight);

    document.body.removeChild(tempElement);

    return totalLines;
  };

  useEffect(() => {
    const lines = calculateLines(text);
    setTotalLines(lines);
  }, [text]);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <div>
      <div
        style={{
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: expanded ? totalLines : maxLines,
          overflow: "hidden",
          textOverflow: "ellipsis",
          wordWrap: "break-word",
        }}
      >
        {text}
      </div>

      {totalLines > maxLines && (
        <span
          onClick={toggleExpanded}
          style={{ color: "blue", cursor: "pointer", marginTop: "5px", fontSize: "12px" }}
        >
          {expanded ? "See less" : "See more"}
        </span>
      )}
    </div>
  );
};

export default TextTruncate;