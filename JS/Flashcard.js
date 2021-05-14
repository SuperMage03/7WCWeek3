class Flashcard {
    constructor(question, answer) {
        this.question = question;
        this.answer = answer;
        this.turn = 0;
    }

    giveVal(id) {
        if (this.turn % 2 === 0) {
            this.turn++;
            document.getElementById(id).innerHTML = this.answer;
        }
        else {
            this.turn++;
            document.getElementById(id).innerHTML = this.question;
        }
    }

}

var flashcards = [];

$(document).ready(function(){
    $("#submitButton").click(function(){
        let Question = $("#Question").val();
        let Answer = $("#Answer").val();

        if (Question !== "" && Answer !== "") {
            document.getElementById("Question").value = "";
            document.getElementById("Answer").value = "";

            flashcards.push(new Flashcard(Question, Answer));

            let newCardEle = `<button class="flashcard" id=card_${flashcards.length-1} onclick="flashcards[${flashcards.length-1}].giveVal('card_${flashcards.length-1}');">${Question}</button>\n`;
            document.getElementById("flashcard-spot").innerHTML += newCardEle;
        }
    });
});
