/** 深度遍历优先 (DFS)
 * 首先，选定一个出发点后进行遍历，如果有邻接的未被访问过的节点则继续前进。
 * 若不能继续前进，则回退一步再前进
 * 若回退一步仍然不能前进，则连续回退至可以前进的位置为止。
 * 重复此过程，直到所有与选定点相通的所有顶点都被遍历。
 * 
 * 深度优先搜索是递归过程，带有回退操作，因此需要使用栈存储访问的路径信息。
 * 当访问到的当前顶点没有可以前进的邻接顶点时，需要进行出栈操作，将当前位置回退至出栈元素位置。
 */

const dfs = (root) => {
  if (!root) return;
  console.log(root.val);
  for (let child of root.children) {
    dfs(child);
  }
}

/** 广度遍历优先 (BFS)
 * 广度优先搜索是最简便的图的搜索算法之一，这一算法也是很多重要的图的算法的原型。
 * Dijkstra单源最短路径算法和Prim最小生成树算法都采用了和宽度优先搜索类似的思想。
 * 其别名又叫BFS，属于一种盲目搜寻法，目的是系统地展开并检查图中的所有节点，以找寻结果。
 * 换句话说，它并不考虑结果的可能位置，彻底地搜索整张图，直到找到结果为止。
 */

const bfs = root => {
  if(!root) return;
  const queue = [root];
  while(queue.length) {
      const top = queue.shift();
      console.log(top.val);
      top.children.forEach(child => {
          queue.push(child)
      })
  }
}
