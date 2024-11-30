# run `python CoinMarket.py`
# smaller test for the historical data (coin market API)

from requests import Session
from requests.exceptions import ConnectionError, Timeout, TooManyRedirects
import json
import os
from dotenv import load_dotenv
from datetime import datetime, timedelta, timezone

# Load environment variables
load_dotenv()
coin_apikey = os.getenv('COINMARKETCAP')

# Date range for the last 7 days (timezone aware)
time_end = datetime.now(timezone.utc)
time_start = time_end - timedelta(days=7)

url = 'https://sandbox-api.coinmarketcap.com/v1/cryptocurrency/quotes/historical'

parameters = {
    "symbol": "BTC,ETH,BNB",  # Bitcoin, Ethereum, and Binance Coin
    "time_start": time_start.isoformat(),
    "time_end": time_end.isoformat(),
    "interval": "1h", 
    "convert": "USD"
}

headers = {
    'Accepts': 'application/json',
    'X-CMC_PRO_API_KEY': coin_apikey,
}

session = Session()
session.headers.update(headers)

# Arrays to hold data
timestamps = []
btc_prices = []
eth_prices = []
bnb_prices = []

try:
    response = session.get(url, params=parameters)
    data = json.loads(response.text)

    # Check info
    print(json.dumps(data, indent=4))

except (ConnectionError, Timeout, TooManyRedirects) as e:
    print(f"Request Error: {e}")