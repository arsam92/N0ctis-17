const terminal = document.querySelector("#terminal");

const EASY = [
  {
    title: "CALIBRATION 01",
    text: "What comes next?",
    visual: "2, 4, 8, 16, ?",
    answer: "32"
  },
  {
    title: "CALIBRATION 02",
    text: "Decode the bytes.",
    visual: "01001000 01001001",
    answer: "HI"
  },
  {
    title: "CALIBRATION 03",
    text: "Continue the pattern.",
    visual: "1, 3, 5, 9, 17, 33, 65, ?",
    answer: "129"
  }
];

const WITNESS_COLUMNS = [16, 1, 18, 1, 4, 15, 24];

const state = {
  page: 0,
  easyIndex: 0,
  attempts: 0,
  startedAt: Date.now()
};

function normalize(value) {
  return value.trim().toUpperCase().replace(/\s+/g, " ");
}

function shell(content, label = "N17 // UNCLASSIFIED") {
  terminal.innerHTML = `
    <div class="topline">
      <span>${label}</span>
      <span>NODE 17</span>
    </div>
    <div class="fade">${content}</div>
    <div class="footer">NOCTIS-17 // DO NOT ASSUME THE FIRST RULE IS THE FINAL RULE.</div>
  `;
}

function progress(value) {
  return `
    <div class="progress"><div style="width:${Math.max(0, Math.min(100, value))}%"></div></div>
  `;
}

function renderIntro() {
  shell(`
    <h1>N0ctis-17</h1>
    <p>Three questions. Nothing unusual.</p>
    <p>Answer them quickly. Do not overthink them.</p>
    <div class="prompt">[ BEGIN CALIBRATION ]</div>
    <div class="choice-row">
      <button data-action="begin">BEGIN</button>
    </div>
    ${progress(0)}
  `);
}

function renderEasy() {
  const q = EASY[state.easyIndex];
  const count = state.easyIndex + 1;

  shell(`
    <h2>${q.title}</h2>
    <p>${q.text}</p>
    <div class="big">${q.visual}</div>
    <div class="input-row">
      <input id="answer" autocomplete="off" spellcheck="false" aria-label="Answer">
      <button class="submit" data-action="easy-submit">SUBMIT</button>
    </div>
    <div id="status" class="status"></div>
    ${progress((count - 1) / EASY.length * 18)}
  `, `N17 // CALIBRATION ${String(count).padStart(2, "0")}/03`);

  document.querySelector("#answer").focus();
}

function renderCalibrationComplete() {
  shell(`
    <h2>CALIBRATION COMPLETE</h2>
    <p>Score: 3 / 3</p>
    <p>You were right to think these were easy.</p>
    <div class="reveal">
      <div class="big">THAT WAS THE TRAP.</div>
      <p>The system did not measure intelligence.</p>
      <p>It measured whether you would obey the shape of a question.</p>
    </div>
    <div class="choice-row">
      <button data-action="signal">CONTINUE</button>
    </div>
    ${progress(20)}
  `, "N17 // CALIBRATION CLOSED");
}

function renderSignal() {
  let board = "";
  for (let r = 0; r < WITNESS_COLUMNS.length; r++) {
    let row = "";
    for (let c = 1; c <= 24; c++) {
      const witness = c === WITNESS_COLUMNS[r];
      row += `<span class="signal-cell ${witness ? "witness" : ""}">${witness ? "◆" : "◇"}</span>`;
    }
    board += `<div class="signal-row">${row}</div>`;
  }

  shell(`
    <h2>PHASE 01 // THE WITNESSES</h2>
    <p>Seven lines. One witness in every line.</p>
    <p>Do not search for a message in the symbols themselves.</p>
    <p>Find where each witness is standing.</p>
    <div class="signal-board" aria-label="Seven rows of diamond symbols">${board}</div>
    <div class="input-row">
      <input id="answer" autocomplete="off" spellcheck="false" aria-label="Phase 1 answer">
      <button class="submit" data-action="signal-submit">SUBMIT</button>
    </div>
    <div id="status" class="status"></div>
    ${progress(42)}
  `, "N17 // PHASE 01");
  document.querySelector("#answer").focus();
}

