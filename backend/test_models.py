import asyncio
from openai import AsyncOpenAI
import os
from dotenv import load_dotenv

async def main():
    load_dotenv()
    api_key = os.getenv("OPENAI_API_KEY")
    client = AsyncOpenAI(
        api_key=api_key,
        base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
    )
    models = await client.models.list()
    for m in models.data:
        print(m.id)

if __name__ == "__main__":
    asyncio.run(main())
