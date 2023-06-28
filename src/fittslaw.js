

class Color {
  constructor(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
    copy() {
    return new Color(this.r, this.g, this.b);
    }
}

let mode = 0; // set initial mode value to 0
let randomMode = false; // randomMode = false when you don't want to mix modes
let participantID = "P10101";
let numTrials = 10;
let sketchBackgroundColor = new Color(51, 51, 51);
let initialRadius = 20;
let initialFilled = true;
let initialFillColor = new Color(sketchBackgroundColor.r, sketchBackgroundColor.g, sketchBackgroundColor.b);
let initialStrokeWeight = 3;
let initialStrokeColor = new Color(255, 255, 255);
let minRadius = 5;
let maxRadius = 75;
let minDistance = 75;
let targetFillColor = new Color(255, 255, 255);
let targetStrokeColor = new Color(sketchBackgroundColor.r, sketchBackgroundColor.g, sketchBackgroundColor.b);
let reachTargetColor = new Color(225, 225, 0);
let targetShift = 75;
let targetStrokeWeight = 1;
let delayHidingTargetMin = 100;
let delayHidingTargetMax = 500;
let delayShowingTarget = 1000;
let timerStartTime = 0;
let timerResetDuration = 750;
let intervalNum = 3;
let intervalTimerColor = new Color(175, 175, 225);

let trials = [];
let currentTrial = 0;
let mouseFilename = "";
let trialFilename = "";
let width = 640;
let height = 480;


class Circle {
  constructor(type) {
      this.x = 0;
      this.y = 0;
      this.rad = 0;
      this.filled = false;
      this.fillColor = new Color(0, 0, 0);
      this.strokeWeight = 0;
      this.strokeColor = null;
      if (type === 0) { //initial type
          this.filled = initialFilled;
        if(this.filled === true) {
            this.fillColor = new Color(initialFillColor.r, initialFillColor.g, initialFillColor.b);
        }
        this.strokeColor = new Color(initialStrokeColor.r, initialStrokeColor.g, initialStrokeColor.b);
        this.strokeWeight = initialStrokeWeight;
        this.rad = initialRadius;
      } else if (type === 1) { //target type
          this.filled = true;
          this.fillColor = new Color(targetFillColor.r, targetFillColor.g, targetFillColor.b);
          this.strokeColor = new Color(targetStrokeColor.r, targetStrokeColor.g, targetStrokeColor.b);
      this.strokeWeight = targetStrokeWeight;
      this.rad = parseInt(random(minRadius, maxRadius));
      }
  }
}

function run() {
    //console.log("Run - Entering");
    if(trials[currentTrial].trialRunning === false) {
        //console.log("Run - Ignoring: Trial Not running");
    } else {
        if (trials[currentTrial].trialRunning === true  && trials[currentTrial].trialCompleted === false && trials[currentTrial].noMovement(mouseX, mouseY) === true) {
            //console.log("Run - Ending No Mouse Movement");
            trials[currentTrial].end();
        } else {
            if (trials[currentTrial].trialRunning === true && trials[currentTrial].trialCompleted === false) {
                //console.log("Run - recording last position");
                trials[currentTrial].setLastPosition(mouseX, mouseY);
            } else {
                //console.log("Run - Why am I here");
                trials[currentTrial].endTimer();
            }

        }
    }
}




class Trial {
    constructor() {
        this.trialRunning = false;
        this.trialCompleted = false;
        this.timer = 0;
        this.shift = 0;
        this.shifted = false;
        this.shiftDone = false;
        this.startTime = new Date();
        this.endtTime = new Date();
        this.Time = null;
        this.initial = new Circle(0);
        this.target = new Circle(1);
        this.lastX = 0;
        this.lastY = 0;
        this.passed = "Fail";
        this.number = currentTrial + 1;
        if (randomMode === true) {
            mode = parseInt(Math.floor(Math.random() * 3));
        }
        switch(mode) {
            case 0:
                this.trialMode = "Normal";
                this.targetHideDelay = 0;
                break;
            case 1:
                this.trialMode = "Hide";
                this.targetHideDelay = parseInt(Math.floor(Math.random() * (delayHidingTargetMax - delayHidingTargetMin + 1) + delayHidingTargetMin));
                break;
            case 2:
                this.trialMode = "Perturbation";
                this.targetHideDelay = parseInt(Math.floor(Math.random() * (delayHidingTargetMax - delayHidingTargetMin + 1) + delayHidingTargetMin));
                break;
        }
        this.createStartPosition();
        this.createTargetPosition();
    }

