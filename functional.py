import requests
import pandas as pd

response = requests.get("https://tradestie.com/api/v1/apps/reddit")
df = pd.DataFrame(response.json())
