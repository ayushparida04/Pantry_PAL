from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from database.db import PantryItem, get_db
from models.schemas import Ingredient

router = APIRouter(prefix="/api/pantry", tags=["pantry"])


@router.get("", response_model=list[Ingredient])
async def get_pantry(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(PantryItem).order_by(PantryItem.created_at.desc()))
    items = result.scalars().all()
    return [Ingredient(id=i.id, name=i.name, amount=i.amount, category=i.category) for i in items]


@router.post("", response_model=Ingredient)
async def add_pantry_item(item: Ingredient, db: AsyncSession = Depends(get_db)):
    db_item = PantryItem(name=item.name, amount=item.amount, category=item.category)
    db.add(db_item)
    await db.commit()
    await db.refresh(db_item)
    return Ingredient(id=db_item.id, name=db_item.name, amount=db_item.amount, category=db_item.category)


@router.delete("/{item_id}")
async def delete_pantry_item(item_id: str, db: AsyncSession = Depends(get_db)):
    db_item = await db.get(PantryItem, item_id)
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    await db.delete(db_item)
    await db.commit()
    return {"ok": True}


@router.delete("")
async def clear_pantry(db: AsyncSession = Depends(get_db)):
    await db.execute(delete(PantryItem))
    await db.commit()
    return {"ok": True}
