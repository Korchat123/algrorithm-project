BIG O notation is way to describ the worst case of give data when run code though time
example
    x=5+6 this is O(1) that mean use only 1 to compute
    for(i=0;i<N;i++) this loop use N time to execute O(N)
    for(i=0;i<N;i++)
        for(j=0;j<N;j++) this loop over loop use N^2 time to run O(N^2)

if O is more mean use more time when number of data is more


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


insertion sort it choose one and compare to prev and go find to point there should be like 
array[5,7,2,1,3,4,6,8,9]

[5]
[[5],7,2,1,3,4,6,8,9]
[7](7>5)
[5,[7],2,1,3,4,6,8,9]
[2](2<7)&(2<5)
[[2],5,7,1,3,4,6,8,9]
[1](1<7)(1<5)(1<2)
[[1],2,5,7,3,4,6,8,9]
[3](3<7)(3<5)(3>2)
[1,2,[3],5,7,4,6,8,9]
[4](4<7>)(4<5)(4>3)
[1,2,3,[4],5,7,6,8,9]
[6](6<7)(6>5)
[1,2,3,4,5,[6],7,8,9]
[8](8>7)
[1,2,3,4,5,6,7,[8],9]
[9](9>8)
[1,2,3,4,5,6,7,8,[9]]
