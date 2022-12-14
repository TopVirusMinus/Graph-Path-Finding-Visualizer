from typing import List, Union
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from collections import defaultdict
import json

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
heuristics = {}


def bfs():
    global source, destination
    queue = []
    backtrack = {}

    print(source, destination)
    queue.append(source)

    visited = set()
    visitedList = []
    shortest_path = []
    fringe = []

    while (queue):
        fringe.append(queue.copy())
        curr = queue.pop(0)
        visited.add(curr)
        visitedList.append(curr)
        print(curr)
        for c, d in graph[curr]:
            if c not in visited:
                queue.append(c)
                visited.add(c)
                backtrack[c] = curr

            if c in destination:
                fringe.append(queue.copy())
                destination = c
                old_destination = c
                visited.add(c)

                while backtrack[destination] != source:
                    destination = backtrack[destination]
                    shortest_path.append(destination)

                shortest_path = shortest_path[::-1]
                shortest_path.insert(0, source)
                shortest_path.append(old_destination)

                print("shorest path", shortest_path)
                print("visited", visited)
                print("fringe", fringe)
                return shortest_path, fringe, visitedList, []

    return {"msg": "bfs algorithm"}


def dfs():
    global source, destination
    stack = []
    backtrack = {}

    print(source, destination)
    stack.append(source)

    visited = set()
    visitedList = []
    shortest_path = []
    fringe = []

    while (stack):
        fringe.append(stack.copy())
        curr = stack.pop(0)

        visited.add(curr)
        visitedList.append(curr)

        print("DFS", curr)
        for c, d in graph[curr]:
            if c not in visited:
                stack.insert(0, c)
                visited.add(c)
                backtrack[c] = curr

            if c in destination:
                fringe.append(stack.copy())
                destination = c
                old_destination = c
                visitedList.append(c)

                while backtrack[destination] != source:
                    destination = backtrack[destination]
                    shortest_path.append(destination)

                shortest_path = shortest_path[::-1]
                shortest_path.insert(0, source)
                shortest_path.append(old_destination)

                print("shortest path", shortest_path)
                print("visited", visited)
                print("fringe", fringe)
                return shortest_path, fringe, visitedList, []

    return {"msg": "dfs algorithm"}


def uniform_cost():
    global source, destination
    priority_queue = []
    backtrack = {}
    visited = set()
    visitedList = []
    shortest_path = []
    fringe = []

    priority_queue.append((source, 0))
    print(priority_queue)

    while priority_queue:
        # print(priority_queue)
        fringe.append(priority_queue.copy())

        curr, cost = priority_queue.pop(0)
        # print(curr)
        visited.add((curr, cost))
        visitedList.append((curr, cost))

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
            print("shorest path", shortest_path)
            #print("visited", visited)
            new_fringe = []
            f_cost = []
            for f in fringe:
                tmp = []
                tmp2 = []
                for z in f:
                    tmp.append(z[0])
                    tmp2.append(z[1])
                new_fringe.append(tmp)
                f_cost.append(tmp2)
                
            print(new_fringe)
            return shortest_path, new_fringe, visitedList, f_cost

        for n, c in graph[curr]:
            if (n, c+cost) not in visited:
                backtrack[n] = curr
                visited.add((n, c+cost))
                visitedList.append((n, c+cost))
                priority_queue.append((n, c+cost))

        priority_queue = sorted(priority_queue, key=lambda t: t[1])
    return {"msg": "uniform cost algorithm"}


