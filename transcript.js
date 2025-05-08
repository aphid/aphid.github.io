//all the timed track dom elements
let trks = document.querySelectorAll("track");

//returns function after ms miliseeconds
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// seconds to hours:minutes:seconds (hh:mm:ss)
function toHMS(sec) {
    return new Date(sec * 1000).toISOString().slice(11, 19);
}


//check to see if tracks have loaded
async function trkchk() {
    console.log("checking tracks");
    for (let t of trks) {
        if (t.readyState !== 2) {
            console.log("not ready");
            await sleep(3);
            return await trkchk();
            //throw("track " + t.src + "isn't ready");
        }
    }
    return true;
}


async function doTheThing() {
    console.log(await trkchk());
    processTracks();
}

doTheThing();

function processTracks() {
    for (let v of document.querySelectorAll("video")) {
        console.log(v.src);
        let track = v.textTracks[0];
        //console.log(track);
        console.log("loaded a track");
        let cont = document.createElement("details");
        let sum = document.createElement("summary");
        sum.textContent = "Transcript";
        cont.appendChild(sum);
        v.after(cont);
        let transc = document.createElement("div");
        transc.classList.add("transcript");
        cont.appendChild(transc);


        console.log("now");
        let tt = v.textTracks[0];
        let ttarr = [];
        if (!tt.cues.length) {
            throw ("no cues" + v.src);
        }
        for (let c of tt.cues) {
            ttarr.push(c);
        }
        //console.log(ttarr.length);
        let lasttime = 0;
        for (let [i, c] of ttarr.entries()) {
            let p = document.createElement("div");
            console.log(c.startTime - lasttime);
            let h = document.createElement("h3");
            h.textContent = toHMS(c.startTime);
            p.append(h);
            lasttime = c.startTime;
            p.dataset.start = c.startTime;
            p.dataset.end = c.endTime;
            p.dataset.index = i;
            p.addEventListener("click", function () {
                //console.log(a.dataset.start);
                v.currentTime = p.dataset.start;
                console.log("playing")
                v.play();
            });
            p.textContent = c.text.replace(/<[^>]*>?/gm, '');
            if (h.textContent) {
                p.setAttribute("title", h.textContent);
            }
            //console.log("adding");
            transc.appendChild(p);
            //console.log(i);
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
