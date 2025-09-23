import React from "react";
import { useAuth } from "../contexts/AuthContext";

const DebugAuth = () => {
  const { user, loading } = useAuth();

  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        background: "black",
        color: "white",
        padding: "10px",
        borderRadius: "5px",
        fontSize: "12px",
        zIndex: 9999,
      }}
    >
      <div>Loading: {loading ? "true" : "false"}</div>
      <div>User: {user ? JSON.stringify(user, null, 2) : "null"}</div>
      <div>Token: {localStorage.getItem("token") || "none"}</div>
    </div>
  );
};

export default DebugAuth;
