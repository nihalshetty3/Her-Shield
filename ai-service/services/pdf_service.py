import os

from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer
)

from reportlab.lib.styles import getSampleStyleSheet

REPORT_DIR="reports"

os.makedirs(REPORT_DIR,exist_ok=True)


def create_pdf(incident_id, report):

    filename=f"{REPORT_DIR}/{incident_id}.pdf"

    styles=getSampleStyleSheet()

    doc=SimpleDocTemplate(filename)

    elements=[]

    elements.append(
        Paragraph(
            "<b><font size=22>HER-SHIELD INCIDENT REPORT</font></b>",
            styles["Title"]
        )
    )

    elements.append(Spacer(1,20))

    elements.append(
        Paragraph(
            f"<b>Incident ID :</b> {incident_id}",
            styles["BodyText"]
        )
    )

    elements.append(Spacer(1,20))

    sections=[

        ("Executive Summary",
         report["executiveSummary"]),

        ("Evidence Summary",
         report["evidenceSummary"]),

        ("Risk Assessment",
         report["riskAssessment"])

    ]

    for title,body in sections:

        elements.append(
            Paragraph(
                f"<b>{title}</b>",
                styles["Heading1"]
            )
        )

        elements.append(
            Paragraph(
                body,
                styles["BodyText"]
            )
        )

        elements.append(Spacer(1,15))

    ###########################################
    ## Timeline
    ###########################################

    elements.append(
        Paragraph(
            "<b>Timeline</b>",
            styles["Heading1"]
        )
    )

    for event in report["timeline"]:

        elements.append(
            Paragraph(
                f"• {event}",
                styles["BodyText"]
            )
        )

    elements.append(Spacer(1,15))

    ###########################################
    ## Recommendations
    ###########################################

    elements.append(
        Paragraph(
            "<b>Recommended Actions</b>",
            styles["Heading1"]
        )
    )

    for action in report["recommendedActions"]:

        elements.append(
            Paragraph(
                f"• {action}",
                styles["BodyText"]
            )
        )

    doc.build(elements)

    return filename