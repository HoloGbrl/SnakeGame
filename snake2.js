
function Node(data) {
    this.data = data;
    this.parent = null;
    this.children = [];
}
 
function Tree(data) {
    var node = new Node(data);
    this._root = node;
}
 
Tree.prototype.traverseDF = function(callback) {
 
    // this is a recurse and immediately-invoking function
    (function recurse(currentNode) {
        // step 2
        for (var i = 0, length = currentNode.children.length; i < length; i++) {
            // step 3
            recurse(currentNode.children[i]);
        }
 
        // step 4
        callback(currentNode);
 
        // step 1
    })(this._root);
 
};
 
Tree.prototype.traverseBF = function(callback) {
    var queue = new Queue();
 
    queue.enqueue(this._root);
 
    currentTree = queue.dequeue();
 
    while(currentTree){
        for (var i = 0, length = currentTree.children.length; i < length; i++) {
            queue.enqueue(currentTree.children[i]);
        }
 
        callback(currentTree);
        currentTree = queue.dequeue();
    }
};
 
Tree.prototype.contains = function(callback, traversal) {
    traversal.call(this, callback);
};
 
Tree.prototype.add = function(data, toData, traversal) {
    var child = new Node(data),
        parent = null,
        callback = function(node) {
            if (node.data === toData) {
                parent = node;
            }
        };
 
    this.contains(callback, traversal);
 
    if (parent) {
        parent.children.push(child);
        child.parent = parent;
    } else {
        throw new Error('Cannot add node to a non-existent parent.');
    }
};
 
Tree.prototype.remove = function(data, fromData, traversal) {
    var tree = this,
        parent = null,
        childToRemove = null,
        index;
 
    var callback = function(node) {
        if (node.data === fromData) {
            parent = node;
        }
    };
 
    this.contains(callback, traversal);
 
    if (parent) {
        index = findIndex(parent.children, data);
 
        if (index === undefined) {
            throw new Error('Node to remove does not exist.');
        } else {
            childToRemove = parent.children.splice(index, 1);
        }
    } else {
        throw new Error('Parent does not exist.');
    }
 
    return childToRemove;
};
 
function findIndex(arr, data) {
    var index;
 
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].data === data) {
            index = i;
        }
    }
 
    return index;
}
var alerted = sessionStorage.getItem('alerted') || '';
if (alerted != 'yes') {
    alert("Welcome to Snake!");
    sessionStorage.setItem('alerted','yes');
}

