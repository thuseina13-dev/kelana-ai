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
        - Return ONLY the itinerary content. Do NOT include greetings, intro, or outro (e.g. "Sure, here is your plan").
        - Do NOT use 4-space indentation for regular text (to avoid unwanted code blocks).

        Sample Structure:

        Day [number]
            Morning:
                - [Activities]
            Afternoon:
                - [Activities]
            Evening:
                - [Activities]
        
        Budget Summary
            [estimated total budget include accommodation, transportation, food, activities, total]

        notes:  
         1. Each day must be give recommendation local food and transportation
         2. in morning give 2 - 3 morning activies
         3. In afternoon give recommendtion for cultur sites and local exeperiment
         4. In evening give dinner sports and nightlife 
         5. each ativites give price estimate 

    """).strip()

    ai_request = client.converse(
        modelId= os.getenv("MODEL_ID"),
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "text" : prompt
                    }
                ]
            }
        ]
    )
    
    ai_response = ai_request["output"]["message"]["content"][0]["text"]
    return ai_response
