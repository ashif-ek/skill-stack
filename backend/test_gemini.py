import os
import json
from google import genai
from pydantic import BaseModel
class InsightSchema(BaseModel):
    assessment: str
    next_step: str
    resource_recommendation: str

print("Imports successful!")
