# run `python CoinMarket.py`
# smaller test for the historical data (coin market api)

from requests import Request, Session
from requests.exceptions import ConnectionError, Timeout, TooManyRedirects
import json
import os
from dotenv import load_dotenv
from datetime import datetime, timedelta

load_dotenv()
coin_apikey = os.getenv('COINMARKETCAP')

#date range
time_end = datetime.utcnow()
time_start = time_end - timedelta(days=7)

url = 'https://sandbox-api.coinmarketcap.com/v1/cryptocurrency/quotes/historical'

parameters = {
    "symbol": "BTC,ETH,BNB",  # bit coin, eth, 
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

try:
  response = session.get(url, params=parameters)
  data = json.loads(response.text)
  print(data)
except (ConnectionError, Timeout, TooManyRedirects) as e:
  print(e)