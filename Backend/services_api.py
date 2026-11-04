from fastapi import FastAPI, HTTPException, Depends, status
from pydantic import BaseModel, Field
from typing import List, Optional
from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.orm import declarative_base, sessionmaker, Session

# Настройка базы данных SQLite
SQLALCHEMY_DATABASE_URL = "sqlite:///./salon.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

#  Модели SQLAlchemy
class Master(Base):
    __tablename__ = "masters"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    specialization = Column(String, index=True)

class Service(Base):
    __tablename__ = "services"
    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(Integer, index=True)
    title = Column(String, index=True)
    desc = Column(String)
    duration = Column(Integer)
    price = Column(Float)

# Создаем таблицы в базе данных
Base.metadata.create_all(bind=engine)

# Pydantic-схемы 

class MasterResponse(BaseModel):
    id: int
    name: str
    specialization: str

    class Config:
        from_attributes = True

class ServiceCreate(BaseModel):
    categoryId: int
    title: str = Field(..., min_length=1, max_length=100)
    desc: str = Field(..., min_length=1, max_length=100)
    duration: int = Field(..., ge=30, le=180)
    price: float = Field(..., gt=0)


app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/masters", response_model=List[MasterResponse])
def get_masters(specialization: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Master)
    if specialization:
        query = query.filter(Master.specialization == specialization)
    return query.all()

@app.get("/masters/{master_id}", response_model=MasterResponse)
def get_master(master_id: int, db: Session = Depends(get_db)):
    master = db.query(Master).filter(Master.id == master_id).first()
    if master is None:
        raise HTTPException(status_code=404, detail="Master not found")
    return master


@app.post("/services", status_code=status.HTTP_201_CREATED)
def create_service(service: ServiceCreate, db: Session = Depends(get_db)):
  
    new_service = Service(
        category_id=service.categoryId,
        title=service.title,
        desc=service.desc,
        duration=service.duration,
        price=service.price
    )
    
   
    db.add(new_service)
    db.commit()
    db.refresh(new_service)
    
    return {
        "id": new_service.id,
        "categoryId": new_service.category_id,
        "title": new_service.title,
        "desc": new_service.desc,
        "duration": new_service.duration,
        "price": new_service.price
    }


if __name__ == "__main__":
    db = SessionLocal()
  
    if db.query(Master).count() == 0:
        db.add(Master(name="Анна", specialization="Парикмахер"))
        db.add(Master(name="Мария", specialization="Визажист"))
        db.commit()
        print("Мастера добавлены в БД!")
    
    
    db.close()
