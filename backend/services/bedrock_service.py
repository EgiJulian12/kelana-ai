import os
import boto3
from dotenv import load_dotenv
from fastapi import HTTPException

load_dotenv()

# ── Configuration ──────────────────────────────────────────────────────────────

def get_bedrock_client():
    """
    Build and return a boto3 Bedrock Runtime client using AWS credentials
    decoded from AWS_BEARER_TOKEN_BEDROCK (format: base64("accessKey:secretKey"))
    or standard AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY env vars.
    """
    region = os.getenv("AWS_REGION", "us-east-1")

    # Support standard boto3 env vars first (AWS_ACCESS_KEY_ID, etc.)
    # then fall back to decoding the bearer token
    access_key = os.getenv("AWS_ACCESS_KEY_ID")
    secret_key = os.getenv("AWS_SECRET_ACCESS_KEY")
    session_token = os.getenv("AWS_SESSION_TOKEN")

    if not access_key or not secret_key:
        # Try to decode from bearer token: base64("accessKey:secretKey")
        bearer_token = os.getenv("AWS_BEARER_TOKEN_BEDROCK")
        if not bearer_token:
            raise ValueError(
                "AWS credentials not found. Set AWS_ACCESS_KEY_ID + AWS_SECRET_ACCESS_KEY "
                "or AWS_BEARER_TOKEN_BEDROCK in the .env file."
            )
        import base64
        try:
            decoded = base64.b64decode(bearer_token + "==").decode("latin-1")
            if ":" in decoded:
                access_key, secret_key = decoded.split(":", 1)
            else:
                # Token itself is the session token (Bedrock-specific short-lived token)
                session_token = bearer_token
                access_key    = os.getenv("AWS_ACCESS_KEY_ID", "")
                secret_key    = os.getenv("AWS_SECRET_ACCESS_KEY", "")
        except Exception as e:
            raise ValueError(f"Failed to decode AWS_BEARER_TOKEN_BEDROCK: {e}")

    client = boto3.client(
        service_name="bedrock-runtime",
        region_name=region,
        aws_access_key_id=access_key or None,
        aws_secret_access_key=secret_key or None,
        aws_session_token=session_token or None,
    )
    return client


# ── AI Recommendation ──────────────────────────────────────────────────────────

def get_ai_recommendation(
    destination: str,
    days: int,
    budget: float,
    travel_style: str,
) -> str:
    """
    Call AWS Bedrock (Converse API) and return an AI-generated travel itinerary.

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
    if days <= 0:
        raise ValueError("days must be greater than 0")

    daily_budget = budget / days

    prompt = (
        f"You are an experienced travel planner.\n\n"
        f"Plan a {days}-day itinerary for {destination}.\n\n"
        f"**Trip Details:**\n"
        f"- Destination: {destination}\n"
        f"- Number of Days: {days}\n"
        f"- Total Budget: USD {budget:.2f}\n"
        f"- Daily Budget: USD {daily_budget:.2f}\n"
        f"- Travel Style: {travel_style}\n\n"
        f"Please provide a structured daily plan with the following criteria:\n\n"
        f"**Morning activities:** Provide 2-3 specific morning activities per day.\n\n"
        f"**Afternoon activities:** Recommend cultural sites and local experiences.\n\n"
        f"**Evening activities:** Suggest dinner spots and nightlife options.\n\n"
        f"Also include:\n"
        f"- Estimated daily budget breakdown\n"
        f"- Local food recommendations\n"
        f"- Transportation suggestions\n\n"
        f"Format your response as Markdown with headers (##) and bullet lists (-)."
    )

    model_id = os.getenv("MODEL_ID", "amazon.nova-lite-v1:0")

    try:
        client   = get_bedrock_client()
        response = client.converse(
            modelId=model_id,
            messages=[
                {
                    "role": "user",
                    "content": [{"text": prompt}],
                }
            ],
        )
        result_text = response["output"]["message"]["content"][0]["text"]
        return result_text
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=502,
            detail=f"Bedrock API error: {str(e)}"
        )


# ── Chat Response with History ─────────────────────────────────────────────────

def get_chat_response(messages: list[dict]) -> str:
    """
    Call AWS Bedrock Converse API with conversation history.

    Parameters
    ----------
    messages : list of dicts with keys 'role' and 'content'
               e.g. [{"role": "user", "content": "Hello"}, ...]

    Returns
    -------
    The assistant's response as plain text.
    """
    if not messages:
        raise ValueError("messages list cannot be empty")

    model_id = os.getenv("MODEL_ID", "amazon.nova-lite-v1:0")

    # Convert our simple format to Bedrock's converse format
    bedrock_messages = []
    for msg in messages:
        bedrock_messages.append({
            "role": msg["role"],
            "content": [{"text": msg["content"]}],
        })

    try:
        client   = get_bedrock_client()
        response = client.converse(
            modelId=model_id,
            messages=bedrock_messages,
        )
        result_text = response["output"]["message"]["content"][0]["text"]
        return result_text
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=502,
            detail=f"Bedrock API error: {str(e)}"
        )
