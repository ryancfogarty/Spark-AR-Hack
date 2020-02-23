const Scene = require("Scene")
const Diagnostics = require("Diagnostics")
const TouchGestures = require("TouchGestures")

Diagnostics.log("Running flick.js")

const hat = Scene.root.find("hat");
const hatDepth = 3.5
const hatStartPosition = hat.transform.position

var touchFrames = []

function pixelsPerMs(translation, ms) {
    return ms == 0 ? 0 : translation / ms
}

function resetHat() {
    hat.transform.position = hatStartPosition
}

function timeDiff(frames) {
    if (frames.length == 0) return 0

    const start = frames[frames.length - 1].timestamp;
    const end = frames[0].timestamp;

    return end - start;
}

function positionDiff(frames) {
    if (frames.length == 0) return 0

    const start = frames[frames.length - 1].yPosition;
    const end = frames[0].yPosition;

    return end - start;
}

TouchGestures.onPan(hat).subscribe(function(gesture) {
    const gesturePosition = Scene.unprojectWithDepth(gesture.location, hatDepth);
    hat.transform.position = gesturePosition
    
    gesturePosition.y.monitor().subscribe((yt) => {
        var frame = {
            yPosition: yt.newValue,
            timestamp: Date.now()
        }

        touchFrames.splice(0, 0, frame)
        if (touchFrames.length > 5) {
            touchFrames.splice(5, touchFrames.length - 5)
        }
    })

    gesture.state.monitor().subscribe((state) => {
        if (state.oldValue == "BEGAN") {
            touchFrames = []
        } else if (state.newValue == "ENDED") {
            const timeDifference = timeDiff(touchFrames)
            const positionDifference = positionDiff(touchFrames)

            Diagnostics.log(pixelsPerMs(positionDifference, timeDifference))

            if (positionDifference > 0) { // flicked down screen
                Diagnostics.log("resetting hat position")
                // `resetHat()` crashes due to "two or more patches connected multiple times"
                // resetHat()
            }
        }
    })
})
