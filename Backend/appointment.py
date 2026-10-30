masters = {1: {"master_id": 1, "name": "Мастер 1"}}
services = {1: {"service_id": 1, "name": "Стрижка"}}

appointments = []

def get_master(master_id):
    return masters.get(master_id)

def get_service(service_id):
    return services.get(service_id)

class Appointment:
    def __init__(self, client_name, master_id, service_id, time):
        self.id = len(appointments) + 1
        self.client_name = client_name
        self.master_id = master_id
        self.service_id = service_id
        self.time = time

def create_appointment(client_name: str, master_id: int, service_id: int, time: str) -> Appointment | None:
    master = get_master(master_id)
    service = get_service(service_id)
    
    if master is None or service is None:
        return None

    if not client_name or not client_name.strip():
        return None

    try:
        hour = int(time.split(':')[0])
    except (ValueError, IndexError, AttributeError):
        return None 

    if hour < 8 or hour >= 20:
        return None 

    appointment = Appointment(client_name, master_id, service_id, time)
    appointments.append(appointment)
    
    return appointment

# --- Проверка ---
print(" Успешные записи ")
first_appointment = create_appointment("Иванова А.А.", 1, 1, '10:00')
second_appointment = create_appointment("Петрова А.А.", 1, 1, '11:00')

print("Список записей:")
for appointment in appointments:
    print(appointment.client_name, appointment.time)

print("\n Некорректное имя клиента")
no_correct_appointment = create_appointment("", 1, 1, '12:00')
print(len(appointments))

print("\n Запись в нерабочее время")
no_correct_appointment = create_appointment("Сидорова А.А.", 1, 1, '00:00')
print(len(appointments))
