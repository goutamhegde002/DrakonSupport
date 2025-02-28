from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import os

# Data Models
class CustomerQuery(BaseModel):
    query: str
    order_number: Optional[str] = None

class ResponseTemplate(BaseModel):
    flags: str
    instruction: str
    category: str
    intent: str
    response: str

class PredictionResponse(BaseModel):
    intent: str
    category: str
    response: str
    confidence: float
    template_flags: str

# Initialize FastAPI app
app = FastAPI(title="Customer Service API")

class CustomerServiceBot:
    def __init__(self):
        # Use the current directory to find the CSV file
        current_dir = os.path.dirname(os.path.abspath(__file__))
        self.data_path = os.path.join(current_dir, "customer_service_data.csv")
        
        self.vectorizer = TfidfVectorizer(
            ngram_range=(1, 2),
            max_features=5000,
            stop_words="english"
        )
        self.df = None
        self.X = None  # Will hold the vectorized data

        self.load_data()
        self.prepare_classifier()

    def load_data(self):
        """Load and prepare the dataset"""
        try:
            print(f"Loading dataset from {self.data_path}...")
            self.df = pd.read_csv(self.data_path)
            self.df = self.df.dropna().reset_index(drop=True)
            print(f"Loaded {len(self.df)} records successfully.")
        except Exception as e:
            print(f"Failed to load CSV file: {e}")
            # Create a sample dataset if file not found
            print("Creating a sample dataset...")
            self.df = pd.DataFrame({
                'flags': ['password reset', 'business hours'],
                'instruction': ['How to reset password', 'Working hours question'],
                'category': ['account', 'general'],
                'intent': ['password_reset', 'hours_inquiry'],
                'response': ['You can reset your password by clicking on the "Forgot Password" link.', 
                            'We are open Monday-Friday, 9am-5pm.']
            })
            # Save this sample data
            self.df.to_csv(self.data_path, index=False)
            print(f"Sample dataset created and saved to {self.data_path}")

    def prepare_classifier(self):
        """Prepare the TF-IDF vectorizer and fit it to the instructions"""
        if self.df is None or self.df.empty:
            raise RuntimeError("Dataset is empty or missing required columns ('flags', 'instruction').")
        
        if "flags" not in self.df or "instruction" not in self.df:
            raise RuntimeError("Required columns ('flags', 'instruction') are missing from dataset.")

        print("Training TF-IDF model...")
        self.combined_text = self.df["flags"] + " " + self.df["instruction"]
        self.X = self.vectorizer.fit_transform(self.combined_text)
        print("TF-IDF model training complete.")

    def replace_order_number(self, text: str, order_number: Optional[str]) -> str:
        """Replace the order number placeholder with actual order number"""
        if order_number:
            return text.replace("{{Order Number}}", order_number)
        return text

    def predict(self, query: str, order_number: Optional[str] = None) -> dict:
        """Predict the intent and generate a response for a given query"""
        if self.X is None:
            raise RuntimeError("Model has not been trained. Ensure data is loaded correctly.")

        # Vectorize the query
        query_vector = self.vectorizer.transform([query])
        
        # Calculate similarities
        similarities = cosine_similarity(query_vector, self.X)[0]
        
        # Get the best match
        best_match_idx = np.argmax(similarities)
        confidence = similarities[best_match_idx]
        
        # Get the matching row from the dataset
        matched_row = self.df.iloc[best_match_idx]
        
        # Replace order number in response if provided
        response = self.replace_order_number(matched_row["response"], order_number)
        
        return {
            "intent": matched_row["intent"],
            "category": matched_row["category"],
            "response": response,
            "confidence": float(confidence),
            "template_flags": matched_row["flags"]
        }

# Initialize the bot
bot = CustomerServiceBot()

@app.post("/predict", response_model=PredictionResponse)
async def predict_intent(query: CustomerQuery):
    """
    Predict intent and generate response for customer query
    """
    try:
        result = bot.predict(query.query, query.order_number)
        return PredictionResponse(**result)
    except KeyError as ke:
        raise HTTPException(status_code=400, detail=f"Invalid key in request: {ke}")
    except ValueError as ve:
        raise HTTPException(status_code=422, detail=f"Value error: {ve}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@app.get("/intents", response_model=List[str])
async def get_intents():
    """
    Get list of all available intents
    """
    if bot.df is None or "intent" not in bot.df:
        raise HTTPException(status_code=500, detail="Intents are not available.")
    return bot.df["intent"].unique().tolist()

@app.get("/categories", response_model=List[str])
async def get_categories():
    """
    Get list of all available categories
    """
    if bot.df is None or "category" not in bot.df:
        raise HTTPException(status_code=500, detail="Categories are not available.")
    return bot.df["category"].unique().tolist()

@app.get("/templates/{intent}", response_model=List[ResponseTemplate])
async def get_templates(intent: str):
    """
    Get all response templates for a specific intent
    """
    if bot.df is None or "intent" not in bot.df:
        raise HTTPException(status_code=500, detail="Templates are not available.")

    templates = bot.df[bot.df["intent"] == intent].to_dict("records")
    if not templates:
        raise HTTPException(status_code=404, detail=f"No templates found for intent: {intent}")
    return templates

@app.get("/health")
async def health_check():
    """
    Health check endpoint
    """
    return {
        "status": "healthy",
        "model_loaded": bot.X is not None,
        "templates_count": len(bot.df) if bot.df is not None else 0
    }

# For running the app directly
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)