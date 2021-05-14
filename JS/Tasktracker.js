var taskList = null;

fetch('./tasks.json').then(function (data) {
    return data.json();
}).then(function (newJson) {
    taskList = newJson;
});


var formOpen = false;

class Task {
    constructor(id, text, day) {
        this.id = id;
        this.text = text;
        this.day = day;
    }
}

function getStatus(day) {
    let curTime = Math.floor(Date.now() / 1000 / 60);
    let taskTime = Math.floor(new Date(day).getTime() / 1000 / 60);
    // 0, not happened
    if (curTime - taskTime < 0) {
        return 0;
    }
    // 1, passed the check-in period
    if (curTime - taskTime > 5) {
        return 1;
    }
    // With in the check-in period
    return 2;
}

function addTask() {
    let id = !taskList.length ? 0: taskList[taskList.length-1].id + 1, text = $("#task-text").val(), day = $("#task-day").val();

    let tasksDiv = document.getElementById("tasks");
    let curTime = new Date(), setTime = new Date(day);

    if (text !== "" && day !== "") {
        if (Math.floor(setTime.getTime() / 1000 / 60) <= Math.floor(curTime.getTime() / 1000 / 60)) {
            window.alert("INVALID TIME!");
        }

        else {
            taskList.push(new Task(id, text, day));
            tasksDiv.innerHTML += `<div class="task reminder" id="task_${id}"></div>`;
            checkStatus(taskList.length-1);
            postJSON(taskList);

            document.getElementById("task-text").value = "";
            document.getElementById("task-day").value = "";
        }
    }

}

function deleteTask(id) {
    document.getElementById(`task_${id}`).remove();
    for (let i = 0; i < taskList.length; i++) {
        if (taskList[i].id === id) {
            taskList.splice(i, 1);
        }
    }
    postJSON(taskList);
}

function initTaskTracker() {
    for (let i = 0; i < taskList.length; i++) {
        let id = taskList[i].id;
        let tasksDiv = document.getElementById("tasks");
        tasksDiv.innerHTML += `<div class="task reminder" id="task_${id}"></div>`;
        checkStatus(i);
    }
}

function toggleForm() {
    let form = "  <form class=\"add-form\">\n" +
        "    <div class=\"form-control\">\n" +
        "      <label>Task</label>\n" +
        "      <input id=\"task-text\" type=\"text\" placeholder=\"Add Task\">\n" +
        "    </div>\n" +
        "\n" +
        "    <div class=\"form-control\">\n" +
        "      <label>Day & Time</label>\n" +
        "      <input id=\"task-day\" type=\"datetime-local\" placeholder=\"Add Day & Time\">\n" +
        "    </div>\n" +
        "\n" +
        "    <input type=\"button\" value=\"Save Task\" class=\"btn btn-block\" onclick=\"addTask()\">\n" +
        "  </form>"
    let container = document.getElementById("form");
    if (!formOpen) {
        container.innerHTML += form;
        document.getElementById("toggleForm").innerHTML = "Close";
        document.getElementById("toggleForm").style = "background-color: red";
        formOpen = true;
    }
    else {
        document.getElementsByClassName("add-form")[0].remove();
        document.getElementById("toggleForm").innerHTML = "Add";
        document.getElementById("toggleForm").style = "background-color: green";
        formOpen = false;
    }
}


async function postJSON(taskList) {
    await fetch('/tasks', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskList)
    }).catch((err) => {
        throw err;
    });
}

function checkStatus(index) {
    let id = taskList[index].id, status = getStatus(taskList[index].day), setTime = new Date(taskList[index].day), text = taskList[index].text;
    let taskEle = document.getElementById(`task_${id}`);
    if (status === 0) {
        taskEle.innerHTML = `<h3>${text}<i class="fa fa-close" style="font-size:100%; color: red; cursor: pointer" onclick="deleteTask(${id})"></i></h3>
                             <p>${setTime.toLocaleString("en-US")}</p>
                            `;
        taskEle.className = "task reminder";
    }
    else if (status === 1) {
        taskEle.innerHTML = `<h3>${text}<i class="fa fa-close" style="font-size:100%; color: red; cursor: pointer" onclick="deleteTask(${id})"></i></h3>
                             <p>${setTime.toLocaleString("en-US")}</p>
                            `;
        taskEle.className = "task finished";
    }
    else {
        taskEle.innerHTML = `<h3>${text}<i class="fa fa-check" style="font-size:100%; color: green; cursor: pointer" onclick="claimReward(${id})"></i></h3>
                             <p>${setTime.toLocaleString("en-US")}</p>
                            `;
        taskEle.className = "task timeup";
    }
}

function statusUpdate() {
    for (let i = 0; i < taskList.length; i++) {
        checkStatus(i);
    }
}

async function claimReward(id) {
    await fetch('./nestime.json').then(function (data) {
        return data.json();
    }).then(function (newJson) {
        let reward = {"reward": newJson.reward + 3};
        postReward(reward);
    });
    deleteTask(id);
}

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

function getReward() {
    let time = 0;
    fetch('./nestime.json').then(function (data) {
        return data.json();
    }).then(function (newJson) {
        time = newJson.reward;
    });
    return time;
}