let grid;
let score = 0;

//表格查找颜色和大小
let colorsSizes = {
  "2": {
    size: 64,
    color: "#FFF999"
  },
  "4": {
    size: 64,
    color: "#CCF9AA"
  },
  "8": {
    size: 64,
    color: "#49BB6C"
  },
  "16": {
    size: 64,
    color: "#2494C1"
  },
  "32": {
    size: 64,
    color: "#9659A7"
  },
  "64": {
    size: 64,
    color: "#F1C500"
  },
  "128": {
    size: 36,
    color: "#FF5956"
  },
  "256": {
    size: 36,
    color: "#F1C5FF"
  },
  "512": {
    size: 36,
    color: "#99BB9C"
  },
  "1024": {
    size: 24,
    color: "#24FFC1"
  },
  "2048": {
    size: 24,
    color: "#A659A9"
  }
}

function isGameWon() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] == 2048) {
        return true;
      }
    }
  }
  return false;
}

function isGameOver() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] == 0) {
        return false;
      }
      if (i !== 3 && grid[i][j] === grid[i + 1][j]) {
        return false;
      }
      if (j !== 3 && grid[i][j] === grid[i][j + 1]) {
        return false;
      }
    }
  }
  return true;
}

//创建空的数组
function blankGrid() {
  return [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];
}

function setup() {
  grid = blankGrid();
  // console.table(grid);
  addNumber();
  addNumber();
  // console.table(grid);

  updateCanvas();
}

setup();



//空白处随机生成2或4
function addNumber() {
  let options = [];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] === 0) {
        options.push({ x: i, y: j });
      }
    }
  }

  //随机一个位置
  if (options.length > 0);
  let spot = options[Math.floor(Math.random() * options.length)];
  let r = Math.random(1);
  grid[spot.x][spot.y] = r > 0.5 ? 2 : 4;
}

function compare(a, b) {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (a[i][j] !== b[i][j]) {
        return true; //true changed
      };
    }
  }
  return false; //false no-change
}

// 拷贝
function copy(grid) {
  let extra = blankGrid();
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      extra[i][j] = grid[i][j];
    }
  }
  return extra;
}

//左右反转Grid
function flipGrid(grid) {
  for (let i = 0; i < 4; i++) {
    grid[i].reverse();
  }
  return grid;
}

//顺时针转90°
function rotateGrid(grid) {
  let newGrid = blankGrid();
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      newGrid[i][j] = grid[3 - j][i];
    }
  }
  return newGrid;
}

//One "move"
//移动，添加新元素
document.onkeyup = function keyPressed(e) { //键盘事件
  let flipped = false;
  let rotated = false;
  let played = true;

  if (e.code === "ArrowLeft") { //左移
    grid = flipGrid(grid);
    flipped = true;
  } else if (e.code === "ArrowRight") { //右移
    // DO NOTHING
  } else if (e.code === "ArrowUp") { //上移
    grid = rotateGrid(grid);
    rotated = true;
  } else if (e.code === "ArrowDown") { //下移
    grid = rotateGrid(grid);
    grid = flipGrid(grid);
    rotated = true;
    flipped = true;
  } else {
    played = false;
  }

  if (played) {
    let past = copy(grid); //拷贝，用于检测数组是否有变化
    for (let i = 0; i < 4; i++) {
      grid[i] = operate(grid[i]);
    }
    let changed = compare(past, grid);

    if (flipped) {
      grid = flipGrid(grid);
    }

    //顺时针转270°
    if (rotated) {
      grid = rotateGrid(grid);
      grid = rotateGrid(grid);
      grid = rotateGrid(grid);
    }

    if (changed) {
      addNumber();
    } else {
      console.log('game over');
    }

    updateCanvas(); //更新dom

    let gameover = isGameOver();
    if (gameover) {
      console.log('GAME OVER!');
    }

    let gamewon = isGameWon();
    if (gamewon) {
      console.log('GAME WON!');
    }
  }

}

function operate(row) {
  row = slide(row);
  row = combine(row);
  row = slide(row);
  return row;
}

//在dom中显示
function updateCanvas() {
  drawGrid();
  document.getElementById('score').innerHTML = score;
}

function drawGrid() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      let val = document.getElementById(String(i) + String(j));
      let s = "" + grid[i][j];
      val.style.backgroundColor = '#fff';
      if (grid[i][j] !== 0) {
        //根据数字长度修改fontSize
        val.style.fontSize = colorsSizes[s].size + 'px';
        val.style.backgroundColor = colorsSizes[s].color;
        val.innerHTML = grid[i][j];
      } else {
        val.innerHTML = '';
      }
    }
  }
}

//一维数组不为零的元素向右滑动，并在末尾填充0
//[4,0,0,2] => [4,2,0,0]
function slide(row) {
  let arr = row.filter(val => val); //返回不为0的元素
  let missing = 4 - arr.length;
  let zeros = Array(missing).fill(0);
  arr = zeros.concat(arr); //拼接数组
  return arr;
}

// operating on array itself
function combine(row) {
  for (let i = 3; i >= 1; i--) {
    let a = row[i];
    let b = row[i - 1];
    if (a == b) {
      row[i] = a + b;
      score += row[i]; //统计分数
      row[i - 1] = 0;
    }
  }
  return row;
}