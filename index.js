const btn = document.querySelector('.difficulty')
const choice = document.querySelector('.choice')

btn.addEventListener('click', function (e) {
    if (e.target.innerHTML === '简单模式') {
        localStorage.setItem('ikun', '3')
        btnHide()
    }
    if (e.target.innerHTML === '困难模式') {
        localStorage.setItem('ikun', '25')
        btnHide()
    }
    if (e.target.innerHTML === '地狱模式') {
        localStorage.setItem('ikun', '50')
        btnHide()
    }
})

function btnHide() {
    choice.style.display = 'none'
    location.href = "./game.html"
}