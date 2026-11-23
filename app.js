(function () {
  'use strict';
  const DATA = window.QUIZ_DATA;
  const LS_KEY = 'weihnachts-millionenquiz-save-v1';
  const letters = ['A', 'B', 'C', 'D'];
  const MEDIA = '/Weihnachtliche-Weihnachten/';
  const keySets = [['1', '2', '3', '4'], ['q', 'w', 'e', 'r'], ['a', 's', 'd', 'f']];
  const $ = (selector) => document.querySelector(selector);
  const money = (n) => new Intl.NumberFormat('de-DE').format(n) + ' €';
  let soundContext;
  let countdownTimer;
  let startTime = 0;
  let toastTimer;

  function defaultProgress() {
    return { index: 0, correct: false, wrong: [], completed: false, jokers: { fifty: false, poll: false, phone: false }, eliminated: [], openJoker: null };
  }
  function initialState() {
    return {
      phase: 'home', returnPhase: null, muted: false, countdown: 3,
      winner: null, fastestMs: null, order: [], cursor: 0,
      fastestWrong: {}, estimateRound: 0, estimates: {},
      progress: { opa: defaultProgress(), emilie: defaultProgress(), mama: defaultProgress() }
    };
  }
  function load() {
    try {
      const data = JSON.parse(localStorage.getItem(LS_KEY));
      if (!data || !['home','fastestReady','fastestCountdown','fastestLive','fastestWon','estimate','estimateResult','quiz','roundDone','finale'].includes(data.phase)) return initialState();
      if (!DATA.teams.every(t => data.progress?.[t.id] && Number.isInteger(data.progress[t.id].index))) return initialState();
      if (['fastestLive','fastestCountdown','fastestReady'].includes(data.phase)) data.phase = 'estimate';
      data.estimates ??= {}; data.estimateRound ??= 0;
      if (data.phase === 'home' && ['fastestLive','fastestCountdown'].includes(data.returnPhase)) data.returnPhase = 'estimate';
      return data;
    } catch { return initialState(); }
  }
  let state = load();
  const app = $('#app');

  function persist() {
    try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch { /* private browsing */ }
  }
  function setPhase(name) { state.phase = name; persist(); render(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  function currentTeam() { return DATA.teams.find(t => t.id === state.order[state.cursor]); }
  function giftHTML(level) {
    const scale = Math.min(1.55, .76 + level * .052);
    return `<div class="gift-stage" aria-label="Geschenkgröße: ${level} von 15 Stufen">
      <span class="gift-spark s1">✦</span><span class="gift-spark s2">✳</span><span class="gift-spark s3">✧</span>
      <div class="gift" style="--gift-scale:${scale.toFixed(3)}"><div class="gift-box"></div><div class="gift-lid"></div><div class="gift-bow"></div></div></div>`;
  }
  function catHTML(line, compact = false) {
    return `<aside class="cat-card ${compact ? 'compact' : ''}" aria-label="Kommentar der Quizkatze">
      <img src="/Weihnachtliche-Weihnachten/katze-avatar.webp" alt="Käpt’n Keks, orangefarbene Katze mit Kapitänsmütze" width="67" height="67">
      <div><p class="cat-name">🐾 KÄPT’N KEKS KOMMENTIERT</p><p class="cat-text">„${line}“</p></div></aside>`;
  }
  function badgeHTML() { return '<div class="pill-row"><span class="pill"><span class="bullet">✦</span> 3 Teams</span><span class="pill"><span class="bullet">✦</span> 45 Fragen</span><span class="pill"><span class="bullet">✦</span> 1 riesiges Geschenk</span></div>'; }
  function statusOf(id) {
    const p=state.progress[id];
    return p.completed ? '✓ Millionen-Runde geschafft' : p.index ? `${p.index} / 15 Fragen geschafft` : '15 Fragen warten';
  }
  function teamCards() {
    return DATA.teams.map(team => `<article class="team-card" style="--teamColor:${team.color}"><div class="team-emoji">${team.icon}</div><div class="team-name">${team.name}</div><p>${team.tagline}</p><div class="team-status">${statusOf(team.id)}</div></article>`).join('');
  }
  function canResume() {
    return state.returnPhase || state.winner !== null || DATA.teams.some(t => state.progress[t.id].index > 0 || state.progress[t.id].completed);
  }
  function home() {
    app.innerHTML = `
      <section class="hero">
        <div><div class="eyebrow">✦ Die große Weihnachts-Spielshow 2026</div>
          <h1 class="display hero-title">Drei Teams.<span class="title-gradient">Eine Million.</span><span>Viel Miau.</span></h1>
          <p class="lede hero-text">Willkommen bei <b>Wer knackt die Weihnachts-Million?</b> 45 Fragen, zwei Schätzrunden und ein Geschenk, das mit jeder richtigen Antwort größer wird.</p>
          ${badgeHTML()}
          <div class="btn-row"><button class="btn btn-primary" data-action="${canResume() ? 'resume' : 'startEstimate'}">${canResume() ? '▶ Spiel fortsetzen' : '▶ Schätzrunde starten'}</button><button class="btn btn-ghost" data-action="howto">Spielregeln ↗</button></div>
        </div>
        <div class="hero-visual"><img src="/Weihnachtliche-Weihnachten/katze-kapitaen.webp" alt="Eine lustige orangefarbene Katze begrüßt die Teams von einem weihnachtlichen Schiff" width="460" height="460"><div class="hero-sticker">Ihr Moderator<b>Käpt’n Keks 🐾</b></div></div>
      </section>
      <p class="section-caption">Die legendären Kandidaten</p><section class="teams-grid" aria-label="Teilnehmende Teams">${teamCards()}</section>
      <p class="fineprint">Alles läuft ohne Anmeldung oder Server – auch offline. Der Fortschritt wird auf diesem Gerät gespeichert.</p>`;
  }
  function estimateParticipants() {
    return state.estimateRound === 0 ? DATA.teams : DATA.teams.filter(t => t.id !== state.winner);
  }
  function estimate() {
    const question = DATA.estimates[state.estimateRound];
    const participants = estimateParticipants();
    const title = state.estimateRound === 0 ? 'Wer darf zuerst spielen?' : 'Wer spielt als Zweites?';
    app.innerHTML = `<div class="stage-header"><div><div class="eyebrow">Schätzrunde ${state.estimateRound + 1} von 2</div><h1>${title}</h1><p class="stage-sub">Alle teilnehmenden Teams geben eine Zahl ein. Wer am nächsten dran ist, gewinnt!</p></div></div>
      <section class="surface fastest-question"><div class="eyebrow">🎯 Die große Schätzfrage</div><h2>${question.text}</h2>
      <div class="estimate-entries" style="display:grid;gap:18px;margin:25px 0">
      ${participants.map(t => `<label style="display:grid;gap:7px;font-weight:700">${t.icon} ${t.name}<input class="estimate-input" data-team="${t.id}" type="number" min="0" step="1" inputmode="numeric" placeholder="Eure Schätzung (${question.unit})" required style="padding:14px;border-radius:10px;font-size:20px;width:100%;box-sizing:border-box"></label>`).join('')}
      </div><button class="btn btn-primary" data-action="submitEstimate">🎯 Schätzungen auflösen!</button></section>
      ${catHTML(state.estimateRound === 0 ? 'Ich schätze, jemand schätzt falsch. Das ist meine Spezialität!' : 'Zwei Teams, eine Schätzfrage. Und ich habe wieder keinen Taschenrechner dabei!')}`;
  }
  function submitEstimate() {
    const participants = estimateParticipants();
    const inputs = [...app.querySelectorAll('.estimate-input')];
    const values = {};
    for (const input of inputs) {
      const raw = input.value.trim();
      if (!raw || !Number.isFinite(Number(raw)) || Number(raw) < 0 || !Number.isInteger(Number(raw))) {
        showToast('Bitte für jedes Team eine gültige ganze Zahl eingeben.'); input.focus(); return;
      }
      values[input.dataset.team] = Number(raw);
    }
    const answer = DATA.estimates[state.estimateRound].answer;
    const ranked = participants.map((t, i) => ({ id:t.id, value:values[t.id], diff:Math.abs(values[t.id]-answer), i }))
      .sort((a,b) => a.diff-b.diff || a.i-b.i);
    state.estimates[state.estimateRound] = { values, ranked };
    if (state.estimateRound === 0) {
      state.winner = ranked[0].id;
      state.order = [ranked[0].id];
      state.cursor = 0;
    } else {
      state.order = [state.winner, ranked[0].id, ranked[1].id];
      state.cursor = 1;
    }
    setPhase('estimateResult'); confetti(70); successSound();
  }
  function estimateResult() {
    const question = DATA.estimates[state.estimateRound];
    const result = state.estimates[state.estimateRound];
    if (!result) { setPhase('estimate'); return; }
    const winner = DATA.teams.find(t => t.id === result.ranked[0].id);
    app.innerHTML = `<section class="surface win-panel"><div class="eyebrow">🎯 Ergebnis der Schätzrunde ${state.estimateRound + 1}</div>
      <h2>Die richtige Antwort: <span class="title-gradient">${new Intl.NumberFormat('de-DE').format(question.answer)} ${question.unit}</span></h2><p>${question.fact}</p>
      <div style="max-width:600px;margin:20px auto;text-align:left">${result.ranked.map((r,i) => {
        const t=DATA.teams.find(x=>x.id===r.id);
        return `<div style="padding:12px;border-bottom:1px solid #8885"><b>${i+1}. ${t.icon} ${t.name}</b>: ${new Intl.NumberFormat('de-DE').format(r.value)} ${question.unit} (Abweichung: ${new Intl.NumberFormat('de-DE').format(r.diff)})</div>`;
      }).join('')}</div>
      <h2>🏆 ${winner.name} spielt ${state.estimateRound === 0 ? 'zuerst' : 'als Zweites'}!</h2>
      ${catHTML('Ich lag nur ungefähr drei Millionen daneben. Also quasi richtig!')}
      <button class="btn btn-primary" data-action="nextRound">▶ ${winner.name} – Quiz starten!</button></section>`;
  }

  function fastestReady() {
    app.innerHTML = `<div class="stage-header"><div><div class="eyebrow">Runde 0 · Die Einstiegsfrage</div><h1>Wer ist am schnellsten?</h1><p class="stage-sub">Der erste <b>richtig</b> Antwortende bekommt den goldenen Startplatz.</p></div><span class="pill">⚡ Reaktionsduell</span></div>
      <div class="fastest-intro"><div class="surface"><h2>Eine Frage. Drei Teams. Zwölf Tasten.</h2>
      <p class="muted">Alle sehen dieselbe Frage. Nach dem Countdown kann jedes Team auf A, B, C oder D tippen – per Klick oder über die eigenen vier Tastaturtasten. <b>Die erste richtige Antwort gewinnt.</b></p>
      <div class="keyboard-grid">
        ${DATA.teams.map((t,i) => `<div class="key-guide"><span>${t.icon} <b>${t.name}</b></span><div class="keys">${keySets[i].map(k=>`<span class="key">${k.toUpperCase()}</span>`).join('')}</div></div>`).join('')}
      </div><p class="fineprint">Die Tasten entsprechen von links nach rechts A, B, C und D. Bei einer falschen Antwort gibt es eine kurze Sperrzeit.</p>
      <button class="btn btn-primary" data-action="countdown">3, 2, 1 – los geht’s! ⚡</button></div>
      <div>${catHTML('Ich habe alle drei Teams gewogen. Ihre Chancen auf die Million wiegen erstaunlich wenig!')}<p class="fineprint">Tipp: Für faire Reaktionen am besten einen gemeinsamen Laptop nutzen und die Tastatur aufteilen.</p></div></div>`;
  }
  function fastestCountdown() {
    app.innerHTML = `<div class="stage-header"><div><div class="eyebrow">Auf die Plätze</div><h1>Finger an die Tasten!</h1></div></div><div class="surface win-panel"><div class="countdown" aria-label="Countdown ${state.countdown}">${state.countdown || 'LOS!'}</div><p class="muted">Gleich erscheint die Einstiegsfrage. Keine falschen Frühstarts, ihr Weihnachtsnasen!</p></div>`;
  }
  function fastestLive() {
    const question = DATA.fastest;
    app.innerHTML = `<div class="stage-header"><div><div class="eyebrow">Einstiegsfrage · Live</div><h1>Wer antwortet zuerst richtig?</h1></div><span class="pill">⚡ JETZT ANTWORTEN</span></div>
      <section class="surface fastest-question"><div class="eyebrow">Die Blitzfrage</div><h2>${question.text}</h2>
      <div class="fastest-options">${question.options.map((x,i)=>`<div class="fastest-option"><b>${letters[i]}</b> ${x}</div>`).join('')}</div>
      <div class="buzzer-grid">${DATA.teams.map((t,i)=>`<div class="buzzer-row"><div class="buzzer-label">${t.icon} ${t.name}<small>${keySets[i].map(k=>k.toUpperCase()).join(' · ')} = A · B · C · D</small></div>
      <div class="buzzer-buttons">${letters.map((l,j)=>`<button class="buzzer ${state.fastestWrong[t.id] && state.fastestWrong[t.id].includes(j)?'wrong':''}" data-action="fastestAnswer" data-team="${t.id}" data-index="${j}" aria-label="${t.name} antwortet ${l}">${l}</button>`).join('')}</div></div>`).join('')}</div>
      </section><p class="fineprint">Nur die erste richtige Antwort zählt. Bei Fehlversuchen wird das jeweilige Team für 1,2 Sekunden gesperrt.</p>`;
  }
  function fastestWon() {
    const t = DATA.teams.find(x=>x.id===state.winner);
    const speed = (state.fastestMs / 1000).toFixed(2).replace('.', ',');
    app.innerHTML = `<section class="surface win-panel"><div class="eyebrow">Das Rennen ist entschieden</div><div class="win-icon">🏆</div>
      <h2><span class="title-gradient">${t.name}</span><br>beginnt!</h2>
      <p>Die erste korrekte Antwort kam von <b>${t.name}</b>. Damit darf dieses Team als Erstes auf den Millionen-Sessel.</p>
      <div class="time-badge">⚡ Reaktionszeit: ${speed} Sekunden</div>
      ${catHTML('Schneller als mein Schwanz beim Anblick einer Gurke! Das fängt ja gut an.')}
      <div class="btn-row" style="justify-content:center;margin-top:23px"><button class="btn btn-primary" data-action="nextRound">${t.icon} ${t.name} – Quiz starten!</button></div>
      <p class="fineprint">Anschließend spielen die beiden anderen Teams ihre jeweils eigene Runde.</p></section>`;
  }
  function catComment(t,p) {
    if (p.correct && p.index===14) return 'EINE MILLION! Das Geschenk muss jetzt wohl mit einem Tieflader abgeholt werden. Miau!';
    if (p.correct && p.index===9) return '16.000 Euro! Ich habe schon mal die Schiffskojen für das Riesen-Geschenk reserviert.';
    if (p.correct && p.index===4) return 'Sicherheitsstufe erreicht! Ich setze feierlich meine zweite Kapitänsmütze auf.';
    if (p.correct) return ['Miau-nifique! Das Geschenk hat schon wieder Wachstumsschmerzen.','Richtig! Ich sehe Geschenkpapier-Bedarf aufkommen.','Meine Schnurrhaare applaudieren. Es wird eng unter dem Weihnachtsbaum.','So wird das was mit der Million. Ich putze schon mal meinen Pokal.'][p.index%4];
    if (p.wrong.length>0) return ['Miau, der Fehler war Absicht. Sicher doch. Versuch es nochmal!','Ich habe es nicht gesagt, aber ich habe es miaut: knapp daneben!','Das war eine kreative Antwort. Leider kein Weihnachtswunder.','Nicht schlimm – es gibt unbegrenzte Versuche. Sogar für Zweibeiner.'][p.wrong.length%4];
    return ['Sitzt die Frisur? Das Denken darf beginnen.','Bei dieser Frage hilft vielleicht Nachdenken. Oder eine sehr schlaue Katze.','Ich moderiere, du rätselst. Das ist eine klare Arbeitsteilung.','Ruhig bleiben. Ich habe auch nur neun Leben und keine Million.'][p.index%4];
  }
  function ladderHTML(index, correct) {
    return `<div class="surface ladder"><div class="ladder-label">✦ Der Weg zur Million</div>${DATA.prizes.map((value,i)=>({value,i})).reverse().map(({value,i})=>`<div class="ladder-item ${[4,9,14].includes(i)?'special':''} ${i===index?'active':''} ${i<index||(i===index&&correct)?'done':''}"><span class="n">${String(i+1).padStart(2,'0')}</span><span>${money(value)}</span></div>`).join('')}</div>`;
  }
  function giftPanel(level) {
    return `<div class="surface present-panel"><p class="present-title">🎁 Das Weihnachtsgeschenk</p>${giftHTML(level)}<div class="present-level">Stufe ${level} von 15</div><p class="present-desc">Mit jeder richtigen Antwort wächst es weiter!</p></div>`;
  }
  function quiz() {
    const team=currentTeam(); if(!team) { setPhase('home'); return; }
    const p=state.progress[team.id];
    if(p.index>=15){setPhase('roundDone');return;}
    const question=DATA.quizzes[team.id][p.index];
    const level=p.index + (p.correct ? 1 : 0);
    const activeIndex=p.index;
    let feedback='';
    if(p.correct) feedback=`<div class="answer-feedback good" role="status">✓ RICHTIG! ${money(DATA.prizes[activeIndex])} erreicht! 🎁 Dein Weihnachtsgeschenk ist gewachsen.
      <p class="fact">💡 ${question.fact}</p></div>`;
    else if(p.wrong.length) feedback=`<div class="answer-feedback" role="status">✗ Noch nicht richtig. Probier eine andere Antwort – du hast unbegrenzt viele Versuche.</div>`;
    const jokers = `<div class="jokers" aria-label="Joker">
       <button class="joker ${p.jokers.fifty?'used':''}" data-action="joker" data-kind="fifty" ${p.jokers.fifty||p.correct?'disabled':''}>50:50</button>
       <button class="joker ${p.jokers.poll?'used':''}" data-action="joker" data-kind="poll" ${p.jokers.poll||p.correct?'disabled':''}>👥 Publikum</button>
       <button class="joker ${p.jokers.phone?'used':''}" data-action="joker" data-kind="phone" ${p.jokers.phone||p.correct?'disabled':''}>🐱 Katzenjoker</button>
       </div>${jokerDetails(p,question)}`;
    app.innerHTML=`<div class="quiz-team-header"><div class="team-h"><div class="team-big-icon">${team.icon}</div><div><div class="eyebrow">Team ${state.cursor+1} von 3</div><h1>${team.name}</h1></div></div><span class="pill">${p.index+1} / 15</span></div>
      <div class="progressbar"><span style="width:${level/15*100}%"></span></div>
      <div class="quiz-grid"><div class="quiz-main">
        <section class="surface quiz-card"><div class="question-overline"><span>Frage ${p.index+1} von 15</span><span>${money(DATA.prizes[activeIndex])}</span></div>
        <h2 class="question-title">${question.text}</h2><div class="options-grid">
        ${question.options.map((o,i)=>`<button class="answer ${p.wrong.includes(i)?'wrong':''} ${p.correct&&i===question.correct?'correct':''}" data-action="answer" data-index="${i}" ${p.correct||p.wrong.includes(i)||p.eliminated.includes(i)?'disabled':''} ${p.eliminated.includes(i)?'style="opacity:.17"':''}><span class="answer-key">${letters[i]}</span><span>${o}</span></button>`).join('')}</div>
        ${feedback}
        ${p.correct?`<button class="btn btn-primary btn-block question-action" data-action="nextQuestion">${activeIndex===14?'🏆 Million geschafft – feiern!':'Nächste Frage →'}</button>`:`<p class="next-hint">Antwort anklicken oder A / B / C / D drücken. Falsch? Einfach erneut probieren.</p>`}
        </section>
        ${jokers}
        <div style="margin-top:15px">${catHTML(catComment(team,p),true)}</div>
      </div><aside class="quiz-aside">${giftPanel(level)}${ladderHTML(activeIndex,p.correct)}</aside></div>`;
  }
  function jokerDetails(p,q) {
    if(!p.openJoker) return '';
    if(p.openJoker==='poll') {
      const rest=[0,1,2,3].filter(i=>i!==q.correct);
      const percentages=[9,13,16,62];
      const result=[0,0,0,0]; result[q.correct]=62;
      rest.forEach((i,j)=>result[i]=percentages[j]);
      return `<div class="joker-info"><h3>👥 Das (rein fiktive) Weihnachtspublikum hat abgestimmt</h3>${result.map((n,i)=>`<div class="poll-row"><span>${letters[i]}</span><div class="poll-bar"><span style="width:${n}%"></span></div><span>${n}%</span></div>`).join('')}</div>`;
    }
    if(p.openJoker==='phone'){
      const other=[0,1,2,3].find(i=>i!==q.correct&&!p.wrong.includes(i));
      const text=other===undefined?`Meine Schnurrhaare zeigen sehr entschieden auf ${letters[q.correct]}.`:`Ich schwanke zwischen ${letters[q.correct]} und ${letters[other]}. Eine von beiden lässt die Glocken klingeln!`;
      return `<div class="joker-info"><h3>🐱 Der Katzenjoker miaut</h3><p>„${text}“</p></div>`;
    }
    return `<div class="joker-info"><h3>✂️ 50:50 ist aktiv</h3><p>Zwei falsche Antwortmöglichkeiten wurden ausgeblendet.</p></div>`;
  }
  function roundDone() {
    const team=currentTeam(); if(!team){setPhase('home');return;}
    const last=state.cursor===2;
    const attempts=state.progress[team.id].attempts||0;
    app.innerHTML=`<section class="surface round-done"><div class="eyebrow">🏆 15 von 15 richtig beantwortet</div><h2>GROSSARTIG, <span class="title-gradient">${team.name}!</span></h2>
      <div class="achievement">✦ DIE WEIHNACHTS-MILLION IST EUER ✦</div><p>Ihr habt alle 15 Fragen richtig gelöst. 🎄 Ihr dürft euch jetzt euer Geschenk unter dem Weihnachtsbaum nehmen!</p>
      ${giftHTML(15)}<div class="stat-row"><span class="stat"><b>15/15</b> richtige Fragen</span><span class="stat"><b>${money(1000000)}</b> Showgewinn</span><span class="stat"><b>${attempts}</b> Fehlversuche</span></div>
      <div style="max-width:620px;margin:0 auto 22px">${catHTML('Ich habe ein kleines Problem: Dieses Geschenk passt nicht mehr in meinen Schiffscontainer!')}</div>
      <button class="btn btn-primary" data-action="afterRound">${last?'🎬 Zum großen Schiffs-Finale!':state.estimateRound===0?'🎯 Zur nächsten Schätzfrage!':'🎤 Nächstes Team bitte!'}</button></section>`;
  }
  function finale() {
    app.innerHTML=`<section class="finale"><div class="eyebrow">✦ Das große Weihnachtsfinale ✦</div><div class="finale-grid"><div>
        <h1>Ihr seid alle <span class="title-gradient">Millionäre!</span></h1><p>45 Fragen, drei gewaltige Geschenke und eine Katze, die sich sehr unauffällig von der Feier verabschiedet.</p>
        <div class="winners-list">${DATA.teams.map(t=>`<div class="winner-line"><span>${t.icon} ${t.name}</span><span>🏆 1.000.000 €</span></div>`).join('')}</div>
        ${catHTML('Meine lieben Weihnachtsmillionäre: Ich segle jetzt in den Sonnenuntergang. Die Geschenke könnt ihr selber tragen. Ahoi!')}
        <div class="btn-row" style="margin-top:22px"><button class="btn btn-primary" data-action="playOutro">▶ Abspann abspielen</button><button class="btn btn-ghost" data-action="replay">Alles neu spielen ↺</button></div>
      </div><div class="video-wrap"><video class="outro-video" id="outroVideo" controls playsinline preload="metadata" poster="/Weihnachtliche-Weihnachten/outro-poster.webp" aria-label="Weihnachts-Video: Käpt’n Keks segelt auf einem geschmückten Schiff davon"><source src="/Weihnachtliche-Weihnachten/katze-segelt-davon.mp4" type="video/mp4">Dein Browser unterstützt leider keine Videowiedergabe.</video></div></div></section>`;
  }
  function render() {
    $('#soundToggle').textContent=state.muted?'♪̸':'♫';
    $('#soundToggle').setAttribute('aria-pressed',String(!state.muted));
    $('#soundToggle').setAttribute('aria-label',state.muted?'Ton einschalten':'Ton ausschalten');
    $('#topStatus').textContent = ({home:'DIE FAMILIEN-SHOW',estimate:'DIE SCHÄTZRUNDE',estimateResult:'DAS SCHÄTZERGEBNIS',fastestReady:'DIE EINSTIEGSRUNDE',fastestCountdown:'STARTKLAR',fastestLive:'BLITZRUNDE',fastestWon:'DAS RENNERGEBNIS',quiz:'AUF DEM MILLIONEN-SESSEL',roundDone:'TEAM CHAMPIONS',finale:'ALLE SIND MILLIONÄRE'})[state.phase]||'DIE FAMILIEN-SHOW';
    switch(state.phase){case 'home':home();break;case 'estimate':estimate();break;case 'estimateResult':estimateResult();break;case 'fastestCountdown':fastestCountdown();break;case 'fastestLive':fastestLive();break;case 'fastestWon':fastestWon();break;case 'quiz':quiz();break;case 'roundDone':roundDone();break;case 'finale':finale();break;default:home();}
  }
  function showToast(message) {
    clearTimeout(toastTimer);
    $('#toastLayer').innerHTML=`<div class="toast">${message}</div>`;
    toastTimer=setTimeout(()=>$('#toastLayer').replaceChildren(),2300);
  }
  function beep(freq=700,duration=.12,type='sine') {
    if(state.muted) return;
    try {
      const AudioCtx=window.AudioContext||window.webkitAudioContext;
      if(!AudioCtx)return;
      soundContext??=new AudioCtx();
      if(soundContext.state==='suspended') soundContext.resume();
      const osc=soundContext.createOscillator(),gain=soundContext.createGain();
      osc.type=type;osc.frequency.value=freq;
      gain.gain.setValueAtTime(.001,soundContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(.075,soundContext.currentTime+.012);
      gain.gain.exponentialRampToValueAtTime(.001,soundContext.currentTime+duration);
      osc.connect(gain).connect(soundContext.destination);
      osc.start();osc.stop(soundContext.currentTime+duration+.01);
    } catch {/* no audio permission */}
  }
  function successSound(){beep(587,.13);setTimeout(()=>beep(784,.14),90);setTimeout(()=>beep(1047,.22),190);}
  function confetti(num=75){
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const layer=$('#confettiLayer');const colors=['#f4ca76','#fff0bc','#91d8be','#adacff','#e9789a'];
    for(let i=0;i<num;i++){
      const piece=document.createElement('i');piece.className='confetti';
      piece.style.left=`${Math.random()*100}%`;piece.style.background=colors[i%colors.length];
      piece.style.setProperty('--drift',`${Math.round(Math.random()*360-180)}px`);
      piece.style.setProperty('--speed',`${2.4+Math.random()*2.6}s`);
      piece.style.animationDelay=`${Math.random()*.5}s`;
      layer.appendChild(piece);setTimeout(()=>piece.remove(),5700);
    }
  }
  function handleCountdown(){
    clearInterval(countdownTimer);state.countdown=3;state.phase='fastestCountdown';persist();render();beep(550,.13);
    countdownTimer=setInterval(()=>{
      if(state.phase!=='fastestCountdown'){clearInterval(countdownTimer);return;}
      state.countdown-=1;
      if(state.countdown<=0){clearInterval(countdownTimer);state.phase='fastestLive';state.fastestWrong={};startTime=performance.now();persist();render();successSound();}
      else{beep(550+state.countdown*50,.13);render();}
    },800);
  }
  function fastestAnswer(teamId,chosen){
    if(state.phase!=='fastestLive')return;
    if(!DATA.teams.some(t=>t.id===teamId)||chosen<0||chosen>3)return;
    const until=Number(state.fastestWrong[`${teamId}Lock`]||0);
    if(Date.now()<until)return;
    if(chosen!==DATA.fastest.correct){
      if(!Array.isArray(state.fastestWrong[teamId]))state.fastestWrong[teamId]=[];
      if(!state.fastestWrong[teamId].includes(chosen))state.fastestWrong[teamId].push(chosen);
      state.fastestWrong[`${teamId}Lock`]=Date.now()+1200;
      beep(190,.25,'sawtooth');showToast(`🙀 ${DATA.teams.find(t=>t.id===teamId).name}: leider falsch! 1,2 Sekunden Sperrzeit.`);
      persist();render();return;
    }
    state.fastestMs=Math.max(1,Math.round(performance.now()-startTime));
    state.winner=teamId;state.order=[teamId,...DATA.teams.map(t=>t.id).filter(id=>id!==teamId)];
    state.cursor=0;state.phase='fastestWon';persist();render();confetti(85);successSound();
  }
  function doAnswer(index){
    if(state.phase!=='quiz'||!Number.isInteger(index)||index<0||index>3)return;
    const t=currentTeam(),p=state.progress[t.id],question=DATA.quizzes[t.id][p.index];
    if(p.correct||p.wrong.includes(index)||p.eliminated.includes(index))return;
    if(question.correct===index){p.correct=true;successSound();confetti(p.index===14?140:42);}
    else{p.wrong.push(index);p.attempts=(p.attempts||0)+1;beep(200,.18,'triangle');}
    persist();render();
    if(p.correct)showToast(p.index===14?'🏆 DIE MILLION IST GEKNACKT! 🎁':'🎁 Richtig! Das Geschenk wächst!');
  }
  function nextQuestion(){
    if(state.phase!=='quiz')return;
    const p=state.progress[currentTeam().id];if(!p.correct)return;
    if(p.index===14){p.completed=true;p.index=15;persist();setPhase('roundDone');confetti(150);return;}
    p.index++;p.correct=false;p.wrong=[];p.eliminated=[];p.openJoker=null;persist();render();window.scrollTo({top:0,behavior:'smooth'});
  }
  function useJoker(kind){
    if(state.phase!=='quiz')return;
    const p=state.progress[currentTeam().id];
    if(!['fifty','poll','phone'].includes(kind)||p.jokers[kind]||p.correct)return;
    p.jokers[kind]=true;p.openJoker=kind;
    if(kind==='fifty'){
      const q=DATA.quizzes[currentTeam().id][p.index];
      const wrongOptions=[0,1,2,3].filter(i=>i!==q.correct&&!p.wrong.includes(i));
      // Keep one incorrect answer on screen; previously attempted answers remain disabled.
      p.eliminated=wrongOptions.slice(0,Math.max(0,wrongOptions.length-1));
    }
    beep(860,.13);persist();render();
  }
  function afterRound(){
    if(state.phase!=='roundDone')return;
    state.cursor++;
    if(state.cursor>=state.order.length){
      if(state.estimateRound===0){state.estimateRound=1;setPhase('estimate');}
      else {setPhase('finale');playOutro();}
    } else {setPhase('quiz');}
  }
  function playOutro(){
    if(state.phase!=='finale')return;
    const v=$('#outroVideo');if(!v)return;
    v.currentTime=0;
    v.muted=state.muted;
    const promise=v.play();if(promise?.catch)promise.catch(()=>showToast('▶ Tippe auf Play im Video, um den Abspann zu starten.'));
  }
  function howto(){
    showToast('Erst schätzen, dann 15 Fragen, erneut schätzen, dann die restlichen Teams. Falsche Antworten dürfen beliebig oft verbessert werden.');
  }
  function reset(confirmFirst=true){
    if(confirmFirst&&!window.confirm('Wirklich alles zurücksetzen? Der gesamte Quizfortschritt geht verloren.'))return;
    clearInterval(countdownTimer);state=initialState();persist();setPhase('home');
  }
  function resume(){
    if(state.phase!=='home')return;
    if(state.returnPhase){const target=state.returnPhase;state.returnPhase=null;setPhase(target);return;}
    if(!state.winner){setPhase('estimate');return;}
    if(state.cursor>=state.order.length){setPhase(state.estimateRound===0?'estimate':'finale');return;}
    const p=state.progress[currentTeam()?.id];setPhase(p?.completed?'roundDone':'quiz');
  }
  function dispatch(action,elem){
    switch(action){
      case 'startEstimate':setPhase('estimate');break;case 'submitEstimate':submitEstimate();break;
      case 'countdown':handleCountdown();break;
      case 'fastestAnswer':fastestAnswer(elem.dataset.team,Number(elem.dataset.index));break;
      case 'nextRound':setPhase('quiz');break;
      case 'answer':doAnswer(Number(elem.dataset.index));break;
      case 'nextQuestion':nextQuestion();break;
      case 'joker':useJoker(elem.dataset.kind);break;
      case 'afterRound':afterRound();break;
      case 'playOutro':playOutro();break;
      case 'replay':reset(true);break;
      case 'resume':resume();break;
      case 'howto':howto();break;
      default:break;
    }
  }
  app.addEventListener('click',(event)=>{
    const button=event.target.closest('[data-action]');if(!button||button.disabled)return;
    dispatch(button.dataset.action,button);
  });
  document.addEventListener('keydown',event=>{
    if(event.altKey||event.ctrlKey||event.metaKey||event.repeat||['INPUT','TEXTAREA','SELECT'].includes(event.target.tagName))return;
    const key=event.key.toLowerCase();
    if(state.phase==='fastestLive'){
      for(let i=0;i<keySets.length;i++){
        const j=keySets[i].indexOf(key);
        if(j!==-1){event.preventDefault();fastestAnswer(DATA.teams[i].id,j);return;}
      }
    }
    if(state.phase==='quiz'){
      const j=letters.findIndex(l=>l.toLowerCase()===key);
      if(j!==-1){event.preventDefault();doAnswer(j);return;}
      if(key==='enter'&&state.progress[currentTeam().id].correct){event.preventDefault();nextQuestion();}
    }
  });
  $('#homeLink').addEventListener('click',(event)=>{
    event.preventDefault();if(state.phase==='home')return;
    clearInterval(countdownTimer);state.returnPhase=['fastestCountdown','fastestLive'].includes(state.phase)?'estimate':state.phase;
    setPhase('home');
  });
  $('#soundToggle').addEventListener('click',()=>{
    state.muted=!state.muted;persist();
    $('#soundToggle').textContent=state.muted?'♪̸':'♫';
    $('#soundToggle').setAttribute('aria-pressed',String(!state.muted));
    $('#soundToggle').setAttribute('aria-label',state.muted?'Ton einschalten':'Ton ausschalten');
    if(!state.muted)beep(770,.1);
    const video=$('#outroVideo');if(video)video.muted=state.muted;
  });
  $('#resetButton').addEventListener('click',()=>reset(true));
  render();
})();
