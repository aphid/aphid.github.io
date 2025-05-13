//object for local settings, an array to store listeners, and some helper functions
let pericarp = {
    cues: []
}

//15 --> "00:00:15"
pericarp.toHMS = function (sec) {
    return new Date(sec * 1000).toISOString().slice(11, 19);
}

pericarp.waitFor = function (element, event, timeout) {
    if (!timeout) {
        //default is 15 seconds, plenty for a network connection
        timeout = 15000;
    }
    console.log(timeout);

    return new Promise(function (resolve, reject) {
        window.setTimeout(function () {
            console.log("timeout");
            reject("timeout reached");
        }, timeout);
        element.addEventListener(event, () => {
            //if we reach timeout, reject, otherwise resolve.

            resolve(true);
        });
    });
};

//"00:00:15" --> 15 || "00:15" --> 15
pericarp.toSec = function (hms) {
    if (typeof hms === "number") {
        return hms;
    }
    let s = hms.split(':'); // split it at the colons
    // minutes are worth 60 seconds. Hours are worth 60 minutes.
    let seconds;
    //if hhmmss
    if (s.length == 3) {
        seconds = (+s[0]) * 60 * 60 + (+s[1]) * 60 + (+s[2]);
        //or mmss
    } else if (s.length == 2) {
        seconds = parseInt(+s[0], 10) * 60 + parseFloat(+s[1])
        //or ...something else? no thanks
    } else {
        throw ("h:m:s please")
    }
    return seconds;
}

pericarp.cue = function (element, start, end, startfn, endfn) {
    //if element is a string instead of a html element, try a querySelector on it
    if (typeof element === "string") {
        let check = document.querySelector(element);
        if (check instanceof HTMLElement) {
            element = check;
        }
    }
    //now make sure it's audio or video
    if (element.nodeName.toLowerCase() !== "video" && element.nodeName.toLowerCase() !== "audio") {
        //fallback: try using query selector on elemnt

    }
    //make sure numbers are in right order
    if (end < start) {
        throw ("umm end is before start");
    }
    //make sure functions are functions
    if (typeof startfn !== "function") {
        throw ("start function isn't a function")
    }
    //and that numbers are numbers
    if (!isNumeric(start)) {
        start = this.toSec(start);
    }
    if (!isNumeric(end)) {
        end = this.toSec(end);
    }


    let p = new Pericarp(element, start, end, startfn, endfn);
    this.cues.push(p);
    return p;
}


let Pericarp = function (element, start, end, startfn, endfn) {
    let cue = this;

    if (!start && end && startfn) {
        throw ("missing some stuff here")
    }
    if (endfn && typeof endfn !== "function") {
        throw ("endfn isn't a function")
    }

    if (!endfn) {
        function endfn() { }
    }
    //this.id = count;
    //count++;
    this.start = start;
    this.end = end;
    this.startfn = startfn;
    //deal with potential lack of endfn
    if (!endfn) {
        this.endfn = function () { };
    } else {
        this.endfn = endfn;
    }
    this.started = false;

    element.addEventListener("timeupdate", function () {
        if ((this.currentTime > cue.start && this.currentTime < cue.end) && !cue.started) {
            cue.started = true;
            cue.startfn();
        } else if ((this.currentTime < cue.start || this.currentTime > cue.end) && cue.started) {
            cue.started = false;
            cue.endfn();
            //todo: add something to remove listener if it has a "once" property
            //or maybe they should have a count? this can also happen in startfn function logic...
        }
    });
}

function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}