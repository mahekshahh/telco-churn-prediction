from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

model = joblib.load("../churn_model.pkl")

class Customer(BaseModel):
    tenure: int
    MonthlyCharges: float
    TotalCharges: float
    NewCustomer: int
    HighCharges: int
    MonthlyContract: int
    Contract: int
    InternetService: int
    PaymentMethod: int

@app.post("/predict")
def predict(customer: Customer):
    data = np.array([[
        customer.tenure,
        customer.MonthlyCharges,
        customer.TotalCharges,
        customer.NewCustomer,
        customer.HighCharges,
        customer.MonthlyContract,
        customer.Contract,
        customer.InternetService,
        customer.PaymentMethod
    ]])
    
    prediction = model.predict(data)[0]
    probability = model.predict_proba(data)[0][1]
    
    return {
        "churn": bool(prediction),
        "probability": round(float(probability) * 100, 1),
        "risk": "High Risk" if probability > 0.7 else "Medium Risk" if probability > 0.4 else "Low Risk"
    }

@app.get("/")
def root():
    return {"message": "Churn Prediction API is running"}