function renderParadox() {
  shell(`
    <h2>PHASE 02 // THE FOUR</h2>
    <p>The word you found is not a password.</p>
    <p>It is an instruction to distrust a perfect-looking conclusion.</p>

    <div class="witness-panel">
      <div class="statement"><span>A:</span> B is lying.</div>
      <div class="statement"><span>B:</span> C is lying.</div>
      <div class="statement"><span>C:</span> D is lying.</div>
      <div class="statement"><span>D:</span> Exactly two of us are lying.</div>
    </div>

    <p class="prompt">QUESTION // Can all four statements be true or false consistently?</p>

    <div class="choice-row">
      <button data-action="paradox-yes">YES</button>
      <button data-action="paradox-no">NO</button>
    </div>
    <div id="status" class="status"></div>
    ${progress(64)}
  `, "N17 // PHASE 02");
}

function renderMeta() {
  shell(`
    <h2>PHASE 03 // THE FIRST ANSWER</h2>
    <p>You now have two results:</p>
    <div class="big">PARADOX / NO</div>

    <p>Most solvers will try to turn them into a key.</p>
    <p>Don't.</p>

    <div class="reveal">
      <p class="prompt">THE SYSTEM ASKS ONE QUESTION:</p>
      <p>Which part of this challenge has been trying to make you solve the wrong problem?</p>
    </div>

    <div class="choice-row">
      <button data-action="meta-a">THE SYMBOLS</button>
      <button data-action="meta-b">THE LOGIC</button>
      <button data-action="meta-c">THE QUESTIONS</button>
      <button data-action="meta-d">ME</button>
    </div>
    <div id="status" class="status"></div>
    ${progress(82)}
  `, "N17 // PHASE 03");
}

function renderEnd() {
  shell(`
    <h2>PHASE 04 // OPEN</h2>
    <div class="big">YOU NOTICED THE QUESTION.</div>
    <p>The easy questions were never there to teach you anything.</p>
    <p>The image was never asking for a word.</p>
    <p>The paradox was never asking for a binary answer.</p>
    <p>They were tests of whether you would accept the frame presented to you.</p>
    <div class="reveal">
      <p class="prompt">NEXT CHANNEL:</p>
      <div class="big">NOT YET</div>
      <p>Seven witnesses remain unaccounted for.</p>
    </div>
    ${progress(100)}
  `, "N17 // PHASE 04");
}

function setStatus(message, good = false) {
  const node = document.querySelector("#status");
  if (!node) return;
  node.textContent = message;
  node.className = `status ${good ? "good" : "bad"}`;
}

function submitEasy() {
  const input = document.querySelector("#answer");
  const answer = normalize(input?.value ?? "");
  const expected = normalize(EASY[state.easyIndex].answer);

  if (answer !== expected) {
    state.attempts++;
    setStatus("WRONG. You were told this was easy.");
    return;
  }

  if (state.easyIndex < EASY.length - 1) {
    state.easyIndex++;
    renderEasy();
    return;
  }

  renderCalibrationComplete();
}

function submitSignal() {
  const input = document.querySelector("#answer");
  const answer = normalize(input?.value ?? "");

  if (answer !== "PARADOX") {
    state.attempts++;
    setStatus("WRONG. You found positions. You did not yet interpret them.");
    return;
  }

  renderParadox();
}

function answerParadox(value) {
  if (value !== "NO") {
    state.attempts++;
    setStatus("Wrong. Try assigning truth values. The contradiction is the point.");
    return;
  }
  renderMeta();
}

function answerMeta(value) {
  if (value !== "THE QUESTIONS") {
    state.attempts++;
    setStatus("Close. Look at what every phase forced you to assume.");
    return;
  }
  renderEnd();
}

terminal.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  switch (button.dataset.action) {
    case "begin":
      state.page = 1;
      state.easyIndex = 0;
      state.attempts = 0;
      renderEasy();
      break;
    case "easy-submit":
      submitEasy();
      break;
    case "signal":
      renderSignal();
      break;
    case "signal-submit":
      submitSignal();
      break;
    case "paradox-yes":
      answerParadox("YES");
      break;
    case "paradox-no":
      answerParadox("NO");
      break;
    case "meta-a":
      answerMeta("THE SYMBOLS");
      break;
    case "meta-b":
      answerMeta("THE LOGIC");
      break;
    case "meta-c":
      answerMeta("THE QUESTIONS");
      break;
    case "meta-d":
      answerMeta("ME");
      break;
  }
});

terminal.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") return;
  if (event.target?.id !== "answer") return;
  document.querySelector("button[data-action$='submit']")?.click();
});

renderIntro();
