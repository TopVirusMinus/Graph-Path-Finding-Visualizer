from typing import List
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

origins = [
    "http://localhost:5500",
    "localhost:5500",
    "http://127.0.0.1:5500/"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


nodes = {}
edges = {}


@app.get("/", tags=["root"])
async def read_root() -> dict:
    return {"message": "Graph Path Finding Visualizer"}


class BaseParam(BaseModel):
    nodes: List[dict]
    edges: List[dict]


@app.post("/receiveInfo/", status_code=201)
async def receiveInfo(baseParam: BaseParam):
    res = baseParam

    nodes = res.nodes
    edges = res.edges
    print(res)
