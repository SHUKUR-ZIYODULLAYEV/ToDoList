const form = document.getElementById("form");
const notes = JSON.parse(localStorage.getItem('notes')) || [];

window.addEventListener('DOMContentLoaded', (event) => {
    notes.forEach(note => {
        createNote(note.id, note.title, note.text, note.time);
    });
});

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const value = document.querySelector('#input').value;
    createNote(notes.length + 1, value, '', '');
    notes.push({
        id: notes.length + 1,
        title: value,
        text: '',
        time: ''
    });
    localStorage.setItem('notes', JSON.stringify(notes));
});

function createNote(id, title, text, time) {
    const tmpNote = document.createElement('section');
    tmpNote.innerHTML = `
            <div class="notes">
                <div class ="time_tools">
                    <div class = "left_time_text">Time left:</div>
                    <div class="countdown-container">
                        <div class="countdown-el days-c">
                            <p id="days${id}">0</p>
                        </div>
                        <div class="countdown-el hours-c">
                            <p id="hours${id}">0</p>
                        </div>
                        <div class="countdown-el mins-c">
                            <p  id="mins${id}">0</p>
                        </div>
                        <div class="countdown-el seconds-c">
                            <p id="seconds${id}">0</p>
                        </div>
                    </div>
                    <button class="edit"><i class="fas fa-edit"></i></button>
                    <button id = "delete" class="delete-${id}"><i class="fas fa-trash-alt"></i></button>
                </div>
                <div class="tools">
                <div class = "set_time_text">Set time:</div>
                <input type="datetime-local" class="settime-${id}" id="set_time-${id}" value="${time}"  autocomplete="off" />
                    <div id="input_text">${title}</div>
                    
                </div>
                <div class="main ${text ? "" : "hidden"}"></div>
                <textarea name="teaxtarea-${id}" class="${text ? "hidden" : ""}">${text}</textarea>
            </div>
        `;
    tmpNote.classList.add('note');

    const editBtn = tmpNote.querySelector(".edit");
    const main = tmpNote.querySelector(".main");
    const textArea = tmpNote.querySelector("textarea");

    textArea.value = text;
    main.innerHTML = marked(text);

    editBtn.addEventListener("click", () => {
        main.classList.toggle("hidden");
        textArea.classList.toggle("hidden");
    });

    textArea.addEventListener("input", (e) => {
        const { value } = e.target;
        main.innerHTML = marked(value);

    });
    
    document.querySelector('body').appendChild(tmpNote);

   const deleteBtn = tmpNote.querySelector("#delete");

    deleteBtn.addEventListener("click", () => {
      const id = deleteBtn.className.split('-').pop();
      tmpNote.remove();
      notes.forEach(note => {
            if (note.id == id) {
                let index = notes.indexOf(note);
                notes.splice(index, 1);
                localStorage.setItem('notes', JSON.stringify(notes));
            }
        })
     });

    document.querySelectorAll('textarea').forEach(ta => {
        const id = ta.name.split('-').pop();
        ta.addEventListener('input', function (event) {
            notes.forEach(note => {
                if (note.id == id) {
                    note.text = ta.value;
                    localStorage.setItem('notes', JSON.stringify(notes));
                }
            })
        });
    });
    
    

    input.value = "";
    var day = "days"+id;
    var hour = "hours"+id;
    var min = "mins"+id;
    var second = "seconds"+id;
    var settime = "set_time-"+id;
    const daysEl = document.getElementById(day);
    const hoursEl = document.getElementById(hour);
    const minsEl = document.getElementById(min);
    const secondsEl = document.getElementById(second);
    const set_time = document.getElementById(settime);

    set_time.addEventListener("input", () => {
        const id = set_time.className.split('-').pop();
        notes.forEach(note => {
            if (note.id == id) {
                note.time = set_time.value;
                localStorage.setItem('notes', JSON.stringify(notes));
            }
        })
    });

    function countdown() {
        const newYears = set_time.value;
        const newYearsDate = new Date(newYears);
        const currentDate = new Date();

        const totalSeconds = (newYearsDate - currentDate) / 1000;
            if (totalSeconds>0) {
                const days = Math.floor(totalSeconds / 3600 / 24);
                const hours = Math.floor(totalSeconds / 3600) % 24;
                const mins = Math.floor(totalSeconds / 60) % 60;
                const seconds = Math.floor(totalSeconds) % 60;
                daysEl.innerHTML = formatTime(days);
                hoursEl.innerHTML = formatTime(hours);
                minsEl.innerHTML = formatTime(mins);
                secondsEl.innerHTML = formatTime(seconds);
                // if (totalSeconds>denger) {
                //    colorchange = document.querySelector(".time_tools");
                //    colorchange.style.background ='blue';
                //     //yashil
                // } else if (totalSeconds<denger) {
                //     colorchange.style.background ='yellow';
                //     //sariq
                // } else if (totalSeconds<(denger+denger)){
                //     colorchange.style.background ='red';
                //     //qizil
                // }
                function formatTime(time) {
                    return time < 10 ? `0${time}` : time;
                }
            }
    }
    // initial call
    countdown();
    //call every 1 second
    setInterval(countdown, 1000);
}