(function () {

    var storageCleanerButton = document.getElementById("storage-clear");
    storageCleanerButton.addEventListener("click", clearScore, false);

    function clearScore() {
        localStorage.clear();
        var rankList = document.getElementById("rank-list");
        rankList.innerHTML = "Score history";
    }

    (function loadTopFiveScores() {
        function Pair(key, value) {
            this.key = key;
            this.value = value;
        }

        var rankList = document.getElementById("rank-list");

        for(var i = 0; i < length; i++) {
            var div = document.createElement("div");
            div.innerHTML = tree._root.children[i] = tree;
            rankList.appendChild(div);


        }})();

    function Queue() {
        var that = this;
        that.arr = [];
    }

    Queue.prototype = {
        constructor: Queue,

        enqueue: function (elem) {
            this.arr.push(elem);
        },

        dequeue: function () {
            var retValue = this.arr[0];
            var newArr = new Array(this.arr.length - 1);
            for (var i = 0; i < newArr.length; i++) {
                newArr[i] = this.arr[i + 1];
            }

            this.arr = newArr;
            return retValue;
        },

        getFirstElem: function () {
            return this.arr[0];
        },

        getLastElem: function () {
            return this.arr[this.arr.length - 1];
        },

        elementAt: function (index) {
            return this.arr[index];
        },

        length: function () {
            return this.arr.length;
        }
    }

    function Coords(x, y) {
        var that = this;
        that.x = x * 10;
        that.y = y * 10;
    }

    function Snake(x, y, bodyLength) {
        var that = this;
        that.snakeBody = new Queue();
        for (var i = 0; i < bodyLength; i++) {
            that.snakeBody.enqueue(new Coords(x + i, y));
        }

        that.currentDirection = new Coords(1, 0);
        that.head = that.snakeBody.getLastElem();
    }

    Snake.prototype = {
        constructor: Snake,

        getHead: function () {
            return this.head;
        },

        getNextHead: function () {
            var nextHead =
                new Coords(
                    parseInt(this.head.x + this.currentDirection.x) / 10,
                    parseInt(this.head.y + this.currentDirection.y) / 10
                );

            return nextHead;
        },

        move: function () {
            var nextHead = this.getNextHead();
            this.snakeBody.enqueue(nextHead);
            this.snakeBody.dequeue();

            this.head = nextHead;
        },

        turnLeft: function () {
            if (this.currentDirection.x !== 1 && this.currentDirection.y !== 0) {
                var leftDirection = new Coords(-1, 0);
                this.currentDirection = leftDirection;
            }
        },

        turnRight: function () {
            if (this.currentDirection.x !== -1 && this.currentDirection.y !== 0) {
                var rightDirection = new Coords(1, 0);
                this.currentDirection = rightDirection;
            }
        },

        turnUp: function () {
            if (this.currentDirection.x !== 0 && this.currentDirection !== 1) {
                var upDirection = new Coords(0, -1);
                this.currentDirection = upDirection;
            }
        },

        turnDown: function () {
            if (this.currentDirection.x !== 0 && this.curentDirection !== -1) {
                var downDirection = new Coords(0, 1);
                this.currentDirection = downDirection;
            }
        }
    }

    function Food(width, height) {
        var minWidth = 10;
        var maxWidth = width - 10;
        var minHeight = 10;
        var maxHeight = height - 10;

        var x = parseInt((Math.random() * (maxWidth - minWidth) + minWidth) / 10);
        var y = parseInt((Math.random() * (maxHeight - minHeight) + minHeight) / 10);

        this.coords = new Coords(x, y);
    }

    // canvas functions
    function drawField(ctx, width, height) {
        ctx.save();

        ctx.fillStyle = "#0";
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = "#601e9e";
        ctx.strokeStyle = "#100";

        // Draws the upper and lower borders
        for (var i = 0; i < width; i += 10) {
            ctx.fillRect(i, 0, 10, 10);
            ctx.strokeRect(i, 0, 10, 10);

            ctx.fillRect(i, height - 10, 10, 10);
            ctx.strokeRect(i, height - 10, 10, 10);
        }

        // Draws the left and right borders
        for (var i = 0; i < height; i += 10) {
            ctx.fillRect(0, i, 10, 10);
            ctx.strokeRect(0, i, 10, 10);

            ctx.fillRect(width - 10, i, 10, 10);
            ctx.strokeRect(width - 10, i, 10, 10);
        }

        ctx.restore();
    }

    function drawFood(ctx, food) {
        ctx.save();

        ctx.fillStyle = "#d20402";
        ctx.strokeStyle = "#100";
        ctx.fillRect(food.coords.x, food.coords.y, 10, 10);
        ctx.strokeRect(food.coords.x, food.coords.y, 10, 10);

        ctx.restore();
    }

    function drawSnake(ctx, snake) {
        ctx.save();

        ctx.fillStyle = "#09b02f";
        ctx.strokeStyle = "#5";

        var snakeBody = snake.snakeBody;
        for (var i = 0; i < snakeBody.length(); i++) {
            var snakeElem = snakeBody.elementAt(i);
            ctx.fillRect(snakeElem.x, snakeElem.y, 10, 10);
            ctx.strokeRect(snakeElem.x, snakeElem.y, 10, 10);
        }

        ctx.restore();
    }

    //Tree traversing
    Tree.prototype.traverseDF = function(callback) {

        // this is a recurse and immediately-invoking function
        (function recurse(currentNode) {
            // step 2
            for (var i = 0, length = currentNode.children.length; i < length; i++) {
                // step 3
                recurse(currentNode.children[i]);
            }

            // step 4
            callback(currentNode);

            // step 1
        })(this._root);

    };


    function saveScore(score){
         /*tree._root.children.push(new Node('name'));
       tree._root.children[1].parent = tree;
        tree._root.children[0].children.push(new Node(score));
        tree._root.children[0].children[0].parent = tree._root.children[0];

        tree.traverseDF(function(node) {
            console.log(node.data)
        });*/

    }

    function restartGame() {
		alert("Game Over! Your score was " + score + ". Press 'OK' to try again!")
        document.location.reload();

    }

    // Initialization
    var canvas = document.getElementsByTagName("canvas")[0];
    var width = canvas.width;
    var height = canvas.height;
    var ctx = canvas.getContext("2d");

    var snake = new Snake(5, 5, 5);
    var food = new Food(width, height);
    var score = 0;
    var tree = new Tree('root');

    var scoreDiv = document.getElementById("score");
    scoreDiv.style.fontWeight = "bold";
    scoreDiv.innerHTML = "Score: " + score;
	
	var rankList = document.getElementById("rank-list");
                     
    window.onkeydown = function (ev) {
        switch (ev.keyCode) {
            case 37:
                snake.turnLeft();
                break;
            case 38:
                snake.turnUp();
                break;
            case 39:
                snake.turnRight();
                break;
            case 40:
                snake.turnDown();
                break;
        }
    }

    function run(ctx, snake, width, height) {
        var nextHead = snake.getNextHead();
        var snakeBody = snake.snakeBody;

        // self collision
        for (var i = 0; i < snakeBody.length(); i++) {
            var elem = snakeBody.elementAt(i);
            if (elem.x === nextHead.x && elem.y === nextHead.y) {
                saveScore(score);
                restartGame();
            }
        }

        // wall collision
        if (nextHead.x <= 0 ||
            nextHead.x >= width - 10 ||
            nextHead.y <= 0 ||
            nextHead.y >= height - 10) {
            saveScore(score);
            restartGame();
        }

        //food collision
        for (var i = 0; i < snakeBody.length() ; i++) {
            var elem = snakeBody.elementAt(i);
            if (elem.x === food.coords.x && elem.y === food.coords.y) {
                var snakeNextHead = snake.getNextHead();
                snake.snakeBody.enqueue(snakeNextHead);
                snake.head = snakeNextHead;
                food = new Food(width, height);
                score += 100;
                scoreDiv.innerHTML = "Score: " + score;			    

                var HighScoreDiv = localStorage.getItem('HighScore') || 0;
  
                
				if (score > HighScore) {
  				HighScore = parseInt(score);
                localStorage.setItem('HighScore', HighScoreDiv);
				}
                HighScoreDiv.innerHTML = "High Score: " + HighScore;
	
                
                clearScore();
				tree._root.children.push(new Node(score));                
                tree.traverseDF(function(node) {
                  if(node.data != 'root'){
				   var div = document.createElement("div");
                   div.innerHTML = node.data;
                   rankList.appendChild(div);
                }
                  });

                break;
            }
        }
        snake.move();
        drawField(ctx, width, height);
        drawFood(ctx, food);
        drawSnake(ctx, snake);
    }

    function gameLoop() {
        run(ctx, snake, width, height);
    }

    setInterval(gameLoop, 100);
}());
