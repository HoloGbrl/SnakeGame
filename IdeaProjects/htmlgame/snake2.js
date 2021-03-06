var alerted = sessionStorage.getItem('alerted') || '';
if (alerted != 'yes') {
    alert("Welcome to Snake!");
    sessionStorage.setItem('alerted','yes');
}

(function SNAKE() {

    var verif = 0;


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


    function restartGame() {
        document.location.reload();
        if(verif == 0) {
            alert("GAME OVER! Press OK to try again...");
            verif++;
        }

    }

    // Initialization
    var canvas = document.getElementsByTagName("canvas")[0];
    var width = canvas.width;
    var height = canvas.height;
    var ctx = canvas.getContext("2d");

    var snake = new Snake(5, 5, 5);
    var food = new Food(width, height);
    var score = 0;

    var scoreDiv = document.getElementById("score");
    scoreDiv.style.fontWeight = "bold";
    scoreDiv.innerHTML = "Score: " + score;

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
        var verify = 0;

        // self collision
        for (var i = 0; i < snakeBody.length(); i++) {
            var elem = snakeBody.elementAt(i);
            if (elem.x === nextHead.x && elem.y === nextHead.y) {
          //      alert("GAME OVER");
            restartGame();
            }
        }

        // wall collision
        if (nextHead.x <= 0 ||
            nextHead.x >= width - 10 ||
            nextHead.y <= 0 ||
            nextHead.y >= height - 10) {
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
