from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List

app = FastAPI()

categories_db = [
    {"id": 1, "name": "Стрижки и укладки"},
    {"id": 2, "name": "Маникюр и педикюр"},
    {"id": 3, "name": "Брови и ресницы"},
    {"id": 4, "name": "Спа-процедуры"},
]

services_db = [
    {"id": 1, "category_id": 1, "name": "Женская стрижка"},
    {"id": 2, "category_id": 1, "name": "Мужская стрижка"},
    {"id": 3, "category_id": 1, "name": "Укладка"},
    {"id": 4, "category_id": 1, "name": "Окрашивание"},
    {"id": 5, "category_id": 1, "name": "Мелирование"},
    
    {"id": 6, "category_id": 2, "name": "Маникюр классический"},
    {"id": 7, "category_id": 2, "name": "Педикюр"},
    {"id": 8, "category_id": 2, "name": "Гель-лак"},
    {"id": 9, "category_id": 2, "name": "Наращивание ногтей"},
    {"id": 10, "category_id": 2, "name": "Дизайн ногтей"},
    
    {"id": 11, "category_id": 3, "name": "Коррекция бровей"},
    {"id": 12, "category_id": 3, "name": "Окрашивание бровей"},
    {"id": 13, "category_id": 3, "name": "Наращивание ресниц"},
    {"id": 14, "category_id": 3, "name": "Ламинирование ресниц"},
    
    {"id": 15, "category_id": 4, "name": "Массаж лица"},
    {"id": 16, "category_id": 4, "name": "Чистка лица"},
    {"id": 17, "category_id": 4, "name": "Пилинг"},
    {"id": 18, "category_id": 4, "name": "Обертывание"},
]

class CategoryResponse(BaseModel):
    id: int
    name: str
    servicesCount: int


# Список категорий
@app.get("/categories", response_model=List[CategoryResponse])
def get_categories():
    result = []
    for category in categories_db:
        count = sum(1 for service in services_db if service["category_id"] == category["id"])
        
        result.append({
            "id": category["id"],
            "name": category["name"],
            "servicesCount": count
        })
    return result

# Информация по категории
@app.get("/categories/{category_id}", response_model=CategoryResponse)
def get_category(category_id: int):
    found_category = None
    for cat in categories_db:
        if cat["id"] == category_id:
            found_category = cat
            break
        
    if found_category is None:
        raise HTTPException(status_code=404, detail="Сategory not found")
        
    count = sum(1 for service in services_db if service["category_id"] == category_id)
    
    return {
        "id": found_category["id"],
        "name": found_category["name"],
        "servicesCount": count
    }
