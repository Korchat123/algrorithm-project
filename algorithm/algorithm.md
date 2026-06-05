binary search is a search that devide and compare is taget is more or less than that point go to medium again until found with this O(logN)
examplle serch for h of array [a,b,c,d,e,f,g,h]
while linear serch is check from a to h will use total 8 to find h
but binary serach is use shorter
1. a,b,c,[d],e,f,g,h 
2. a,b,c,d,e,[f],g,h
3. a,b,c,d,e,f,[g],h
4. a,b,c,d,e,f,g,[h]
we can see hit use only 4 round to find h

bfs
is serch of graph or tree that search by queue (fifo) that run in sam column first
example
        a
       / \
     b     c
    / \   / \
  d    e  f  g

find f =a ,b ,c ,d,e,f

dfs is go in dept first and use stack (LIFO)
        a
       / \
     b     c
    / \   / \
  d    e  f  g
find f =a ,b ,d ,e,c,f

merge sort is sorting by devide until only one element and combine back
                                        array[9,8,5,6,3,7,2,1]
                                                  /   \
                                            [9,8,5,6]  [3,7,2,1]
                                            /  \            /  \
                                        [9,8]  [5,6]     [3,7]   [2,1]
                                        /       \         / \     /  \
                                       [9],[8] [5] [6]   [3] [7] [2],[1]
                                        \  /   \    /     \  /    \  /
                                       [8,9]    [5,6]     [3,7]   [1,2]
                                          \      /          \       /  
                                          [5,6,8,9]         [1,2,3,7]
                                               \              /
                                              [1,2,3,5,6,7,8,9]
