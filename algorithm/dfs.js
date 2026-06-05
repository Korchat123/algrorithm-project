
let visted = new Set();
let found = false;
function dfs(graph, start, end) {
    console.log(start);
  if (visted.has(start)) return;
    visted.add(start);
    if (start === end) {
        console.log('found');
        found = true;
        return true;
    }
    else {
    for (let neighbor of graph[start]) {
        found=dfs(graph, neighbor, end);
        if (found) return true;
        }
    }
    return found;
}

let graph = {
    a: ['b', 'c'],
    b: ['a'],
    c: ['d', 'e'],
    d: ['f'],
    e: ['c'],
    f: ['a']
}
dfs(graph, 'a', 'b');
