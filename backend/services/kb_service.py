from pydantic import BaseModel
import os

import boto3
from dotenv import load_dotenv

load_dotenv()

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

AWS_REGION = os.getenv("AWS_REGION", "ap-southeast-2")
KNOWLEDGE_BASE_ID = os.getenv("KNOWLEDGE_BASE_ID")
AWS_ACCESS_KEY_ID= os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY= os.getenv("AWS_SECRET_ACCESS_KEY")

def get_bedrock_client():
    bedrock_client = boto3.client(
        service_name="bedrock-agent-runtime",
        region_name=AWS_REGION,
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    )

    return bedrock_client

def retrieve_and_generate(query: str) -> str:
    """
    Retrieve relevant content from the Bedrock Knowledge Base.

    Managed knowledge bases support Retrieve, not RetrieveAndGenerate.

    Args:
        query: The user's question.

    Returns:
        The retrieved text snippets joined as a single string.

    Raises:
        ValueError: If required environment variables are missing.
        Exception:  Propagated from boto3 / Bedrock on API errors.
    """
    missing_vars = [
        name
        for name, value in {
            "KNOWLEDGE_BASE_ID": KNOWLEDGE_BASE_ID,
        }.items()
        if not value
    ]
    if missing_vars:
        raise ValueError(
            f"{', '.join(missing_vars)} is not set. "
            "Check your .env file."
        )

    client = get_bedrock_client()

    response = client.retrieve(
        knowledgeBaseId=KNOWLEDGE_BASE_ID,
        retrievalQuery={"text": query},
        retrievalConfiguration={
            "managedSearchConfiguration": {
                "numberOfResults": 1,
            },
        },
    )

    results = []
    for result in response.get("retrievalResults", []):
        text = result.get("content", {}).get("text", "").strip()
        score = result.get("score", 0.0)
        
        metadata = result.get("metadata", {})
        source = metadata.get("_document_title", "")
        
        if not source:
            loc_info = result.get("location", {})
            loc_type = loc_info.get("type", "")
            if loc_type == "S3":
                source = loc_info.get("s3Location", {}).get("uri", "").split('/')[-1]
            elif loc_type == "CONFLUENCE":
                source = loc_info.get("confluenceLocation", {}).get("url", "")
            elif loc_type == "SHAREPOINT":
                source = loc_info.get("sharePointLocation", {}).get("url", "")
            elif loc_type == "SALESFORCE":
                source = loc_info.get("salesforceLocation", {}).get("url", "")
            elif loc_type == "WEB":
                source = loc_info.get("webLocation", {}).get("url", "")
            
            if not source:
                source = "Dokumen Pendukung"
            
        results.append({
                "content": text,
                "score": score,
                "source": source
        })
            
    return results


    
class AskRequest(BaseModel):
    quetions: str

