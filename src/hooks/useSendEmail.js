// useSendEmail.js
import { useState } from "react";

const useSendEmail = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const sendEmail = async (to, subject, text, html) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/email/send-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ to, subject, text, html }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send email");
      }

      const data = await response.json();
      setSuccess(data.message);
    } catch (err) {
      setError("error in backend", err.message);
    } finally {
      setLoading(false);
    }
  };

  return { sendEmail, loading, error, success };
};

export default useSendEmail;
