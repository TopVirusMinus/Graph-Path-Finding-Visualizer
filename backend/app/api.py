from typing import List
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

origins = [
    "http://localhost:3000",
    "localhost:3000"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


res = {}
grid = []
numRows = -1
numCols = -1
startPos = {}
endPos = {}


@app.get("/", tags=["root"])
async def read_root() -> dict:
    return {"message": "Path Finding Visualizer"}


class BaseParam(BaseModel):
    grid: List[list]
    numCols: int
    numRows: int
    startPos: dict
    endPos: dict


@app.post("/receiveInfo/", status_code=201)
async def receiveInfo(baseParam: BaseParam):
    res = baseParam

    grid = res.grid
    numRows = res.numRows
    numCols = res.numCols
    startPos = res.startPos
    endPos = res.endPos
    print(res)
