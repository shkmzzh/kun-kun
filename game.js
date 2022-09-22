const app = document.getElementById("app");
const $width = 50;
const $height = 50;
let count 
var gameOver = false;
  count = parseInt(localStorage.getItem('ikun'))
const BlockNums = count;
const IMGS = [
  "./img/ikun1.jpg",
  "./img/ikun2.jpg",
  "./img/ikun3.jpg",
  "./img/ikun4.jpg",
  "./img/ikun5.jpg",
  "./img/ikun6.jpg",
  "./img/ikun7.jpg",
];
function calculationOfPosition() {
  const { left: x, top: y } = app.getBoundingClientRect();
  const AppPosition = {
    x,
    y,
    drawStartX: 20,
    drawStartY: 20,
    drawEndX: app.offsetWidth - 70,
    drawEndY: app.offsetHeight - 200,
  };

  return AppPosition;
}
const AppPosition = calculationOfPosition();

class Block {
  constructor(src, i) {
    this.width = $width;
    this.height = $height;
    this.n = src;
    this.index = i;
    this.src = src;
    this.x = randomPosition(AppPosition.drawStartX, AppPosition.drawEndX);
    this.y = randomPosition(AppPosition.drawStartY, AppPosition.drawEndY);
    this.blockState = false;
  }
  isCover() {
    var thatBlock;
    var coverState = false;
    for (let index = 0; index < allBlock.length; index++) {
      // 找到他的位置
      if (allBlock[index].index === this.index) {
        thatBlock = allBlock[index];
      } else if (thatBlock) {
        const target = allBlock[index];
        var xLeft = target.x;
        var xRight = target.x + target.width;
        var yTop = target.y;
        var yBottom = target.y + target.height;
        if (
          !(
            thatBlock.x > xRight ||
            thatBlock.x + thatBlock.width < xLeft ||
            thatBlock.y > yBottom ||
            thatBlock.y + thatBlock.height < yTop
          )
        ) {
          coverState = true;
          break;
        }
      }
    }
    return coverState;
  }

  draw() {
    const imgDom = new Image();
    imgDom.src = this.src;
    imgDom.id = this.index;
    imgDom.onclick = clickBlock.bind(null, imgDom, this);
    imgDom.classList = "noSelect imgGlobal";
    let style = {
      left: this.x + "px",
      top: this.y + "px",
      width: this.width + "px",
      height: this.height + "px",
    };
    if (this.isCover()) {
      imgDom.classList.add("imgFilter");
      this.blockState = false;
    } else {
      imgDom.classList.remove("imgFilter");
      this.blockState = true;
    }
    setStyle(imgDom, style);
    return imgDom;
  }
}
const allBlock = [];
const hasBeenStored = [];

const storageBox = document.getElementById("storageBox");
const borderWidth = 10;
var StpragePosition;
var startLeft;
function computedBoxPosition(target, targetDomClass) {
  setStyle(target, {
    zIndex: 9999,
  });
  StpragePosition = storageBox.getBoundingClientRect();
  startLeft = StpragePosition.x - AppPosition.x + borderWidth;
  const top = StpragePosition.y - AppPosition.y + borderWidth + "px";
  const Item = {
    targetDomClass,
    target,
  };
  if (!hasBeenStored.length) {
    setStyle(target, {
      left: startLeft + "px",
      top,
    });
    targetDomClass.left = startLeft;
    hasBeenStored.push(Item);
  } else {
    const hasIndex = hasBeenStored.findIndex(
      (v) => v.targetDomClass.n == targetDomClass.n
    );
    if (hasIndex === -1) {
      const left = startLeft + hasBeenStored.length * targetDomClass.width;
      setStyle(target, {
        left: left + "px",
        top,
      });
      targetDomClass.left = left;
      hasBeenStored.push(Item);
    } else {
      for (let index = hasBeenStored.length - 1; index >= hasIndex; index--) {
        const newLeft = startLeft + (index + 1) * $width;
        setStyle(hasBeenStored[index].target, {
          left: newLeft + "px",
        });
        hasBeenStored[index].targetDomClass.left = newLeft;
      }
      setStyle(target, {
        left: startLeft + hasIndex * targetDomClass.width + "px",
        top,
      });
      targetDomClass.left = startLeft + hasIndex * targetDomClass.width;
      hasBeenStored.splice(hasIndex, 0, Item);
    }
  }
  Item.target.classList.remove("noSelect");
  Item.target.classList.add("isSelect");
  const removeIndex = allBlock.findIndex(
    (v) => v.index == Item.targetDomClass.index
  );
  allBlock.splice(removeIndex, 1);
  const noSelect = document.querySelectorAll(".noSelect");
  for (var i = 0; i < noSelect.length; i++) {
    app.removeChild(noSelect[i]);
  }
  createBlockToDocument();
}
function checkBox() {
  const checkMap = {};
  hasBeenStored.forEach((v, i) => {
    if (!checkMap[v.targetDomClass.n]) {
      checkMap[v.targetDomClass.n] = [];
    }
    checkMap[v.targetDomClass.n].push({
      index: i,
      id: v.targetDomClass.index,
    });
  });
  for (const key in checkMap) {
    if (checkMap[key].length === 3) {
      hasBeenStored.splice(checkMap[key][0].index, 3);
      setTimeout(() => {
        checkMap[key].forEach((v) => {
          var box = document.getElementById(v.id);
          box.parentNode.removeChild(box);
        });
        hasBeenStored.forEach((v, i) => {
          let left = startLeft + i * v.targetDomClass.width + "px";
          setStyle(v.target, {
            left,
          });
          v.targetDomClass.left = left;
        });
      }, 300);
    }
  }
  GameValidate();
}

