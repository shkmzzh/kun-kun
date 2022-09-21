const btn = document.querySelector('.difficulty')
const choice = document.querySelector('.choice')

btn.addEventListener('click', function (e) {
    if (e.target.innerHTML === '简单模式') {
        localStorage.setItem('ikun', '15')
        btnHide()
    }
    if (e.target.innerHTML === '困难模式') {
        localStorage.setItem('ikun', '35')
        btnHide()
    }
    if (e.target.innerHTML === '地狱模式') {
        localStorage.setItem('ikun', '100')
        btnHide()
    }
})

function btnHide() {
    choice.style.display = 'none'
    location.href = "./game.html"
}