def greedy_best_first():
    global source, destination
    visited = set()
    visitedList = []
    queue = [(source, 0)]
    fringe = []
    backtrack = {}
    shortest_path = []

    while queue:
        queue.sort(key=lambda t: t[1])  # to sort according f-cost ystaa
        fringe.append(queue.copy())

        node, cost = queue.pop(0)  # a5tar 2a 2l f-cost\

        if node in visited:
            continue

        visited.add(node)
        visitedList.append(node)
        if node in destination:
            fringe.append(queue.copy())
            new_destination = node
            # print(backtrack)
            while backtrack[new_destination] != source:
                # print(new_destination)
                new_destination = backtrack[new_destination]
                shortest_path.append(new_destination)

            shortest_path = shortest_path[::-1]
            shortest_path.insert(0, source)
            shortest_path.append(node)
            
            new_fringe = []
            f_cost = []
            
            for f in fringe:
                tmp = []
                tmp2 = []
                for z in f:
                    tmp.append(z[0])
                    tmp2.append(z[1])
                new_fringe.append(tmp)
                f_cost.append(tmp2)
                
            print(new_fringe)
            return shortest_path, new_fringe, visitedList, f_cost

        for node2, cost2 in graph[node]:
            if node2 not in visited:
                backtrack[node2] = node
                costXheu = heuristics[node2]
                queue.append((node2, costXheu))
    return {"msg": "best first algorithm"}


def a_star():
    global source, destination
    visited = set()
    visitedList = []
    queue = [(source, 0)]
    fringe = []
    backtrack = {}
    shortest_path = []

    while queue:
        queue.sort(key=lambda t: t[1])  # to sort according f-cost ystaa
        fringe.append(queue.copy())
        print(queue)

        node, cost = queue.pop(0)  # a5tar 2a2l f-cost\
        print(node)

        if node in visited:
            continue

        visited.add(node)
        visitedList.append(node)
        if node in destination:
            fringe.append(queue.copy())
            new_destination = node
            # print(backtrack)
            while backtrack[new_destination] != source:
                # print(new_destination)
                new_destination = backtrack[new_destination]
                shortest_path.append(new_destination)

            shortest_path = shortest_path[::-1]
            shortest_path.insert(0, source)
            shortest_path.append(node)
            
            new_fringe = []
            f_cost = []
            for f in fringe:
                tmp = []
                tmp2 = []
                for z in f:
                    tmp.append(z[0])
                    tmp2.append(z[1])
                new_fringe.append(tmp)
                f_cost.append(tmp2)
                
                
            print(new_fringe)
            return shortest_path, new_fringe, visitedList, f_cost

        for node2, cost2 in graph[node]:
            if node2 not in visited:
                backtrack[node2] = node
                costXheu = (cost - heuristics[node]) + \
                    cost2 + heuristics[node2]
                queue.append((node2, costXheu))
    return {"msg": "A* algorithm"}


algorithms = {"bfs": bfs, "dfs": dfs, "uniformCost": uniform_cost,
              "greedyBestFirst": greedy_best_first, "A*": a_star}


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
    source: Union[int, str]
    destination: list


@app.post("/receiveInfo/", status_code=201)
async def receiveInfo(baseParam: BaseParam):
    global nodes, edges, graph, algorithm, source, destination, heuristics
    nodes = {}
    edges = {}
    heuristics = {}
    graph = defaultdict(list)
    algorithm = "bfs"
    source = -1
    destination = set()

    res = baseParam
    nodes = res.nodes
    edges = res.edges
    algorithm = res.algorithm
    source = res.source

    print("SOURCE", source)
    heuristics = defaultdict(lambda: -1)

    for n in nodes:
        heuristics[n["id"]] = int(n["title"])

    for d in res.destination:
        destination.add(d)

    for edge in edges:
        h = heuristics[edge["to"]]
        graph[edge["from"]].append((edge["to"], int(edge["label"])))

    def sort_alphabetically(idd):
        print(idd)
        global nodes, graph
        name = ""
        for node in nodes:
            if node["id"] == idd:
                name = node["label"]
                break
        return name

    # sort the graph alphabetically
    for g in graph.keys():
        graph[g].sort(key=lambda l: sort_alphabetically(l[0]))

    #print("SORT", sort_alphabetically(graph[1][0][0]))
    # print(algorithm)
    print("GRAPH", graph)
    #print(source, destination)
