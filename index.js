const levelOrderText = document.getElementById('level-order')
const preOrderText = document.getElementById('pre-order')
const postOrderText = document.getElementById('post-order')
const inOrderText = document.getElementById('in-order')
const orderDisplay = document.getElementById('order-display')
const balanceButtons = document.getElementById('balance-buttons')
const treeDisplay = document.getElementById('tree')
const balanceStatus = document.getElementById('balance-status')
const modal = document.getElementById('modal')
const alertWindow = document.getElementById('alert')
const alertMessage = document.getElementById('alert-message')
const unbalanceButton = document.getElementById('unbalance')
const rebalanceButton = document.getElementById('rebalance')

class node {
    constructor (value) {
        this.data = value;
        this.leftChild = null
        this.rightChild = null
    }
}

const buildTree = (array, start, end) => {
    if (start > end) return null
    const midpoint = Math.floor((start+end)/2)
    const treeNode = new node(array[midpoint])
    treeNode.leftChild = buildTree(array, start, midpoint-1)
    treeNode.rightChild = buildTree(array, midpoint+1, end)
    return treeNode
}

const fix = (array) => {
    const fixedArray = array.sort((a,b) => a > b ? +1 : -1)
    for (let i=1; i<fixedArray.length; i++) {
        if (fixedArray[i] === fixedArray[i-1]) {
            fixedArray.splice(i,1)
            i--
        }
    }
    return fixedArray
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
        if (targetNode.leftChild === null && targetNode.rightChild === null) {
            if (value > startingNode.data) {
                startingNode.rightChild = null
                return
            } else {
                startingNode.leftChild = null
                return
            }
        }
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
        return 
    }
}




const printInDiv = (div, node, prefix = "", isLeft = true) => {
    if (node === null) return
    if (node.rightChild !== null) {
      printInDiv(div, node.rightChild, `${prefix}${isLeft ? "│---" : "-----"}`, false);
    }
    div.innerHTML += (`${prefix}${isLeft ? "└─ " : "┌─ "}${node.data}<br>`);
    if (node.left !== null) {
      printInDiv(div, node.leftChild, `${prefix}${isLeft ? "-----" : "│---"}`, true);
    }
  };

const divClear = (div) => {
    div.innerHTML = ''
}

const overwriteDiv = (div, node) => {
    divClear(div)
    printInDiv(div, node, prefix = "", isLeft = true)
}

const demoTree = new tree([1,2,3])

function randomArray(array = []) {
    let nextNumber = 0
    for (let i = 0; i < 11; i++) {
        nextNumber += Math.ceil(Math.random()*4)
        array.push(nextNumber)
    }
    return array
}

function updateOrderFields() {
    levelOrderText.textContent = demoTree.levelOrder().join(', ')
    preOrderText.textContent = demoTree.preOrder().join(', ')
    postOrderText.textContent = demoTree.postOrder().join(', ')
    inOrderText.textContent = demoTree.inOrder().join(', ')
}

let rebalanceTally = 0

function newTree() {
    rebalanceTally = 0
    const array = randomArray()
    demoTree.root = buildTree(array, 0, array.length-1)
    overwriteDiv(treeDisplay, demoTree.root)
    updateOrderFields()
    if (balanceButtons.style.display !== 'flex') {
        orderDisplay.style.display = 'flex'
        balanceButtons.style.display = 'flex'
        balanceStatus.style.display = 'flex'
    }
    if (demoTree.isBalanced()) {
        treeDisplay.style.borderColor = 'rgb(0,0,0)'
        balanceStatus.textContent = 'Tree is balanced'
        balanceStatus.style.color = 'rgb(0,0,0)'
        rebalanceButton.style.display = 'none'
        unbalanceButton.style.display = 'flex'
    }
}

function unbalanceTree() {
    if (!demoTree.isBalanced()) {
        modalAlert('The tree is already unbalanced.')
        return
    }
    if (rebalanceTally >=4) {
        modalAlert('This is getting out of hand. Why not start over with a new tree?')
        return
    }
    while (demoTree.isBalanced()) {
        demoTree.insert(Math.ceil(Math.random()*(50+rebalanceTally*50))+50)
    }
    overwriteDiv(treeDisplay, demoTree.root)
    updateOrderFields()
    if (!demoTree.isBalanced()) {
        treeDisplay.style.borderColor = 'rgb(220,20,60)'
        balanceStatus.textContent = 'Tree is not balanced'
        balanceStatus.style.color = 'rgb(220,20,60)'
        rebalanceButton.style.display = 'flex'
        unbalanceButton.style.display = 'none'
    }
}

function rebalanceTree() {
    if (demoTree.isBalanced()) {
        modalAlert('The tree is already balanced.')
        return
    }
    demoTree.rebalance()
    overwriteDiv(treeDisplay, demoTree.root)
    if (demoTree.isBalanced()) {
        treeDisplay.style.borderColor = 'rgb(0,0,0)'
        balanceStatus.textContent = 'Tree is balanced'
        balanceStatus.style.color = 'rgb(0,0,0)'
        rebalanceButton.style.display = 'none'
        unbalanceButton.style.display = 'flex'
    }
    rebalanceTally += 1
    updateOrderFields()
}

function modalAlert(string) {
    modal.style.display = 'flex'
    alertMessage.textContent = string
    
}

function closeModal(event) {
    if (event.target !== alertWindow && event.target !== alertMessage) modal.style.display = 'none'
}

document.onkeydown = (event) => {
    if (event.key === "Escape") {
        modal.style.display = 'none'
    }
}