let visited = new Set();
function bfs(graph, start, end) {
    let queue = [start];
    while (queue.length > 0) {
        let node = queue.shift();
        console.log(node);
        if (node === end) {
            console.log('found');
            return true;
        }
        if (!visited.has(node)) {
            visited.add(node);
            for (let neighbor of graph[node]) {
                queue.push(neighbor);
            }
        }
    }
    return false;
}
let graph = {
    a: ['b', 'c'],
    b: ['a'],
    c: ['d', 'e'],
    d: ['f'],
    e: ['c'],
    f: ['a']
}
bfs(graph, 'a', 'f');   