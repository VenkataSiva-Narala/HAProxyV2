import React, { useState, useEffect } from "react";
import IpAddress from "../../IPConfig";
import {  useNavigate } from 'react-router-dom';

const CurrentConfigView = () => {
  const IP = IpAddress();
  const [jsonData, setJsonData] = useState([]);
  const [loadingFlag, setLoadingFlag] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  const localStorageKey = localStorage.getItem("proToken");

  useEffect(() => {
		if (!localStorageKey) {
            console.log('Token:', localStorageKey);
			navigate('/')
		}
	}, [])
  useEffect(() => {
    setLoadingFlag(true);
    fetch(IP + "current_haproxy", {
      headers: {
        Authorization: localStorageKey,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error === 0) {
          setJsonData(data.data);
        } else if (data.error === 1) {
          // navigate('/');
        }
        setLoadingFlag(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError(error);
        setLoadingFlag(false);
      });
  }, [IP, localStorageKey]);

  if (loadingFlag) {
    return <div style={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div style={styles.error}>Error: {error.message}</div>;
  }


  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Current Config View</h1>
      <div style={{ whiteSpace: "pre-line" }}>{jsonData}</div>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    color: "#333",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    maxWidth: "800px",
    margin: "40px auto",
  },
  header: {
    fontSize: "24px",
    marginBottom: "20px",
  },
  data: {
    backgroundColor: "#fff",
    padding: "15px",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    fontSize: "14px",
    overflow: "auto",
    maxHeight: "400px",
  },
  loading: {
    textAlign: "center",
    padding: "20px",
    fontSize: "18px",
    color: "#555",
  },
  error: {
    textAlign: "center",
    padding: "20px",
    fontSize: "18px",
    color: "red",
  },
};

export default CurrentConfigView;