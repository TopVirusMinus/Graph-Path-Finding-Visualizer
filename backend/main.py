from typing import List
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from collections import defaultdict

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
graph = defaultdict(list)
algorithm = "bfs"
source = -1
destination = -1

def bfs():
    global source, destination
    queue = []
    backtrack = {}
    old_destination = destination
    
    print(source, destination)
    queue.append(source)
    
    visited = set()
    shortest_path = []
    fringe = []
    
    while(queue):
        fringe.append(queue.copy())    
        curr = queue.pop(0)
        visited.add(curr)
        print(curr)
        for c,d in graph[curr]:
            if c not in visited:
                queue.append(c)
                visited.add(c)
                backtrack[c] = curr
                
            if c == destination:
                visited.add(c)
                while backtrack[destination] != source:
                    destination = backtrack[destination]
                    shortest_path.append(destination)
                    shortest_path = shortest_path[::-1]
                    
                shortest_path.insert(0, source)
                shortest_path.append(old_destination)
                print("shorest path",shortest_path)
                print("visited", visited)
                print("fringe", fringe)
                return shortest_path, visited, fringe
            
    return {"msg":"bfs algorithm"}

def dfs():
    return {"msg":"dfs algorithm"}

def uniform_cost():
    return {"msg":"uniform cost algorithm"}

def best_first():
    return {"msg":"best first algorithm"}

def a_star():
    return {"msg":"A* algorithm"}

algorithms = {"bfs": bfs, "dfs":dfs, "uniformCost":uniform_cost, "best_first":best_first, "A*":a_star}

@app.get("/", tags=["root"])
async def read_root() -> dict:
    return {"message": "Graph Path Finding Visualizer"}

@app.get("/computePath")
async def computePath():
    return algorithms[algorithm]()


class BaseParam(BaseModel):
    nodes: List[dict]
    edges: List[dict]
    algorithm: str
    source: int
    destination: int


@app.post("/receiveInfo/", status_code=201)
async def receiveInfo(baseParam: BaseParam):
    global nodes, edges, graph, algorithm, source, destination
    nodes = {}
    edges = {}
    graph = defaultdict(list)
    algorithm = "bfs"
    source = -1
    destination = -1
    
    res = baseParam
    nodes = res.nodes
    edges = res.edges
    algorithm = res.algorithm
    source = res.source
    destination = res.destination
    
    for edge in edges:
        graph[edge["from"]].append((edge["to"],int(edge["label"]))) 

    print(algorithm)
    print(graph)
    print(source, destination)

