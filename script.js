const canvas = document.getElementById('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

window.addEventListener('resize', () => {
	canvas.width = window.innerWidth
	canvas.height = window.innerHeight
	setPos()
	console.log(pos.length)
})
window.addEventListener('mousemove', (e) => {
	mouse_x = e.pageX
	mouse_y = e.pageY
})

const ctx = canvas.getContext('2d')
ctx.fillStyle = 'black'

const gap = 50
const pos = []
const types = 6

let mouse_x = 0,
	mouse_y = 0
let click_effect_power = 0

const shape_inputs = [
	document.getElementById('circle'),
	document.getElementById('rectangle'),
	document.getElementById('rotatingRectangle')
]
const shape_funcs = [drawCircles, drawRectangles, drawRotatingRectangles]
const type_select = document.getElementById('type')

for (let i = 1; i <= types; i++) {
	const option = document.createElement('option')
	option.innerText = option.value = i
	type_select.appendChild(option)
}

let type = Number(type_select.value)
let shape = shape_funcs[0]

for (let i = 0; i < shape_inputs.length; i++) {
	shape_inputs[i].addEventListener('change', () => {
		if (shape_inputs[i].checked) shape = shape_funcs[i]
	})
}

type_select.addEventListener('change', () => (type = Number(type_select.value)))
window.addEventListener('click', () => (click_effect_power += 10))

function setPos() {
	pos.splice(0, pos.length)

	for (let i = 0; i <= canvas.width / gap + 1; i++) {
		for (let j = 0; j <= canvas.height / gap + 1; j++) pos.push({ x: i * gap, y: j * gap })
	}
}

function calculateSize(x, y) {
	const v = 15 + click_effect_power
	const results = [
		(Math.abs(x - mouse_x) + Math.abs(y - mouse_y)) / v,
		((gap * gap) / 2 - (Math.abs(x - mouse_x) + Math.abs(y - mouse_y))) / v,
		(Math.abs(x - mouse_x) - Math.abs(y - mouse_y)) / v,
		(Math.abs(y - mouse_y) - Math.abs(x - mouse_x)) / v,
		Math.abs((Math.abs(x - mouse_x) - Math.abs(y - mouse_y)) / v),
		Math.sin(Math.abs((Math.abs(x - mouse_x) - Math.abs(y - mouse_y)) / v) / 2) * 70
	]
	const result = results[type - 1]

	return result <= 0 ? 0 : result
}

function drawCircles(type) {
	for (let p of pos) {
		let size = calculateSize(p.x, p.y)
		ctx.beginPath()
		ctx.arc(p.x, p.y, size / 2, 0, 2 * Math.PI)
		ctx.fill()
	}
}

function drawRectangles(type) {
	for (let p of pos) {
		let size = calculateSize(p.x, p.y)
		ctx.fillRect(p.x - size / 2, p.y - size / 2, size, size)
	}
}

function drawRotatingRectangles(type) {
	for (let p of pos) {
		let size = calculateSize(p.x, p.y)
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

	if (click_effect_power > 0) click_effect_power -= click_effect_power / 10
	else if (click_effect_power < 0) click_effect_power = 0

	requestAnimationFrame(animate)
}

setPos()
animate()
