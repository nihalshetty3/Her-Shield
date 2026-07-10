import os 
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer
)

from reportlab.lib.styles import getSampleStyleSheet
REPORT_DIR = "reports"

os.makedirs(REPORT_DIR , exist_ok=True)

def create_pdf(incident_id , report):
    filename = f"{REPORT_DIR}/{incident_id}.pdf"
    
    doc = SimpleDocTemplate(filename)
    
    styles = getSampleStyleSheet()
    
    elements=[]
    
    elements.append(
        Paragraph(
            "<b>HER-SHIELD INCIDENT REPORT</b>",
            styles["Title"]
        )
    )
    
    elements.append(Spacer(1, 15))
    
    for key,value in report.items():
        elements.append(
            Paragraph(
                f"<b>{key}</b>",
                styles["Heading2"]
            )
        )
        elements.append(
            Paragraph(
                str(value),
                styles["BodyText"]
            )
        )
        elements.append(Spacer(1 , 10))
        
    doc.build(elements)
    
    return filename
        
    