import React, { useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from './Login.module.css';

function Login() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogin = async (user_name, password) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/login', { user_name, password });
      dispatch({ type: "LOGIN_SUCCESS", payload: response.data });
      setMessage("Login erfolgreich!");
      navigate.push("/dashboard");
    } catch (error) {
      setMessage(error.response?.data?.message || "Login fehlgeschlagen.");
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      user_name: "",
      password: "",
    },
    onSubmit: (values) => {
      handleLogin(values.user_name, values.password);
    },
    validationSchema: Yup.object({
      user_name: Yup.string()
        .trim()
        .required("Benutzername ist erforderlich"),
      password: Yup.string()
        .trim()
        .required("Passwort ist erforderlich"),
    }),
  });

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>
          Supotsu no Ochaya
          <br />
          Business Intelligence
        </h1>
        <h2 className={styles.subtitle}>Login</h2>
        <form className={styles.form} onSubmit={formik.handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="user_name">Benutzername</label>
            <input
              type="text"
              id="user_name"
              name="user_name"
              value={formik.values.user_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Benutzer*inname"
              className={
                formik.touched.user_name && formik.errors.user_name
                  ? styles.errorInput
                  : ""
              }
            />
            {formik.touched.user_name && formik.errors.user_name && (
              <div className={styles.error}>{formik.errors.user_name}</div>
            )}
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Passwort</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Passwort"
              className={
                formik.touched.password && formik.errors.password
                  ? styles.errorInput
                  : ""
              }
            />
            {formik.touched.password && formik.errors.password && (
              <div className={styles.error}>{formik.errors.password}</div>
            )}
          </div>
          <button
            type="submit"
            className={styles.button}
            disabled={loading}
          >
            {loading ? "Wird geladen..." : "Sign in"}
          </button>
        </form>
        {message && <div className={styles.message}>{message}</div>}
      </div>
    </div>
  );
}

export default Login;