    showStart() {
        if(this.filled === false) {
            noFill();
        } else {
            fill(this.initial.fillColor.r, this.initial.fillColor.g, this.initial.fillColor.b);
        }
        stroke(this.initial.strokeColor.r, this.initial.strokeColor.g, this.initial.strokeColor.b);
        strokeWeight(this.initial.strokeWeight);
        circle(this.initial.x, this.initial.y, this.initial.rad*2);
    }

    showTarget() {
        fill(this.target.fillColor.r, this.target.fillColor.g, this.target.fillColor.b);
        stroke(this.target.strokeColor.r, this.target.strokeColor.g, this.target.strokeColor.b);
        strokeWeight(this.target.strokeWeight);
        circle(this.target.x, this.target.y, this.target.rad*2);
    }

    startTimer() {
        this.timer = setInterval(run, timerResetDuration);
        //console.log("Start Timer - Started: " + this.timer + " Trial No: " + currentTrial);
    }

    endTimer() {
        //console.log("Stopped Timer - Entering: " + this.timer + " Trial No: " + currentTrial);
        if(this.timer !== 0) {
            clearInterval(this.timer);
            //console.log("Stopped Timer - Before setting: " + this.timer + " Trial No: " + currentTrial);
            this.timer = 0;
            //console.log("Stopped Timer - After Setting: " + this.timer + " Trial No: " + currentTrial);
        }

   }
   
    resetTimer() {
        this.endTimer();
        this.startTimer();
    }
    
    setLastPosition(x, y) {
        this.lastX = x;
        this.lastY = y;
    }
        
    getLastPosition() {
        let pos = this.lastX + ", " + this.lastY;
        return pos;
    }
    
    noMovement(x, y) {
        if (this.lastX === x && this.lastY === y) {
            //console.log("No Movement - True");
            return true;
        }
        //console.log("No Movement - False");
        return false;
    }

    start() {
        //console.log("START - Starting Trial No: " + currentTrial);
        this.showTarget();
        this.startTime = new Date();
        this.startTimer();
        this.trialRunning = true;
        this.trialCompleted = false;

      }

    end() {
        //console.log("END - Closing Trial No: " + currentTrial);
        this.endTimer();
        this.trialRunning = false;
        this.trialCompleted = true;
        if (mode === 1) {
            this.passed = "N/A";
        } else if (this.mouseInTarget(mouseX, mouseY)) {
            this.passed = "Passed";
        }
        background(sketchBackgroundColor.r, sketchBackgroundColor.g, sketchBackgroundColor.b);
        this.recordTrialInformation();
    }

    mouseInStart(x, y) {
        return ((parseInt(dist(x, y, this.initial.x, this.initial.y)) <= this.initial.rad));
    }
    
    mouseInTarget(x, y) {
        return ((parseInt(dist(x, y, this.target.x, this.target.y)) <= this.target.rad));
    }

    setTargetColor(c) {
        this.target.fillColor = c;
    }


    createStartPosition() {
        this.initial.x = parseInt(random(this.initial.rad*2+1, width-this.initial.rad*2-1));
        this.initial.y = parseInt(random(this.initial.rad*2+1, height-this.initial.rad*2-1));
    }

    overlap() {
        let distance = parseInt(Math.min(dist(this.initial.x, this.initial.y, this.target.x+this.shift, this.target.y),
                                        dist(this.initial.x, this.initial.y, this.target.x, this.target.y)));
        if(distance < (this.initial.rad+this.target.rad+minDistance)) {
            return true;
        }
        return false;
    }

    createTargetPosition() {
        if (mode === 2) {
            this.shift = targetShift;
        }
        this.target.x = parseInt(random(this.target.rad*2+1, width-this.target.rad*2-1-this.shift));
        this.target.y = parseInt(random(this.target.rad*2+1, height-this.target.rad*2-1));
        while (this.overlap()) {
            this.target.x = parseInt(random(this.target.rad*2+1, width-this.target.rad*2-1-this.shift));
            this.target.y = parseInt(random(this.target.rad*2+1, height-this.target.rad*2-1));
        }
    }


