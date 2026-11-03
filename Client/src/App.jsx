
import { useEffect, useState } from "react";

function App() {
  const [serverStatus, setServerStatus] = useState("Checking...");
  const [error, setError] = useState("");

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/health"
        );

        if (!response.ok) {
          throw new Error("Backend request failed");
        }

        const result = await response.json();

        setServerStatus(result.message);

      } catch (error) {
        setError(error.message);
        setServerStatus("Backend not connected");
      }
    };

    checkBackend();
  }, []);

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Call Center Dashboard</h1>

      <h2>Backend Connection</h2>

      <p>{serverStatus}</p>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default App;
