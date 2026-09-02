from dotenv import load_dotenv
import boto3
import os

load_dotenv()
aws_api_key=os.getenv("AWS_BEARER_TOKEN_BEDROCK")
aws_model_id=os.getenv('AWS_MODEL_ID')
aws_region=os.getenv('AWS_REGION') 


def get_bedrock_client():
    bedrock_client = boto3.client(
        service_name="bedrock-runtime",
        region_name=aws_region,
        aws_access_key_id=aws_api_key,
        aws_secret_access_key=aws_api_key,
    )

    return bedrock_client


import textwrap

def get_bedrock_recommendation(days, destination, budget, category) -> str:
    client = get_bedrock_client()
    prompt = textwrap.dedent(f"""
        You are an experienced travel planner.
        Create a detailed {days}-day itinerary for {destination} with a total budget of USD {budget} and travel style: {category}.

        CRITICAL FORMATTING INSTRUCTIONS:
        - Output strictly valid Markdown.
        - Use EXACTLY the following section headers (starting with ##) so the response can be easily parsed and displayed in separate sections:

        ## DAY 1: [Short Title]
        - Morning:
          - [Activities with estimated cost]
        - Afternoon:
          - [Activities with estimated cost]
        - Evening:
          - [Activities with estimated cost]

        ## DAY [number]: [Short Title]
        (Repeat for each day up to Day {days})

        ## TRAVEL TIPS
        - [Provide 3-5 practical travel tips, local etiquette, transportation advice, and best times to visit]

        ## LOCAL FOOD RECOMMENDATION
        - [Provide 3-5 must-try local dishes, famous eateries, and price ranges]

        ## BUDGET BREAKDOWN
        - Accommodation: $[Amount]
        - Transportation: $[Amount]
        - Food: $[Amount]
        - Activities: $[Amount]
        - Estimated Total: $[Amount]

        Additional Notes:
        1. Return ONLY the itinerary content with the exact section headers above. Do NOT include intro or outro text.
        2. Ensure every activity and food item includes an estimated cost in USD.
    """).strip()

    ai_request = client.converse(
        modelId=os.getenv("MODEL_ID"),
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "text": prompt
                    }
                ]
            }
        ]
    )
    
    ai_response = ai_request["output"]["message"]["content"][0]["text"]
    return ai_response

def get_bedrock_answer(query_or_messages) -> str:
    client = get_bedrock_client()
    
    # System prompt / instructions
    system_prompts = [
        {
            "text": (
                "You are an experienced travel planner and assistant. "
                "Answer the user's questions helpfully with rich travel recommendations. "
                "Only answer questions related to travel, destinations, itineraries, culture, food, and logistics. "
                "If the question is completely unrelated to travel, politely decline to answer. "
                "Do NOT include redundant intro or outro filler."
            )
        }
    ]

    bedrock_messages = []

    # If query_or_messages is a list of message dicts: [{"role": "user"|"assistant", "content": "..."}]
    if isinstance(query_or_messages, list):
        for msg in query_or_messages:
            if isinstance(msg, dict):
                role = msg.get("role", "user")
                content = msg.get("content", "")
            else:
                role = getattr(msg, "role", "user")
                content = getattr(msg, "content", "")

            # Normalize role for Bedrock ('ai' -> 'assistant')
            if role == "ai":
                role = "assistant"
            elif role not in ["user", "assistant"]:
                role = "user"

            if content:
                bedrock_messages.append({
                    "role": role,
                    "content": [
                        {
                            "text": str(content)
                        }
                    ]
                })
    else:
        # Fallback if single string query is passed
        bedrock_messages = [
            {
                "role": "user",
                "content": [
                    {
                        "text": str(query_or_messages)
                    }
                ]
            }
        ]

    # Ensure at least one message exists
    if not bedrock_messages:
        bedrock_messages = [
            {
                "role": "user",
                "content": [{"text": "Hello"}]
            }
        ]

    ai_request = client.converse(
        modelId=os.getenv("MODEL_ID"),
        system=system_prompts,
        messages=bedrock_messages
    )
    
    ai_response = ai_request["output"]["message"]["content"][0]["text"]
    return ai_response
