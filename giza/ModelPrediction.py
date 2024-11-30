# Install all the below dependencies
# Run `python ModelPrediction.py to get a output in the terminal`

import requests
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import MinMaxScaler
from dotenv import load_dotenv
from datetime import datetime, timedelta, timezone
import os
import json
from skl2onnx import convert_sklearn
from skl2onnx.common.data_types import FloatTensorType

# Load environment variables
load_dotenv()
coin_apikey = os.getenv('COINMARKETCAP')

# Set date range for one week
time_end = datetime.now(timezone.utc)
time_start = time_end - timedelta(days=7)

# Fetch data from CoinMarketCap
def fetch_historical_data(coin_apikey, symbol="BTC,ETH,BNB"):
    url = "https://sandbox-api.coinmarketcap.com/v1/cryptocurrency/quotes/historical"
    headers = {
        'Accepts': 'application/json',
        'X-CMC_PRO_API_KEY': coin_apikey,
    }
    params = {
        "symbol": symbol,
        "time_start": time_start.isoformat(),
        "time_end": time_end.isoformat(),
        "interval": "1h", 
        "convert": "USD"
    }
    
    print(f"Fetching data from CoinMarketCap API with params: {params}")  # Debug statement

    try:
        response = requests.get(url, headers=headers, params=params)
        print(f"Response Status Code: {response.status_code}")  # Debug statement

        if response.status_code == 403:
            print("API Key might be invalid or permission denied (403).")  # Debug statement
        elif response.status_code == 200:
            print("Request successful.")  # Debug statement

        response.raise_for_status()  # Errors for bad responses (4/500)
        data = response.json()
        print("API Response (first 500 chars):", json.dumps(data, indent=4)[:500])  # Debug statement
        
        # Verify API response based on structure
        if 'data' in data and all(symbol in data['data'] for symbol in symbol.split(',')):
            all_prices = []
            for symbol in symbol.split(','):
                if 'quotes' in data['data'][symbol]:
                    prices = [entry['quote']['USD']['price'] for entry in data['data'][symbol]['quotes']]
                    dates = [entry['timestamp'] for entry in data['data'][symbol]['quotes']]
                    
                    # Convert frames and ensure string is good to work with
                    symbol_df = pd.DataFrame({
                        "Symbol": symbol,
                        "Date": pd.to_datetime(dates),  # Convert ISO string to datetime because pandas can work with it directly
                        "Price": prices
                    })
                    all_prices.append(symbol_df)
            # Concatenate all the symbol dataframes into one
            return pd.concat(all_prices, ignore_index=True)
        else:
            raise Exception("Missing expected 'quotes' data in the API response.")
    
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")  # Debug statement
        raise SystemExit(f"Request failed: {e}")

# Fetch historical price data: Like our main method starts here
try:
    print("Starting to fetch data...")  # Debug statement
    df = fetch_historical_data(coin_apikey, symbol="BTC,ETH,BNB")
    if df is not None and not df.empty:
        print("Data fetched successfully, displaying first 5 rows:")  # Debug statement
        print(df.head())
except Exception as e:
    print(f"Error occurred: {e}")  # Debug statement

# Preprocess the data for Linear Regression
if 'df' in locals() and not df.empty:
    print("Preprocessing the data...")  # Debug statement
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_prices = scaler.fit_transform(df["Price"].values.reshape(-1, 1))

    # Use the last 5 hours of data for predicting the next hour
    X = []
    y = []
    for i in range(len(scaled_prices) - 1):
        X.append(scaled_prices[i:i+1])  # Use the previous hour to predict the next hour
        y.append(scaled_prices[i+1])    # Next hour price

    X = np.array(X).reshape(-1, 1)  # Fix the shape for LinearRegression
    y = np.array(y)

    # Train a Linear Regression model
    model = LinearRegression()
    model.fit(X, y)

    # Predict the next hour's price
    predicted_price = model.predict(X[-1].reshape(1, -1))

    # Scale the predicted price back to the original range
    predicted_price = scaler.inverse_transform(predicted_price.reshape(-1, 1))[0][0]
    print(f"Predicted price for the next hour: ${predicted_price:.2f}")

    # Get the current price (last known price)
    current_price = df["Price"].iloc[-1]
    print(f"Current price: ${current_price:.2f}")

    # Predict if the price will go up or down
    if predicted_price > current_price:
        print("The price will go UP.")
    elif predicted_price < current_price:
        print("The price will go DOWN.")
    else:
        print("The price is stable.")


# Define the input type for the ONNX model
initial_type = [("input", FloatTensorType([None, 1]))]

# Convert the trained model to ONNX format
onnx_model = convert_sklearn(model, initial_types=initial_type)

# Save the ONNX model to a file
with open("linear_regression.onnx", "wb") as f:
    f.write(onnx_model.SerializeToString())
print("Model exported to ONNX format.")
