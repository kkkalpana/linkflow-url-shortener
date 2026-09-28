import { useEffect } from "react";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

const RedirectHandler = () => {
  const { code } = useParams();

  useEffect(() => {
    const backendUrl = import.meta.env.DEV
      ? "http://localhost:5002"
      : import.meta.env.VITE_API_BASE_URL?.replace(/\/api\/?$/, "") ||
        "https://linkflow-url-shortener.onrender.com";

    window.location.replace(`${backendUrl}/${code}`);
  }, [code]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "80vh",
        color: "var(--text-secondary)",
      }}
    >
      <LoadingSpinner size="lg" />
      <p style={{ marginTop: "var(--space-md)", fontSize: "1.1rem" }}>
        Redirecting you to your destination...
      </p>
    </div>
  );
};

export default RedirectHandler;
