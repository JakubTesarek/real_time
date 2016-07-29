document.addEventListener("DOMContentLoaded", startTimer);

function startTimer() {
	setInterval(updateClocks, 100);
}

function prefix(time) {
	return time < 10 ? "0"+time : time
}

function ampm(h) {
	return h >= 5 ? "pm" : "am";
}

function updateDigitalClocks(h, m, s) {
	clocks = document.getElementById("decimal_time");
	clocks.innerHTML = h % 5 + ":" + prefix(m) + ":" + prefix(s) + "<sup>" + ampm(h) + "</sup>";
}

function updateAnalogClocks(h, m, s) {
	var canvas = document.getElementById("clock");
	var context = canvas.getContext("2d");
	
	var clockRadius = 200;
	var clockX = canvas.width / 2;
	var clockY = canvas.height / 2;
	Math.TAU = 2 * Math.PI;
	
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.lineWidth = 1;

	function drawBackground() {
		for (var i = 0; i < 100; i++) {
			var innerDist = (i % 5) ? 0.95 : (i % 20) ? 0.85 : 0.7;
			var outerDist = 1;
			
			context.lineWidth = 1;
			context.strokeStyle = '#AAA';
			
			var armRadians = (Math.TAU * (i/100)) - (Math.TAU/4);
			var x1 = clockX + Math.cos(armRadians) * (innerDist * clockRadius);
			var y1 = clockY + Math.sin(armRadians) * (innerDist * clockRadius);
			var x2 = clockX + Math.cos(armRadians) * (clockRadius);
			var y2 = clockY + Math.sin(armRadians) * (clockRadius);
			
			context.beginPath();
			context.moveTo(x1, y1);
			context.lineTo(x2, y2);
			context.stroke();
		}
	}

	function drawArm(progress, armLength) {
		var armRadians = (Math.TAU * progress) - (Math.TAU/4);
		var targetX = clockX + Math.cos(armRadians) * (armLength * clockRadius);
		var targetY = clockY + Math.sin(armRadians) * (armLength * clockRadius);

		context.lineWidth = 1;
		context.strokeStyle = '#444';

		context.beginPath();
		context.moveTo(clockX, clockY);
		context.lineTo(targetX, targetY);
		context.stroke();
	}
	
	drawBackground()

	var hProgress = (h / 5) + (1 / 5) * (m / 100) + (1 / 5) * (1 / 100) * (s / 100);
	var mProgress = (m / 100) + (1 / 100) * (s / 100);
	var sProgress = s / 100;
	
	drawArm(hProgress, 1/2);
	drawArm(mProgress, 3/4);
	drawArm(sProgress, 1);
}

function updateClocks() {
	var today = new Date();

	seconds = (today.getHours() * 3600) + (today.getMinutes() * 60) + today.getSeconds() + (today.getMilliseconds() / 1000);
	decimal_seconds = (seconds / 86400.0) * 100000.0

	h = Math.floor(decimal_seconds / 10000)
	decimal_seconds %= h * 10000

	m = Math.floor(decimal_seconds / 100)
	decimal_seconds %= Math.floor(m * 100)
  
	s = Math.floor(decimal_seconds)

	updateDigitalClocks(h, m, s);
	updateAnalogClocks(h, m, s)
}