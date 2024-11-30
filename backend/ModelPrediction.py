import requests
import pandas as pd
import numpy as np
import torch
import torch.nn as nn
import torch.onnx
from sklearn.preprocessing import MinMaxScaler
from dotenv import load_dotenv
from datetime import datetime, timedelta
import os

load_dotenv()

#date range
time_end = datetime.utcnow()
time_start = time_end - timedelta(days=7)

# Fetch data from pro market cap
def fetch_historical_data(COINMARKETCAP, symbol="BTC", days=100):
    url = f"https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/historical"
    headers = {"X-CMC_PRO_API_KEY": COINMARKETCAP}
    params = {
    "symbol": "BTC,ETH,BNB",  # bit coin, eth, 
    "time_start": time_start.isoformat(),
    "time_end": time_end.isoformat(),
    "interval": "1h", 
    "convert": "USD"
    }
    
    response = requests.get(url, headers=headers, params=params)
    data = response.json()
    
    if response.status_code == 200:
        prices = [entry["quote"]["USD"]["price"] for entry in data["data"]["quotes"]]
        dates = [entry["timestamp"] for entry in data["data"]["quotes"]]
        return pd.DataFrame({"Date": dates, "Price": prices})
    else:
        raise Exception(f"Error: {data['status']['error_message']}")

# Key
COINMARKETCAP = "os.getenv('COINMARKETCAP')"

# Fetch historical price data
try:
    df = fetch_historical_data(COINMARKETCAP)
    print(df.head())
except Exception as e:
    print(str(e))

# Process data
scaler = MinMaxScaler(feature_range=(0, 1))
scaled_prices = scaler.fit_transform(df["Price"].values.reshape(-1, 1))

# Create sequences for LSTM training
def create_sequences(data, seq_length=5):
    X, y = [], []
    for i in range(len(data) - seq_length):
        X.append(data[i:i+seq_length])
        y.append(data[i+seq_length])
    return np.array(X), np.array(y)

seq_length = 5
X, y = create_sequences(scaled_prices, seq_length)

# Convert to PyTorch tensors
X = torch.tensor(X, dtype=torch.float32)
y = torch.tensor(y, dtype=torch.float32)

# Define and Train an LSTM Model
class LSTMModel(nn.Module):
    def __init__(self, input_size, hidden_size, output_size):
        super(LSTMModel, self).__init__()
        self.lstm = nn.LSTM(input_size, hidden_size, batch_first=True)
        self.fc = nn.Linear(hidden_size, output_size)
    
    def forward(self, x):
        _, (hidden, _) = self.lstm(x)
        return self.fc(hidden[-1])

model = LSTMModel(input_size=1, hidden_size=64, output_size=1)
criterion = nn.MSELoss()
optimizer = torch.optim.Adam(model.parameters(), lr=0.001)

# Training loop
epochs = 50
for epoch in range(epochs):
    model.train()
    optimizer.zero_grad()
    predictions = model(X)
    loss = criterion(predictions, y)
    loss.backward()
    optimizer.step()
    if (epoch + 1) % 10 == 0:
        print(f"Epoch {epoch+1}/{epochs}, Loss: {loss.item()}")

# Export the Model to ONNX
onnx_path = "price_prediction.onnx"
dummy_input = torch.randn(1, seq_length, 1)  # Shape: (batch_size, seq_length, input_size)
torch.onnx.export(model, dummy_input, onnx_path, input_names=["input"], output_names=["output"])

print(f"Model exported to {onnx_path}")

# Use Giza to Deploy Model on Starknet
# Assuming Giza is set up, use the CLI for preprocessing:
# 1. Preprocess the ONNX model for Cairo
#    $ python giza.py preprocess --model price_prediction.onnx --output_dir ./cairo_model
# - alternate giza cli
# $ giza preprocess --model your_model.onnx --output_dir ./cairo_model
# 2. Deploy the generated Cairo contract to Starknet
#    $ starknet deploy --network testnet --contract ./cairo_model/model.cairo
# 3. Generate proof for new inputs
#    $ python giza.py proof --model price_prediction.onnx --input ./input.json --output ./proof.json
# - alternate giza cli
# # giza proof --model your_model.onnx --input input.json --output proof.json
# 4. Verify the proof on-chain using Starknet CLI
