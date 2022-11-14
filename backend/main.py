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
destination = set()

def bfs():
    global source, destination
    queue = []
    backtrack = {}
    
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
                
            if c in destination:
                destination = c
                old_destination = c
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
    global source, destination
    priority_queue = []
    backtrack = {}
    visited = set()
    shortest_path = []
    fringe = []
    
    priority_queue.append((source,0))
    print(priority_queue)
    
    while priority_queue:
        print(priority_queue)
        fringe.append(priority_queue.copy())    

        curr, cost = priority_queue.pop(0)
        print(curr)
        visited.add((curr,cost))
        
        if curr in destination:
            print("found!")
            new_destination = curr
            old_destination = curr
            visited.add(curr)
            while backtrack[new_destination] != source:
                new_destination = backtrack[new_destination]
                shortest_path.append(new_destination)
            
            shortest_path = shortest_path[::-1]    
            shortest_path.insert(0, source)
            shortest_path.append(old_destination)
            print("shorest path",shortest_path)
            print("visited", visited)
            print("fringe", fringe)
            return shortest_path, visited, fringe
        
        for n,c in graph[curr]:
            if (n, c+cost) not in visited:
                backtrack[n] = curr
                visited.add((n, c+cost))
                priority_queue.append((n, c+cost))
                
        priority_queue = sorted(priority_queue,key=lambda t: t[1])
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
    destination: list


@app.post("/receiveInfo/", status_code=201)
async def receiveInfo(baseParam: BaseParam):
    global nodes, edges, graph, algorithm, source, destination
    nodes = {}
    edges = {}
    graph = defaultdict(list)
    algorithm = "bfs"
    source = -1
    destination = set()
    
    res = baseParam
    nodes = res.nodes
    edges = res.edges
    algorithm = res.algorithm
    source = res.source
    
    for d in res.destination:
        destination.add(d)
        
    for edge in edges:
        graph[edge["from"]].append((edge["to"],int(edge["label"]))) 

    print(algorithm)
    print(graph)
    print(source, destination)

