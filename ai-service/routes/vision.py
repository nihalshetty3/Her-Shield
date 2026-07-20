from fastapi import APIRouter , UploadFile , File , Form

router = APIRouter(
    prefix="/vision",
    tags=["Vision AI"]
)

@router.post("/analyze")
async def analyze(
    image: UploadFile = File(...),
    incidentId: str = Form(...)
):
    
    contents = await image.read()
    print("Received", len(contents), "bytes")
    
    return {
        "incidentId": incidentId,
        "riskScore": 0,
        "description": "Analysis Pending"
    }