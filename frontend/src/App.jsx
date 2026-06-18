import { useState } from "react"

export default function App() {
  const [form, setForm] = useState({
    tenure: "",
    MonthlyCharges: "",
    TotalCharges: "",
    Contract: "0",
    InternetService: "0",
    PaymentMethod: "0",
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    setLoading(true)
    const tenure = parseInt(form.tenure)
    const MonthlyCharges = parseFloat(form.MonthlyCharges)
    const TotalCharges = parseFloat(form.TotalCharges)

    const payload = {
      tenure,
      MonthlyCharges,
      TotalCharges,
      NewCustomer: tenure <= 12 ? 1 : 0,
      HighCharges: MonthlyCharges >= 70 ? 1 : 0,
      MonthlyContract: form.Contract === "0" ? 1 : 0,
      Contract: parseInt(form.Contract),
      InternetService: parseInt(form.InternetService),
      PaymentMethod: parseInt(form.PaymentMethod),
    }

    const res = await fetch("http://127.0.0.1:8001/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    setResult(data)
    setLoading(false)
  }

  const riskColor = result?.risk === "High Risk"
    ? { bg: "#fde8e8", border: "#e74c3c", text: "#c0392b" }
    : result?.risk === "Medium Risk"
    ? { bg: "#fef9e7", border: "#f39c12", text: "#d68910" }
    : { bg: "#e8f5e9", border: "#27ae60", text: "#1e8449" }

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        <div style={styles.header}>
          <h1 style={styles.title}>Churn Predictor</h1>
          <p style={styles.subtitle}>Enter customer details to predict churn risk</p>
        </div>

        <div style={styles.formGrid}>
          <div style={styles.field}>
            <label style={styles.label}>Tenure (months)</label>
            <input style={styles.input} name="tenure" value={form.tenure} onChange={handleChange} placeholder="e.g. 6" />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Monthly Charges ($)</label>
            <input style={styles.input} name="MonthlyCharges" value={form.MonthlyCharges} onChange={handleChange} placeholder="e.g. 85" />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Total Charges ($)</label>
            <input style={styles.input} name="TotalCharges" value={form.TotalCharges} onChange={handleChange} placeholder="e.g. 510" />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Contract Type</label>
            <select style={styles.input} name="Contract" value={form.Contract} onChange={handleChange}>
              <option value="0">Month-to-month</option>
              <option value="1">One year</option>
              <option value="2">Two year</option>
            </select>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Internet Service</label>
            <select style={styles.input} name="InternetService" value={form.InternetService} onChange={handleChange}>
              <option value="0">DSL</option>
              <option value="1">Fiber optic</option>
              <option value="2">No internet</option>
            </select>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Payment Method</label>
            <select style={styles.input} name="PaymentMethod" value={form.PaymentMethod} onChange={handleChange}>
              <option value="0">Bank transfer</option>
              <option value="1">Credit card</option>
              <option value="2">Electronic check</option>
              <option value="3">Mailed check</option>
            </select>
          </div>
        </div>

        <button style={styles.button} onClick={handleSubmit}>
          {loading ? "Predicting..." : "Predict Churn"}
        </button>

        {result && (
          <div style={{
            ...styles.result,
            background: riskColor.bg,
            borderColor: riskColor.border,
          }}>
            <div style={styles.resultLeft}>
              <p style={styles.resultLabel}>Prediction</p>
              <p style={{ ...styles.resultVerdict, color: riskColor.text }}>
                {result.churn ? "Will Churn" : "Will Stay"}
              </p>
              <p style={{ ...styles.resultRisk, color: riskColor.text }}>{result.risk}</p>
            </div>
            <p style={styles.resultProb}>{result.probability}%</p>
          </div>
        )}

      </div>
    </div>
  )
}

const styles = {
  page: {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#F5F0E8",
    fontFamily: "'DM Sans', sans-serif",
    overflow: "hidden",
    margin: "0",
    padding: "0",
  },
  card: {
    background: "#ffffff",
    borderRadius: "16px",
    padding: "2rem",
    width: "60vw",
    maxWidth: "60vw",
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: "1.2rem",
  },
  header: {
    borderBottom: "1.5px solid #E8E8E0",
    paddingBottom: "0.8rem",
  },
  title: {
    color: "#2D4A2D",
    fontSize: "1.6rem",
    fontWeight: "700",
    margin: "0 0 0.2rem 0",
  },
  subtitle: {
    color: "#6B8F6B",
    fontSize: "0.85rem",
    margin: "0",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "0.8rem",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "0.3rem",
  },
  label: {
    color: "#2D4A2D",
    fontSize: "0.75rem",
    fontWeight: "600",
    letterSpacing: "0.03em",
  },
  input: {
    padding: "0.55rem 0.8rem",
    borderRadius: "8px",
    border: "1.5px solid #C5D9B5",
    fontSize: "0.85rem",
    color: "#2D4A2D",
    background: "#FAFAF7",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  },
  button: {
    padding: "0.75rem",
    background: "#2D4A2D",
    color: "#F5F0E8",
    border: "none",
    borderRadius: "8px",
    fontSize: "0.95rem",
    fontWeight: "600",
    cursor: "pointer",
    width: "100%",
  },
  result: {
    borderRadius: "10px",
    border: "2px solid",
    padding: "1rem 1.5rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    gap: "0.2rem",
  },
  resultLeft: {
    display: "flex",
    flexDirection: "column",
    gap: "0.1rem",
  },
  resultLabel: {
    fontSize: "0.7rem",
    fontWeight: "600",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#6B8F6B",
    margin: "0",
  },
  resultVerdict: {
    fontSize: "1.3rem",
    fontWeight: "700",
    margin: "0",
  },
  resultRisk: {
    fontSize: "0.8rem",
    fontWeight: "600",
    margin: "0",
  },
  resultProb: {
    fontSize: "2.2rem",
    fontWeight: "700",
    color: "#2D4A2D",
    margin: "0",
  },
}