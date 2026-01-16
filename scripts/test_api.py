"""Quick API key verification test"""
from anthropic import Anthropic

client = Anthropic(
    base_url="http://127.0.0.1:8045",
    api_key="sk-cbb33b67c7f14a208a67aa705ebf80ee"
)

try:
    response = client.messages.create(
        model="gemini-3-pro-high",
        max_tokens=50,
        messages=[{"role": "user", "content": "Say 'API working' in exactly 2 words."}]
    )
    print("✅ API Connection:", response.content[0].text)
except Exception as e:
    print("❌ API Error:", str(e))
