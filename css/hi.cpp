#include <iostream>
using namespace std;
template <class Elem>
class minHeap{
    private:
    Elem* tab;
    int n;
    int max;
    public:
    minHeap(Elem* h, int num, int maxsize);
    minHeap(int maxsize);
    ~minHeap();
    int heapsize() const;
    bool isleaf(int) const;
    int leftchild(int) const;
    int rightchild(int) const;
    int parent(int) const;
    Elem deletemin();
    void buildheap();
    void insert(const Elem&);
};
template <class Elem>
minHeap<Elem>::minHeap(Elem* h,int num,int maxsize) : n(num), max(maxsize){
    tab = new Elem[maxsize + 1];
    for(i=1,i<=num,i++){
        tab[i] = h[i-1];
    }
    buildheap();
}
template <class Elem>
minHeap<Elem>::minHeap(int maxsize): max(maxsize){
    tab = new Elem[maxsize +1];
}
template<class Elem>
minHeap<Elem>::~minHeap(){
    delete tab[];
}
template<class Elem>
int minHeap<Elem>::heapsize() const{
    return n;
}
template<class Elem>
int minHeap<Elem>::parent(int pos) const{
    return pos/2;
}
template<class Elem>
int minHeap<Elem>::leftchild(int pos) const{
    return 2 * pos;
}
template<class Elem>
int minHeap<Elem>::leftchild(int pos) const{
    return 2 * pos +1;
}
template<class Elem>
bool minHeap<Elem>::isleaf(int pos) const{
    return (pos>n/2) && (pos<=n)
}
template<class Elem>
void minHeap<Elem>::buildheap(){
    for(int i=n/2,i>0,i--){
        int pos = i;
        while(!isleaf(i)){
        int left = leftchild(i);
        int right = rightchild(i);
        int smallest = left;
        if(right <= n && tab[right]<tab[left]){
            smallest = right;
        }
        if(tab[i]<=tab[smallest]){
            break;
        }
        swap(tab[i],tab[smallest]);
        i = smallest
        }
    }
}
template<class Elem>
Elem minHeap<Elem>::deletemin(){
    if(n==0) return Elem();

    Elem temp = tab[1];
    tab[1] = tab[n--];

    if (n>1) putheap();
    return temp;
}
