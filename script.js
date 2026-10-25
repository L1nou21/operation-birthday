const giftButton = document.getElementById("giftButton");

giftButton.addEventListener("click", function() {
    alert("ERROR 404: Gift not found!.");

    giftButton.style.display = "none";
    document.getElementById("welcome").style.display = "none";
    document.getElementById("verify").style.display = "block";
});

let escapes = 0;
const teasing = [
    "Too slow grandpa.",
    "Your reflexes need an update..",
    "Even the cake is faster than you..",
    "Skill issue detected",
    "ٌَAre you even trying?",
    "Maybe try using both hands",
    "This is getting embarrassing",
    "Bro, the button is starting to feel sorry for you",
    "One last chance. Don't embarrass yourself",
    "Fine you win, Happy now?"
];

giftButton.onmouseover = function() {
    if (escapes < 10) {
        escapes++;
        document.getElementById("tease").textContent =
            teasing[Math.min(escapes - 1, teasing.length - 1)];
        
        if (escapes === 10) {
            giftButton.style.left = "50%";
            giftButton.style.top = "50%";
        } else {
    
            giftButton.style.left = Math.random() * 70 + "vw";
            giftButton.style.top = Math.random() * 70 + "vh";
        }
    }
};

const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const result = document.getElementById("result");

yesBtn.onclick = function() {
    result.textContent = "Suspicious. A real brother would hesitate.";
    document.getElementById("continueBtn").style.display = "inline-block";
};

noBtn.onclick = function() {
    result.textContent = "IDENTIFY FRAUD DETECTED!";
    document.getElementById("continueBtn").style.display = "inline-block"
};

document.getElementById("continueBtn").onclick = function() {
    alert("Verification failed successfully. access granted.");

    document.getElementById("verify").style.display = "none";
    document.getElementById("loading").style.display = "block";

    startLoading();
};
function startLoading() {
    let number = 0;
    let direction = 1;

    const timer = setInterval(function() {
        number += direction;

        document.getElementById("bar").value = number;
        document.getElementById("percent").textContent = number + "%";

        if(number === 99) {
            direction = -1;
            document.getElementById("bar").classList.add("escape");
            document.getElementById("status").textContent = "Oops. your gift is escaping!";
        }

        if (number === 50 && direction === -1) {
            clearInterval(timer);
            alertSound();
            document.getElementById("status").classList.add("danger");
            document.getElementById("status").textContent =
            "SYSTEM FAILURE: Your birthday cake has escaped.";
            
            document.getElementById("nextBtn").style.display = "inline-block";

        }
    }, 100);
}
document.getElementById("nextBtn").onclick = function() {
    document.getElementById("loading").style.display = "none";
    document.getElementById("quiz").style.display = "block";
    showQuestion();
};
 const questions = [
    ["Who is the best sibling?", "You", "Me"],
    ["Who deserves more cake?", "You", "Me"],
    ["Am I your favorite sibling?", "Yes", "Obviously"]
 ];

 let q = 0
 let answered = false;

 function showQuestion() {
    document.getElementById("counter").textContent = "Question " + (q + 1) + "/" + questions.length;
    answered = false
    document.getElementById("question").textContent = questions[q][0];
    document.getElementById("a").textContent = questions[q][1];
    document.getElementById("b").textContent = questions[q][2];
    document.getElementById("feedback").textContent = "";
    document.getElementById("nextQ").disabled = true;
 }

 document.getElementById("a").onclick = function() {
    answered = true;
    document.getElementById("nextQ").disabled = false;
    document.getElementById("feedback").textContent = 
    ["Wrong! very suspecious.",
    "Wrong. The cake comittee is disappointed.",
    "Your confidence is conserning."][q];
 };

 document.getElementById("b").onclick = function() {
    answered = true;
    document.getElementById("nextQ").disabled = false;
    document.getElementById("feedback").textContent = 
    ["Correct! Unfortunately.",
     "Bold choice. The cake has been notified.",
     "Obviously. took you long enough."][q];
 };

 document.getElementById("nextQ").onclick = function() {
    q++;

    if (q < questions.length) {
        showQuestion();
    } else {
        document.getElementById("quiz").innerHTML = `
            <h2>OFFICIAL BROTHER CERTIFICATE</h2>
            <h3>BARELY APPROVED</h3>
            <p>This certifies that you have successfully
            survived the Brother Examination.</p>
            <p>Score: 100% (results may be fabricated)</p>
            <p>Validity: Until you annoy me again.</p>
            <button id="giftNext">Claim your reward</button>
         `;
         document.getElementById("giftNext").onclick = function() {
            document.getElementById("quiz").style.display = "none";
            document.getElementById("gifts").style.display = "block";
         };
    }
 };

 let box = 0

 const gifts = [
    "Congratulations! you found...another box.",
    "Wait. this one is DEFINITELY the real gift.",
    "ERROR 404: Gift not found.",
    "Almost there.Probably.",
    "Okay okay, last box..I PROMISE."  
 ];

 document.getElementById("boxBtn").onclick = function() {
    
    if (box === gifts.length) {
        alertSound();

        alert("SECURITY ALERT!\nSuspicious levels of handsomeness detected. \nProceed at your oun risk..");
        document.getElementById("gifts").innerHTML = `
            <h1>HAPPY BIRTHDAY!</h1>
            <h2>MISSION COMPLETE</h2>
            <p>After all that nonesence, you finally made it.</p>
            <p>There's no secret prize, no hidden treasure, and infortunately, no free cake.</p>
            <p>But here's the real surprise...</p>
            <h3>I learned to code just to make this ridiculous website for you :3</h3>
            <p>Happy birthday big bro</p>
            <p>Now go get yourself some cake</p>
        `;
        confetti();
        return;
    }
    document.getElementById("gifts").querySelector("p").textContent = gifts[box];

    box++;
    
    if (box === gifts.length) {
        document.getElementById("boxBtn").textContent =
        "UNLOCK FINAL GIFT";
    }
 };
 function alertSound() { const audio = new AudioContext();
    [440, 330].forEach((freq, i) => {
        const beep = audio.createOscillator();
        const volume = audio.createGain();
    
        beep.connect(volume);
        volume.connect(audio.destination);
    
        beep.frequency.value = freq;
        volume.gain.value = 0.08;
    
        beep.start(audio.currentTime + i * 0.2);
        beep.stop(audio.currentTime + (i + 1) * 0.2);
    });
    }

    function confetti() { const colors = ["red", "gold", "purple", "blue", "lime"];
        for (let i = 0; i < 200; i++) {
            const piece = document.createElement("div");
            piece.className = "confetti";
        
            piece.style.left = Math.random() * 100 + "vw";
            piece.style.background = colors[i % colors.length];
            piece.style.animationDelay = Math.random() * 2 + "s";
        
            document.body.appendChild(piece);
        
            setTimeout(() => piece.remove(), 6000);
        }
        }