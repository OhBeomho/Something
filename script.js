const canvas = document.getElementById('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

window.addEventListener('resize', () => {
	canvas.width = window.innerWidth
	canvas.height = window.innerHeight
	savePos()
})
window.addEventListener('mousemove', (e) => {
	mouseX = e.pageX
	mouseY = e.pageY
})

const ctx = canvas.getContext('2d')
ctx.fillStyle = 'black'

const gap = 50
const pos = []
const types = 6

let mouseX = 0,
	mouseY = 0
let clickEffect = 0

const shapeInput = [
	document.getElementById('circle'),
	document.getElementById('rectangle'),
	document.getElementById('rotatingRectangle')
]
const shapeFuncs = [drawCircles, drawRectangles, drawRotatingRectangles]
const typeSelect = document.getElementById('type')

for (let i = 1; i <= types; i++) {
	const option = document.createElement('option')
	option.innerText = i
	option.value = i
	typeSelect.appendChild(option)
}

let type = Number(typeSelect.value)
let shape

for (let i = 0; i < shapeInput.length; i++) {
	if (shapeInput[i].checked) shape = shapeFuncs[i]
	shapeInput[i].addEventListener('change', () => {
		if (shapeInput[i].checked) shape = shapeFuncs[i]
	})
}

typeSelect.addEventListener('change', () => (type = Number(typeSelect.value)))
window.addEventListener('click', () => (clickEffect += 10))

for (let i = 0; i <= canvas.width / gap + 5; i++) {
	for (let j = 0; j <= canvas.height / gap + 5; j++) pos.push({ x: i * gap, y: j * gap })
}

function calculateSize(x, y, type) {
	let result
	let v = 15 + clickEffect

	switch (type) {
		case 1:
			result = (Math.abs(x - mouseX) + Math.abs(y - mouseY)) / v
			break
		case 2:
			result = ((gap * gap) / 2 - (Math.abs(x - mouseX) + Math.abs(y - mouseY))) / v
			break
		case 3:
			result = (Math.abs(x - mouseX) - Math.abs(y - mouseY)) / v
			break
		case 4:
			result = (Math.abs(y - mouseY) - Math.abs(x - mouseX)) / v
			break
		case 5:
			result = Math.abs((Math.abs(x - mouseX) - Math.abs(y - mouseY)) / v)
			break
		case 6:
			result = Math.sin(Math.abs((Math.abs(x - mouseX) - Math.abs(y - mouseY)) / v) / 2) * 70
			break
	}

	return result <= 0 ? 0 : result
}

function drawCircles(type) {
	for (let p of pos) {
		let size = calculateSize(p.x, p.y, type)
		ctx.beginPath()
		ctx.arc(p.x, p.y, size / 2, 0, 2 * Math.PI)
		ctx.fill()
	}
}

function drawRectangles(type) {
	for (let p of pos) {
		let size = calculateSize(p.x, p.y, type)
		ctx.fillRect(p.x - size / 2, p.y - size / 2, size, size)
	}
}

function drawRotatingRectangles(type) {
	for (let p of pos) {
		let size = calculateSize(p.x, p.y, type)
		ctx.save()
		ctx.translate(p.x - size / 2, p.y - size / 2)
		ctx.rotate((size * 10 * Math.PI) / 180)
		ctx.fillRect(-size / 2, -size / 2, size, size)
		ctx.restore()
	}
}

function animate() {
	ctx.clearRect(0, 0, canvas.width, canvas.height)

	shape(type)

	if (clickEffect > 0) clickEffect -= clickEffect / 10
	else if (clickEffect < 0) clickEffect = 0

	requestAnimationFrame(animate)
}

animate()
