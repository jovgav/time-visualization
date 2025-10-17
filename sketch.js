let hourColors = [];
let hourPositions = [];
let circleSize = 60;  
let padding = 100;    
let lastMinute = -1;  
let positionSeed;     

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Hour color array
  hourColors = [
    color(12, 56, 133),    // midnight - dark blue
    color(132, 71, 201),   // 1am - purple
    color(23, 66, 235),     // 2am - blue
    color(42, 71, 45),     // 3am - dark green
    color(189, 8, 189),   // 4am - magenta
    color(92, 194, 224), // 5am - light blue
    color(105, 209, 143), // 6am - light green
    color(163, 143, 116), // 7am - tan
    color(255, 199, 239), // 8am - pink
    color(255, 165, 0),   // 9am - orange
    color(0, 0, 0),       // 10am - black
    color(140, 145, 134), // 11am - grey
    color(255, 223, 53),  // noon - yellow
    color(90, 209, 187),  // 1pm - turquoise
    color(209, 178, 86),   // 2pm - mustard
    color(139, 0, 0),     // 3pm - dark red
    color(207, 87, 2),   // 4pm - dark orange
    color(87, 3, 156),    // 5pm - dark purple
    color(250, 17, 17),     // 6pm - red
    color(255, 180, 112), // 7pm - pale orange
    color(90, 100, 110), // 8pm - grey blue
    color(163, 160, 160), // 9pm - silver
    color(89, 61, 40),   // 10pm - brown
    color(200, 162, 200)  // 11pm - lilac
  ];

  let now = new Date();
  positionSeed = now.getHours() * 60 + now.getMinutes();
  updatePositions();
}

function updatePositions() {
  randomSeed(positionSeed);
  
  hourPositions = [];
  for (let i = 0; i < 24; i++) {
    let position;
    let attempts = 0;
    const maxAttempts = 100;
    
    do {
      position = {
        x: random(padding, width - padding),
        y: random(padding, height - padding)
      };
      attempts++;
    } while (isOverlapping(position, i) && attempts < maxAttempts);
    
    hourPositions.push(position);
  }
}

function isOverlapping(newPos, currentIndex) {
  let minDistance = circleSize * 3; 
  
  for (let i = 0; i < hourPositions.length; i++) {
    if (i !== currentIndex) {
      let d = dist(newPos.x, newPos.y, hourPositions[i].x, hourPositions[i].y);
      if (d < minDistance) return true;
    }
  }
  return false;
}

function draw() {
  background(300);
  
  let now = new Date();
  let currentHour = now.getHours();
  let currentMinute = now.getMinutes();
  
  if (currentMinute !== lastMinute) {
    positionSeed = currentHour * 60 + currentMinute;
    updatePositions();
    lastMinute = currentMinute;
  }
  
  for (let hour = 0; hour < 24; hour++) {
    if (hour === currentHour) {
      drawCurrentHour(hour);
    } else {
      drawPastOrFutureHour(hour, currentHour);
    }
  }
}

function drawPastOrFutureHour(hour, currentHour) {
  push();
  let x = hourPositions[hour].x;
  let y = hourPositions[hour].y;
  
  let hasOccurred = hour < currentHour;
  
  if (hasOccurred) {
    for (let i = 5; i >= 0; i--) {
      let glowSize = circleSize + (i * 20);
      let alpha = map(i, 5, 0, 4, 10);
      noStroke();
      fill(red(hourColors[hour]), green(hourColors[hour]), blue(hourColors[hour]), alpha);
      ellipse(x, y, glowSize, glowSize);
    }
    
    noStroke();
    fill(255, 8);
    let innerGlowSize = circleSize * 0.7;
    ellipse(x, y, innerGlowSize, innerGlowSize);
  } else {
    noStroke();
    fill(red(hourColors[hour]), green(hourColors[hour]), blue(hourColors[hour]), 10);
    ellipse(x, y, circleSize, circleSize);
  }
  pop();
}

function drawCurrentHour(currentHour) {
  let nextHour = (currentHour + 1) % 24;
  let now = new Date();
  let currentSecond = now.getSeconds();
  let milliseconds = now.getMilliseconds();
  
  let secondProgress = currentSecond / 60;
  let currentColor = lerpColor(
    hourColors[currentHour],
    hourColors[nextHour],
    secondProgress
  );
  
  let fastProgress = (currentSecond * 2 + (milliseconds / 500)) / 60;
  let glowColor = lerpColor(
    hourColors[currentHour],
    hourColors[nextHour],
    fastProgress % 1 
  );
  
  push();
  let x = hourPositions[currentHour].x;
  let y = hourPositions[currentHour].y;
  
  for (let i = 5; i >= 0; i--) {
    let glowSize = circleSize + (i * 20);
    let alpha = map(i, 5, 0, 30, 150);
    noStroke();
    fill(red(glowColor), green(glowColor), blue(glowColor), alpha);
    ellipse(x, y, glowSize, glowSize);
  }
  
  noStroke();
  fill(red(currentColor), green(currentColor), blue(currentColor), 255);
  ellipse(x, y, circleSize, circleSize);
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
