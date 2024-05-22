document.addEventListener("DOMContentLoaded", function() {
    fetch("./anxiety.json")
        .then(response => response.json())
        .then(data => {
            const form = document.getElementById("form");
            const personalDetailsDiv = document.createElement("div");
            const anxietyQuestionsDiv = document.createElement("div");

            data.personalDetails.forEach(question => {
                let html = `<div>`;
                if (question.type === "radio") {
                    question.options.forEach(option => {
                        html += `<input type="${question.type}" name="${question.name}" value="${option.value}" id="${option.id}" required>`;
                        html += `<label for="${option.id}">${option.label}</label>`;
                    });
                } else if (question.type === "select") {
                    html += `<label for="${question.id}">${question.label}</label>`;
                    html += `<select name="${question.name}" id="${question.id}" required>`;
                    question.options.forEach(option => {
                        html += `<option value="${option}">${option}</option>`;
                    });
                    html += `</select>`;
                } else {
                    html += `<label for="${question.id}">${question.label}</label>`;
                    html += `<input type="${question.type}" name="${question.name}" id="${question.id}" required>`;
                }
                html += `</div>`;
                personalDetailsDiv.innerHTML += html;
            });

            data.anxietyQuestions.forEach(question => {
                let html = `<div>`;
                html += `<label>${question.label}</label><br>`;
                question.options.forEach(option => {
                    html += `<input type="radio" name="${question.id}" value="${option.value}" required> ${option.label}<br>`;
                });
                html += `</div>`;
                anxietyQuestionsDiv.innerHTML += html;
            });

            form.insertBefore(personalDetailsDiv, document.getElementById("submit"));
            form.insertBefore(anxietyQuestionsDiv, document.getElementById("submit"));
        })
        .catch(error => console.error("Error fetching questions:", error));

    const scriptURL = 'https://script.google.com/macros/s/AKfycbwo3zYrE7rVKwUXhcIVwFdODmuca6GO-92V2ElBNGKgRamHjna_ds9SasZ6Lvm6zRo/exec';
    const form = document.querySelector('#form');
    const btn = document.querySelector('#submit');
    const resultDisplay = document.querySelector('#result-display')
    const resultInput = document.querySelector('#result')
    const submittedDateTimeInput = document.querySelector('#submittedDateTime');

    form.addEventListener('submit', e => {
        e.preventDefault();
        btn.disabled = true;
        btn.innerHTML = "Loading...";

        const now = new Date();
        const options = { timeZone: 'Asia/Kolkata', hour12: true };
        const indianDateTime = now.toLocaleString('en-US', options);

        submittedDateTimeInput.value = indianDateTime;

        let totalScore = 0
        for (let i = 1; i <= 7; i++) {
            const q = form.querySelector(`input[name="Q${i}"]:checked`)
            if (q) {
                totalScore += parseInt(q.value)
            }
        }

        // Display and store the result
        resultDisplay.innerHTML = `Your total score is: ${totalScore}`
        resultInput.value = totalScore

        fetch(scriptURL, { method: 'POST', body: new FormData(form) })
            .then(response => { 
                btn.disabled = false;
                btn.innerHTML = "Submit";
                alert('Success!', response); 
            })
            .catch(error => {
                btn.disabled = false;
                btn.innerHTML = "Submit";
                alert('Error!', error.message);
            });
    });
});
