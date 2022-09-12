const canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	savePos();
});
window.addEventListener('mousemove', (e) => {
	mouseX = e.pageX;
	mouseY = e.pageY;
});

const ctx = canvas.getContext('2d');

const gap = 50;
const pos = [];

let mouseX = 0,
	mouseY = 0;

const shapeInput = [
	document.getElementById('circle'),
	document.getElementById('rectangle'),
	document.getElementById('rotatingRectangle')
];
const shapeFuncs = [drawCircles, drawRectangles, drawRotatingRectangles];
const typeSelect = document.getElementById('type');

let type = Number(typeSelect.value);
let shape = drawCircles;

for (let i = 0; i < shapeInput.length; i++) {
	if (shapeInput[i].checked) shape = shapeFuncs[i];

	shapeInput[i].addEventListener('change', () => {
		if (shapeInput[i].checked) shape = shapeFuncs[i];
	});
}

typeSelect.addEventListener('change', () => (type = Number(typeSelect.value)));

function savePos() {
	for (let i = 0; i <= canvas.width / gap + 5; i++) {
		for (let j = 0; j <= canvas.height / gap + 5; j++) {
			pos.push({
				x: i * gap,
				y: j * gap
			});
		}
	}
}

function calculateSize(x, y, type) {
	let result;

	switch (type) {
		case 1:
			result = Math.abs(x - mouseX) / 20 + Math.abs(y - mouseY) / 20;
			break;
		case 2:
			result = Math.abs(x - mouseX) / 20 - Math.abs(y - mouseY) / 20;
			break;
		case 3:
			result = Math.abs(y - mouseY) / 20 - Math.abs(x - mouseX) / 20;
			break;
		case 4:
			result = Math.abs(Math.abs(x - mouseX) / 20 - Math.abs(y - mouseY) / 20);
			break;
		case 5:
			result = Math.sin(Math.abs(Math.abs(x - mouseX) / 20 - Math.abs(y - mouseY) / 20) / 2) * 70;
			break;
	}

	return result <= 0 ? 0 : result;
}

function drawCircles(type) {
	ctx.fillStyle = 'black';

	for (let p of pos) {
		let size = calculateSize(p.x, p.y, type);

		ctx.beginPath();
		ctx.arc(p.x, p.y, size / 2, 0, 2 * Math.PI);
		ctx.fill();
	}
}

function drawRectangles(type) {
	ctx.fillStyle = 'black';

	for (let p of pos) {
		let size = calculateSize(p.x, p.y, type);

		ctx.fillRect(p.x - size / 2, p.y - size / 2, size, size);
	}
}

function drawRotatingRectangles(type) {
	ctx.fillStyle = 'black';

	for (let p of pos) {
		let size = calculateSize(p.x, p.y, type);

		if (size <= 0) continue;

		ctx.save();
		ctx.translate(p.x - size / 2, p.y - size / 2);
		ctx.rotate((size * 10 * Math.PI) / 180);
		ctx.fillRect(-size / 2, -size / 2, size, size);
		ctx.restore();
	}
}

function animate() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	shape(type);
	requestAnimationFrame(animate);
}

savePos();
requestAnimationFrame(animate);
