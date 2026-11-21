// =========================================================================
// VA. ARQUITETURA & INTERIORES — CONTROLADOR UNIFICADO (FASE 1 + FASE 2)
// Jornada estética em 8 etapas (1 pergunta por tela) + Checklist Inteligente
// de Necessidades + Prioridades + Resumo Editável + Painel Privado Vidart.
// =========================================================================

(function () {
  const DATA = window.VA_DATA;
  const CHK = window.VA_CHECKLIST;
  const STORE = window.VA_STORAGE;

  let draft = STORE.loadDraft();
  let ui = {
    activeStyleGroup: null,
    lightingCompareSplit: 50,
    expandedChecklistQuestions: {}, // { [questionId]: true } para "Ver outras opções"
    adminAuthenticated: false,
    adminSelectedId: null,
    adminSearch: '',
    adminTab: 'records',
    submitFeedback: null,
    returnToReveal: false
  };

  const els = {
    brandHomeBtn: document.getElementById('brandHomeBtn'),
    topbarChapter: document.getElementById('topbarChapter'),
    chapterCode: document.getElementById('chapterCode'),
    chapterName: document.getElementById('chapterName'),
    chapterSub: document.getElementById('chapterSub'),
    progressBar: document.getElementById('progressBar'),
    journeyMain: document.getElementById('journeyMain'),
    stageContainer: document.getElementById('stageContainer'),
    journeyBar: document.getElementById('journeyBar'),
    prevStepBtn: document.getElementById('prevStepBtn'),
    nextStepBtn: document.getElementById('nextStepBtn'),
    nextStepLabel: document.getElementById('nextStepLabel'),
    journeyMeta: document.getElementById('journeyMeta'),
    lightboxModal: document.getElementById('lightboxModal'),
    lightboxImg: document.getElementById('lightboxImg'),
    lightboxTitle: document.getElementById('lightboxTitle'),
    lightboxDesc: document.getElementById('lightboxDesc'),
    lightboxCloseBtn: document.getElementById('lightboxCloseBtn'),
    openAdminBtn: document.getElementById('openAdminBtn'),
    adminModal: document.getElementById('adminModal'),
    adminCloseBtn: document.getElementById('adminCloseBtn'),
    adminBody: document.getElementById('adminBody')
  };

  // =========================================================================
  // UTILITÁRIOS
  // =========================================================================

  function escapeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function toggleInArray(arr, id) {
    const idx = arr.indexOf(id);
    if (idx >= 0) arr.splice(idx, 1);
    else arr.push(id);
  }

  function findById(list, id) {
    return (list || []).find((item) => item.id === id) || null;
  }

  function persist() {
    STORE.saveDraft(draft);
  }

  function markStepCompleted(step) {
    if (!draft.completedSteps.includes(step)) {
      draft.completedSteps.push(step);
    }
  }

  // =========================================================================
  // ESTRUTURA DE SUBETAPAS (1 PERGUNTA PRINCIPAL POR TELA)
  // =========================================================================

  function getStep8SubSteps() {
    const questions = CHK.buildChecklistQuestions(draft.projectContext);
    const markedNeeds = CHK.collectMarkedNeeds(questions, draft.checklist.answers);
    const subSteps = questions.map((q) => ({ type: 'checklist', question: q }));
    if (markedNeeds.length > 0) {
      subSteps.push({ type: 'priorities', needs: markedNeeds });
    }
    subSteps.push({ type: 'contact' });
    subSteps.push({ type: 'reveal' });
    return subSteps;
  }

  function getSubStepCount(step) {
    if (step === 2) return 3; // Ambientes, Estilos, Cores
    if (step === 5) return 2; // Simulador, Qualidades
    if (step === 6) return 3; // Sensações, Descanso, Especial
    if (step === 7) return 2; // Tipo/Perfil, Ambientes/Contexto
    if (step === 8) return getStep8SubSteps().length;
    return 1;
  }

  function goTo(step, subStep = 0, opts = {}) {
    const clampedStep = Math.max(1, Math.min(8, step));
    const maxSub = Math.max(0, getSubStepCount(clampedStep) - 1);
    const clampedSub = Math.max(0, Math.min(maxSub, subStep));

    if (draft.currentStep > 1) markStepCompleted(draft.currentStep);

    if (opts.returnToReveal) {
      ui.returnToReveal = true;
    } else if (clampedStep === 1 || (clampedStep === 8 && clampedSub === maxSub)) {
      ui.returnToReveal = false;
    }

    draft.currentStep = clampedStep;
    draft.currentSubStep = clampedSub;
    persist();
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function goToFinalReveal() {
    const step8Subs = getStep8SubSteps();
    goTo(8, step8Subs.length - 1);
  }

  function goNext() {
    if (ui.returnToReveal) {
      goToFinalReveal();
      return;
    }
    const step = draft.currentStep;
    const sub = draft.currentSubStep;
    const count = getSubStepCount(step);
    if (sub + 1 < count) {
      goTo(step, sub + 1);
    } else if (step < 8) {
      goTo(step + 1, 0);
    }
  }

  function goPrev() {
    if (ui.returnToReveal) {
      goToFinalReveal();
      return;
    }
    const step = draft.currentStep;
    const sub = draft.currentSubStep;
    if (sub > 0) {
      goTo(step, sub - 1);
    } else if (step > 1) {
      const prevStep = step - 1;
      const prevCount = getSubStepCount(prevStep);
      goTo(prevStep, prevCount - 1);
    }
  }

  // =========================================================================
  // MOTOR DE AFINIDADES & BÚSSOLA ESTÉTICA
  // =========================================================================

  function computeAffinityScores(selections) {
    const scores = {};
    const addTags = (tags, weight) => {
      (tags || []).forEach((t) => {
        scores[t] = (scores[t] || 0) + weight;
      });
    };
    selections.environments.forEach((id) => addTags(findById(DATA.environments, id)?.tags, 2));
    selections.styles.forEach((id) => addTags(findById(DATA.styles, id)?.tags, 3));
    selections.palettes.forEach((id) => addTags(findById(DATA.palettes, id)?.tags, 2));
    selections.materials.forEach((id) => addTags(findById(DATA.materials, id)?.tags, 2));
    selections.combinations.forEach((id) => addTags(findById(DATA.combinations, id)?.tags, 3));
    return scores;
  }

  function getSuggestedStyleGroup(scores) {
    let bestId = DATA.styleGroups[0].id;
    let bestScore = -1;
    DATA.styleGroups.forEach((g) => {
      const sc = g.tags.reduce((a, t) => a + (scores[t] || 0), 0);
      if (sc > bestScore) {
        bestScore = sc;
        bestId = g.id;
      }
    });
    return bestScore > 0 ? bestId : DATA.styleGroups[0].id;
  }

  function getRankedCombinations(scores) {
    const hasScores = Object.keys(scores).length > 0;
    return DATA.combinations
      .map((c, idx) => ({
        ...c,
        _score: c.tags.reduce((a, t) => a + (scores[t] || 0), 0),
        _idx: idx
      }))
      .sort((a, b) => (hasScores ? b._score - a._score || a._idx - b._idx : a._idx - b._idx));
  }

  function computeAestheticCompass(selections) {
    const scores = computeAffinityScores(selections);
    const ratio = (leftTags, rightTags) => {
      const l = leftTags.reduce((a, t) => a + (scores[t] || 0), 0);
      const r = rightTags.reduce((a, t) => a + (scores[t] || 0), 0);
      if (l === 0 && r === 0) return 50;
      return Math.round(18 + (r / (l + r)) * 64);
    };
    const lightBonus =
      selections.lightingScenario === 'intimista'
        ? 18
        : selections.lightingScenario === 'luz_indireta'
          ? 10
          : selections.lightingScenario === 'natural_abundante'
            ? -14
            : 0;
    const clamp = (v) => Math.max(15, Math.min(85, v));
    return [
      {
        left: 'Luminoso & Arejado',
        right: 'Intimista & Profundo',
        value: clamp(ratio(['claro', 'escandinavo', 'suave'], ['profundo', 'intimista', 'contraste']) + lightBonus)
      },
      {
        left: 'Pureza Minimalista',
        right: 'Riqueza Tátil',
        value: clamp(ratio(['minimalista', 'monocromatico'], ['organico', 'natural', 'terroso', 'rustico_sofisticado']))
      },
      {
        left: 'Fluidez Orgânica',
        right: 'Precisão Geométrica',
        value: clamp(ratio(['organico', 'suave', 'japandi'], ['moderno', 'industrial', 'contraste']))
      },
      {
        left: 'Atemporal Clássico',
        right: 'Expressão Contemporânea',
        value: clamp(ratio(['classico', 'neoclassico', 'elegante'], ['contemporaneo', 'moderno', 'ecletico']))
      }
    ];
  }

  function buildAestheticSynthesis() {
    const s = draft.selections;
    const styleTitles = s.styles.map((id) => findById(DATA.styles, id)?.title).filter(Boolean);
    const paletteTitles = s.palettes.map((id) => findById(DATA.palettes, id)?.title).filter(Boolean);
    const matTitles = s.materials.map((id) => findById(DATA.materials, id)?.title).filter(Boolean);
    const feelTitles = s.homeFeelings.map((id) => findById(DATA.homeFeelings, id)?.title).filter(Boolean);

    const headline =
      styleTitles.length >= 2
        ? `${styleTitles[0]} com nuances ${styleTitles[1].toLowerCase()}`
        : styleTitles.length === 1
          ? `Essência ${styleTitles[0]} com olhar autoral`
          : 'Curadoria Arquitetônica Personalizada';

    const parts = [];
    if (styleTitles.length) {
      parts.push(`Suas escolhas dialogam com ${styleTitles.slice(0, 3).join(', ')}, sem se limitar a um único rótulo.`);
    } else {
      parts.push('Suas escolhas revelam busca por equilíbrio espacial, proporção e conforto visual.');
    }
    if (paletteTitles.length) {
      parts.push(`Na paleta, destacam-se ${paletteTitles.slice(0, 2).join(' e ').toLowerCase()}.`);
    }
    if (matTitles.length) {
      parts.push(`Na materialidade, sobressaem ${matTitles.slice(0, 3).join(', ').toLowerCase()}.`);
    }
    if (feelTitles.length) {
      parts.push(`No jeito de viver, o espaço precisa despertar ${feelTitles.slice(0, 3).join(', ').toLowerCase()}.`);
    }

    return {
      headline,
      narrative: parts.join(' '),
      tags: [...styleTitles.slice(0, 3), ...feelTitles.slice(0, 2)].slice(0, 5)
    };
  }

  function buildChecklistSummary() {
    const questions = CHK.buildChecklistQuestions(draft.projectContext);
    const answers = draft.checklist.answers || {};
    const byRoom = [];
    const preserve = [];

    questions.forEach((q) => {
      const selectedIds = answers[q.id] || [];
      if (!selectedIds.length) return;
      const labels = selectedIds
        .map((oid) => q.options.find((o) => o.id === oid)?.label)
        .filter(Boolean);
      if (!labels.length) return;

      if (q.kind === 'preserve') {
        preserve.push(...labels);
      } else {
        byRoom.push({
          questionId: q.id,
          category: q.category,
          kind: q.kind,
          items: labels
        });
      }
    });

    const markedNeeds = CHK.collectMarkedNeeds(questions, answers);
    const topPriorities = (draft.checklist.priorities || [])
      .map((pid) => markedNeeds.find((n) => n.id === pid))
      .filter(Boolean);

    return { byRoom, preserve, topPriorities };
  }

  // =========================================================================
  // CHROME & INDICADOR DUPLO DE PROGRESSO (ex: 05/08 · 1/2)
  // =========================================================================

  function updateChrome() {
    const step = draft.currentStep;
    const sub = draft.currentSubStep;
    const subCount = getSubStepCount(step);
    const chapter = DATA.chapters.find((c) => c.step === step) || DATA.chapters[0];
    const isWelcome = step === 1;
    const step8Subs = step === 8 ? getStep8SubSteps() : [];
    const currentStep8Item = step === 8 ? step8Subs[sub] : null;
    const isFinalReveal = step === 8 && currentStep8Item?.type === 'reveal';
    const isChecklistLike =
      step === 8 && (currentStep8Item?.type === 'checklist' || currentStep8Item?.type === 'priorities');

    els.topbarChapter.hidden = isWelcome;
    els.chapterCode.textContent = `${chapter.code}/08`;
    els.chapterName.textContent = chapter.short;

    if (subCount > 1 && !isFinalReveal) {
      els.chapterSub.hidden = false;
      els.chapterSub.textContent = `${sub + 1}/${subCount}`;
    } else {
      els.chapterSub.hidden = true;
    }

    const overallProgress = ((step - 1) + (sub + 1) / subCount) / 8;
    els.progressBar.style.transform = `scaleX(${Math.max(0.08, Math.min(1, overallProgress))})`;

    els.journeyMain.classList.toggle('is-welcome', isWelcome);
    els.journeyBar.hidden = isWelcome;

    if (!isWelcome) {
      els.prevStepBtn.hidden = false;
      if (isFinalReveal) {
        els.nextStepBtn.hidden = true;
        els.journeyMeta.textContent = 'Resumo completo pronto — clique em Editar em qualquer bloco';
      } else if (ui.returnToReveal) {
        els.nextStepBtn.hidden = false;
        els.nextStepLabel.textContent = 'Salvar e voltar ao resumo';
        els.journeyMeta.textContent = 'Editando escolha · Atualização instantânea';
      } else {
        els.nextStepBtn.hidden = false;
        if (isChecklistLike) {
          els.nextStepLabel.textContent = 'OK, continuar';
        } else if (step === 8 && currentStep8Item?.type === 'contact') {
          els.nextStepLabel.textContent = 'Ver meu perfil completo';
        } else {
          els.nextStepLabel.textContent = 'Continuar';
        }
        els.journeyMeta.textContent =
          subCount > 1
            ? `Etapa ${chapter.code}/08 · Pergunta ${sub + 1} de ${subCount} · Salvo`
            : `Etapa ${chapter.code}/08 · Salvo automaticamente`;
      }
    }
  }

  // =========================================================================
  // COMPONENTES REUTILIZÁVEIS
  // =========================================================================

  function checkMarkHtml() {
    return `
      <span class="choice-card__check" aria-hidden="true">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </span>
    `;
  }

  function circleCheckHtml() {
    return `
      <span class="checklist-circle" aria-hidden="true">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </span>
    `;
  }

  function zoomBtnHtml(img, title, desc) {
    return `
      <button type="button" class="choice-card__zoom" data-zoom-img="${escapeHtml(img)}" data-zoom-title="${escapeHtml(title)}" data-zoom-desc="${escapeHtml(desc)}" aria-label="Ampliar imagem: ${escapeHtml(title)}">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          <line x1="11" y1="8" x2="11" y2="14"></line>
          <line x1="8" y1="11" x2="14" y2="11"></line>
        </svg>
      </button>
    `;
  }

  // =========================================================================
  // RENDERIZAÇÃO PRINCIPAL
  // =========================================================================

  function render() {
    const maxSub = Math.max(0, getSubStepCount(draft.currentStep) - 1);
    if (draft.currentSubStep > maxSub) draft.currentSubStep = maxSub;

    updateChrome();
    const step = draft.currentStep;
    const sub = draft.currentSubStep;
    let html = '';

    if (step === 1) html = renderStep1Welcome();
    else if (step === 2 && sub === 0) html = renderStep2Environments();
    else if (step === 2 && sub === 1) html = renderStep2Styles();
    else if (step === 2 && sub === 2) html = renderStep2Palettes();
    else if (step === 3) html = renderStep3Materials();
    else if (step === 4) html = renderStep4Combinations();
    else if (step === 5 && sub === 0) html = renderStep5LightingSimulator();
    else if (step === 5 && sub === 1) html = renderStep5LightingQualities();
    else if (step === 6 && sub === 0) html = renderStep6Feelings();
    else if (step === 6 && sub === 1) html = renderStep6RestSpaces();
    else if (step === 6 && sub === 2) html = renderStep6SpecialElements();
    else if (step === 7 && sub === 0) html = renderStep7ProjectType();
    else if (step === 7 && sub === 1) html = renderStep7ProjectRooms();
    else if (step === 8) {
      const step8Subs = getStep8SubSteps();
      const item = step8Subs[sub] || step8Subs[step8Subs.length - 1];
      if (item.type === 'checklist') html = renderChecklistQuestion(item.question, sub, step8Subs.length);
      else if (item.type === 'priorities') html = renderChecklistPriorities(item.needs);
      else if (item.type === 'contact') html = renderStep8Contact();
      else html = renderStep8Reveal();
    }

    if (ui.returnToReveal && step > 1) {
      html =
        `
        <div class="return-edit-banner" style="margin-top:1.1rem;margin-bottom:0;">
          <p class="return-edit-banner__text">
            <strong>Modo de ajuste:</strong> altere suas preferências e volte direto para o resumo final atualizado.
          </p>
          <button type="button" class="btn-primary" id="returnToRevealBannerBtn" style="background:var(--bronze);border-color:var(--bronze);padding:0.55rem 1.2rem;">
            Voltar ao resumo
          </button>
        </div>
      ` + html;
    }

    els.stageContainer.innerHTML = html;
    bindStageEvents();
  }

  // -----------------------------------------------------------------------
  // ETAPA 01/08 — BOAS-VINDAS
  // -----------------------------------------------------------------------
  function renderStep1Welcome() {
    const hasProgress =
      draft.selections.environments.length > 0 ||
      draft.selections.styles.length > 0 ||
      draft.completedSteps.length > 0;

    return `
      <section class="welcome-stage">
        <svg class="welcome-arc" viewBox="0 0 540 360" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M40 340C40 174.315 174.315 40 340 40C422.843 40 497.843 73.5786 552.132 127.868" stroke="#967751" stroke-width="1" stroke-opacity="0.38" />
          <path d="M110 350C110 222.975 212.975 120 340 120C410 120 472 151 514 200" stroke="#221E1A" stroke-width="0.8" stroke-opacity="0.16" />
        </svg>

        <div class="welcome-copy">
          <p class="eyebrow">Curadoria Estética · VA Arquitetura e Interiores</p>
          <h1 class="welcome-headline">
            Todo espaço começa com uma forma única de <em>sentir.</em>
          </h1>
          <p class="welcome-sub">
            Vamos descobrir os detalhes que tornam um ambiente verdadeiramente seu e entender o que o seu espaço precisa resolver no dia a dia.
          </p>
          <div class="welcome-actions">
            <button type="button" class="btn-primary" id="startJourneyBtn">
              <span>${hasProgress ? 'Continuar minha descoberta' : 'Começar minha descoberta'}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
            ${hasProgress ? `<button type="button" class="btn-link-subtle" id="resetDraftWelcomeBtn">Recomeçar do zero</button>` : ''}
          </div>
          <p class="welcome-note">8 etapas breves · 1 pergunta por tela · Salvo automaticamente</p>
        </div>

        <div class="welcome-visual">
          <div class="welcome-frame">
            <img src="${DATA.welcomeHeroImage}" alt="Sala de estar em gesso mineral, linho cru e carvalho sob luz natural" />
          </div>
        </div>
      </section>
    `;
  }

  // -----------------------------------------------------------------------
  // ETAPA 02/08 — DESCOBERTA ESTÉTICA (1/3 Ambientes, 2/3 Estilos, 3/3 Cores)
  // -----------------------------------------------------------------------
  function renderStep2Environments() {
    const selected = draft.selections.environments;
    return `
      <section class="stage-shell">
        <div class="stage-header">
          <p class="eyebrow">Etapa 02/08 · Descoberta Estética (1/3)</p>
          <h1 class="stage-title">Em qual destes espaços você gostaria de <em>estar?</em></h1>
          <p class="stage-lead">Observe a luz, as proporções e a sensação de cada ambiente.</p>
          <p class="stage-question">Selecione um ou mais ambientes que despertem afinidade imediata.</p>
        </div>

        <div class="visual-grid">
          ${DATA.environments
            .map((env) => {
              const isSel = selected.includes(env.id);
              return `
                <article class="choice-card ${isSel ? 'is-selected' : ''}" tabindex="0" role="checkbox" aria-checked="${isSel}" data-select-type="environments" data-id="${env.id}">
                  <div class="choice-card__media">
                    <img src="${env.image}" alt="${escapeHtml(env.title)}" loading="lazy" />
                    <span class="choice-card__badge">${escapeHtml(env.atmosphere)}</span>
                    ${checkMarkHtml()}
                    ${zoomBtnHtml(env.image, env.title, env.subtitle)}
                  </div>
                  <div class="choice-card__body">
                    <h2 class="choice-card__title">${escapeHtml(env.title)}</h2>
                    <p class="choice-card__desc">${escapeHtml(env.subtitle)}</p>
                  </div>
                </article>
              `;
            })
            .join('')}
        </div>
      </section>
    `;
  }

  function renderStep2Styles() {
    const scores = computeAffinityScores(draft.selections);
    const suggestedGroupId = getSuggestedStyleGroup(scores);
    if (!ui.activeStyleGroup) ui.activeStyleGroup = suggestedGroupId;
    const activeGroup = DATA.styleGroups.find((g) => g.id === ui.activeStyleGroup) || DATA.styleGroups[0];
    const groupStyles = DATA.styles.filter((st) => st.groupId === activeGroup.id);

    return `
      <section class="stage-shell">
        <div class="stage-header">
          <p class="eyebrow">Etapa 02/08 · Descoberta Estética (2/3)</p>
          <h1 class="stage-title">Quais linguagens arquitetônicas conversam com <em>você?</em></h1>
          <p class="stage-lead">Você pode combinar estilos de famílias diferentes — projetos autorais nascem de referências híbridas.</p>
        </div>

        <div class="group-tabs" role="tablist" aria-label="Famílias de estilo">
          ${DATA.styleGroups
            .map((g) => {
              const count = DATA.styles.filter(
                (st) => st.groupId === g.id && draft.selections.styles.includes(st.id)
              ).length;
              const isSuggested = g.id === suggestedGroupId && draft.selections.environments.length > 0;
              return `
                <button type="button" class="group-tab ${g.id === activeGroup.id ? 'is-active' : ''}" role="tab" aria-selected="${g.id === activeGroup.id}" data-style-group="${g.id}">
                  <span>${escapeHtml(g.title)}</span>
                  ${isSuggested ? `<span class="group-tab__tag">Em sintonia</span>` : ''}
                  ${count > 0 ? `<span class="group-tab__count">${count}</span>` : ''}
                </button>
              `;
            })
            .join('')}
        </div>

        <p class="group-intro">${escapeHtml(activeGroup.subtitle)}</p>

        <div class="visual-grid ${groupStyles.length === 4 ? 'visual-grid--2' : ''}">
          ${groupStyles
            .map((st) => {
              const isSel = draft.selections.styles.includes(st.id);
              return `
                <article class="choice-card ${isSel ? 'is-selected' : ''}" tabindex="0" role="checkbox" aria-checked="${isSel}" data-select-type="styles" data-id="${st.id}">
                  <div class="choice-card__media">
                    <img src="${st.image}" alt="${escapeHtml(st.title)}" loading="lazy" />
                    ${checkMarkHtml()}
                    ${zoomBtnHtml(st.image, st.title, st.desc)}
                  </div>
                  <div class="choice-card__body">
                    <h2 class="choice-card__title">${escapeHtml(st.title)}</h2>
                    <p class="choice-card__desc">${escapeHtml(st.desc)}</p>
                  </div>
                </article>
              `;
            })
            .join('')}
        </div>
      </section>
    `;
  }

  function renderStep2Palettes() {
    const selected = draft.selections.palettes;
    return `
      <section class="stage-shell">
        <div class="stage-header">
          <p class="eyebrow">Etapa 02/08 · Descoberta Estética (3/3)</p>
          <h1 class="stage-title">Quais paletas traduzem a <em>sensação</em> que você procura?</h1>
          <p class="stage-lead">Observe como cada família de cores altera a percepção do ambiente.</p>
          <p class="stage-question">Selecione uma ou mais paletas preferidas.</p>
        </div>

        <div class="visual-grid">
          ${DATA.palettes
            .map((pal) => {
              const isSel = selected.includes(pal.id);
              return `
                <article class="choice-card ${isSel ? 'is-selected' : ''}" tabindex="0" role="checkbox" aria-checked="${isSel}" data-select-type="palettes" data-id="${pal.id}">
                  <div class="choice-card__media">
                    <img src="${pal.image}" alt="${escapeHtml(pal.title)}" loading="lazy" />
                    <span class="choice-card__badge">${escapeHtml(pal.feeling)}</span>
                    ${checkMarkHtml()}
                    ${zoomBtnHtml(pal.image, pal.title, pal.desc)}
                  </div>
                  <div class="choice-card__body">
                    <h2 class="choice-card__title">${escapeHtml(pal.title)}</h2>
                    <p class="choice-card__desc">${escapeHtml(pal.desc)}</p>
                    <div class="swatch-bar">
                      ${pal.colors.map((c) => `<span style="background:${c}"></span>`).join('')}
                    </div>
                  </div>
                </article>
              `;
            })
            .join('')}
        </div>
      </section>
    `;
  }

  // -----------------------------------------------------------------------
  // ETAPA 03/08 — MATERIAIS E TEXTURAS (múltipla escolha)
  // -----------------------------------------------------------------------
  function renderStep3Materials() {
    const selected = draft.selections.materials;
    return `
      <section class="stage-shell">
        <div class="stage-header">
          <p class="eyebrow">Etapa 03/08 · Materiais e Texturas</p>
          <h1 class="stage-title">Quais superfícies despertam sua <em>identificação?</em></h1>
          <p class="stage-lead">Observe relevo, acabamento e comportamento da luz em cada material.</p>
          <p class="stage-question">Marque quantos materiais desejar.</p>
        </div>

        <div class="visual-grid">
          ${DATA.materials
            .map((mat) => {
              const isSel = selected.includes(mat.id);
              return `
                <article class="choice-card ${isSel ? 'is-selected' : ''}" tabindex="0" role="checkbox" aria-checked="${isSel}" data-select-type="materials" data-id="${mat.id}">
                  <div class="choice-card__media">
                    <img src="${mat.image}" alt="${escapeHtml(mat.title)}" loading="lazy" />
                    <span class="choice-card__badge">${escapeHtml(mat.category)}</span>
                    ${checkMarkHtml()}
                    ${zoomBtnHtml(mat.image, mat.title, `${mat.finish} — ${mat.desc}`)}
                  </div>
                  <div class="choice-card__body">
                    <div class="material-head-row">
                      <h2 class="choice-card__title">${escapeHtml(mat.title)}</h2>
                      <span class="material-swatch-chip" style="background:${mat.swatch}" aria-hidden="true"></span>
                    </div>
                    <span class="choice-card__kicker">${escapeHtml(mat.finish)}</span>
                    <p class="choice-card__desc">${escapeHtml(mat.desc)}</p>
                  </div>
                </article>
              `;
            })
            .join('')}
        </div>
      </section>
    `;
  }

  // -----------------------------------------------------------------------
  // ETAPA 04/08 — COMBINAÇÕES DE MATERIAIS (múltipla escolha + compositor)
  // -----------------------------------------------------------------------
  function renderStep4Combinations() {
    const scores = computeAffinityScores(draft.selections);
    const ranked = getRankedCombinations(scores);
    const selected = draft.selections.combinations;
    const custom = draft.selections.customCombination;

    const stoneItem = findById(DATA.composerSlots.stone, custom.stone);
    const woodItem = findById(DATA.composerSlots.wood, custom.wood);
    const accentItem = findById(DATA.composerSlots.accent, custom.accent);

    return `
      <section class="stage-shell">
        <div class="stage-header">
          <p class="eyebrow">Etapa 04/08 · Combinações de Materiais</p>
          <h1 class="stage-title">Quais composições produzem a sensação que você <em>procura?</em></h1>
          <p class="stage-lead">Ordenamos sugestões com base nas suas escolhas anteriores. Selecione uma ou mais combinações.</p>
        </div>

        <div class="visual-grid">
          ${ranked
            .map((cmb, i) => {
              const isSel = selected.includes(cmb.id);
              const isSuggested = i < 2 && cmb._score > 0;
              return `
                <article class="choice-card ${isSel ? 'is-selected' : ''}" tabindex="0" role="checkbox" aria-checked="${isSel}" data-select-type="combinations" data-id="${cmb.id}">
                  <div class="choice-card__media">
                    <img src="${cmb.image}" alt="${escapeHtml(cmb.title)}" loading="lazy" />
                    ${isSuggested ? `<span class="choice-card__badge choice-card__badge--suggested">Sugerido para você</span>` : ''}
                    ${checkMarkHtml()}
                    ${zoomBtnHtml(cmb.image, cmb.title, cmb.desc)}
                  </div>
                  <div class="choice-card__body">
                    <h2 class="choice-card__title">${escapeHtml(cmb.title)}</h2>
                    <p class="choice-card__desc">${escapeHtml(cmb.desc)}</p>
                    <div class="swatch-bar">
                      ${cmb.swatches.map((hex) => `<span style="background:${hex}"></span>`).join('')}
                    </div>
                  </div>
                </article>
              `;
            })
            .join('')}
        </div>

        <div class="composer-box">
          <p class="eyebrow" style="margin-bottom:0.4rem;">Opcional · Compositor</p>
          <h2 style="font-family:var(--font-display);font-size:1.65rem;font-weight:400;">Ou monte sua própria tríade</h2>
          <div class="composer-grid">
            ${[
              { key: 'stone', title: '1. Pedra / Base', items: DATA.composerSlots.stone },
              { key: 'wood', title: '2. Madeira', items: DATA.composerSlots.wood },
              { key: 'accent', title: '3. Têxtil & Metal', items: DATA.composerSlots.accent }
            ]
              .map(
                (col) => `
              <div>
                <h3 class="composer-col__title">${col.title}</h3>
                <div class="composer-options">
                  ${col.items
                    .map(
                      (item) => `
                    <button type="button" class="composer-opt ${custom[col.key] === item.id ? 'is-selected' : ''}" data-composer-slot="${col.key}" data-composer-id="${item.id}">
                      <span class="composer-opt__dot" style="background:${item.swatch}"></span>
                      <span>${escapeHtml(item.label)}</span>
                    </button>
                  `
                    )
                    .join('')}
                </div>
              </div>
            `
              )
              .join('')}
          </div>
          ${
            stoneItem || woodItem || accentItem
              ? `
            <div class="composer-preview">
              <div class="composer-trio">
                <div class="composer-trio__bar">
                  <span style="background:${stoneItem ? stoneItem.swatch : '#EFE9DF'}"></span>
                  <span style="background:${woodItem ? woodItem.swatch : '#EFE9DF'}"></span>
                  <span style="background:${accentItem ? accentItem.swatch : '#EFE9DF'}"></span>
                </div>
                <p style="font-size:0.88rem;color:var(--ink-primary);">
                  ${[stoneItem?.label, woodItem?.label, accentItem?.label].filter(Boolean).join(' + ')}
                </p>
              </div>
              <button type="button" class="btn-link-subtle" id="clearComposerBtn">Limpar</button>
            </div>
          `
              : ''
          }
        </div>
      </section>
    `;
  }

  // -----------------------------------------------------------------------
  // ETAPA 05/08 — ILUMINAÇÃO E ATMOSFERA (1/2 Simulador, 2/2 Qualidades)
  // -----------------------------------------------------------------------
  function renderStep5LightingSimulator() {
    const activeScenario =
      findById(DATA.lightingScenarios, draft.selections.lightingScenario) || DATA.lightingScenarios[0];
    const baseScenario = DATA.lightingScenarios[0];
    const split = ui.lightingCompareSplit;

    return `
      <section class="stage-shell">
        <div class="stage-header">
          <p class="eyebrow">Etapa 05/08 · Iluminação e Atmosfera (1/2)</p>
          <h1 class="stage-title">Qual clima de luz mais combina com <em>você?</em></h1>
          <p class="stage-lead">Compare o mesmo ambiente preservando materiais e geometria. Arraste o divisor na imagem.</p>
        </div>

        <div class="lighting-studio">
          <div>
            <div class="lighting-viewport" id="lightingViewport">
              <div class="lighting-layer">
                <img src="${DATA.lightingBaseImage}" alt="Ambiente com ${escapeHtml(activeScenario.title)}" style="filter:${activeScenario.filter};" />
                <div class="lighting-layer__wash" style="background:${activeScenario.overlay};"></div>
              </div>
              <div class="lighting-layer lighting-layer--compare" id="lightingCompareLayer" style="clip-path:inset(0 ${100 - split}% 0 0);">
                <img src="${DATA.lightingBaseImage}" alt="Referência em luz natural" style="filter:${baseScenario.filter};" />
                <div class="lighting-layer__wash" style="background:${baseScenario.overlay};"></div>
              </div>
              <span class="lighting-label lighting-label--left">Luz Natural · 5000K</span>
              <span class="lighting-label lighting-label--right">${escapeHtml(activeScenario.title)}</span>
              <div class="lighting-divider" id="lightingDivider" style="left:${split}%;">
                <div class="lighting-divider__handle" aria-hidden="true">⇄</div>
              </div>
              <input type="range" min="5" max="95" value="${split}" class="lighting-range" id="lightingRange" aria-label="Comparar luz natural com cenário escolhido" />
            </div>
          </div>

          <div class="lighting-controls" role="radiogroup" aria-label="Cenários de iluminação">
            ${DATA.lightingScenarios
              .map(
                (sc) => `
              <button type="button" class="scenario-btn ${sc.id === activeScenario.id ? 'is-active' : ''}" role="radio" aria-checked="${sc.id === activeScenario.id}" data-lighting-scenario="${sc.id}">
                <div class="scenario-btn__top">
                  <span class="scenario-btn__title">${escapeHtml(sc.title)}</span>
                  <span class="scenario-btn__kelvin">${escapeHtml(sc.kelvin)}</span>
                </div>
                <p class="scenario-btn__desc">${escapeHtml(sc.desc)}</p>
              </button>
            `
              )
              .join('')}
          </div>
        </div>
      </section>
    `;
  }

  function renderStep5LightingQualities() {
    return `
      <section class="checklist-shell">
        <div class="checklist-header">
          <p class="eyebrow">Etapa 05/08 · Iluminação e Atmosfera (2/2)</p>
          <h1 class="checklist-prompt">Quais efeitos de luz você valoriza nos ambientes?</h1>
          <p class="checklist-instruction">Marque o que se aplica</p>
        </div>

        <div class="checklist-list">
          ${DATA.lightingPreferences
            .map((lp) => {
              const isSel = draft.selections.lightingPreferences.includes(lp.id);
              return `
                <button type="button" class="checklist-row ${isSel ? 'is-selected' : ''}" aria-pressed="${isSel}" data-select-type="lightingPreferences" data-id="${lp.id}">
                  ${circleCheckHtml()}
                  <span class="checklist-row__content">
                    <span class="checklist-row__label">${escapeHtml(lp.title)}</span>
                    <span style="font-size:0.82rem;color:var(--ink-muted);">${escapeHtml(lp.desc)}</span>
                  </span>
                </button>
              `;
            })
            .join('')}
        </div>
      </section>
    `;
  }

  // -----------------------------------------------------------------------
  // ETAPA 06/08 — SEU JEITO DE VIVER (1/3 Sensações, 2/3 Descanso, 3/3 Especial)
  // -----------------------------------------------------------------------
  function renderStep6Feelings() {
    return `
      <section class="checklist-shell">
        <div class="checklist-header">
          <p class="eyebrow">Etapa 06/08 · Seu Jeito de Viver (1/3)</p>
          <h1 class="checklist-prompt">Como você gostaria de se sentir ao chegar em casa?</h1>
          <p class="checklist-instruction">Marque o que se aplica</p>
        </div>

        <div class="checklist-list">
          ${DATA.homeFeelings
            .map((f) => {
              const isSel = draft.selections.homeFeelings.includes(f.id);
              return `
                <button type="button" class="checklist-row ${isSel ? 'is-selected' : ''}" aria-pressed="${isSel}" data-select-type="homeFeelings" data-id="${f.id}">
                  ${circleCheckHtml()}
                  <span class="checklist-row__content">
                    <span class="checklist-row__label">${escapeHtml(f.title)}</span>
                    <span style="font-size:0.82rem;color:var(--ink-muted);">${escapeHtml(f.desc)}</span>
                  </span>
                </button>
              `;
            })
            .join('')}
        </div>
      </section>
    `;
  }

  function renderStep6RestSpaces() {
    return `
      <section class="stage-shell">
        <div class="stage-header">
          <p class="eyebrow">Etapa 06/08 · Seu Jeito de Viver (2/3)</p>
          <h1 class="stage-title">Qual espaço representa melhor o seu momento de <em>descanso?</em></h1>
          <p class="stage-lead">Escolha a cena que mais se aproxima de como você gosta de desacelerar.</p>
        </div>

        <div class="visual-grid visual-grid--2">
          ${DATA.restSpaces
            .map((rs) => {
              const isSel = draft.selections.restSpace === rs.id;
              return `
                <article class="choice-card ${isSel ? 'is-selected' : ''}" tabindex="0" role="radio" aria-checked="${isSel}" data-rest-space="${rs.id}">
                  <div class="choice-card__media">
                    <img src="${rs.image}" alt="${escapeHtml(rs.title)}" loading="lazy" />
                    ${checkMarkHtml()}
                  </div>
                  <div class="choice-card__body">
                    <h2 class="choice-card__title">${escapeHtml(rs.title)}</h2>
                    <p class="choice-card__desc">${escapeHtml(rs.desc)}</p>
                  </div>
                </article>
              `;
            })
            .join('')}
        </div>
      </section>
    `;
  }

  function renderStep6SpecialElements() {
    return `
      <section class="checklist-shell">
        <div class="checklist-header">
          <p class="eyebrow">Etapa 06/08 · Seu Jeito de Viver (3/3)</p>
          <h1 class="checklist-prompt">O que faz um ambiente ser especial para você?</h1>
          <p class="checklist-instruction">Marque o que se aplica</p>
        </div>

        <div class="checklist-list">
          ${DATA.specialElements
            .map((el) => {
              const isSel = draft.selections.specialElements.includes(el.id);
              return `
                <button type="button" class="checklist-row ${isSel ? 'is-selected' : ''}" aria-pressed="${isSel}" data-select-type="specialElements" data-id="${el.id}">
                  ${circleCheckHtml()}
                  <span class="checklist-row__label">${escapeHtml(el.label)}</span>
                </button>
              `;
            })
            .join('')}
        </div>
      </section>
    `;
  }

  // -----------------------------------------------------------------------
  // ETAPA 07/08 — SEU PROJETO (1/2 Tipo & Perfil, 2/2 Ambientes & Contexto)
  // -----------------------------------------------------------------------
  function renderStep7ProjectType() {
    const p = draft.projectContext;
    return `
      <section class="checklist-shell">
        <div class="checklist-header">
          <p class="eyebrow">Etapa 07/08 · Seu Projeto (1/2)</p>
          <h1 class="checklist-prompt">Qual é o tipo de projeto que você vai realizar?</h1>
          <p class="checklist-instruction">Suas escolhas aqui definem apenas as perguntas realmente úteis na próxima etapa.</p>
        </div>

        <div class="checklist-list">
          ${DATA.projectOptions.types
            .map((t) => {
              const isSel = p.projectType === t.id;
              return `
                <button type="button" class="checklist-row ${isSel ? 'is-selected' : ''}" role="radio" aria-checked="${isSel}" data-ctx-single="projectType" data-ctx-val="${escapeHtml(t.id)}">
                  ${circleCheckHtml()}
                  <span class="checklist-row__content">
                    <span class="checklist-row__label">${escapeHtml(t.label)}</span>
                    <span style="font-size:0.82rem;color:var(--ink-muted);">${escapeHtml(t.desc)}</span>
                  </span>
                </button>
              `;
            })
            .join('')}
        </div>

        <div style="margin-top:1.75rem;">
          <span class="field-label" style="display:block;margin-bottom:0.65rem;">Natureza do imóvel</span>
          <div class="chip-wrap">
            ${DATA.projectOptions.categories
              .map(
                (cat) => `
              <button type="button" class="chip-btn ${p.propertyCategory === cat.id ? 'is-selected' : ''}" data-ctx-single="propertyCategory" data-ctx-val="${escapeHtml(cat.id)}">${escapeHtml(cat.label)}</button>
            `
              )
              .join('')}
          </div>
        </div>

        ${
          p.projectType === 'Interiores'
            ? `
          <div style="margin-top:1.5rem;">
            <span class="field-label" style="display:block;margin-bottom:0.65rem;">Situação atual do imóvel</span>
            <div class="chip-wrap">
              ${DATA.projectOptions.interiorStatuses
                .map(
                  (st) => `
                <button type="button" class="chip-btn ${p.interiorStatus === st.id ? 'is-selected' : ''}" data-ctx-single="interiorStatus" data-ctx-val="${escapeHtml(st.id)}">${escapeHtml(st.label)}</button>
              `
                )
                .join('')}
            </div>
          </div>
        `
            : ''
        }

        ${
          p.propertyCategory === 'Comercial'
            ? `
          <div style="margin-top:1.5rem;">
            <span class="field-label" style="display:block;margin-bottom:0.65rem;">Atividade do estabelecimento</span>
            <div class="chip-wrap">
              ${DATA.projectOptions.commercialSegments
                .map(
                  (seg) => `
                <button type="button" class="chip-btn ${p.commercialSegment === seg.id ? 'is-selected' : ''}" data-ctx-single="commercialSegment" data-ctx-val="${escapeHtml(seg.id)}">${escapeHtml(seg.label)}</button>
              `
                )
                .join('')}
            </div>
          </div>
        `
            : ''
        }
      </section>
    `;
  }

  function renderStep7ProjectRooms() {
    const p = draft.projectContext;
    const isCommercial = p.propertyCategory === 'Comercial';

    return `
      <section class="checklist-shell">
        <div class="checklist-header">
          <p class="eyebrow">Etapa 07/08 · Seu Projeto (2/2)</p>
          <h1 class="checklist-prompt">${
            isCommercial ? 'Localização e prazo do espaço comercial' : 'Quais ambientes farão parte do projeto?'
          }</h1>
          <p class="checklist-instruction">${
            isCommercial
              ? 'Informe o contexto básico para direcionarmos o levantamento comercial.'
              : 'Exibiremos perguntas apenas sobre os ambientes que você marcar abaixo.'
          }</p>
        </div>

        ${
          !isCommercial
            ? `
          <div class="chip-wrap" style="margin-bottom:1.75rem;">
            ${DATA.projectOptions.rooms
              .map(
                (rm) => `
              <button type="button" class="chip-btn ${p.rooms.includes(rm.id) ? 'is-selected' : ''}" data-ctx-room="${rm.id}">${escapeHtml(rm.label)}</button>
            `
              )
              .join('')}
          </div>

          <div style="margin-bottom:1.75rem;">
            <span class="field-label" style="display:block;margin-bottom:0.65rem;">Situações específicas do dia a dia <span class="field-optional">(opcional)</span></span>
            <div class="chip-wrap">
              ${DATA.projectOptions.contextFlags
                .map(
                  (fl) => `
                <button type="button" class="chip-btn ${p.contextFlags.includes(fl.id) ? 'is-selected' : ''}" data-ctx-flag="${fl.id}">${escapeHtml(fl.label)}</button>
              `
                )
                .join('')}
            </div>
          </div>
        `
            : ''
        }

        <div class="form-grid">
          <div class="field-group">
            <label class="field-label" for="ctxCity">Cidade e bairro <span class="field-optional">(opcional)</span></label>
            <input class="field-input" id="ctxCity" type="text" placeholder="Ex: São Paulo, Jardins" value="${escapeHtml(p.city)}" data-ctx-input="city" />
          </div>
          <div class="field-group">
            <label class="field-label" for="ctxTimeline">Prazo previsto <span class="field-optional">(opcional)</span></label>
            <select class="field-select" id="ctxTimeline" data-ctx-input="timeline">
              <option value="">Selecione se já tiver previsão</option>
              ${DATA.projectOptions.timelines
                .map((tl) => `<option value="${escapeHtml(tl)}" ${p.timeline === tl ? 'selected' : ''}>${escapeHtml(tl)}</option>`)
                .join('')}
            </select>
          </div>
        </div>
      </section>
    `;
  }

  // -----------------------------------------------------------------------
  // FASE 2 — ETAPA 08/08: CHECKLIST INTELIGENTE (1 PERGUNTA POR TELA)
  // -----------------------------------------------------------------------
  function renderChecklistQuestion(question, subIdx, totalSubs) {
    // Registra pergunta exibida no cadastro estruturado
    if (!draft.checklist.displayedQuestionIds.includes(question.id)) {
      draft.checklist.displayedQuestionIds.push(question.id);
      persist();
    }

    const selectedIds = draft.checklist.answers[question.id] || [];
    const regularOpts = question.options.filter((o) => !o.exclusive);
    const exclusiveOpts = question.options.filter((o) => o.exclusive);

    const isExpanded = Boolean(ui.expandedChecklistQuestions[question.id]);
    const MAX_VISIBLE = 5;
    const hasOverflow = regularOpts.length > MAX_VISIBLE;
    const visibleRegular = hasOverflow && !isExpanded ? regularOpts.slice(0, MAX_VISIBLE) : regularOpts;
    const hiddenCount = regularOpts.length - visibleRegular.length;

    return `
      <section class="checklist-shell">
        <div class="checklist-header">
          <p class="eyebrow">Etapa 08/08 · ${escapeHtml(question.category)}</p>
          <h1 class="checklist-prompt">${escapeHtml(question.prompt)}</h1>
          <p class="checklist-instruction">${escapeHtml(question.instruction)}</p>
        </div>

        <div class="checklist-list" role="${question.mode === 'single' ? 'radiogroup' : 'group'}" aria-label="${escapeHtml(question.prompt)}">
          ${visibleRegular
            .map((opt) => {
              const isSel = selectedIds.includes(opt.id);
              return `
                <button type="button" class="checklist-row ${isSel ? 'is-selected' : ''}" role="${question.mode === 'single' ? 'radio' : 'checkbox'}" aria-checked="${isSel}" data-chk-q="${question.id}" data-chk-opt="${opt.id}">
                  ${circleCheckHtml()}
                  <span class="checklist-row__label">${escapeHtml(opt.label)}</span>
                </button>
              `;
            })
            .join('')}

          ${
            hasOverflow && !isExpanded
              ? `
            <div>
              <button type="button" class="checklist-more-btn" data-expand-q="${question.id}">
                Ver outras opções (+${hiddenCount})
              </button>
            </div>
          `
              : ''
          }

          ${
            exclusiveOpts.length
              ? `
            <div class="checklist-divider" aria-hidden="true"></div>
            ${exclusiveOpts
              .map((opt) => {
                const isSel = selectedIds.includes(opt.id);
                return `
                  <button type="button" class="checklist-row ${isSel ? 'is-selected' : ''}" role="checkbox" aria-checked="${isSel}" data-chk-q="${question.id}" data-chk-opt="${opt.id}">
                    ${circleCheckHtml()}
                    <span class="checklist-row__label">${escapeHtml(opt.label)}</span>
                  </button>
                `;
              })
              .join('')}
          `
              : ''
          }
        </div>
      </section>
    `;
  }

  // PRIORIDADES — "O que é mais importante resolver?" (até 3)
  function renderChecklistPriorities(markedNeeds) {
    const validIds = new Set(markedNeeds.map((n) => n.id));
    draft.checklist.priorities = (draft.checklist.priorities || []).filter((id) => validIds.has(id));
    const prios = draft.checklist.priorities;

    return `
      <section class="checklist-shell">
        <div class="checklist-header">
          <p class="eyebrow">Etapa 08/08 · Prioridades</p>
          <h1 class="checklist-prompt">O que é mais importante resolver?</h1>
          <p class="checklist-instruction">Destaque até 3 prioridades entre as necessidades que você marcou.</p>
        </div>

        <div class="priority-counter">${prios.length} / 3 prioridades destacadas</div>

        <div class="checklist-list">
          ${markedNeeds
            .map((need) => {
              const rankIdx = prios.indexOf(need.id);
              const isSel = rankIdx >= 0;
              const isBlocked = !isSel && prios.length >= 3;
              return `
                <button type="button" class="checklist-row ${isSel ? 'is-selected' : ''} ${isBlocked ? 'is-disabled' : ''}" aria-pressed="${isSel}" data-prio-id="${escapeHtml(need.id)}">
                  ${isSel ? `<span class="priority-badge-num">${rankIdx + 1}</span>` : circleCheckHtml()}
                  <span class="checklist-row__content">
                    <span class="checklist-row__tag">${escapeHtml(need.category)}</span>
                    <span class="checklist-row__label">${escapeHtml(need.label)}</span>
                  </span>
                </button>
              `;
            })
            .join('')}
        </div>
      </section>
    `;
  }

  // CONTATO FINAL + OBSERVAÇÕES + LGPD (antes do resumo final)
  function renderStep8Contact() {
    const c = draft.client;
    return `
      <section class="checklist-shell">
        <div class="checklist-header">
          <p class="eyebrow">Etapa 08/08 · Últimos Detalhes</p>
          <h1 class="checklist-prompt">Deseja acrescentar alguma observação antes do seu resumo?</h1>
          <p class="checklist-instruction">Se quiser enviar seu perfil para a equipe da Vidart, preencha seu contato abaixo.</p>
        </div>

        <div class="form-card">
          <div class="field-group">
            <label class="field-label" for="chkNotes">Observações adicionais <span class="field-optional">(opcional)</span></label>
            <textarea class="field-textarea" id="chkNotes" placeholder="Algum detalhe importante da rotina, restrição do imóvel ou referência extra...">${escapeHtml(draft.checklist.notes || '')}</textarea>
          </div>

          <div class="form-grid">
            <div class="field-group">
              <label class="field-label" for="clientName">Seu nome</label>
              <input class="field-input" id="clientName" type="text" placeholder="Como podemos lhe chamar?" value="${escapeHtml(c.name)}" data-client-input="name" />
            </div>
            <div class="field-group">
              <label class="field-label" for="clientPhone">WhatsApp ou telefone <span class="field-optional">(opcional)</span></label>
              <input class="field-input" id="clientPhone" type="tel" placeholder="(00) 00000-0000" value="${escapeHtml(c.phone)}" data-client-input="phone" />
            </div>
            <div class="field-group field-group--full">
              <label class="field-label" for="clientEmail">E-mail <span class="field-optional">(opcional)</span></label>
              <input class="field-input" id="clientEmail" type="email" placeholder="voce@exemplo.com" value="${escapeHtml(c.email)}" data-client-input="email" />
            </div>
          </div>

          <label class="lgpd-box">
            <input type="checkbox" id="lgpdConsentCheck" ${c.lgpdConsent ? 'checked' : ''} />
            <span class="lgpd-box__text">
              <strong>Privacidade e LGPD:</strong> Concordo que a <strong>VA Arquitetura e Interiores</strong> armazene minhas preferências estéticas, necessidades levantadas e dados de contato exclusivamente para elaboração do briefing do meu projeto. Posso atualizar ou excluir meus dados a qualquer momento.
            </span>
          </label>
        </div>
      </section>
    `;
  }

  // -----------------------------------------------------------------------
  // TELA FINAL — IDENTIDADE ESTÉTICA + RESUMO COMPLETO DO CHECKLIST + EDITAR
  // -----------------------------------------------------------------------
  function renderStep8Reveal() {
    const s = draft.selections;
    const p = draft.projectContext;
    const c = draft.client;
    const synthesis = buildAestheticSynthesis();
    const compass = computeAestheticCompass(s);
    const chkSummary = buildChecklistSummary();

    const firstName = (c.name || '').trim().split(/\s+/)[0];
    const greetingTitle = firstName
      ? `${escapeHtml(firstName)}, aqui está a síntese do seu olhar e do seu projeto.`
      : 'Aqui está a síntese do seu olhar e do seu projeto.';

    const chosenEnvs = s.environments.map((id) => findById(DATA.environments, id)).filter(Boolean);
    const chosenStyles = s.styles.map((id) => findById(DATA.styles, id)).filter(Boolean);
    const chosenPalettes = s.palettes.map((id) => findById(DATA.palettes, id)).filter(Boolean);
    const chosenMaterials = s.materials.map((id) => findById(DATA.materials, id)).filter(Boolean);
    const chosenCombos = s.combinations.map((id) => findById(DATA.combinations, id)).filter(Boolean);
    const activeScenario = findById(DATA.lightingScenarios, s.lightingScenario) || DATA.lightingScenarios[0];
    const chosenFeelings = s.homeFeelings.map((id) => findById(DATA.homeFeelings, id)).filter(Boolean);
    const roomLabels = (p.rooms || []).map((rid) => findById(DATA.projectOptions.rooms, rid)?.label || rid);

    const visualRefs = [];
    chosenEnvs.forEach((it) => visualRefs.push({ image: it.image, caption: it.title, desc: it.subtitle }));
    chosenStyles.forEach((it) => {
      if (!visualRefs.some((v) => v.image === it.image)) visualRefs.push({ image: it.image, caption: it.title, desc: it.desc });
    });
    chosenMaterials.forEach((it) => {
      if (!visualRefs.some((v) => v.image === it.image)) visualRefs.push({ image: it.image, caption: it.title, desc: it.desc });
    });
    if (!visualRefs.length) {
      visualRefs.push(
        { image: DATA.welcomeHeroImage, caption: 'Atmosfera Mineral', desc: 'Equilíbrio entre textura mineral e luz natural.' },
        { image: 'assets/va-ref-08.webp', caption: 'Curadoria Material', desc: 'Pedra natural, madeira e metal escovado.' },
        { image: DATA.lightingBaseImage, caption: 'Proporção e Luz', desc: 'Arquitetura serena e acolhedora.' }
      );
    }

    const editIcon = `
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M12 20h9"></path>
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
      </svg>
    `;

    const isSubmitted = Boolean(draft.submittedRecordId);

    return `
      <section class="stage-shell">
        <!-- 1. HERO + BÚSSOLA -->
        <div class="reveal-hero reveal-stagger-1">
          <svg class="reveal-hero__arc" viewBox="0 0 360 360" fill="none" aria-hidden="true">
            <path d="M30 340C30 168.792 168.792 30 340 30" stroke="#C6A982" stroke-width="1.2" />
            <path d="M95 340C95 204.69 204.69 95 340 95" stroke="#F4EFE6" stroke-width="0.8" stroke-opacity="0.35" />
          </svg>
          <div class="reveal-hero__grid">
            <div>
              <p class="eyebrow">Etapa 08/08 · Identidade Estética & Briefing</p>
              <h1 class="reveal-hero__title">${greetingTitle}</h1>
              <p class="reveal-hero__synthesis">${escapeHtml(synthesis.narrative)}</p>
              <div class="reveal-tags">
                <span class="reveal-tag">${escapeHtml(synthesis.headline)}</span>
                ${synthesis.tags.map((t) => `<span class="reveal-tag">${escapeHtml(t)}</span>`).join('')}
              </div>
            </div>
            <div class="reveal-compass">
              <span class="reveal-compass__head">Bússola do Seu Olhar</span>
              ${compass
                .map(
                  (axis) => `
                <div class="compass-axis">
                  <div class="compass-axis__labels">
                    <span>${escapeHtml(axis.left)}</span>
                    <span>${escapeHtml(axis.right)}</span>
                  </div>
                  <div class="compass-axis__track">
                    <div class="compass-axis__fill" style="width:${axis.value}%;"></div>
                    <div class="compass-axis__dot" style="left:${axis.value}%;"></div>
                  </div>
                </div>
              `
                )
                .join('')}
            </div>
          </div>
        </div>

        <!-- 2. RESUMO DO LEVANTAMENTO DE NECESSIDADES (FASE 2) -->
        <div class="reveal-section-head reveal-stagger-2">
          <div>
            <p class="eyebrow" style="margin-bottom:0.3rem;">Levantamento Funcional</p>
            <h2 class="reveal-section-head__title">Resumo de Necessidades & Prioridades</h2>
          </div>
          <button type="button" class="btn-edit-inline no-print" data-edit-target="8:0">${editIcon}<span>Revisar checklist</span></button>
        </div>

        <div class="needs-summary-grid reveal-stagger-2">
          <article class="editable-card">
            <div class="editable-card__top">
              <div>
                <span class="choice-card__kicker">Escopo</span>
                <h3 class="editable-card__title">Projeto e Ambientes</h3>
              </div>
              <button type="button" class="btn-edit-inline no-print" data-edit-target="7:0">${editIcon}<span>Editar</span></button>
            </div>
            <div class="editable-card__thumbs">
              ${[p.projectType, p.propertyCategory, p.city, p.timeline].filter(Boolean).map((x) => `<span class="combo-tag">${escapeHtml(x)}</span>`).join('') || '<span class="combo-tag">Não informado</span>'}
              ${roomLabels.map((rm) => `<span class="combo-tag" style="background:var(--bronze-soft);color:var(--bronze-dark);">${escapeHtml(rm)}</span>`).join('')}
            </div>
          </article>

          <article class="editable-card">
            <div class="editable-card__top">
              <div>
                <span class="choice-card__kicker">Foco Principal</span>
                <h3 class="editable-card__title">As 3 Prioridades</h3>
              </div>
            </div>
            ${
              chkSummary.topPriorities.length
                ? `
              <ul class="needs-room-list">
                ${chkSummary.topPriorities.map((pr, idx) => `<li><strong>#${idx + 1} (${escapeHtml(pr.category)}):</strong> ${escapeHtml(pr.label)}</li>`).join('')}
              </ul>
            `
                : '<p style="font-size:0.86rem;color:var(--ink-muted);">Nenhuma prioridade destacada.</p>'
            }
          </article>

          ${chkSummary.byRoom
            .map(
              (grp) => `
            <article class="editable-card">
              <div>
                <span class="choice-card__kicker">${grp.kind === 'problem' ? 'Pontos atuais' : 'Usos previstos'}</span>
                <h3 class="editable-card__title">${escapeHtml(grp.category)}</h3>
              </div>
              <ul class="needs-room-list">
                ${grp.items.map((txt) => `<li>${escapeHtml(txt)}</li>`).join('')}
              </ul>
            </article>
          `
            )
            .join('')}

          ${
            chkSummary.preserve.length
              ? `
            <article class="editable-card">
              <div>
                <span class="choice-card__kicker">Imóvel Existente</span>
                <h3 class="editable-card__title">Elementos a Preservar</h3>
              </div>
              <div class="editable-card__thumbs">
                ${chkSummary.preserve.map((it) => `<span class="combo-tag">${escapeHtml(it)}</span>`).join('')}
              </div>
            </article>
          `
              : ''
          }

          ${
            draft.checklist.notes
              ? `
            <article class="editable-card">
              <div class="editable-card__top">
                <div>
                  <span class="choice-card__kicker">Observações</span>
                  <h3 class="editable-card__title">Notas Adicionais</h3>
                </div>
                <button type="button" class="btn-edit-inline no-print" data-edit-target="8:contact">${editIcon}<span>Editar</span></button>
              </div>
              <p style="font-size:0.88rem;color:var(--ink-secondary);">${escapeHtml(draft.checklist.notes)}</p>
            </article>
          `
              : ''
          }
        </div>

        <!-- 3. MOODBOARD VISUAL + ESCOLHAS ESTÉTICAS EDITÁVEIS -->
        <div class="reveal-section-head reveal-stagger-3">
          <div>
            <p class="eyebrow" style="margin-bottom:0.3rem;">Curadoria Estética</p>
            <h2 class="reveal-section-head__title">Seu Moodboard & Escolhas Estéticas</h2>
          </div>
          <span style="font-size:0.8rem;color:var(--ink-muted);">Clique em Editar para ajustar qualquer preferência</span>
        </div>

        <div class="moodboard-panel reveal-stagger-3" style="margin-bottom:1.25rem;">
          <div class="moodboard-collage">
            ${visualRefs
              .slice(0, 5)
              .map(
                (ref) => `
              <figure class="moodboard-collage__item" data-zoom-img="${escapeHtml(ref.image)}" data-zoom-title="${escapeHtml(ref.caption)}" data-zoom-desc="${escapeHtml(ref.desc)}">
                <img src="${ref.image}" alt="${escapeHtml(ref.caption)}" />
                <figcaption class="moodboard-collage__cap">${escapeHtml(ref.caption)}</figcaption>
              </figure>
            `
              )
              .join('')}
          </div>
        </div>

        <div class="editable-choices-grid reveal-stagger-3">
          <article class="editable-card">
            <div class="editable-card__top">
              <div><span class="choice-card__kicker">Etapa 02</span><h3 class="editable-card__title">Ambientes, Estilos & Paletas</h3></div>
              <button type="button" class="btn-edit-inline no-print" data-edit-target="2:0">${editIcon}<span>Editar</span></button>
            </div>
            <div class="editable-card__thumbs">
              ${chosenStyles.map((st) => `<span class="mini-ref-chip"><img src="${st.image}" alt="" /><span>${escapeHtml(st.title)}</span></span>`).join('')}
              ${chosenPalettes.map((pal) => `<span class="mini-ref-chip"><span class="palette-dot" style="width:18px;height:18px;background:${pal.colors[2]};"></span><span>${escapeHtml(pal.title)}</span></span>`).join('')}
              ${!chosenStyles.length && !chosenPalettes.length ? '<span class="combo-tag">Exploração aberta</span>' : ''}
            </div>
          </article>

          <article class="editable-card">
            <div class="editable-card__top">
              <div><span class="choice-card__kicker">Etapas 03 & 04</span><h3 class="editable-card__title">Materiais & Combinações</h3></div>
              <button type="button" class="btn-edit-inline no-print" data-edit-target="3:0">${editIcon}<span>Editar</span></button>
            </div>
            <div class="editable-card__thumbs">
              ${chosenMaterials.map((m) => `<span class="mini-ref-chip"><span class="palette-dot" style="width:18px;height:18px;background:${m.swatch};"></span><span>${escapeHtml(m.title)}</span></span>`).join('')}
              ${chosenCombos.map((cmb) => `<span class="combo-tag">${escapeHtml(cmb.title)}</span>`).join('')}
              ${!chosenMaterials.length && !chosenCombos.length ? '<span class="combo-tag">A definir em conjunto</span>' : ''}
            </div>
          </article>

          <article class="editable-card">
            <div class="editable-card__top">
              <div><span class="choice-card__kicker">Etapa 05</span><h3 class="editable-card__title">Iluminação & Atmosfera</h3></div>
              <button type="button" class="btn-edit-inline no-print" data-edit-target="5:0">${editIcon}<span>Editar</span></button>
            </div>
            <div class="editable-card__thumbs">
              <span class="combo-tag" style="background:var(--bronze-soft);color:var(--bronze-dark);">${escapeHtml(activeScenario.title)} · ${escapeHtml(activeScenario.kelvin)}</span>
              ${s.lightingPreferences.map((id) => `<span class="combo-tag">${escapeHtml(findById(DATA.lightingPreferences, id)?.title || id)}</span>`).join('')}
            </div>
          </article>

          <article class="editable-card">
            <div class="editable-card__top">
              <div><span class="choice-card__kicker">Etapa 06</span><h3 class="editable-card__title">Seu Jeito de Viver</h3></div>
              <button type="button" class="btn-edit-inline no-print" data-edit-target="6:0">${editIcon}<span>Editar</span></button>
            </div>
            <div class="editable-card__thumbs">
              ${chosenFeelings.map((f) => `<span class="combo-tag">${escapeHtml(f.title)}</span>`).join('') || '<span class="combo-tag">Conforto e equilíbrio</span>'}
            </div>
          </article>
        </div>

        <!-- 4. FINALIZAÇÃO & ENVIO -->
        <div class="reveal-cta-box reveal-stagger-4 no-print">
          <div style="max-width:54ch;">
            <p class="eyebrow" style="margin-bottom:0.35rem;">Finalizar Briefing</p>
            <h2 style="font-family:var(--font-display);font-size:1.85rem;font-weight:400;">Enviar perfil completo para a Vidart</h2>
            <p style="font-size:0.88rem;color:var(--ink-secondary);margin-top:0.35rem;">
              Suas escolhas estéticas e seu levantamento funcional serão registrados em um único dossiê para orientar decisões reais do projeto.
            </p>
            ${
              !c.lgpdConsent
                ? `
              <label class="lgpd-box" style="margin-top:0.9rem;">
                <input type="checkbox" id="revealLgpdCheck" />
                <span class="lgpd-box__text">Autorizo o armazenamento deste briefing pela VA Arquitetura e Interiores exclusivamente para atendimento do meu projeto (LGPD).</span>
              </label>
            `
                : ''
            }
            ${ui.submitFeedback ? `<div class="status-banner" role="status">${escapeHtml(ui.submitFeedback)}</div>` : ''}
          </div>

          <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center;">
            <button type="button" class="btn-primary" id="submitProfileBtn">
              <span>${isSubmitted ? 'Atualizar briefing enviado' : 'Enviar perfil para a Vidart'}</span>
            </button>
            <button type="button" class="btn-secondary" id="printPdfBtn">Salvar Dossiê (PDF)</button>
            <button type="button" class="btn-link-subtle" id="eraseMyDataBtn" style="color:#7A3B3B;">Excluir meus dados</button>
          </div>
        </div>
      </section>
    `;
  }

  // =========================================================================
  // EVENTOS DAS ETAPAS
  // =========================================================================

  function bindStageEvents() {
    const returnBannerBtn = document.getElementById('returnToRevealBannerBtn');
    if (returnBannerBtn) returnBannerBtn.addEventListener('click', () => goToFinalReveal());

    // Editar diretamente do resumo final
    els.stageContainer.querySelectorAll('[data-edit-target]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const [stRaw, subRaw] = btn.dataset.editTarget.split(':');
        const targetStep = Number(stRaw);
        if (subRaw === 'contact') {
          const subs = getStep8SubSteps();
          const idx = subs.findIndex((x) => x.type === 'contact');
          goTo(8, Math.max(0, idx), { returnToReveal: true });
        } else {
          goTo(targetStep, Number(subRaw) || 0, { returnToReveal: true });
        }
      });
    });

    const startBtn = document.getElementById('startJourneyBtn');
    if (startBtn) startBtn.addEventListener('click', () => goTo(2, 0));

    const resetWelcomeBtn = document.getElementById('resetDraftWelcomeBtn');
    if (resetWelcomeBtn) {
      resetWelcomeBtn.addEventListener('click', () => {
        draft = STORE.clearDraft();
        ui.activeStyleGroup = null;
        ui.submitFeedback = null;
        ui.returnToReveal = false;
        render();
      });
    }

    // Zoom lightbox
    els.stageContainer.querySelectorAll('[data-zoom-img]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openLightbox(btn.dataset.zoomImg, btn.dataset.zoomTitle, btn.dataset.zoomDesc);
      });
    });

    // Multi-select estéticos
    els.stageContainer.querySelectorAll('[data-select-type]').forEach((el) => {
      const handle = () => {
        toggleInArray(draft.selections[el.dataset.selectType], el.dataset.id);
        persist();
        render();
      };
      el.addEventListener('click', handle);
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handle();
        }
      });
    });

    // Abas de estilo (Etapa 2.2)
    els.stageContainer.querySelectorAll('[data-style-group]').forEach((tab) => {
      tab.addEventListener('click', () => {
        ui.activeStyleGroup = tab.dataset.styleGroup;
        render();
      });
    });

    // Compositor de tríade (Etapa 4)
    els.stageContainer.querySelectorAll('[data-composer-slot]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const slot = btn.dataset.composerSlot;
        const id = btn.dataset.composerId;
        draft.selections.customCombination[slot] =
          draft.selections.customCombination[slot] === id ? null : id;
        persist();
        render();
      });
    });
    const clearComposerBtn = document.getElementById('clearComposerBtn');
    if (clearComposerBtn) {
      clearComposerBtn.addEventListener('click', () => {
        draft.selections.customCombination = { stone: null, wood: null, accent: null };
        persist();
        render();
      });
    }

    // Simulador de luz (Etapa 5.1)
    els.stageContainer.querySelectorAll('[data-lighting-scenario]').forEach((btn) => {
      btn.addEventListener('click', () => {
        draft.selections.lightingScenario = btn.dataset.lightingScenario;
        persist();
        render();
      });
    });
    const lightingRange = document.getElementById('lightingRange');
    if (lightingRange) {
      lightingRange.addEventListener('input', (e) => {
        const val = Number(e.target.value);
        ui.lightingCompareSplit = val;
        const layer = document.getElementById('lightingCompareLayer');
        const divider = document.getElementById('lightingDivider');
        if (layer) layer.style.clipPath = `inset(0 ${100 - val}% 0 0)`;
        if (divider) divider.style.left = `${val}%`;
      });
    }

    // Espaço de descanso (Etapa 6.2)
    els.stageContainer.querySelectorAll('[data-rest-space]').forEach((card) => {
      const handle = () => {
        draft.selections.restSpace =
          draft.selections.restSpace === card.dataset.restSpace ? null : card.dataset.restSpace;
        persist();
        render();
      };
      card.addEventListener('click', handle);
    });

    // Etapa 7 — Contexto do projeto
    els.stageContainer.querySelectorAll('[data-ctx-single]').forEach((btn) => {
      btn.addEventListener('click', () => {
        draft.projectContext[btn.dataset.ctxSingle] = btn.dataset.ctxVal;
        persist();
        render();
      });
    });
    els.stageContainer.querySelectorAll('[data-ctx-room]').forEach((btn) => {
      btn.addEventListener('click', () => {
        toggleInArray(draft.projectContext.rooms, btn.dataset.ctxRoom);
        persist();
        render();
      });
    });
    els.stageContainer.querySelectorAll('[data-ctx-flag]').forEach((btn) => {
      btn.addEventListener('click', () => {
        toggleInArray(draft.projectContext.contextFlags, btn.dataset.ctxFlag);
        persist();
        render();
      });
    });
    els.stageContainer.querySelectorAll('[data-ctx-input]').forEach((input) => {
      input.addEventListener('input', (e) => {
        draft.projectContext[input.dataset.ctxInput] = e.target.value;
        persist();
      });
    });

    // FASE 2 — Checklist linhas clicáveis com exclusividade lógica
    els.stageContainer.querySelectorAll('[data-chk-q]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const qId = btn.dataset.chkQ;
        const optId = btn.dataset.chkOpt;
        const questions = CHK.buildChecklistQuestions(draft.projectContext);
        const question = questions.find((q) => q.id === qId);
        if (!question) return;

        const current = draft.checklist.answers[qId] || [];
        const next = CHK.toggleAnswerWithExclusivity(question, current, optId);
        draft.checklist.answers[qId] = next;

        // Preserva 1ª resposta original se ainda não registrada
        if (!draft.checklist.originalAnswers[qId] && next.length > 0) {
          draft.checklist.originalAnswers[qId] = [...next];
        }

        persist();
        render();
      });
    });

    // Ver outras opções (+N)
    els.stageContainer.querySelectorAll('[data-expand-q]').forEach((btn) => {
      btn.addEventListener('click', () => {
        ui.expandedChecklistQuestions[btn.dataset.expandQ] = true;
        render();
      });
    });

    // Prioridades (máximo 3)
    els.stageContainer.querySelectorAll('[data-prio-id]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.prioId;
        const prios = draft.checklist.priorities || [];
        const idx = prios.indexOf(id);
        if (idx >= 0) {
          prios.splice(idx, 1);
        } else if (prios.length < 3) {
          prios.push(id);
        }
        draft.checklist.priorities = prios;
        persist();
        render();
      });
    });

    // Notas e contato (Etapa 8)
    const chkNotes = document.getElementById('chkNotes');
    if (chkNotes) {
      chkNotes.addEventListener('input', (e) => {
        draft.checklist.notes = e.target.value;
        persist();
      });
    }
    els.stageContainer.querySelectorAll('[data-client-input]').forEach((input) => {
      input.addEventListener('input', (e) => {
        draft.client[input.dataset.clientInput] = e.target.value;
        persist();
      });
    });
    const lgpdCheck = document.getElementById('lgpdConsentCheck') || document.getElementById('revealLgpdCheck');
    if (lgpdCheck) {
      lgpdCheck.addEventListener('change', (e) => {
        draft.client.lgpdConsent = e.target.checked;
        draft.client.lgpdConsentAt = e.target.checked ? new Date().toISOString() : null;
        persist();
      });
    }

    // Submissão, PDF e Exclusão LGPD
    const submitBtn = document.getElementById('submitProfileBtn');
    if (submitBtn) {
      submitBtn.addEventListener('click', async () => {
        if (!draft.client.lgpdConsent) {
          ui.submitFeedback = 'Marque a autorização de privacidade (LGPD) acima para registrar seu briefing.';
          render();
          return;
        }
        markStepCompleted(8);
        const synthesis = buildAestheticSynthesis();
        const chkSummary = buildChecklistSummary();
        const { record, remoteSync } = await STORE.submitBriefing(draft, synthesis, chkSummary);
        const syncMsg = remoteSync.configured
          ? remoteSync.ok
            ? ' e sincronizado com o servidor do estúdio.'
            : ' (salvo localmente; endpoint externo indisponível).'
          : ' no registro estruturado da VA Arquitetura.';
        ui.submitFeedback = `Briefing ${record.recordId} registrado com sucesso${syncMsg}`;
        render();
      });
    }

    const printPdfBtn = document.getElementById('printPdfBtn');
    if (printPdfBtn) printPdfBtn.addEventListener('click', () => window.print());

    const eraseBtn = document.getElementById('eraseMyDataBtn');
    if (eraseBtn) {
      eraseBtn.addEventListener('click', () => {
        if (window.confirm('Deseja excluir permanentemente suas respostas e dados pessoais desta sessão?')) {
          if (draft.submittedRecordId) STORE.deleteRecord(draft.submittedRecordId);
          draft = STORE.clearDraft();
          ui.activeStyleGroup = null;
          ui.submitFeedback = null;
          ui.returnToReveal = false;
          render();
        }
      });
    }
  }

  // =========================================================================
  // LIGHTBOX
  // =========================================================================

  function openLightbox(src, title, desc) {
    els.lightboxImg.src = src;
    els.lightboxImg.alt = title || '';
    els.lightboxTitle.textContent = title || '';
    els.lightboxDesc.textContent = desc || '';
    els.lightboxModal.hidden = false;
  }

  function closeLightbox() {
    els.lightboxModal.hidden = true;
    els.lightboxImg.src = '';
  }

  // =========================================================================
  // PAINEL PRIVADO DA EQUIPE VIDART (ESTÉTICA + NECESSIDADES POR AMBIENTE)
  // =========================================================================

  function openAdminModal() {
    els.adminModal.hidden = false;
    renderAdminBody();
  }

  function closeAdminModal() {
    els.adminModal.hidden = true;
  }

  function renderAdminBody() {
    if (!ui.adminAuthenticated) {
      els.adminBody.innerHTML = `
        <form class="admin-login" id="adminLoginForm">
          <div>
            <p class="eyebrow" style="margin-bottom:0.35rem;">Acesso Restrito</p>
            <h3 style="font-family:var(--font-display);font-size:1.75rem;font-weight:400;">Equipe VA Arquitetura</h3>
            <p style="font-size:0.84rem;color:var(--ink-secondary);margin-top:0.3rem;">
              Digite a chave de acesso para consultar os briefings estéticos e levantamentos de necessidades.
            </p>
          </div>
          <div class="field-group">
            <label class="field-label" for="adminPinInput">Chave de acesso</label>
            <input class="field-input" id="adminPinInput" type="password" autocomplete="current-password" placeholder="Senha da equipe" required />
          </div>
          <p id="adminPinError" style="font-size:0.82rem;color:#7A3B3B;" hidden>Chave incorreta. Tente novamente.</p>
          <button type="submit" class="btn-primary">Entrar no painel</button>
          <p style="font-size:0.74rem;color:var(--ink-muted);">Chave padrão inicial: <code>va2024</code></p>
        </form>
      `;
      document.getElementById('adminLoginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const ok = await STORE.verifyAdminPin(document.getElementById('adminPinInput').value);
        if (ok) {
          ui.adminAuthenticated = true;
          renderAdminBody();
        } else {
          document.getElementById('adminPinError').hidden = false;
        }
      });
      return;
    }

    const records = STORE.loadRegistry();
    const settings = STORE.loadSettings();
    const q = ui.adminSearch.trim().toLowerCase();
    const filtered = q
      ? records.filter(
          (r) =>
            (r.client?.name || '').toLowerCase().includes(q) ||
            (r.projectContext?.city || '').toLowerCase().includes(q) ||
            (r.recordId || '').toLowerCase().includes(q)
        )
      : records;

    if (!ui.adminSelectedId && filtered.length) ui.adminSelectedId = filtered[0].recordId;
    const activeRecord = filtered.find((r) => r.recordId === ui.adminSelectedId) || filtered[0] || null;

    els.adminBody.innerHTML = `
      <div class="admin-toolbar">
        <div class="segmented-toggle">
          <button type="button" class="segmented-toggle__btn ${ui.adminTab === 'records' ? 'is-active' : ''}" data-admin-tab="records">Briefings (${records.length})</button>
          <button type="button" class="segmented-toggle__btn ${ui.adminTab === 'settings' ? 'is-active' : ''}" data-admin-tab="settings">Configurações</button>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:0.55rem;">
          <button type="button" class="btn-secondary" id="adminExportCsvBtn" ${records.length ? '' : 'disabled'}>Exportar CSV</button>
          <button type="button" class="btn-secondary" id="adminExportJsonBtn" ${records.length ? '' : 'disabled'}>Backup JSON</button>
          <button type="button" class="btn-link-subtle" id="adminLogoutBtn">Sair</button>
        </div>
      </div>
      ${ui.adminTab === 'settings' ? renderAdminSettings(settings) : renderAdminRecords(filtered, activeRecord)}
    `;

    bindAdminEvents(records, activeRecord);
  }

  function renderAdminSettings(settings) {
    return `
      <div class="form-card" style="max-width:660px;">
        <h3 style="font-family:var(--font-display);font-size:1.65rem;font-weight:400;">Integração & Segurança</h3>
        <div class="field-group">
          <label class="field-label" for="cfgWebhook">URL de Webhook / API (POST JSON) <span class="field-optional">(opcional)</span></label>
          <input class="field-input" id="cfgWebhook" type="url" placeholder="https://seu-endpoint.com/api/briefings" value="${escapeHtml(settings.webhookUrl)}" />
        </div>
        <div class="field-group">
          <label class="field-label" for="cfgNewPin">Alterar chave da equipe <span class="field-optional">(opcional)</span></label>
          <input class="field-input" id="cfgNewPin" type="password" placeholder="Nova senha (mín. 4 caracteres)" />
        </div>
        <div style="display:flex;align-items:center;gap:1rem;">
          <button type="button" class="btn-primary" id="saveAdminSettingsBtn">Salvar</button>
          <span id="settingsSavedMsg" style="font-size:0.84rem;color:#254035;" hidden>Configurações salvas.</span>
        </div>
      </div>
    `;
  }

  function renderAdminRecords(filtered, r) {
    if (!filtered.length) {
      return `
        <div class="form-card" style="text-align:center;padding:2.5rem 1.5rem;">
          <h3 style="font-family:var(--font-display);font-size:1.6rem;font-weight:400;">Nenhum briefing registrado ainda</h3>
          <p style="font-size:0.88rem;color:var(--ink-secondary);margin-top:0.35rem;">
            Os briefings enviados pelos clientes aparecerão aqui com todas as escolhas estéticas e respostas por ambiente.
          </p>
        </div>
      `;
    }

    const qIndex = CHK.getAllQuestionsIndex();
    const s = r.rawSelections || {};
    const p = r.projectContext || {};
    const c = r.client || {};
    const chk = r.checklist || {};

    const chkRows = Object.entries(chk.answers || {})
      .map(([qId, optIds]) => {
        const q = qIndex[qId];
        if (!q || !optIds.length) return '';
        const labels = optIds.map((oid) => q.options.find((o) => o.id === oid)?.label || oid);
        return `<div style="margin-bottom:0.6rem;"><strong>${escapeHtml(q.category)}:</strong> ${labels.map(escapeHtml).join(' · ')}</div>`;
      })
      .filter(Boolean)
      .join('');

    const prioRows = (chk.priorities || [])
      .map((pid, idx) => {
        const [qId, optId] = pid.split('::');
        const q = qIndex[qId];
        const opt = q?.options.find((o) => o.id === optId);
        return opt ? `<li><strong>#${idx + 1} (${escapeHtml(q.category.split(' · ')[0])}):</strong> ${escapeHtml(opt.label)}</li>` : '';
      })
      .filter(Boolean)
      .join('');

    return `
      <div class="admin-split">
        <div>
          <input class="field-input" id="adminSearchInput" type="search" placeholder="Buscar por nome, cidade ou ID..." value="${escapeHtml(ui.adminSearch)}" style="margin-bottom:0.8rem;" />
          <div class="admin-list">
            ${filtered
              .map(
                (item) => `
              <button type="button" class="admin-row ${item.recordId === r.recordId ? 'is-active' : ''}" data-admin-select="${item.recordId}">
                <div style="display:flex;justify-content:space-between;gap:0.5rem;align-items:center;">
                  <strong style="font-size:0.92rem;">${escapeHtml(item.client?.name || 'Sem nome')}</strong>
                  <span class="combo-tag">${escapeHtml(item.status || 'Novo')}</span>
                </div>
                <div style="font-size:0.78rem;color:var(--ink-muted);margin-top:0.2rem;">
                  ${escapeHtml(item.projectContext?.projectType || 'Interiores')} · ${escapeHtml(item.projectContext?.propertyCategory || 'Residencial')}
                </div>
                <div style="font-size:0.72rem;color:var(--ink-muted);margin-top:0.15rem;">
                  ${item.submittedAt ? new Date(item.submittedAt).toLocaleDateString('pt-BR') : ''} · v${escapeHtml(item.questionnaireVersion || '4.0')}
                </div>
              </button>
            `
              )
              .join('')}
          </div>
        </div>

        <div class="admin-detail">
          <div style="display:flex;flex-wrap:wrap;justify-content:space-between;gap:1rem;border-bottom:1px solid var(--hairline);padding-bottom:1rem;">
            <div>
              <span class="choice-card__kicker">Ficha ${escapeHtml(r.recordId)} · Questionário v${escapeHtml(r.questionnaireVersion || '4.0')}</span>
              <h3 style="font-family:var(--font-display);font-size:1.85rem;font-weight:400;">${escapeHtml(c.name)}</h3>
              <p style="font-size:0.84rem;color:var(--ink-secondary);">${[c.email, c.phone].filter(Boolean).map(escapeHtml).join(' · ') || 'Contato não informado'}</p>
              <p style="font-size:0.74rem;color:var(--ink-muted);margin-top:0.2rem;">LGPD: ${c.lgpdConsent ? `Autorizado em ${new Date(c.lgpdConsentAt).toLocaleString('pt-BR')}` : 'Pendente'}</p>
            </div>
            <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
              <button type="button" class="btn-secondary" id="adminPrintOneBtn">Exportar PDF</button>
              <button type="button" class="btn-link-subtle" id="adminDeleteOneBtn" style="color:#7A3B3B;">Excluir</button>
            </div>
          </div>

          <div>
            <span class="summary-item__label">Projeto & Prioridades Destacadas</span>
            <p style="font-size:0.86rem;margin-top:0.25rem;">
              ${[p.projectType, p.propertyCategory, p.interiorStatus, p.commercialSegment, p.city, p.timeline].filter(Boolean).map(escapeHtml).join(' · ') || '—'}
            </p>
            ${prioRows ? `<ul class="needs-room-list" style="margin-top:0.6rem;">${prioRows}</ul>` : ''}
          </div>

          <div>
            <span class="summary-item__label">Respostas do Checklist por Ambiente</span>
            <div style="font-size:0.85rem;color:var(--ink-secondary);margin-top:0.45rem;">
              ${chkRows || '<p style="color:var(--ink-muted);">Nenhuma resposta de checklist registrada.</p>'}
            </div>
            ${chk.notes ? `<p style="font-size:0.84rem;margin-top:0.5rem;"><strong>Observações do cliente:</strong> ${escapeHtml(chk.notes)}</p>` : ''}
          </div>

          <div>
            <span class="summary-item__label">Preferências Estéticas</span>
            <p style="font-size:0.85rem;margin-top:0.25rem;"><strong>Estilos:</strong> ${(s.styles || []).map((id) => escapeHtml(findById(DATA.styles, id)?.title || id)).join(', ') || '—'}</p>
            <p style="font-size:0.85rem;margin-top:0.2rem;"><strong>Paletas:</strong> ${(s.palettes || []).map((id) => escapeHtml(findById(DATA.palettes, id)?.title || id)).join(', ') || '—'}</p>
            <p style="font-size:0.85rem;margin-top:0.2rem;"><strong>Materiais:</strong> ${(s.materials || []).map((id) => escapeHtml(findById(DATA.materials, id)?.title || id)).join(', ') || '—'}</p>
          </div>

          <div style="border-top:1px solid var(--hairline);padding-top:1rem;">
            <label class="field-label" for="adminTeamNotes">Observações Internas da Equipe</label>
            <textarea class="field-textarea" id="adminTeamNotes" style="margin-top:0.45rem;" placeholder="Anotações técnicas da equipe...">${escapeHtml(r.teamNotes || '')}</textarea>
            <div style="display:flex;align-items:center;gap:0.8rem;margin-top:0.65rem;">
              <select class="field-select" id="adminRecordStatus" style="max-width:200px;">
                ${['Novo', 'Em análise', 'Briefing validado', 'Em proposta'].map((st) => `<option value="${st}" ${r.status === st ? 'selected' : ''}>${st}</option>`).join('')}
              </select>
              <button type="button" class="btn-primary" id="saveTeamNotesBtn">Salvar notas</button>
              <span id="notesSavedToast" style="font-size:0.82rem;color:#254035;" hidden>Salvo.</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function bindAdminEvents(records, activeRecord) {
    els.adminBody.querySelectorAll('[data-admin-tab]').forEach((btn) => {
      btn.addEventListener('click', () => {
        ui.adminTab = btn.dataset.adminTab;
        renderAdminBody();
      });
    });

    const csvBtn = document.getElementById('adminExportCsvBtn');
    if (csvBtn) csvBtn.addEventListener('click', () => STORE.exportRecordsToCsv(records, DATA, CHK));

    const jsonBtn = document.getElementById('adminExportJsonBtn');
    if (jsonBtn) jsonBtn.addEventListener('click', () => STORE.exportRecordsToJson(records));

    const logoutBtn = document.getElementById('adminLogoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        ui.adminAuthenticated = false;
        renderAdminBody();
      });
    }

    const searchInput = document.getElementById('adminSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        ui.adminSearch = e.target.value;
        renderAdminBody();
      });
    }

    els.adminBody.querySelectorAll('[data-admin-select]').forEach((row) => {
      row.addEventListener('click', () => {
        ui.adminSelectedId = row.dataset.adminSelect;
        renderAdminBody();
      });
    });

    const saveNotesBtn = document.getElementById('saveTeamNotesBtn');
    if (saveNotesBtn && activeRecord) {
      saveNotesBtn.addEventListener('click', () => {
        STORE.updateRecordTeamData(activeRecord.recordId, {
          teamNotes: document.getElementById('adminTeamNotes').value,
          status: document.getElementById('adminRecordStatus').value
        });
        const toast = document.getElementById('notesSavedToast');
        if (toast) {
          toast.hidden = false;
          setTimeout(() => (toast.hidden = true), 2000);
        }
      });
    }

    const deleteOneBtn = document.getElementById('adminDeleteOneBtn');
    if (deleteOneBtn && activeRecord) {
      deleteOneBtn.addEventListener('click', () => {
        if (window.confirm(`Excluir permanentemente o registro de ${activeRecord.client?.name}?`)) {
          STORE.deleteRecord(activeRecord.recordId);
          ui.adminSelectedId = null;
          renderAdminBody();
        }
      });
    }

    const printOneBtn = document.getElementById('adminPrintOneBtn');
    if (printOneBtn && activeRecord) {
      printOneBtn.addEventListener('click', () => window.print());
    }

    const saveSettingsBtn = document.getElementById('saveAdminSettingsBtn');
    if (saveSettingsBtn) {
      saveSettingsBtn.addEventListener('click', async () => {
        STORE.saveSettings({ webhookUrl: document.getElementById('cfgWebhook').value.trim() });
        const newPin = document.getElementById('cfgNewPin').value.trim();
        if (newPin.length >= 4) await STORE.updateAdminPin(newPin);
        const msg = document.getElementById('settingsSavedMsg');
        if (msg) {
          msg.hidden = false;
          setTimeout(() => (msg.hidden = true), 2500);
        }
      });
    }
  }

  // =========================================================================
  // EVENTOS GLOBAIS & BOOT
  // =========================================================================

  els.brandHomeBtn.addEventListener('click', () => goTo(1, 0));
  els.prevStepBtn.addEventListener('click', goPrev);
  els.nextStepBtn.addEventListener('click', goNext);

  els.lightboxCloseBtn.addEventListener('click', closeLightbox);
  els.lightboxModal.addEventListener('click', (e) => {
    if (e.target === els.lightboxModal) closeLightbox();
  });

  els.openAdminBtn.addEventListener('click', openAdminModal);
  els.adminCloseBtn.addEventListener('click', closeAdminModal);
  els.adminModal.addEventListener('click', (e) => {
    if (e.target === els.adminModal) closeAdminModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (!els.lightboxModal.hidden) closeLightbox();
      else if (!els.adminModal.hidden) closeAdminModal();
    }
  });

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    });
  }

  render();
})();
