const Scene = require("Scene")
const Diagnostics = require("Diagnostics")
const TouchGestures = require("TouchGestures")

Diagnostics.log("Running flick.js")

const hat = Scene.root.find("hat");

const hatDepth = 3.5
const hatStartPosition = hat.transform.position

var startPanTime = null
var yTranslation = null

// todo: approximate instantaneous velocity instead of average velocity for more realistic flick
function pixelsPerMs(translation, ms) {
    return translation / ms
}

function timeSincePanStart() {
    return Date.now() - startPanTime
}

function resetHat() {
    hat.transform.position = hatStartPosition
}

TouchGestures.onPan(hat).subscribe(function(gesture) {
    const gesturePosition = Scene.unprojectWithDepth(gesture.location, hatDepth);
    hat.transform.position = gesturePosition
    
    gesture.translation.y.monitor().subscribe((yt) => {
        yTranslation = yt.newValue
    })

    gesture.state.monitor().subscribe((state) => {
        if (state.oldValue == "BEGAN") {
            startPanTime = Date.now()
        } else if (state.newValue == "ENDED") {
            if (yTranslation > 0) {
                Diagnostics.log("resetting hat position")
                // `resetHat()` crashes due to "two or more patches connected multiple times"
                // resetHat()
            }

            Diagnostics.log(pixelsPerMs(yTranslation, timeSincePanStart()))
        }
    })
})
