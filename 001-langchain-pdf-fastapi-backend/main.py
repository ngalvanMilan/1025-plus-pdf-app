from functools import lru_cache
from typing import Union
import os

from fastapi import FastAPI, Depends
from fastapi.responses import PlainTextResponse
from starlette.exceptions import HTTPException as StarletteHTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# routers: comment out next line till create them
from routers import pdfs

import config

app = FastAPI()

# router: comment out next line till create it
app.include_router(pdfs.router)

# Create uploads directory if it doesn't exist
uploads_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")
if not os.path.exists(uploads_dir):
    os.makedirs(uploads_dir)

# Mount the uploads directory to serve static files
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")

#origins = [
#    "http://localhost:3000",
#    "https://todo-frontend-khaki.vercel.app/",
#]

# CORS configuration, needed for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# global http exception handler, to handle errors
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request, exc):
    print(f"{repr(exc)}")
    return PlainTextResponse(str(exc.detail), status_code=exc.status_code)

# to use the settings
@lru_cache()
def get_settings():
    return config.Settings()


@app.get("/")
def read_root(settings: config.Settings = Depends(get_settings)):
    # print the app_name configuration
    print(settings.app_name)
    return "Hello PDF World"


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}