from datetime import datetime
timeline=[]

def add_event(event , details=None):
    timeline.append(
        {
            "time": datetime.now().strftime("%H:%M:%S"),
            "event": event,
            "details": details
        }
    )
    
def get_timeline():
    return timeline

def clear_timeline():
    timeline.clear()