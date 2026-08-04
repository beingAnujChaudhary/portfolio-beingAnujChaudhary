const VERB_DATA = [
  { inf: "kommen", en: "come", en3: "comes", irr: false, forms: ["komme", "kommst", "kommt", "kommt", "kommen"] },
  { inf: "gehen", en: "go", en3: "goes", irr: false, forms: ["gehe", "gehst", "geht", "geht", "gehen"] },
  { inf: "machen", en: "do", en3: "does", irr: false, forms: ["mache", "machst", "macht", "macht", "machen"] },
  { inf: "wohnen", en: "live", en3: "lives", irr: false, forms: ["wohne", "wohnst", "wohnt", "wohnt", "wohnen"] },
  { inf: "lieben", en: "love", en3: "loves", irr: false, forms: ["liebe", "liebst", "liebt", "liebt", "lieben"] },
  { inf: "bringen", en: "bring", en3: "brings", irr: false, forms: ["bringe", "bringst", "bringt", "bringt", "bringen"] },
  { inf: "sprechen", en: "speak", en3: "speaks", irr: true, forms: ["spreche", "sprichst", "spricht", "sprecht", "sprechen"] },
  { inf: "kochen", en: "cook", en3: "cooks", irr: false, forms: ["koche", "kochst", "kocht", "kocht", "kochen"] },
  { inf: "fragen", en: "ask", en3: "asks", irr: false, forms: ["frage", "fragst", "fragt", "fragt", "fragen"] },
  { inf: "antworten", en: "reply", en3: "replies", irr: false, forms: ["antworte", "antwortest", "antwortet", "antwortet", "antworten"] },
  { inf: "baden", en: "bathe", en3: "bathes", irr: false, forms: ["bade", "badest", "badet", "badet", "baden"] },
  { inf: "essen", en: "eat", en3: "eats", irr: true, forms: ["esse", "isst", "isst", "esst", "essen"] },
  { inf: "singen", en: "sing", en3: "sings", irr: false, forms: ["singe", "singst", "singt", "singt", "singen"] },
  { inf: "tanzen", en: "dance", en3: "dances", irr: false, forms: ["tanze", "tanzt", "tanzt", "tanzt", "tanzen"] },
  { inf: "arbeiten", en: "work", en3: "works", irr: false, forms: ["arbeite", "arbeitest", "arbeitet", "arbeitet", "arbeiten"] },
  { inf: "sehen", en: "see", en3: "sees", irr: true, forms: ["sehe", "siehst", "sieht", "seht", "sehen"] },
  { inf: "hören", en: "listen", en3: "listens", irr: false, forms: ["höre", "hörst", "hört", "hört", "hören"] },
  { inf: "laufen", en: "run", en3: "runs", irr: true, forms: ["laufe", "läufst", "läuft", "lauft", "laufen"] },
  { inf: "lesen", en: "read", en3: "reads", irr: true, forms: ["lese", "liest", "liest", "lest", "lesen"] },
  { inf: "schreiben", en: "write", en3: "writes", irr: false, forms: ["schreibe", "schreibst", "schreibt", "schreibt", "schreiben"] },
  { inf: "suchen", en: "search", en3: "searches", irr: false, forms: ["suche", "suchst", "sucht", "sucht", "suchen"] },
  { inf: "finden", en: "find", en3: "finds", irr: false, forms: ["finde", "findest", "findet", "findet", "finden"] },
  { inf: "stehen", en: "stand", en3: "stands", irr: false, forms: ["stehe", "stehst", "steht", "steht", "stehen"] },
  { inf: "sitzen", en: "sit", en3: "sits", irr: false, forms: ["sitze", "sitzt", "sitzt", "sitzt", "sitzen"] },
  { inf: "fahren", en: "drive", en3: "drives", irr: true, forms: ["fahre", "fährst", "fährt", "fahrt", "fahren"] },
  { inf: "reisen", en: "travel", en3: "travels", irr: false, forms: ["reise", "reist", "reist", "reist", "reisen"] },
  { inf: "treffen", en: "meet", en3: "meets", irr: true, forms: ["treffe", "triffst", "trifft", "trefft", "treffen"] },
  { inf: "schlafen", en: "sleep", en3: "sleeps", irr: true, forms: ["schlafe", "schläfst", "schläft", "schlaft", "schlafen"] },
  { inf: "lernen", en: "learn", en3: "learns", irr: false, forms: ["lerne", "lernst", "lernt", "lernt", "lernen"] },
  { inf: "lachen", en: "laugh", en3: "laughs", irr: false, forms: ["lache", "lachst", "lacht", "lacht", "lachen"] }
];

