class node {
    constructor (value) {
        this.data = value;
        this.leftChild = null
        this.rightChild = null
    }
}

class tree  {
    constructor (array) {
        this.root = buildTree(fix(array), 0, array.length-1)
    }

    insert(value, startingNode = this.root) {
        if (value < startingNode.data && startingNode.leftChild === null) {
            startingNode.leftChild = new node(value)
            return
        } else if (value > startingNode.data && startingNode.rightChild === null) {
            startingNode.rightChild = new node(value)
            return
        } else if (value < startingNode.data && startingNode.leftChild !== null) {
            this.insert(value, startingNode.leftChild)
        } else if (value > startingNode.data && startingNode.rightChild !== null) {
            this.insert(value, startingNode.rightChild)
        }
    }

    delete(value, startingNode = this.root) {
        const targetNode = value > startingNode.data ? startingNode.rightChild : startingNode.leftChild
        if (targetNode.data !== value) return this.delete(value, targetNode)
        // if value node has no children
        if (targetNode.leftChild === null && targetNode.rightChild === null) {
            if (value > startingNode.data) {
                startingNode.rightChild = null
                return
            } else {
                startingNode.leftChild = null
                return
            }
        }
        // if value node has two children
        if (targetNode.leftChild !== null && targetNode.rightChild !== null) {
            const nextBiggest = this.leftDescendant(targetNode.rightChild)
            this.parentOf(nextBiggest).leftChild = nextBiggest.rightChild
            if (this.parentOf(nextBiggest) !== targetNode) nextBiggest.rightChild = targetNode.rightChild
            nextBiggest.leftChild = targetNode.leftChild
            switch(targetNode.data === startingNode.leftChild.data) {
                case true:
                    startingNode.leftChild = nextBiggest
                    break;
                case false:
                    startingNode.rightChild = nextBiggest
                    break;
            }
            console.log(nextBiggest)
            console.log(startingNode)
            return
        }
        // if value node has one child
        if (value > startingNode.data) {
            startingNode.rightChild = targetNode.leftChild !== null ? targetNode.leftChild : targetNode.rightChild
        }
        if (value < startingNode.data) {
            startingNode.leftChild = targetNode.leftChild !== null ? targetNode.leftChild : targetNode.rightChild
        }
        
    }

    parentOf(node, startingNode = this.root) {
        const targetNode = node.data > startingNode.data ? startingNode.rightChild : startingNode.leftChild
        if (targetNode === node) return startingNode
        return this.parentOf(node, targetNode)
    }

    leftDescendant(node) {  
        if (node.leftChild === null) {
            return node
        }
        else return this.leftDescendant(node.leftChild)
    }

    levelOrder(queue = [], values = []) {
        queue.push(this.root)
        while (queue.length) {
            values.push(queue[0].data)
            if (queue[0].leftChild !== null) {queue.push(queue[0].leftChild)}         
            if (queue[0].rightChild !== null) {queue.push(queue[0].rightChild)}
            queue.shift()
        }
        return values
    }

    preOrder(startingNode = this.root, values = []) {
        if (startingNode === null) return
        values.push(startingNode.data)
        this.preOrder(startingNode.leftChild, values)
        this.preOrder(startingNode.rightChild, values)
        return values
    }

    inOrder(startingNode = this.root, values = []) {
        if (startingNode === null) return
        this.inOrder(startingNode.leftChild, values)
        values.push(startingNode.data)
        this.inOrder(startingNode.rightChild, values)
        return values
    }

    postOrder(startingNode = this.root, values = []) {
        if (startingNode === null) return
        this.postOrder(startingNode.leftChild, values)
        this.postOrder(startingNode.rightChild, values)
        values.push(startingNode.data)
        return values
    }

    height(node) {
        if (node === null) return 0
        if (node.rightChild === null && node.leftChild === null) return 0
        const leftHeight = this.height(node.leftChild)
        const rightHeight = this.height(node.rightChild)
        if (leftHeight > rightHeight) return leftHeight + 1
        else return rightHeight + 1
    }

    depth(node, depth = 0) {
        if (node === this.root) return depth
        if (this.parentOf(node) === this.root) return depth + 1
        return this.depth(this.parentOf(node), depth + 1)
    }

    isBalanced(startingNode = this.root) {
        const leftHeight = this.height(startingNode.leftChild)
        const rightHeight = this.height(startingNode.rightChild)
        if (leftHeight - rightHeight < -1 || leftHeight - rightHeight > 1) return false
        if (startingNode.leftChild !== null) this.isBalanced(startingNode.leftChild)
        if (startingNode.rightChild !== null) this.isBalanced(startingNode.rightChild)
        return true
    }

    rebalance() {
        if (this.isBalanced()) return
        const array = this.inOrder()
        this.root = buildTree(array, 0, array.length-1)
        prettyPrint(this.root)
        return 
    }
}

const fix = (array) => {
    // sorts
    const fixedArray = array.sort((a,b) => a > b ? +1 : -1)
    //  removes duplicates
    for (let i=1; i<fixedArray.length; i++) {
        if (fixedArray[i] === fixedArray[i-1]) {
            fixedArray.splice(i,1)
            i--
        }
    }
    return fixedArray
}

const buildTree = (array, start, end) => {
    if (start > end) return null
    const midpoint = Math.floor((start+end)/2)
    const treeNode = new node(array[midpoint])
    treeNode.leftChild = buildTree(array, start, midpoint-1)
    treeNode.rightChild = buildTree(array, midpoint+1, end)
    return treeNode
}

const prettyPrint = (node, prefix = "", isLeft = true) => {
    if (node === null) {
      return;
    }
    if (node.rightChild !== null) {
      prettyPrint(node.rightChild, `${prefix}${isLeft ? "│   " : "    "}`, false);
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
    if (node.left !== null) {
      prettyPrint(node.leftChild, `${prefix}${isLeft ? "    " : "│   "}`, true);
    }
  };

const newTree = new tree([1,5,7,9,76,4,23,3,456,7,56,78,94,53,25,78,46,267,7,5,4,3,2,3,56])