    getDuration() {
        let now = new Date();
        let diff = now - this.startTime;
        let hours = Math.floor(diff / (1000 * 60 * 60));
        diff -= hours * 1000 * 60 * 60;
        let minutes = Math.floor(diff / (1000 * 60));
        diff -= minutes * 1000 * 60;
        let seconds = Math.floor(diff / 1000);
        diff -= seconds * 1000;
        let milliseconds = diff;
        return (
            milliseconds.toString
        )
      }
      
    pad(num, size) {
        let s = "000000000" + num;
        return s.substr(s.length - size);
      }   

    recordTrialInformation() {
        var duration = this.getDuration();
        var trialData = {
            TrialDate: this.startTime,
            TrialNumber: this.number,
            TrialMode: this.trialMode,
            StartCircleX: this.initial.x,
            StartCircleY: this.initial.y,
            StartCircleRadius: this.initial.rad,
            TargetCenterX: this.target.x,
            TargetCenterY: this.target.y,
            TargetRadius: this.target.rad,
            TargetHideDelay: this.targetHideDelay,
            Duration: duration,
            Status: this.passed
        }
     }
    
    recordMousePosition() {
        var duration = this.getDuration();
        var locationData = {
            TrialDate: this.startTime,
            TrialNumber: this.number,
            MouseX: mouseX,
            MouseY: parseInt(mouseY),
            Duration: toString(duration)
        }

    }
}




   

function setup() {
    let now = new Date();
    let trialFilename = "trials" + now.getHours() + "," + now.getMinutes() + "," + now.getSeconds() + participantID + ".csv";
    let mouseFilename = "location" + now.getHours() + "," + now.getMinutes() + "," + now.getSeconds() + participantID + ".csv";
    createCanvas(width, height);
    background(sketchBackgroundColor.r, sketchBackgroundColor.g, sketchBackgroundColor.b);

    // Create First Trial
    trials = new Array(numTrials);
    trials[currentTrial] = new Trial();
    //trials[currentTrial].writeHeaders();
    intervalNum = 3;
    trials[currentTrial].showStart();
}

function mouseMoved() {
    if (trials[currentTrial].trialRunning === false && trials[currentTrial].trialCompleted === false && trials[currentTrial].mouseInStart(mouseX, mouseY) === true) {
        console.log("Mouse Moved: Starting Trial & Showing Target: " + currentTrial);
        sleep(delayShowingTarget);
        trials[currentTrial].start();
    } else {
        if (trials[currentTrial].trialRunning === true &&  trials[currentTrial].trialCompleted === false && trials[currentTrial].mouseInTarget(mouseX, mouseY) === true) {
            //console.log("Mouse Moved: Showing Yellow Target Now: " + currentTrial);
            trials[currentTrial].setTargetColor(reachTargetColor);
            // show target with reached color
            trials[currentTrial].showTarget();
        }
    }
 }


function draw() {
    if (currentTrial === numTrials - 1 && trials[currentTrial].trialRunning === false && trials[currentTrial].trialCompleted === true) {
        //console.log("Draw - Completed");
        sleep(timerResetDuration);
        background(sketchBackgroundColor.r, sketchBackgroundColor.g, sketchBackgroundColor.b);
        frameRate(0);
        noLoop();
        return;
    } else {
        if (currentTrial < numTrials-1 && !trials[currentTrial].trialRunning && trials[currentTrial].trialCompleted && intervalNum === 0) {
            //console.log("Draw - New Trial");
            //countdown over and previous trial is completed and trials left
            intervalNum = 3;
            frameRate(30);
            background(sketchBackgroundColor.r, sketchBackgroundColor.g, sketchBackgroundColor.b);
            if (currentTrial < numTrials-1) {
                trials[++currentTrial] = new Trial();
                trials[currentTrial].showStart();
                return;
            }
        } else if(!trials[currentTrial].trialRunning && trials[currentTrial].trialCompleted && intervalNum >= 0 && currentTrial < numTrials-1) {
            //console.log("Draw - Countdown");
            countdown(intervalNum);
            frameRate(1);
            intervalNum--
        } else {
            //Do Regular Trial Running Loop
            frameRate(30);
            trials[currentTrial].recordMousePosition();
            if (trials[currentTrial].trialRunning && !trials[currentTrial].trialCompleted) {
                if (mode === 2 && trials[currentTrial].shifted === false) {
                    //console.log("Draw - Delaying Target Move------------------>" + trials[currentTrial].targetHideDelay);
                    frameRate(60);
                    setTimeout(() => {
                       trials[currentTrial].setTargetColor(targetFillColor);
                       trials[currentTrial].shifted = true;
                    }, trials[currentTrial].targetHideDelay);
                    return;
                } else if (mode === 2 && trials[currentTrial].shifted === true && trials[currentTrial].shiftDone === false) {
                    //console.log("Draw - Moving Target Now After------------------>" + trials[currentTrial].targetHideDelay);
                    background(sketchBackgroundColor.r, sketchBackgroundColor.g, sketchBackgroundColor.b);
                    trials[currentTrial].showStart();
                    trials[currentTrial].target.x += targetShift;
                    trials[currentTrial].setTargetColor(targetFillColor);
                    trials[currentTrial].showTarget();
                    trials[currentTrial].shiftDone = true;
                    frameRate(60);
                    //trials[currentTrial].resetTimer();
                }
                if (mode === 1 && trials[currentTrial].shifted === false) {
                    //console.log("Draw - Delaying Target Hide------------------>" + trials[currentTrial].targetHideDelay);
                    frameRate(1);
                    setTimeout(() => {
                       trials[currentTrial].target.x = -1*(trials[currentTrial].target.rad*2) - 2;
                       trials[currentTrial].shifted = true;
                    }, trials[currentTrial].targetHideDelay);
                    return;
                } else if (mode === 1 && trials[currentTrial].shifted === true && trials[currentTrial].shiftDone === false) {
                    //console.log("Draw - Hiding Target Now After------------------>" + trials[currentTrial].targetHideDelay);
                    background(sketchBackgroundColor.r, sketchBackgroundColor.g, sketchBackgroundColor.b);
                    trials[currentTrial].showStart();
                    trials[currentTrial].shiftDone = true;
                    frameRate(30);
                } else if (mode === 1 && trials[currentTrial].shifted === true && trials[currentTrial].shiftDone === true) {
                    showStop();
                }
            }
        }
    }

    const modeButton = document.getElementById("mode-button");
    modeButton.addEventListener("click", () => {
      mode = getNextMode(mode); // get the next valid mode value
      console.log("Mode changed to", mode);
    });
}

function getNextMode(currentMode) {
    // define the valid mode values
    const validModes = [0, 1, 2];
    // get the index of the current mode value in the valid modes array
    const currentIndex = validModes.indexOf(currentMode);
    // get the index of the next valid mode value by adding 1 and wrapping around at the end of the array
    const nextIndex = (currentIndex + 1) % validModes.length;
    // return the next valid mode value
    return validModes[nextIndex];
  }

function countdown(number) {
    trials[currentTrial].endTimer();
    background(sketchBackgroundColor.r, sketchBackgroundColor.g, sketchBackgroundColor.b);
    fill(intervalTimerColor.r, intervalTimerColor.g, intervalTimerColor.b);
    stroke(intervalTimerColor.r, intervalTimerColor.g, intervalTimerColor.b);
    strokeWeight(1);
    circle(width/2, height/2, 120);
    let f = "Arial";
    textSize(36);
    fill(0);
    fill(255);
    text("Trial: " + (trials[currentTrial].number+1), width/2-80, height/4);
    let display = number + "...";
    text(display, width/2-20, height/2+10);
    };
  
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}


function polygon(x, y, radius, npoints) {
  let angle = TWO_PI / npoints;
  beginShape();
  var a;
  for (a = angle/2; a < TWO_PI + angle/2; a += angle) {
    var sx = x + cos(a) * radius;
    var sy = y + sin(a) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

function showStop() {
  background(sketchBackgroundColor.r, sketchBackgroundColor.g, sketchBackgroundColor.b);
  strokeWeight(0);
  fill(255, 0, 0);
  polygon(width/2, height/2, 80, 8);
  let f = "Arial";
  textSize(36);
  fill(255);
  let display = "Stop";
  text(display, int(width/2)-35, int(height/2)+10);
}