const SUBJECTS = [
  { en: "I", de: "ich" },
  { en: "You (informal)", de: "du" },
  { en: ["He", "She", "It"], de: ["er", "sie", "es"] },
  { en: "You (plural)", de: "ihr" },
  { en: ["They", "You (formal)"], de: ["sie", "Sie"] }
];

const generateVerbsDeck = () => {
  const cards = [];
  let subjectIndex = 0;
  let heSheItCycle = 0;
  let theyYouCycle = 0;

  for (let i = 0; i < VERB_DATA.length; i++) {
    const verb = VERB_DATA[i];
    for (let j = 0; j < 4; j++) {
      const sIndex = subjectIndex % 5;
      const subDef = SUBJECTS[sIndex];

      let enSubj, deSubj;
      if (sIndex === 2) {
         enSubj = subDef.en[heSheItCycle % 3];
         deSubj = subDef.de[heSheItCycle % 3];
         heSheItCycle++;
      } else if (sIndex === 4) {
         enSubj = subDef.en[theyYouCycle % 2];
         deSubj = subDef.de[theyYouCycle % 2];
         theyYouCycle++;
      } else {
         enSubj = subDef.en;
         deSubj = subDef.de;
      }

      const enVerb = (sIndex === 2) ? verb.en3 : verb.en;
      const verbForm = verb.forms[sIndex];

      cards.push({
        front: `${enSubj} ${enVerb}`,
        back: `${deSubj} ${verbForm}`,
        hint: `Infinitive: ${verb.inf} ${verb.irr ? '(Irregular)' : ''}`.trim()
      });

      subjectIndex++;
    }
  }
  return cards;
};

