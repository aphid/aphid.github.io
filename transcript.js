//all of the track elements
let trks = document.querySelectorAll("track");

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//make sure that tracks are loaded, wait for them if not.
async function trkchk() {
    //console.log("checking tracks");
    for (let t of trks) {
	//if one is not ready, wait and start over.
        if (t.readyState !== 2 && t.kind == "captions") {
            //console.log(t, "not ready");
            await sleep(3);
            return await trkchk();
            //throw("track " + t.src + "isn't ready");
        }
    }
    return true;
}

//check and process tracks
async function doTheThing() {
    console.log(await trkchk());
    processTracks();
}

doTheThing();

//seconds to hh:mm:ss
function toHMS(sec) {
    return new Date(sec * 1000).toISOString().slice(11, 19);
}


function processTracks() {
    //per each video
    for (let v of document.querySelectorAll("video")) {
        //console.log(v.src);
        //console.log("loaded a track");
	//make folding element
        let cont = document.createElement("details");
        let sum = document.createElement("summary");
        sum.textContent = "Transcript"; //confused why it says details!
	cont.appendChild(sum);
        v.after(cont);
	//transcript text goes in here
        let transc = document.createElement("div");
        transc.classList.add("transcript");
        cont.appendChild(transc);

        //only one track per video but they are in an array anyway
	let tt = v.textTracks[0];
        let ttarr = [];
        if (!tt.cues.length) {
            throw ("no cues" + v.src);
        }
	//i could probably copy the array but this is also a good loop to have for filtering weird text.
        for (let c of tt.cues) {
            ttarr.push(c);
        }
        let lasttime = 0;
        for (let [i, c] of ttarr.entries()) {
            let p = document.createElement("div");
            //console.log(c.startTime - lasttime);
            let h = document.createElement("h3");
            h.textContent = toHMS(c.startTime);
            p.append(h);
            lasttime = c.startTime;
            p.dataset.start = c.startTime;
            p.dataset.end = c.endTime;
            p.dataset.index = i;
	    //add click even to text to move playhead
            p.addEventListener("click", function () {
                //console.log(a.dataset.start);
                v.currentTime = p.dataset.start;
                console.log("playing")
                v.play();
            });
	    //clean text;
            p.textContent = c.text.replace(/<[^>]*>?/gm, '');
	    //add timestamp to hover/title attribute
            if (h.textContent) {
                p.setAttribute("title", h.textContent);
            }
            transc.appendChild(p);
            //adds "x secs of silence" to mark gaps over 9 sec
	    if (typeof tt.cues[i + 1] !== "undefined") {
                let delay = tt.cues[i + 1].startTime - c.startTime;
                if (delay > 9) {
                    let d = document.createElement("div");
                    d.classList.add("delay");
                    d.style.margin = 5 + (delay / 2) + "px 0";
                    //console.log(d.style.margin);
                    d.textContent = "~" + parseInt(delay, 10) + " second silence";
                    transc.appendChild(d);
                    //console.log("adding");

                }
            }
        }
    }
}

