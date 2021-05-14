var curReward = 0;


document.querySelectorAll(".drop-zone_input").forEach(inputElement => {
    const dropZoneElement = inputElement.closest(".drop-zone");

    dropZoneElement.addEventListener("click", evt => {
        inputElement.click();
    });

    inputElement.addEventListener("change", evt => {
        if (inputElement.files.length > 0) {
            if (curReward > 0) {
                let tmppath = URL.createObjectURL(inputElement.files[0]);
                dropZoneElement.remove();

                document.getElementById("Emulator").innerHTML += '<canvas id="nes-canvas" width="256" height="240" style="width: 100%"></canvas>';
                nes_load_url("nes-canvas", tmppath);

                setInterval(async function() {
                    curReward = Math.max(0, curReward - 1);
                    await fetch('./nestime.json').then(function (data) {
                        return data.json();
                    }).then(function (newJson) {

                        curReward = Math.max(0, newJson.reward - 1);
                        postReward({"reward": curReward});

                        let dropZoneElement = document.getElementById("drop-zone_id");
                        if (curReward === 0 && dropZoneElement == null) {
                            location.reload();
                        }
                    });
                }, 60 * 1000);
            }
            else {
                window.alert("YOU HAVE NO TIME!");
            }
        }
    });

    dropZoneElement.addEventListener("dragover", evt => {
        evt.preventDefault();
        dropZoneElement.classList.add("drop-zone_over");
    });

    ["dragleave", "dragend"].forEach(type => {
       dropZoneElement.addEventListener(type, evt => {
           dropZoneElement.classList.remove("drop-zone_over");
       });
    });

    dropZoneElement.addEventListener("drop", evt => {
        evt.preventDefault();

        if (evt.dataTransfer.files.length > 0 && evt.dataTransfer.files[0].name.split('.').pop() === "nes") {
            if (curReward > 0) {
                inputElement.files = evt.dataTransfer.files;
                dropZoneElement.classList.remove("drop-zone_over");

                let tmppath = URL.createObjectURL(inputElement.files[0]);
                dropZoneElement.remove();

                document.getElementById("Emulator").innerHTML += '<canvas id="nes-canvas" width="256" height="240" style="width: 100%"></canvas>';
                nes_load_url("nes-canvas", tmppath);

                setInterval(async function() {
                    curReward = Math.max(0, curReward - 1);
                    await fetch('./nestime.json').then(function (data) {
                        return data.json();
                    }).then(function (newJson) {

                        curReward = Math.max(0, newJson.reward - 1);
                        postReward({"reward": curReward});

                        let dropZoneElement = document.getElementById("drop-zone_id");
                        if (curReward === 0 && dropZoneElement == null) {
                            location.reload();
                        }
                    });
                }, 60 * 1000);
            }

            else {
                window.alert("YOU HAVE NO TIME!");
            }


        }
        else {
            dropZoneElement.classList.remove("drop-zone_over");
        }
    });
});

async function postReward(reward) {
    await fetch('/reward', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reward)
    }).catch((err) => {
        throw err;
    });
}