const DECKS = {
    ep1: [
        { front: 'I', back: 'ich', hint: '1st person singular' },
        { front: 'You (informal)', back: 'du', hint: '2nd person singular' },
        { front: 'He / She / It', back: 'er / sie / es', hint: '3rd person singular' },
        { front: 'We', back: 'wir', hint: '1st person plural' },
        { front: 'You all (plural)', back: 'ihr', hint: '2nd person plural' },
        { front: 'They / You (formal)', back: 'sie / Sie', hint: '3rd person plural / formal' },
        { front: 'I learn', back: 'ich lerne', hint: 'lernen' },
        { front: 'You learn (informal)', back: 'du lernst', hint: 'lernen' },
        { front: 'He learns', back: 'er lernt', hint: 'lernen' },
        { front: 'We learn', back: 'wir lernen', hint: 'lernen' },
        { front: 'You all learn', back: 'ihr lernt', hint: 'lernen' },
        { front: 'They learn', back: 'sie lernen', hint: 'lernen' }
    ],
    ep2: [
        { front: 'W sounds like', back: 'v', hint: 'Example: wir' },
        { front: 'V sounds like', back: 'f (usually)', hint: 'Example: Vater' },
        { front: 'J sounds like', back: 'y', hint: 'Example: ja' },
        { front: 'Z sounds like', back: 'ts', hint: 'Example: zehn' },
        { front: 'ei sounds like', back: '"eye"', hint: 'Example: mein' },
        { front: 'ie sounds like', back: 'long "ee"', hint: 'Example: Liebe' },
        { front: 'eu / äu sounds like', back: '"oy"', hint: 'Example: neu, Häuser' },
        { front: 'ß (Eszett) sounds like', back: 's', hint: 'Example: heißen' }
    ],
    ep3: [
        { front: '0', back: 'null', hint: 'Number' },
        { front: '1', back: 'eins', hint: 'Number' },
        { front: '2', back: 'zwei', hint: 'Number' },
        { front: '3', back: 'drei', hint: 'Number' },
        { front: '4', back: 'vier', hint: 'Number' },
        { front: '5', back: 'fünf', hint: 'Number' },
        { front: '6', back: 'sechs', hint: 'Number' },
        { front: '7', back: 'sieben', hint: 'Number' },
        { front: '8', back: 'acht', hint: 'Number' },
        { front: '9', back: 'neun', hint: 'Number' },
        { front: '10', back: 'zehn', hint: 'Number' },
        { front: '11', back: 'elf', hint: 'Number' },
        { front: '12', back: 'zwölf', hint: 'Number' },
        { front: '20', back: 'zwanzig', hint: 'Tens' },
        { front: '30', back: 'dreißig', hint: 'Tens (uses ß)' },
        { front: '21', back: 'einundzwanzig', hint: 'ones + und + tens' }
    ],
    ep4: [
        { front: 'I am', back: 'ich bin', hint: 'sein (to be)' },
        { front: 'You are (informal)', back: 'du bist', hint: 'sein (to be)' },
        { front: 'He is', back: 'er ist', hint: 'sein (to be)' },
        { front: 'We are', back: 'wir sind', hint: 'sein (to be)' },
        { front: 'You all are', back: 'ihr seid', hint: 'sein (to be)' },
        { front: 'They are', back: 'sie sind', hint: 'sein (to be)' },
        { front: 'I have', back: 'ich habe', hint: 'haben (to have)' },
        { front: 'You have (informal)', back: 'du hast', hint: 'haben (to have)' },
        { front: 'He has', back: 'er hat', hint: 'haben (to have)' },
        { front: 'We have', back: 'wir haben', hint: 'haben (to have)' },
        { front: 'You all have', back: 'ihr habt', hint: 'haben (to have)' },
        { front: 'They have', back: 'sie haben', hint: 'haben (to have)' },
        { front: 'Female student', back: 'die Studentin', hint: 'Add -in to make feminine' }
    ],
    ep5: generateVerbsDeck(),
    ep6: [
        { front: 'Good morning!', back: 'Guten Morgen!', hint: 'Greeting' },
        { front: 'Good day! / Hello!', back: 'Guten Tag!', hint: 'Greeting' },
        { front: 'Good evening!', back: 'Guten Abend!', hint: 'Greeting' },
        { front: 'Good night!', back: 'Gute Nacht!', hint: 'Leaving for bed' },
        { front: 'Goodbye! (formal)', back: 'Auf Wiedersehen!', hint: 'Farewell' },
        { front: 'How are you? (informal)', back: 'Wie geht es dir?', hint: 'Asking how someone is' },
        { front: 'I am sorry', back: 'Es tut mir leid', hint: 'Apologizing' },
        { front: 'Thank you', back: 'Danke', hint: 'Gratitude' },
        { front: 'can / be able to', back: 'können', hint: 'Modal verb' },
        { front: 'must / have to', back: 'müssen', hint: 'Modal verb' },
        { front: 'may / be allowed to', back: 'dürfen', hint: 'Modal verb' },
        { front: 'should', back: 'sollen', hint: 'Modal verb' },
        { front: 'want to', back: 'wollen', hint: 'Modal verb' },
        { front: 'would like to', back: 'möchten', hint: 'Modal verb' }
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.flashcard-3d-container');
    if (!container) return;

    const episodeKey = container.getAttribute('data-episode');
    let flashcards = DECKS[episodeKey] || DECKS.ep1;
    let initialFlashcards = [...flashcards];

    let currentIndex = 0;
    let isFlipped = false;
    let showHint = false;

    const storageKey = 'flashcard_state_' + episodeKey;
    const savedState = JSON.parse(localStorage.getItem(storageKey)) || {
        tracking: false,
        currentIndex: 0
    };

    let isTracking = savedState.tracking;
    currentIndex = savedState.currentIndex || 0;
    if (currentIndex >= flashcards.length) currentIndex = 0;

    const flashcard = document.querySelector('.flashcard-element');
    const frontText = document.querySelector('.card-front-text');
    const backText = document.querySelector('.card-back-text');
    const hintBtn = document.querySelector('.show-hint-btn');
    const hintText = document.querySelector('.hint-text');
    
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const shuffleBtn = document.querySelector('.shuffle-card-btn');
    const resetBtn = document.querySelector('.reset-btn');
    const progressText = document.querySelector('.inline-progress-text');
    const progressBar = document.querySelector('.progress-fill');
    
    const ttsEnBtn = document.querySelector('.tts-en');
    const ttsDeBtn = document.querySelector('.tts-de');
    
    const toggleSwitch = document.querySelector(`#track-learning-toggle-${episodeKey}`);
    const feedbackControls = document.querySelector('.learning-feedback-controls');
    const gotItBtn = document.querySelector('.got-it-btn');
    const needsReviewBtn = document.querySelector('.needs-review-btn');

    if (toggleSwitch) {
        toggleSwitch.checked = isTracking;
        toggleSwitch.addEventListener('change', (e) => {
            isTracking = e.target.checked;
            saveState();
            renderCard();
        });
    }

    function saveState() {
        localStorage.setItem(storageKey, JSON.stringify({
            tracking: isTracking,
            currentIndex: currentIndex
        }));
    }

    function renderCard() {
        const card = flashcards[currentIndex];
        frontText.textContent = card.front;
        backText.textContent = card.back;
        hintText.textContent = card.hint || 'No hint available';
        
        progressText.textContent = `${currentIndex + 1} / ${flashcards.length}`;
        if(progressBar) {
            progressBar.style.width = `${((currentIndex + 1) / flashcards.length) * 100}%`;
        }

        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === flashcards.length - 1;
        
        // Stop any currently playing audio when card changes
        window.speechSynthesis.cancel();

        isFlipped = false;
        flashcard.style.transform = 'rotateY(0deg)';
        showHint = false;
        hintBtn.style.display = 'flex';
        hintText.classList.add('hidden');
        feedbackControls.classList.add('hidden');
        
        saveState();
    }

    function toggleFlip() {
        isFlipped = !isFlipped;
        flashcard.style.transform = isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)';
        
        if (isTracking && isFlipped) {
            feedbackControls.classList.remove('hidden');
        } else {
            feedbackControls.classList.add('hidden');
        }
    }

    // TTS Functionality
    function speak(text, lang) {
        if (!('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel(); // Stop current
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        // Adjust for more natural voice if possible
        utterance.rate = 0.9; 
        window.speechSynthesis.speak(utterance);
    }

    if (ttsEnBtn) {
        ttsEnBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // prevent flip
            speak(flashcards[currentIndex].front, 'en-US');
        });
    }

    if (ttsDeBtn) {
        ttsDeBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // prevent flip
            speak(flashcards[currentIndex].back, 'de-DE');
        });
    }

    flashcard.addEventListener('click', (e) => {
        if(e.target.closest('.feedback-btn') || e.target.closest('.card-icon-btn') || e.target.closest('.tts-btn')) return;
        toggleFlip();
    });

    hintBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showHint = true;
        hintBtn.style.display = 'none';
        hintText.classList.remove('hidden');
    });

    const goToNext = () => {
        if (currentIndex < flashcards.length - 1) {
            isFlipped = false;
            flashcard.style.transform = 'rotateY(0deg)';
            feedbackControls.classList.add('hidden');
            setTimeout(() => {
                currentIndex++;
                renderCard();
            }, 150);
        }
    };

    nextBtn.addEventListener('click', goToNext);

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            isFlipped = false;
            flashcard.style.transform = 'rotateY(0deg)';
            feedbackControls.classList.add('hidden');
            setTimeout(() => {
                currentIndex--;
                renderCard();
            }, 150);
        }
    });
    
    gotItBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        goToNext();
    });
    
    needsReviewBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const currentCard = flashcards.splice(currentIndex, 1)[0];
        flashcards.push(currentCard);
        
        isFlipped = false;
        flashcard.style.transform = 'rotateY(0deg)';
        feedbackControls.classList.add('hidden');
        setTimeout(() => {
            if (currentIndex >= flashcards.length) {
                currentIndex = flashcards.length - 1;
            }
            renderCard();
        }, 150);
    });

    if (shuffleBtn) {
        shuffleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            flashcards = [...flashcards].sort(() => Math.random() - 0.5);
            currentIndex = 0;
            renderCard();
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            flashcards = [...initialFlashcards];
            currentIndex = 0;
            renderCard();
        });
    }

    window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') goToNext();
        else if (e.key === 'ArrowLeft') prevBtn.click();
        else if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault();
            toggleFlip();
        }
    });

    // Initial render
    renderCard();
});
