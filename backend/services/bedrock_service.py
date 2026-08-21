import os
import json
import boto3
import base64
import requests
from dotenv import load_dotenv

load_dotenv()

# ── Configuration ──────────────────────────────────────────────────────────────

def get_bedrock_client():
    """
    Build and return a boto3 Bedrock Runtime client.
    Credentials and region are loaded from the .env file:
      - AWS_BEARER_TOKEN_BEDROCK  (custom bearer token format)
      - AWS_REGION
    """
    bearer_token = os.getenv("AWS_BEARER_TOKEN_BEDROCK")
    region       = os.getenv("AWS_REGION", "us-east-1")

    if not bearer_token:
        raise ValueError("AWS_BEARER_TOKEN_BEDROCK is not set in the .env file.")

    # Return a custom client wrapper that uses bearer token
    class BedrockClient:
        def __init__(self, token, region):
            self.token = token
            self.region = region
            self.endpoint = f"https://bedrock-runtime.{region}.amazonaws.com"
        
        def converse(self, modelId, messages):
            url = f"{self.endpoint}/model/{modelId}/converse"
            headers = {
                "Authorization": f"Bearer {self.token}",
                "Content-Type": "application/json",
            }
            payload = {"messages": messages}
            
            response = requests.post(url, json=payload, headers=headers)
            response.raise_for_status()
            return response.json()
    
    return BedrockClient(bearer_token, region)


# ── AI Recommendation ──────────────────────────────────────────────────────────

def get_ai_recommendation(
    destination: str,
    days: int,
    budget: float,
    travel_style: str,
) -> str:
    """
    Call AWS Bedrock and return an AI-generated travel itinerary.

    Parameters
    ----------
    destination  : e.g. "Bali, Indonesia"
    days         : number of travel days
    budget       : total budget in USD
    travel_style : e.g. "backpacker", "luxury", "family"

    Returns
    -------
    The model's response text as a plain string.
    """
    daily_budget = budget / days
    
    prompt = (
        f"You are an experienced travel planner.\n\n"
        f"Plan a {days}-day itinerary for {destination} budget {budget:.2f}.\n\n"
        f"**Trip Details:**\n"
        f"- Destination: {destination}\n"
        f"- Number of Days: {days}\n"
        f"- Total Budget: USD {budget:.2f}\n"
        f"- Daily Budget: USD {daily_budget:.2f}\n"
        f"- Travel Style: {travel_style}\n\n"
        f"Please provide:\n"
        f"- Daily itinerary (activities for each day)\n"
        f"- Estimated daily budget breakdown\n"
        f"- Local food recommendations\n"
        f"- Transportation suggestions\n\n"
        f"Format your response as Markdown with headers (##) and bullet lists (-)."
    )

    model_id = os.getenv("MODEL_ID", "amazon.nova-lite-v1:0")
    client   = get_bedrock_client()

    # Bedrock Converse API — works with Nova, Claude, Titan, etc.
    response = client.converse(
        modelId=model_id,
        messages=[
            {
                "role": "user",
                "content": [{"text": prompt}],
            }
        ],
    )

    # Extract the assistant's reply text
    result_text = response["output"]["message"]["content"][0]["text"]
    return result_text
