"""
Knowledge Base Service for RAG (Retrieval-Augmented Generation)
Uses Amazon Bedrock Knowledge Base to retrieve and generate grounded answers
"""
import boto3
import os
from typing import Dict, Any

# Initialize Bedrock Agent Runtime client
client = boto3.client(
    "bedrock-agent-runtime",
    region_name=os.getenv("AWS_REGION", "us-east-1")
)

# Knowledge Base ID from environment variable
KNOWLEDGE_BASE_ID = os.getenv("KNOWLEDGE_BASE_ID", "")
MODEL_ARN = os.getenv("KNOWLEDGE_BASE_MODEL_ARN", "")


def ask_knowledge_base(question: str) -> Dict[str, Any]:
    """
    Query the Knowledge Base with RAG
    
    Args:
        question: User's travel-related question
        
    Returns:
        Dict containing answer and source references
    """
    if not KNOWLEDGE_BASE_ID:
        return {
            "answer": "Knowledge Base is not configured. Please set KNOWLEDGE_BASE_ID in .env file.",
            "sources": []
        }
    
    try:
        # Step 1: Retrieve relevant documents from Knowledge Base
        retrieve_response = client.retrieve(
            knowledgeBaseId=KNOWLEDGE_BASE_ID,
            retrievalQuery={
                "text": question
            },
            retrievalConfiguration={
                "managedSearchConfiguration": {
                    "numberOfResults": 3
                }
            }
        )
        
        # Extract retrieved documents
        retrieved_results = retrieve_response.get("retrievalResults", [])
        
        if not retrieved_results:
            return {
                "answer": "I couldn't find relevant information in the knowledge base to answer your question.",
                "sources": []
            }
        
        # Build context from retrieved documents
        context_parts = []
        sources = []
        
        for result in retrieved_results:
            content = result.get("content", {}).get("text", "")
            location = result.get("location", {})
            s3_location = location.get("s3Location", {})
            uri = s3_location.get("uri", "")
            
            if content:
                context_parts.append(content)
            
            if uri:
                doc_name = uri.split("/")[-1] if "/" in uri else uri
                if doc_name not in sources:
                    sources.append(doc_name)
        
        # Combine context
        context = "\n\n".join(context_parts)
        
        # Step 2: Generate answer using Bedrock with retrieved context
        bedrock_runtime = boto3.client(
            "bedrock-runtime",
            region_name=os.getenv("AWS_REGION", "us-east-1")
        )
        
        prompt = f"""You are a helpful travel assistant. Based on the following information from trusted travel documents, please answer the user's question.

Context from documents:
{context}

User question: {question}

Please provide a clear and accurate answer based on the information provided above. If the information doesn't fully answer the question, acknowledge what you can answer and what you cannot."""
        
        # Call Bedrock to generate answer
        model_id = os.getenv("MODEL_ID", "amazon.nova-lite-v1:0")
        
        response = bedrock_runtime.converse(
            modelId=model_id,
            messages=[
                {
                    "role": "user",
                    "content": [{"text": prompt}]
                }
            ]
        )
        
        # Extract answer
        answer = response.get("output", {}).get("message", {}).get("content", [{}])[0].get("text", "No answer generated.")
        
        return {
            "answer": answer,
            "sources": sources
        }
        
    except Exception as e:
        print(f"❌ Error querying Knowledge Base: {e}")
        return {
            "answer": f"Error: {str(e)}",
            "sources": []
        }
