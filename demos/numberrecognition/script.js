const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let drawing = false;

canvas.addEventListener('mousedown', () => { drawing = true; ctx.beginPath(); });
canvas.addEventListener('mouseup', () => { drawing = false; });
canvas.addEventListener('mousemove', draw);

function draw(e) {
  if (!drawing) return;
  ctx.lineWidth = 15;
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#000';
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  document.getElementById('result').innerText = '';
}

function predict() {
  const dataURL = canvas.toDataURL('image/png');
  fetch('/predict', {
    method: 'POST',
    body: JSON.stringify({ image: dataURL }),
    headers: { 'Content-Type': 'application/json' }
  })
  .then(res => res.json())
  .then(data => {
    document.getElementById('result').innerText = `Prediction: ${data.digit} → ${data.word}`;
  });
}