window.onload = function () {
  drawBlock(BlockNums);
  setStyle(storageBox, {
    border: "10px solid rgb(15, 87, 255)",
  });
};

function setStyle(d, styleObject) {
  for (const key in styleObject) {
    d["style"][key] = styleObject[key];
  }
  d["style"]["transition"] = ".225s";
}
function randomPosition(min, max) {
  return randomKey(min, max);
}

function randomKey(min, max) {
  return parseInt(Math.random() * (max - min + 1) + min);
}

function drawBlock(gloup) {

  let virtualArr = [];
  for (let index = 0; index < gloup; index++) {
    virtualArr.push(...IMGS.sort(randomSort));
  }
  virtualArr.forEach((v, index) => {
    const vBlock = new Block(v, index);
    allBlock.push(vBlock);
  });

  createBlockToDocument();
}

function createBlockToDocument() {
  allBlock.forEach((v) => {
    app.appendChild(v.draw());
  });
}

function clickBlock(target, targetDomClass) {
  if (gameOver) {
    alert("游戏结束");
    return;
  }
  if (targetDomClass.blockState) {

    targetDomClass.blockState = false;

    computedBoxPosition(target, targetDomClass);

    checkBox();
  }
}


function randomSort(a, b) {
  return Math.random() > 0.5 ? -1 : 1;
}


function GameValidate() {
  if (hasBeenStored.length === 6) {
    setTimeout(() => {
      getFail()
    }, 225);
    gameOver = true;
  }

  if (!allBlock.length && !hasBeenStored.length) {
    setTimeout(() => {
      getWin()
    }, 225);
    gameOver = true;
  }
}

document.querySelector('.refresh').addEventListener('click', function () {
  location.reload()
})
const ofail = document.querySelector('.fail')
const modal = document.querySelector('.modal')

function getFail() {
  modal.style.display = 'block'
  getJntm()
}
ofail.addEventListener('click', function () {
  modal.style.display = 'none'
  location.reload()
})

const reward = document.querySelector('.reward')
const leave = document.querySelector('.leave')
const money = document.querySelector('.money')
money.addEventListener('click', function () {
  reward.style.display = 'block'
})
leave.addEventListener('click', function () {
  reward.style.display = 'none'
  getNgm()
})

const btn = document.querySelector('.difficulty')
const choice = document.querySelector('.choice')
const pattern = document.querySelector('.pattern')

pattern.addEventListener('click', function () {
  choice.style.display = 'block'
})

btn.addEventListener('click', function (e) {
  if (e.target.innerHTML === '简单模式') {
    localStorage.setItem('ikun', '3')
    btnHide()
  }
  if (e.target.innerHTML === '困难模式') {
    localStorage.setItem('ikun', '15')
    btnHide()
  }
  if (e.target.innerHTML === '地狱模式') {
    localStorage.setItem('ikun', '45')
    btnHide()
  }
})

function btnHide() {
  choice.style.display = 'none'
  location.reload()
}
function getNgm() {
  document.querySelector('audio').src = `./audio/ngm.mp3`
}
function getJntm() {
  document.querySelector('audio').src = `./audio/jntm.mp3`
}
function getKiss() {
  document.querySelector('audio').src = `./audio/kiss.mp3`
}

const win = document.querySelector('.win')
function getWin() {
  win.style.display = 'block'
  getKiss()
}
document.querySelector('.btnWin').addEventListener('click', function () {
  win.style.display = 'none'
  getNgm()
})

function random(){
  let arr = ['作者想吃哥哥下的蛋,支持一下🏀', '请简单粗暴的爱我一分一分赏🐔', '给🐔哥一个面子好不好', '给真ikun一点支持吧🏀', '大爷,赏个鸡子呗🐔', '作者想吃哥哥下的蛋,支持一下🏀', '你的支持就是我的动力🏀','《鸡了个鸡》🐔需要您的支持']
  let dsValue = arr[Math.floor(Math.random() * 7)]
  return dsValue
}
document.querySelector('.modal p').innerText=random()
document.querySelector('.reward p').innerText=random()

console.log('小黑子,你漏出鸡脚了!')
