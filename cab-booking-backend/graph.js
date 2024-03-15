class Graph {
    constructor() {
        this.nodes = new Set();
        this.edges = {};
    }

    addNode(node) {
        this.nodes.add(node);
        if (!(node in this.edges)) {
            this.edges[node] = [];
        }
    }

    addEdge(source, destination, weight) {
        this.edges[source].push({ node: destination, weight: weight });
        // Since this is an undirected graph, add the reverse edge as well
        this.edges[destination].push({ node: source, weight: weight });
    }

    dijkstra(startNode) {
        const distances = {};
        const visited = {};
        const previous = {};
        const queue = new PriorityQueue();

        // Initialize distances and queue
        for (const node of this.nodes) {
            distances[node] = node === startNode ? 0 : Infinity;
            queue.enqueue(node, distances[node]);
            previous[node] = null;
        }

        while (!queue.isEmpty()) {
            const minNode = queue.dequeue();
            if (!minNode) break;

            const currentNode = minNode.data;
            visited[currentNode] = true;

            for (const neighbor of this.edges[currentNode]) {
                const { node, weight } = neighbor;
                if (!visited[node]) {
                    const newDistance = distances[currentNode] + weight;
                    if (newDistance < distances[node]) {
                        distances[node] = newDistance;
                        previous[node] = currentNode;
                        queue.enqueue(node, distances[node]);
                    }
                }
            }
        }

        return { distances, previous };
    }

    shortestPath(startNode, endNode) {
        const { distances, previous } = this.dijkstra(startNode);
        const path = [];
        let currentNode = endNode;

        // Check if there is a path from startNode to endNode
        if (distances[endNode] === Infinity) {
            return { path: [], distance: Infinity }; // No path exists
        }

        while (currentNode !== null) {
            path.unshift(currentNode);
            currentNode = previous[currentNode];
        }

        return { path, distance: distances[endNode] };
    }
}

class PriorityQueue {
    constructor() {
        this.queue = [];
    }

    enqueue(data, priority) {
        this.queue.push({ data, priority });
        this.sort();
    }

    dequeue() {
        return this.queue.shift();
    }

    sort() {
        this.queue.sort((a, b) => a.priority - b.priority);
    }

    isEmpty() {
        return this.queue.length === 0;
    }
}


module.exports = { Graph };