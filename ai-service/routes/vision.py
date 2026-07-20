from fastapi import APIRouter , UploadFile , File , Form
from services.vision_service import analyze_image
import tempfile

router = APIRouter(
    prefix="/vision",
    tags=["Vision AI"]
)

@router.post("/analyze")
async def analyze(
    image: UploadFile = File(...),
    incidentId: str = Form(...)
):
    
    with tempfile.NamedTemporaryFile(delete=False , suffix=".jpeg") as temp:
        temp.write(await image.read())
        path = temp.name
        
    result = analyze_image(path)
    result["incidentId"]=incidentId
    
    return result