import React from "react";

export default ({ title, onClick }) => (
  <button type="button" onClick={onClick}>
    {title}
  </button>
);
