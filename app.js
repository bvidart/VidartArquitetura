// =========================================================================
// VA. ARQUITETURA & INTERIORES — CONTROLADOR DA JORNADA DE DESCOBERTA
// Arquitetura orientada a estado, personalização adaptativa e painel interno.
// =========================================================================

(function () {
  const DATA = window.VA_DATA;
  const STORE = window.VA_STORAGE;

  // Estado centralizado da aplicação
  let draft = STORE.loadDraft();
  let ui = {
    activeStyleGroup: null,
    materialViewMode: 'sample', // 'sample' | 'applied'
    lightingCompareSplit: 50,
    adminAuthenticated: false,
    adminSelectedId: null,
    adminSearch: '',
    adminTab: 'records', // 'records' | 'settings'
    submitFeedback: null
  };

  // Referências de DOM
  const els = {
    brandHomeBtn: document.getElementById('brandHomeBtn'),
    topbarChapter: document.getElementById('topbarChapter'),
    chapterCode: document.getElementById('chapterCode'),
    chapterName: document.getElementById('chapterName'),
    progressBar: document.getElementById('progressBar'),
    journeyMain: document.getElementById('journeyMain'),
    stageContainer: document.getElementById('stageContainer'),
    journeyBar: document.getElementById('journeyBar'),
    prevStepBtn: document.getElementById('prevStepBtn'),
    nextStepBtn: document.getElementById('nextStepBtn'),
    nextStepLabel: document.getElementById('nextStepLabel'),
    skipStepBtn: document.getElementById('skipStepBtn'),
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
    if (idx >= 0) {
      arr.splice(idx, 1);
    } else {
      arr.push(id);
    }
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
  // MOTOR DE PERSONALIZAÇÃO INTELIGENTE (AFINIDADES PROGRESSIVAS)
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
      const s = g.tags.reduce((acc, t) => acc + (scores[t] || 0), 0);
      if (s > bestScore) {
        bestScore = s;
        bestId = g.id;
      }
    });
    return bestScore > 0 ? bestId : DATA.styleGroups[0].id;
  }

  function getRankedCombinations(scores) {
    const hasScores = Object.keys(scores).length > 0;
    return DATA.combinations
      .map((c, idx) => {
        const score = c.tags.reduce((acc, t) => acc + (scores[t] || 0), 0);
        return { ...c, _score: score, _idx: idx };
      })
      .sort((a, b) => (hasScores ? b._score - a._score || a._idx - b._idx : a._idx - b._idx));
  }

  function buildContextualReflection(step) {
    const s = draft.selections;
    const scores = computeAffinityScores(s);
    const topTags = Object.entries(scores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([tag]) => tag);

    if (step === 2 && s.environments.length > 0) {
      if (topTags.includes('organico') || topTags.includes('natural')) {
        return 'Você parece se identificar com ambientes de linhas suaves, materiais naturais e atmosferas acolhedoras.';
      }
      if (topTags.includes('classico') || topTags.includes('elegante')) {
        return 'Seu olhar demonstra afinidade por proporções equilibradas, arquitetura clássica atualizada e elegância serena.';
      }
      if (topTags.includes('minimalista') || topTags.includes('monocromatico')) {
        return 'Você valoriza o silêncio visual, superfícies contínuas e a presença calma da luz natural.';
      }
      if (topTags.includes('profundo') || topTags.includes('intimista')) {
        return 'Há uma inclinação marcante por espaços envolventes, madeiras expressivas e atmosfera intimista.';
      }
      return 'Suas primeiras escolhas já revelam uma busca equilibrada entre arquitetura marcante e conforto cotidiano.';
    }

    if (step === 3 && s.styles.length > 0) {
      const names = s.styles.map((id) => findById(DATA.styles, id)?.title).filter(Boolean);
      if (names.length === 1) {
        return `O olhar ${names[0].toLowerCase()} aparece como ponto de partida — você pode combiná-lo com outras referências para enriquecer o resultado.`;
      }
      return `A combinação entre ${names.slice(0, 3).join(', ')} sugere um repertório autoral e híbrido, livre de rótulos rígidos.`;
    }

    if (step === 4 && s.palettes.length > 0) {
      const names = s.palettes.map((id) => findById(DATA.palettes, id)?.title.toLowerCase()).filter(Boolean);
      return `Sua paleta caminha para ${names.slice(0, 2).join(' e ')}, definindo o tom emocional dos espaços.`;
    }

    if (step === 5 && s.materials.length > 0) {
      const names = s.materials.map((id) => findById(DATA.materials, id)?.title.toLowerCase()).filter(Boolean);
      return `A presença de ${names.slice(0, 3).join(', ')} indica uma preferência tátil clara — vamos explorar como esses materiais conversam entre si.`;
    }

    if (step === 6 && (s.combinations.length > 0 || s.customCombination.stone)) {
      return 'Essas composições já desenham a base material do projeto, equilibrando temperatura visual, textura e luz.';
    }

    if (step === 7 && s.lightingPreferences.length > 0) {
      const first = findById(DATA.lightingPreferences, s.lightingPreferences[0]);
      return `Priorizar ${first ? first.title.toLowerCase() : 'a luz certa'} vai orientar o desenho luminotécnico para valorizar cada superfície escolhida.`;
    }

    return null;
  }

  function buildAestheticSynthesis() {
    const s = draft.selections;
    const styleTitles = s.styles.map((id) => findById(DATA.styles, id)?.title).filter(Boolean);
    const paletteTitles = s.palettes.map((id) => findById(DATA.palettes, id)?.title).filter(Boolean);
    const matTitles = s.materials.map((id) => findById(DATA.materials, id)?.title).filter(Boolean);
    const feelTitles = s.homeFeelings.map((id) => findById(DATA.homeFeelings, id)?.title).filter(Boolean);
    const lightTitles = s.lightingPreferences.map((id) => findById(DATA.lightingPreferences, id)?.title).filter(Boolean);

    const headline =
      styleTitles.length >= 2
        ? `${styleTitles[0]} com nuances ${styleTitles[1].toLowerCase()}`
        : styleTitles.length === 1
          ? `Essência ${styleTitles[0]} com olhar autoral`
          : 'Curadoria Arquitetônica Personalizada';

    const parts = [];
    if (styleTitles.length) {
      parts.push(`Suas escolhas convergem para uma linguagem que dialoga com ${styleTitles.slice(0, 3).join(', ')}, sem se limitar a um único rótulo.`);
    } else {
      parts.push('Suas escolhas revelam uma sensibilidade voltada à harmonia espacial, proporção e conforto visual.');
    }
    if (paletteTitles.length) {
      parts.push(`Na atmosfera cromática, destacam-se ${paletteTitles.slice(0, 2).join(' e ').toLowerCase()}.`);
    }
    if (matTitles.length) {
      parts.push(`A materialidade privilegia o toque de ${matTitles.slice(0, 4).join(', ').toLowerCase()}.`);
    }
    if (feelTitles.length) {
      parts.push(`No modo de viver, o espaço precisa despertar ${feelTitles.slice(0, 3).join(', ').toLowerCase()}.`);
    }
    if (lightTitles.length) {
      parts.push(`A iluminação acompanha esse ritmo através de ${lightTitles.slice(0, 2).join(' e ').toLowerCase()}.`);
    }

    return {
      headline,
      narrative: parts.join(' '),
      tags: [...styleTitles.slice(0, 3), ...feelTitles.slice(0, 2)].slice(0, 5)
    };
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

  // =========================================================================
  // NAVEGAÇÃO ENTRE CAPÍTULOS
  // =========================================================================

  function goToStep(stepNumber, opts = {}) {
    const clamped = Math.max(1, Math.min(10, stepNumber));
    if (draft.currentStep > 1) {
      markStepCompleted(draft.currentStep);
    }
    if (opts.returnToReveal) {
      ui.returnToReveal = true;
    } else if (clamped === 10 || clamped === 1) {
      ui.returnToReveal = false;
    }
    draft.currentStep = clamped;
    persist();
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function updateChrome() {
    const step = draft.currentStep;
    const chapter = DATA.chapters.find((c) => c.step === step) || DATA.chapters[0];
    const isWelcome = step === 1;

    els.topbarChapter.hidden = isWelcome;
    els.chapterCode.textContent = `${chapter.code} / 10`;
    els.chapterName.textContent = chapter.short;
    els.progressBar.style.transform = `scaleX(${step / 10})`;

    els.journeyMain.classList.toggle('is-welcome', isWelcome);
    els.journeyBar.hidden = isWelcome;

    if (!isWelcome) {
      els.prevStepBtn.hidden = false;
      const isOptional = step === 6 || step === 8 || step === 9;
      els.skipStepBtn.hidden = !isOptional || ui.returnToReveal;

      if (step === 10) {
        els.nextStepBtn.hidden = true;
        els.skipStepBtn.hidden = true;
        els.journeyMeta.textContent = 'Sua identidade estética está pronta — edite qualquer bloco quando quiser';
      } else if (ui.returnToReveal) {
        els.nextStepBtn.hidden = false;
        els.nextStepLabel.textContent = 'Salvar e voltar ao meu perfil';
        els.journeyMeta.textContent = 'Editando escolha · Suas alterações atualizam o perfil automaticamente';
      } else {
        els.nextStepBtn.hidden = false;
        els.nextStepLabel.textContent = step === 9 ? 'Revelar minha identidade' : 'Continuar';
        els.journeyMeta.textContent = `Etapa ${chapter.code} de 10 · Salvo automaticamente`;
      }
    }
  }

  // =========================================================================
  // RENDERIZAÇÃO DAS 10 ETAPAS
  // =========================================================================

  function render() {
    updateChrome();
    const step = draft.currentStep;
    let html = '';

    switch (step) {
      case 1: html = renderStep1Welcome(); break;
      case 2: html = renderStep2Environments(); break;
      case 3: html = renderStep3Styles(); break;
      case 4: html = renderStep4Palettes(); break;
      case 5: html = renderStep5Materials(); break;
      case 6: html = renderStep6Combinations(); break;
      case 7: html = renderStep7Lighting(); break;
      case 8: html = renderStep8Living(); break;
      case 9: html = renderStep9ProjectContext(); break;
      case 10: html = renderStep10Reveal(); break;
    }

    if (ui.returnToReveal && step > 1 && step < 10) {
      const banner = `
        <div class="return-edit-banner" style="margin-top:1.25rem;margin-bottom:0;">
          <p class="return-edit-banner__text">
            <strong>Modo de ajuste:</strong> altere suas preferências abaixo e volte direto para o seu painel final atualizado.
          </p>
          <button type="button" class="btn-primary" id="returnToRevealBannerBtn" style="background:var(--bronze);border-color:var(--bronze);padding:0.6rem 1.25rem;">
            Voltar ao meu perfil
          </button>
        </div>
      `;
      html = banner + html;
    }

    els.stageContainer.innerHTML = html;
    bindStageEvents(step);
  }

  function renderReflectionHtml(step) {
    const text = buildContextualReflection(step);
    if (!text) return '';
    return `
      <div class="reflection-whisper" role="status">
        <span class="reflection-whisper__dot" aria-hidden="true"></span>
        <div>
          <p class="reflection-whisper__text">“${escapeHtml(text)}”</p>
          <span class="reflection-whisper__hint">Percepção inicial — você pode refinar ou alterar suas escolhas a qualquer momento.</span>
        </div>
      </div>
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

  function checkMarkHtml() {
    return `
      <span class="choice-card__check" aria-hidden="true">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </span>
    `;
  }

  // ETAPA 01 — BOAS-VINDAS
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
            Vamos descobrir os detalhes que tornam um ambiente verdadeiramente seu. Uma jornada visual, leve e personalizada para traduzir o seu olhar em arquitetura.
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
          <p class="welcome-note">Sem questionários longos · Cerca de 4 minutos · Suas escolhas são salvas automaticamente</p>
        </div>

        <div class="welcome-visual">
          <div class="welcome-frame">
            <img src="assets/va-ref-01.webp" alt="Ambiente contemporâneo em gesso mineral, linho cru e carvalho sob luz natural" />
          </div>
          <div class="welcome-inset" aria-hidden="true">
            <img src="assets/va-ref-02.webp" alt="" />
          </div>
        </div>
      </section>
    `;
  }

  // ETAPA 02 — CONEXÃO COM OS AMBIENTES
  function renderStep2Environments() {
    const selected = draft.selections.environments;
    return `
      <section class="stage-shell">
        <div class="stage-header">
          <p class="eyebrow">Capítulo 02 · Conexão com os Ambientes</p>
          <h1 class="stage-title">Em qual destes espaços você gostaria de <em>estar?</em></h1>
          <p class="stage-lead">
            Observe a luz, as proporções e a sensação de cada ambiente. Selecione um ou mais espaços que despertem acolhimento imediato — você pode ampliar qualquer fotografia.
          </p>
          ${renderReflectionHtml(2)}
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

  // ETAPA 03 — DESCOBERTA DOS ESTILOS
  function renderStep3Styles() {
    const scores = computeAffinityScores(draft.selections);
    const suggestedGroupId = getSuggestedStyleGroup(scores);
    if (!ui.activeStyleGroup) {
      ui.activeStyleGroup = suggestedGroupId;
    }

    const activeGroup =
      DATA.styleGroups.find((g) => g.id === ui.activeStyleGroup) || DATA.styleGroups[0];
    const groupStyles = DATA.styles.filter((st) => st.groupId === activeGroup.id);

    return `
      <section class="stage-shell">
        <div class="stage-header">
          <p class="eyebrow">Capítulo 03 · Descoberta dos Estilos</p>
          <h1 class="stage-title">Quais linguagens arquitetônicas conversam com <em>você?</em></h1>
          <p class="stage-lead">
            Organizamos os estilos em três famílias para facilitar a comparação. Sinta-se livre para escolher referências de grupos diferentes — projetos autorais nascem de combinações híbridas.
          </p>
          ${renderReflectionHtml(3)}
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
                    <span class="choice-card__kicker">${escapeHtml(activeGroup.title)}</span>
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

  // ETAPA 04 — PALETAS E SENSAÇÕES
  function renderStep4Palettes() {
    const selected = draft.selections.palettes;
    const activePalettes = selected.map((id) => findById(DATA.palettes, id)).filter(Boolean);

    return `
      <section class="stage-shell">
        <div class="stage-header">
          <p class="eyebrow">Capítulo 04 · Paletas e Sensações</p>
          <h1 class="stage-title">Como as cores transformam a <em>sensação</em> do espaço?</h1>
          <p class="stage-lead">
            Observe cada família cromática aplicada em ambientes reais. Selecione uma ou mais paletas que traduzam o clima que você deseja sentir diariamente.
          </p>
          ${renderReflectionHtml(4)}
        </div>

        ${
          activePalettes.length
            ? `
            <div class="palette-preview-strip">
              <div>
                <span class="choice-card__kicker">Sua curadoria cromática atual</span>
                <p style="font-size:0.9rem;color:var(--ink-primary);margin-top:0.2rem;">
                  ${activePalettes.map((p) => escapeHtml(p.title)).join(' · ')}
                </p>
              </div>
              <div class="palette-preview-strip__swatches">
                ${activePalettes
                  .flatMap((p) => p.colors.slice(0, 3))
                  .map((hex) => `<span class="palette-dot" style="background:${hex}" title="${hex}"></span>`)
                  .join('')}
              </div>
            </div>
          `
            : ''
        }

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
                    <div class="swatch-bar" aria-label="Amostras da paleta ${escapeHtml(pal.title)}">
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

  // ETAPA 05 — MATERIAIS E TEXTURAS
  function renderStep5Materials() {
    const selected = draft.selections.materials;
    const mode = ui.materialViewMode;

    return `
      <section class="stage-shell">
        <div class="stage-header">
          <p class="eyebrow">Capítulo 05 · Materiais e Texturas</p>
          <h1 class="stage-title">Quais superfícies convidam ao <em>toque?</em></h1>
          <p class="stage-lead">
            Alterne entre o detalhe da textura e a aplicação arquitetônica para perceber relevo, acabamento e comportamento da luz. Selecione os materiais que despertam sua identificação.
          </p>
          ${renderReflectionHtml(5)}
        </div>

        <div class="view-mode-bar">
          <div class="segmented-toggle" role="group" aria-label="Modo de visualização dos materiais">
            <button type="button" class="segmented-toggle__btn ${mode === 'sample' ? 'is-active' : ''}" data-mat-mode="sample">Detalhe e Textura</button>
            <button type="button" class="segmented-toggle__btn ${mode === 'applied' ? 'is-active' : ''}" data-mat-mode="applied">Aplicado no Ambiente</button>
          </div>
          <span style="font-size:0.82rem;color:var(--ink-muted);">
            ${selected.length} ${selected.length === 1 ? 'material selecionado' : 'materiais selecionados'}
          </span>
        </div>

        <div class="visual-grid">
          ${DATA.materials
            .map((mat) => {
              const isSel = selected.includes(mat.id);
              const imgUrl = mode === 'applied' ? mat.appliedImage : mat.sampleImage;
              return `
                <article class="choice-card ${isSel ? 'is-selected' : ''}" tabindex="0" role="checkbox" aria-checked="${isSel}" data-select-type="materials" data-id="${mat.id}">
                  <div class="choice-card__media">
                    <img src="${imgUrl}" alt="${escapeHtml(mat.title)}" loading="lazy" />
                    <span class="choice-card__badge">${escapeHtml(mat.category)}</span>
                    ${checkMarkHtml()}
                    ${zoomBtnHtml(imgUrl, mat.title, `${mat.finish} — ${mat.desc}`)}
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

  // ETAPA 06 — COMBINAÇÕES DE MATERIAIS
  function renderStep6Combinations() {
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
          <p class="eyebrow">Capítulo 06 · Combinações de Materiais</p>
          <h1 class="stage-title">Que diálogo de matérias produz a sensação que você <em>procura?</em></h1>
          <p class="stage-lead">
            Ordenamos composições harmoniosas considerando suas escolhas anteriores — você pode selecionar suas favoritas ou experimentar sua própria tríade abaixo.
          </p>
          ${renderReflectionHtml(6)}
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
                    <div class="combo-tags">
                      ${cmb.elements.map((el) => `<span class="combo-tag">${escapeHtml(el)}</span>`).join('')}
                    </div>
                  </div>
                </article>
              `;
            })
            .join('')}
        </div>

        <div class="composer-box">
          <p class="eyebrow" style="margin-bottom:0.45rem;">Experimente combinar (opcional)</p>
          <h2 style="font-family:var(--font-display);font-size:1.75rem;font-weight:400;">Monte sua própria tríade material</h2>
          <p style="font-size:0.88rem;color:var(--ink-secondary);margin-top:0.35rem;">
            Escolha uma base mineral, uma madeira e um detalhe tátil para registrar uma combinação personalizada no seu moodboard.
          </p>

          <div class="composer-grid">
            ${[
              { key: 'stone', title: '1. Base Mineral / Pedra', items: DATA.composerSlots.stone },
              { key: 'wood', title: '2. Madeira / Estrutura', items: DATA.composerSlots.wood },
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
                <div>
                  <span class="choice-card__kicker">Tríade personalizada registrada</span>
                  <p style="font-size:0.88rem;color:var(--ink-primary);">
                    ${[stoneItem?.label, woodItem?.label, accentItem?.label].filter(Boolean).join(' + ')}
                  </p>
                </div>
              </div>
              <button type="button" class="btn-link-subtle" id="clearComposerBtn">Limpar tríade</button>
            </div>
          `
              : ''
          }
        </div>
      </section>
    `;
  }

  // ETAPA 07 — ILUMINAÇÃO E ATMOSFERA
  function renderStep7Lighting() {
    const activeScenario =
      findById(DATA.lightingScenarios, draft.selections.lightingScenario) ||
      DATA.lightingScenarios[0];
    const baseScenario = DATA.lightingScenarios[0]; // Luz Natural Abundante como referência esquerda
    const split = ui.lightingCompareSplit;

    return `
      <section class="stage-shell">
        <div class="stage-header">
          <p class="eyebrow">Capítulo 07 · Iluminação e Atmosfera</p>
          <h1 class="stage-title">Como a luz deve <em>vestir</em> o seu espaço?</h1>
          <p class="stage-lead">
            Compare o mesmo ambiente preservando exatamente os mesmos materiais e geometria. Arraste o divisor na imagem para perceber como a temperatura e a direção da luz transformam a atmosfera.
          </p>
          ${renderReflectionHtml(7)}
        </div>

        <div class="lighting-studio">
          <div>
            <div class="lighting-viewport" id="lightingViewport">
              <!-- Camada direita: cenário selecionado -->
              <div class="lighting-layer">
                <img src="assets/va-ref-01.webp" alt="Ambiente com ${escapeHtml(activeScenario.title)}" style="filter:${activeScenario.filter};" />
                <div class="lighting-layer__wash" style="background:${activeScenario.overlay};"></div>
              </div>

              <!-- Camada esquerda (recortada pelo slider): luz natural de referência -->
              <div class="lighting-layer lighting-layer--compare" id="lightingCompareLayer" style="clip-path:inset(0 ${100 - split}% 0 0);">
                <img src="assets/va-ref-01.webp" alt="Referência em luz natural abundante" style="filter:${baseScenario.filter};" />
                <div class="lighting-layer__wash" style="background:${baseScenario.overlay};"></div>
              </div>

              <span class="lighting-label lighting-label--left">Luz Natural · 5000K</span>
              <span class="lighting-label lighting-label--right">${escapeHtml(activeScenario.title)}</span>

              <div class="lighting-divider" id="lightingDivider" style="left:${split}%;">
                <div class="lighting-divider__handle" aria-hidden="true">⇄</div>
              </div>

              <input type="range" min="5" max="95" value="${split}" class="lighting-range" id="lightingRange" aria-label="Comparar luz natural com o cenário selecionado" />
            </div>
            <p style="margin-top:0.65rem;font-size:0.78rem;color:var(--ink-muted);">
              Arraste da esquerda para a direita sobre a fotografia para comparar a iluminação no mesmo espaço.
            </p>
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

        <div class="sub-block">
          <h2 class="sub-block__title">Quais qualidades de iluminação mais lhe agradam?</h2>
          <div class="pill-grid">
            ${DATA.lightingPreferences
              .map((lp) => {
                const isSel = draft.selections.lightingPreferences.includes(lp.id);
                return `
                  <button type="button" class="pill-tile ${isSel ? 'is-selected' : ''}" aria-pressed="${isSel}" data-select-type="lightingPreferences" data-id="${lp.id}">
                    <div class="pill-tile__title">${escapeHtml(lp.title)}</div>
                    <p class="pill-tile__desc">${escapeHtml(lp.desc)}</p>
                  </button>
                `;
              })
              .join('')}
          </div>
        </div>
      </section>
    `;
  }

  // ETAPA 08 — PERSONALIDADE E FORMA DE VIVER
  function renderStep8Living() {
    const s = draft.selections;
    return `
      <section class="stage-shell">
        <div class="stage-header">
          <p class="eyebrow">Capítulo 08 · Personalidade e Forma de Viver</p>
          <h1 class="stage-title">Como você gostaria de se sentir ao <em>chegar em casa?</em></h1>
          <p class="stage-lead">
            A estética ganha sentido quando acompanha o seu ritmo de vida. Escolha as sensações e os momentos que tornam um espaço realmente acolhedor para você.
          </p>
        </div>

        <div class="pill-grid">
          ${DATA.homeFeelings
            .map((f) => {
              const isSel = s.homeFeelings.includes(f.id);
              return `
                <button type="button" class="pill-tile ${isSel ? 'is-selected' : ''}" aria-pressed="${isSel}" data-select-type="homeFeelings" data-id="${f.id}">
                  <div class="pill-tile__title">${escapeHtml(f.title)}</div>
                  <p class="pill-tile__desc">${escapeHtml(f.desc)}</p>
                </button>
              `;
            })
            .join('')}
        </div>

        <div class="sub-block">
          <h2 class="sub-block__title">Qual destes espaços representa melhor o seu momento de descanso?</h2>
          <div class="visual-grid visual-grid--4">
            ${DATA.restSpaces
              .map((rs) => {
                const isSel = s.restSpace === rs.id;
                return `
                  <article class="choice-card ${isSel ? 'is-selected' : ''}" tabindex="0" role="radio" aria-checked="${isSel}" data-rest-space="${rs.id}">
                    <div class="choice-card__media">
                      <img src="${rs.image}" alt="${escapeHtml(rs.title)}" loading="lazy" />
                      ${checkMarkHtml()}
                    </div>
                    <div class="choice-card__body">
                      <h3 class="choice-card__title" style="font-size:1.22rem;">${escapeHtml(rs.title)}</h3>
                      <p class="choice-card__desc">${escapeHtml(rs.desc)}</p>
                    </div>
                  </article>
                `;
              })
              .join('')}
          </div>
        </div>

        <div class="sub-block">
          <h2 class="sub-block__title">O que faz um ambiente ser especial para você?</h2>
          <div class="chip-wrap">
            ${DATA.specialElements
              .map((el) => {
                const isSel = s.specialElements.includes(el.id);
                return `
                  <button type="button" class="chip-btn ${isSel ? 'is-selected' : ''}" aria-pressed="${isSel}" data-select-type="specialElements" data-id="${el.id}">
                    ${escapeHtml(el.label)}
                  </button>
                `;
              })
              .join('')}
          </div>
        </div>
      </section>
    `;
  }

  // ETAPA 09 — CONTEXTO DO PROJETO + CONTATO CONTEXTUALIZADO + LGPD
  function renderStep9ProjectContext() {
    const p = draft.projectContext;
    const c = draft.client;

    return `
      <section class="stage-shell">
        <div class="stage-header">
          <p class="eyebrow">Capítulo 09 · Contexto do Projeto</p>
          <h1 class="stage-title">Conte brevemente sobre o <em>espaço</em> que você imagina</h1>
          <p class="stage-lead">
            Apenas o essencial para conectar sua descoberta estética à realidade do projeto. Campos complementares são totalmente opcionais.
          </p>
        </div>

        <div class="form-card">
          <div class="field-group">
            <span class="field-label">Tipo de projeto</span>
            <div class="chip-wrap">
              ${DATA.projectOptions.types
                .map(
                  (t) => `
                <button type="button" class="chip-btn ${p.projectType === t ? 'is-selected' : ''}" data-ctx-single="projectType" data-ctx-val="${escapeHtml(t)}">${escapeHtml(t)}</button>
              `
                )
                .join('')}
            </div>
          </div>

          <div class="field-group">
            <span class="field-label">Natureza do imóvel</span>
            <div class="chip-wrap">
              ${DATA.projectOptions.categories
                .map(
                  (cat) => `
                <button type="button" class="chip-btn ${p.propertyCategory === cat ? 'is-selected' : ''}" data-ctx-single="propertyCategory" data-ctx-val="${escapeHtml(cat)}">${escapeHtml(cat)}</button>
              `
                )
                .join('')}
            </div>
          </div>

          <div class="field-group">
            <span class="field-label">Ambientes de interesse <span class="field-optional">(selecione um ou mais)</span></span>
            <div class="chip-wrap">
              ${DATA.projectOptions.rooms
                .map(
                  (rm) => `
                <button type="button" class="chip-btn ${p.rooms.includes(rm) ? 'is-selected' : ''}" data-ctx-room="${escapeHtml(rm)}">${escapeHtml(rm)}</button>
              `
                )
                .join('')}
            </div>
          </div>

          <div class="form-grid">
            <div class="field-group">
              <label class="field-label" for="ctxCity">Cidade e localização</label>
              <input class="field-input" id="ctxCity" type="text" placeholder="Ex: São Paulo, Jardins" value="${escapeHtml(p.city)}" data-ctx-input="city" />
            </div>

            <div class="field-group">
              <label class="field-label" for="ctxTimeline">Prazo desejado <span class="field-optional">(opcional)</span></label>
              <select class="field-select" id="ctxTimeline" data-ctx-input="timeline">
                <option value="">Selecione se já tiver previsão</option>
                ${DATA.projectOptions.timelines
                  .map(
                    (tl) => `<option value="${escapeHtml(tl)}" ${p.timeline === tl ? 'selected' : ''}>${escapeHtml(tl)}</option>`
                  )
                  .join('')}
              </select>
            </div>

            <div class="field-group field-group--full">
              <label class="field-label" for="ctxInvestment">Direcionamento de especificação e investimento <span class="field-optional">(discreto e opcional)</span></label>
              <select class="field-select" id="ctxInvestment" data-ctx-input="investmentRange">
                <option value="">Prefiro deixar em aberto por enquanto</option>
                ${DATA.projectOptions.investmentRanges
                  .map(
                    (inv) => `<option value="${escapeHtml(inv)}" ${p.investmentRange === inv ? 'selected' : ''}>${escapeHtml(inv)}</option>`
                  )
                  .join('')}
              </select>
            </div>

            <div class="field-group">
              <label class="field-label" for="ctxNeeds">Principais necessidades e prioridades <span class="field-optional">(opcional)</span></label>
              <textarea class="field-textarea" id="ctxNeeds" placeholder="O que precisa funcionar melhor no dia a dia?" data-ctx-input="needs">${escapeHtml(p.needs)}</textarea>
            </div>

            <div class="field-group">
              <label class="field-label" for="ctxRestrictions">Restrições ou referências adicionais <span class="field-optional">(opcional)</span></label>
              <textarea class="field-textarea" id="ctxRestrictions" placeholder="Algo que prefere evitar, peças existentes ou links de referência..." data-ctx-input="restrictions">${escapeHtml(p.restrictions)}</textarea>
            </div>
          </div>

          <hr style="border:none;border-top:1px solid var(--hairline);margin-block:0.4rem;" />

          <div>
            <p class="eyebrow" style="margin-bottom:0.4rem;">Para preparar sua síntese</p>
            <p style="font-size:0.86rem;color:var(--ink-secondary);margin-bottom:1rem;">
              Informe seus dados apenas se desejar compartilhar este perfil com a equipe da VA Arquitetura e Interiores.
            </p>
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
          </div>

          <label class="lgpd-box">
            <input type="checkbox" id="lgpdConsentCheck" ${c.lgpdConsent ? 'checked' : ''} />
            <span class="lgpd-box__text">
              <strong>Privacidade e LGPD:</strong> Concordo que a <strong>VA Arquitetura e Interiores</strong> armazene minhas preferências estéticas e dados de contato exclusivamente para a elaboração do briefing e atendimento do meu projeto. Posso solicitar a atualização ou exclusão destas informações a qualquer momento.
            </span>
          </label>
        </div>
      </section>
    `;
  }

  // ETAPA 10 — SUA IDENTIDADE ESTÉTICA (REVELAÇÃO GRATIFICANTE & PAINEL EDITÁVEL)
  function renderStep10Reveal() {
    const s = draft.selections;
    const p = draft.projectContext;
    const c = draft.client;
    const synthesis = buildAestheticSynthesis();
    const compass = computeAestheticCompass(s);

    const firstName = (c.name || '').trim().split(/\s+/)[0];
    const greetingTitle = firstName
      ? `${escapeHtml(firstName)}, descobrimos um pouco do que faz um espaço ser seu.`
      : 'Descobrimos um pouco do que faz um espaço ser seu.';

    const chosenEnvs = s.environments.map((id) => findById(DATA.environments, id)).filter(Boolean);
    const chosenStyles = s.styles.map((id) => findById(DATA.styles, id)).filter(Boolean);
    const chosenPalettes = s.palettes.map((id) => findById(DATA.palettes, id)).filter(Boolean);
    const chosenMaterials = s.materials.map((id) => findById(DATA.materials, id)).filter(Boolean);
    const chosenCombos = s.combinations.map((id) => findById(DATA.combinations, id)).filter(Boolean);
    const chosenLighting = s.lightingPreferences.map((id) => findById(DATA.lightingPreferences, id)).filter(Boolean);
    const activeScenario = findById(DATA.lightingScenarios, s.lightingScenario) || DATA.lightingScenarios[0];
    const chosenFeelings = s.homeFeelings.map((id) => findById(DATA.homeFeelings, id)).filter(Boolean);
    const chosenRest = findById(DATA.restSpaces, s.restSpace);
    const chosenSpecials = s.specialElements.map((id) => findById(DATA.specialElements, id)).filter(Boolean);

    const custom = s.customCombination;
    const customParts = [
      findById(DATA.composerSlots.stone, custom.stone),
      findById(DATA.composerSlots.wood, custom.wood),
      findById(DATA.composerSlots.accent, custom.accent)
    ].filter(Boolean);

    // Galeria visual real para o Moodboard
    const visualRefs = [];
    chosenEnvs.forEach((item) => visualRefs.push({ image: item.image, caption: item.title, desc: item.subtitle }));
    chosenStyles.forEach((item) => {
      if (!visualRefs.some((v) => v.image === item.image)) {
        visualRefs.push({ image: item.image, caption: `Estilo ${item.title}`, desc: item.desc });
      }
    });
    chosenMaterials.forEach((item) => {
      if (!visualRefs.some((v) => v.image === item.sampleImage)) {
        visualRefs.push({ image: item.sampleImage, caption: item.title, desc: item.desc });
      }
    });
    if (visualRefs.length === 0) {
      visualRefs.push(
        { image: 'assets/va-ref-01.webp', caption: 'Atmosfera Mineral', desc: 'Equilíbrio entre textura mineral e luz natural.' },
        { image: 'assets/va-ref-08.webp', caption: 'Curadoria Material', desc: 'Pedra natural, madeira e metais escovados.' },
        { image: 'assets/va-ref-04.webp', caption: 'Proporção e Luz', desc: 'Arquitetura serena e acolhedora.' }
      );
    }

    const editIcon = `
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M12 20h9"></path>
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
      </svg>
    `;

    // Explicações curatoriais personalizadas para cada bloco
    const envInsight = chosenEnvs.length
      ? `Sua escolha por ${chosenEnvs.map((e) => e.atmosphere.toLowerCase()).slice(0, 2).join(' e ')} mostra que você busca espaços onde a proporção e a atmosfera acolhem logo no primeiro olhar.`
      : 'Você ainda não selecionou ambientes de conexão — clique em editar para explorar espaços de referência.';

    const styleInsight =
      chosenStyles.length >= 2
        ? `Misturar ${chosenStyles.slice(0, 3).map((x) => x.title).join(' com ')} revela um gosto autoral e sofisticado: você valoriza o melhor de cada linguagem sem se prender a fórmulas prontas.`
        : chosenStyles.length === 1
          ? `A identificação com o estilo ${chosenStyles[0].title} traz clareza de direção, servindo como base para detalhes personalizados ao seu ritmo de vida.`
          : 'Ainda em aberto — você pode selecionar uma ou mais linguagens para enriquecer sua leitura estética.';

    const paletteInsight = chosenPalettes.length
      ? `Cores em torno de ${chosenPalettes.map((x) => x.feeling.toLowerCase()).slice(0, 2).join(' e ')} constroem a temperatura emocional da casa, influenciando diretamente o bem-estar diário.`
      : 'Selecione uma paleta para visualizar como as cores moldam a sensação dos seus espaços.';

    const matInsight = chosenMaterials.length
      ? `A preferência por ${chosenMaterials.slice(0, 3).map((m) => m.title.toLowerCase()).join(', ')} indica sensibilidade tátil: superfícies autênticas que envelhecem bem e trazem verdade ao toque.`
      : 'Explore madeiras, pedras, tecidos e acabamentos para definir a textura do seu projeto.';

    const comboInsight =
      chosenCombos.length || customParts.length
        ? 'Essas combinações já estabelecem um vocabulário material coerente entre piso, marcenaria, pedras e detalhes — prontas para guiar a especificação real.'
        : 'Você pode escolher uma composição pronta ou montar sua tríade personalizada de pedra, madeira e metal.';

    const lightInsight = `O cenário "${activeScenario.title}" (${activeScenario.kelvin}) ${
      chosenLighting.length
        ? `somado a ${chosenLighting.slice(0, 2).map((l) => l.title.toLowerCase()).join(' e ')}`
        : ''
    } orienta como a luz vai esculpir volumes, valorizar texturas e acompanhar os diferentes momentos do seu dia.`;

    const livingInsight = chosenFeelings.length
      ? `Acima da estética, o espaço precisa entregar ${chosenFeelings.slice(0, 3).map((f) => f.title.toLowerCase()).join(', ')} — esse é o verdadeiro ponto de partida de um projeto sob medida.`
      : 'Conte como você deseja se sentir em casa para conectarmos a estética à sua rotina.';

    const projectSummaryParts = [
      p.projectType,
      p.propertyCategory,
      p.city,
      p.timeline,
      p.investmentRange
    ].filter(Boolean);

    const isSubmitted = Boolean(draft.submittedRecordId);

    return `
      <section class="stage-shell">
        <!-- 1. HERO DE REVELAÇÃO + BÚSSOLA DO SEU OLHAR -->
        <div class="reveal-hero reveal-stagger-1">
          <svg class="reveal-hero__arc" viewBox="0 0 360 360" fill="none" aria-hidden="true">
            <path d="M30 340C30 168.792 168.792 30 340 30" stroke="#C6A982" stroke-width="1.2" />
            <path d="M95 340C95 204.69 204.69 95 340 95" stroke="#F4EFE6" stroke-width="0.8" stroke-opacity="0.35" />
          </svg>

          <div class="reveal-hero__grid">
            <div>
              <p class="eyebrow">Sua Identidade Estética · VA Arquitetura e Interiores</p>
              <h1 class="reveal-hero__title">${greetingTitle}</h1>
              <p class="reveal-hero__synthesis">${escapeHtml(synthesis.narrative)}</p>
              <div class="reveal-tags">
                <span class="reveal-tag">${escapeHtml(synthesis.headline)}</span>
                ${synthesis.tags.map((t) => `<span class="reveal-tag">${escapeHtml(t)}</span>`).join('')}
              </div>
            </div>

            <div class="reveal-compass" aria-label="Bússola estética baseada nas suas escolhas">
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

        <!-- 2. MOODBOARD VISUAL INTERATIVO -->
        <div class="moodboard-panel reveal-stagger-2">
          <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:baseline;gap:0.75rem;margin-bottom:1rem;">
            <div>
              <span class="choice-card__kicker">Curadoria Visual</span>
              <h2 class="moodboard-panel__title" style="margin-bottom:0;">Seu Moodboard Personalizado</h2>
            </div>
            <span style="font-size:0.78rem;color:var(--ink-muted);">Toque em qualquer imagem para ampliar</span>
          </div>

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

          ${
            chosenPalettes.length
              ? `
            <div style="margin-top:1.35rem;display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1rem;">
              ${chosenPalettes
                .map(
                  (pal) => `
                <div>
                  <span style="font-size:0.8rem;color:var(--ink-secondary);">${escapeHtml(pal.title)} · <em>${escapeHtml(pal.feeling)}</em></span>
                  <div class="swatch-bar">
                    ${pal.colors.map((hex) => `<span style="background:${hex}" title="${hex}"></span>`).join('')}
                  </div>
                </div>
              `
                )
                .join('')}
            </div>
          `
              : ''
          }
        </div>

        <!-- 3. PAINEL COMPLETO DE TODAS AS ESCOLHAS + EXPLICAÇÃO + EDITAR -->
        <div class="reveal-section-head reveal-stagger-3">
          <div>
            <p class="eyebrow" style="margin-bottom:0.35rem;">Leitura Detalhada & Controle Total</p>
            <h2 class="reveal-section-head__title">Todas as suas escolhas — edite o que quiser</h2>
          </div>
          <p class="reveal-section-head__sub">Ao alterar qualquer etapa, seu moodboard e sua leitura se atualizam na hora.</p>
        </div>

        <div class="editable-choices-grid reveal-stagger-3">
          <!-- Bloco 02: Ambientes -->
          <article class="editable-card">
            <div class="editable-card__top">
              <div>
                <span class="choice-card__kicker">Capítulo 02</span>
                <h3 class="editable-card__title">Ambientes de Conexão</h3>
              </div>
              <button type="button" class="btn-edit-inline no-print" data-edit-step="2">${editIcon}<span>Editar</span></button>
            </div>
            <div class="editable-card__thumbs">
              ${
                chosenEnvs.length
                  ? chosenEnvs
                      .map(
                        (e) => `
                    <span class="mini-ref-chip">
                      <img src="${e.image}" alt="" />
                      <span>${escapeHtml(e.title)}</span>
                    </span>
                  `
                      )
                      .join('')
                  : '<span class="combo-tag">Nenhuma seleção registrada</span>'
              }
            </div>
            <p class="choice-insight"><strong>O que isso revela:</strong> ${escapeHtml(envInsight)}</p>
          </article>

          <!-- Bloco 03: Estilos -->
          <article class="editable-card">
            <div class="editable-card__top">
              <div>
                <span class="choice-card__kicker">Capítulo 03</span>
                <h3 class="editable-card__title">Linguagens & Estilos</h3>
              </div>
              <button type="button" class="btn-edit-inline no-print" data-edit-step="3">${editIcon}<span>Editar</span></button>
            </div>
            <div class="editable-card__thumbs">
              ${
                chosenStyles.length
                  ? chosenStyles
                      .map(
                        (st) => `
                    <span class="mini-ref-chip">
                      <img src="${st.image}" alt="" />
                      <span>${escapeHtml(st.title)}</span>
                    </span>
                  `
                      )
                      .join('')
                  : '<span class="combo-tag">Exploração aberta</span>'
              }
            </div>
            <p class="choice-insight"><strong>O que isso revela:</strong> ${escapeHtml(styleInsight)}</p>
          </article>

          <!-- Bloco 04: Paletas -->
          <article class="editable-card">
            <div class="editable-card__top">
              <div>
                <span class="choice-card__kicker">Capítulo 04</span>
                <h3 class="editable-card__title">Paletas e Sensações</h3>
              </div>
              <button type="button" class="btn-edit-inline no-print" data-edit-step="4">${editIcon}<span>Editar</span></button>
            </div>
            <div class="editable-card__thumbs">
              ${
                chosenPalettes.length
                  ? chosenPalettes
                      .map(
                        (pal) => `
                    <span class="mini-ref-chip">
                      <span class="palette-dot" style="width:20px;height:20px;background:${pal.colors[2]};"></span>
                      <span>${escapeHtml(pal.title)}</span>
                    </span>
                  `
                      )
                      .join('')
                  : '<span class="combo-tag">Nenhuma paleta selecionada</span>'
              }
            </div>
            <p class="choice-insight"><strong>O que isso revela:</strong> ${escapeHtml(paletteInsight)}</p>
          </article>

          <!-- Bloco 05: Materiais -->
          <article class="editable-card">
            <div class="editable-card__top">
              <div>
                <span class="choice-card__kicker">Capítulo 05</span>
                <h3 class="editable-card__title">Materiais e Texturas</h3>
              </div>
              <button type="button" class="btn-edit-inline no-print" data-edit-step="5">${editIcon}<span>Editar</span></button>
            </div>
            <div class="editable-card__thumbs">
              ${
                chosenMaterials.length
                  ? chosenMaterials
                      .map(
                        (m) => `
                    <span class="mini-ref-chip">
                      <span class="palette-dot" style="width:20px;height:20px;background:${m.swatch};"></span>
                      <span>${escapeHtml(m.title)}</span>
                    </span>
                  `
                      )
                      .join('')
                  : '<span class="combo-tag">Nenhum material selecionado</span>'
              }
            </div>
            <p class="choice-insight"><strong>O que isso revela:</strong> ${escapeHtml(matInsight)}</p>
          </article>

          <!-- Bloco 06: Combinações -->
          <article class="editable-card">
            <div class="editable-card__top">
              <div>
                <span class="choice-card__kicker">Capítulo 06</span>
                <h3 class="editable-card__title">Combinações Favoritas</h3>
              </div>
              <button type="button" class="btn-edit-inline no-print" data-edit-step="6">${editIcon}<span>Editar</span></button>
            </div>
            <div class="editable-card__thumbs">
              ${chosenCombos.map((cmb) => `<span class="combo-tag">${escapeHtml(cmb.title)}</span>`).join('')}
              ${
                customParts.length
                  ? `<span class="combo-tag" style="background:var(--bronze-soft);color:var(--bronze-dark);">Sua tríade: ${customParts.map((x) => escapeHtml(x.label)).join(' + ')}</span>`
                  : ''
              }
              ${!chosenCombos.length && !customParts.length ? '<span class="combo-tag">A definir em conjunto</span>' : ''}
            </div>
            <p class="choice-insight"><strong>O que isso revela:</strong> ${escapeHtml(comboInsight)}</p>
          </article>

          <!-- Bloco 07: Iluminação -->
          <article class="editable-card">
            <div class="editable-card__top">
              <div>
                <span class="choice-card__kicker">Capítulo 07</span>
                <h3 class="editable-card__title">Iluminação e Atmosfera</h3>
              </div>
              <button type="button" class="btn-edit-inline no-print" data-edit-step="7">${editIcon}<span>Editar</span></button>
            </div>
            <div class="editable-card__thumbs">
              <span class="combo-tag" style="background:var(--bronze-soft);color:var(--bronze-dark);">${escapeHtml(activeScenario.title)} · ${escapeHtml(activeScenario.kelvin)}</span>
              ${chosenLighting.map((l) => `<span class="combo-tag">${escapeHtml(l.title)}</span>`).join('')}
            </div>
            <p class="choice-insight"><strong>O que isso revela:</strong> ${escapeHtml(lightInsight)}</p>
          </article>

          <!-- Bloco 08: Forma de Viver -->
          <article class="editable-card">
            <div class="editable-card__top">
              <div>
                <span class="choice-card__kicker">Capítulo 08</span>
                <h3 class="editable-card__title">Personalidade & Forma de Viver</h3>
              </div>
              <button type="button" class="btn-edit-inline no-print" data-edit-step="8">${editIcon}<span>Editar</span></button>
            </div>
            <div class="editable-card__thumbs">
              ${chosenFeelings.map((f) => `<span class="combo-tag">${escapeHtml(f.title)}</span>`).join('')}
              ${chosenRest ? `<span class="mini-ref-chip"><img src="${chosenRest.image}" alt="" /><span>${escapeHtml(chosenRest.title)}</span></span>` : ''}
              ${chosenSpecials.map((sp) => `<span class="combo-tag">${escapeHtml(sp.label)}</span>`).join('')}
              ${!chosenFeelings.length && !chosenRest && !chosenSpecials.length ? '<span class="combo-tag">Nenhuma sensação registrada</span>' : ''}
            </div>
            <p class="choice-insight"><strong>O que isso revela:</strong> ${escapeHtml(livingInsight)}</p>
          </article>

          <!-- Bloco 09: Contexto do Projeto -->
          <article class="editable-card">
            <div class="editable-card__top">
              <div>
                <span class="choice-card__kicker">Capítulo 09</span>
                <h3 class="editable-card__title">Contexto do Projeto</h3>
              </div>
              <button type="button" class="btn-edit-inline no-print" data-edit-step="9">${editIcon}<span>Editar</span></button>
            </div>
            <div class="editable-card__thumbs">
              ${
                projectSummaryParts.length
                  ? projectSummaryParts.map((item) => `<span class="combo-tag">${escapeHtml(item)}</span>`).join('')
                  : '<span class="combo-tag">Informações opcionais ainda não preenchidas</span>'
              }
              ${(p.rooms || []).map((rm) => `<span class="combo-tag">${escapeHtml(rm)}</span>`).join('')}
            </div>
            <p class="choice-insight">
              <strong>Resumo prático:</strong>
              ${
                p.needs || p.restrictions
                  ? escapeHtml([p.needs, p.restrictions].filter(Boolean).join(' · '))
                  : 'Quando estiver pronto, adicione cidade, ambientes ou necessidades específicas para agilizar o primeiro encontro.'
              }
            </p>
          </article>
        </div>

        <!-- 4. COMPARTILHAR COM A VIDART / SALVAR PDF / LGPD -->
        <div class="reveal-cta-box reveal-stagger-4 no-print">
          <div style="max-width:54ch;">
            <p class="eyebrow" style="margin-bottom:0.35rem;">Próximo Passo</p>
            <h2 style="font-family:var(--font-display);font-size:1.9rem;font-weight:400;">Compartilhe sua descoberta com a Vidart</h2>
            <p style="font-size:0.9rem;color:var(--ink-secondary);margin-top:0.35rem;">
              Este perfil traduz suas preferências reais em um ponto de partida claro para que nossa equipe desenvolva uma proposta verdadeiramente alinhada ao seu olhar.
            </p>
            ${
              !c.lgpdConsent
                ? `
              <label class="lgpd-box" style="margin-top:1rem;">
                <input type="checkbox" id="revealLgpdCheck" />
                <span class="lgpd-box__text">Autorizo o armazenamento deste perfil pela VA Arquitetura e Interiores exclusivamente para atendimento e briefing do meu projeto (LGPD).</span>
              </label>
            `
                : ''
            }
            ${
              ui.submitFeedback
                ? `<div class="status-banner" role="status">${escapeHtml(ui.submitFeedback)}</div>`
                : ''
            }
          </div>

          <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center;">
            <button type="button" class="btn-primary" id="submitProfileBtn">
              <span>${isSubmitted ? 'Atualizar perfil enviado' : 'Enviar perfil para a Vidart'}</span>
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

  function bindStageEvents(step) {
    // Banner de retorno rápido ao perfil final (quando editando a partir da Etapa 10)
    const returnBannerBtn = document.getElementById('returnToRevealBannerBtn');
    if (returnBannerBtn) {
      returnBannerBtn.addEventListener('click', () => goToStep(10));
    }

    // Botões "Editar" inline de cada bloco na Etapa 10
    els.stageContainer.querySelectorAll('[data-edit-step]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = Number(btn.dataset.editStep);
        if (target >= 2 && target <= 9) {
          goToStep(target, { returnToReveal: true });
        }
      });
    });

    // Etapa 01
    const startBtn = document.getElementById('startJourneyBtn');
    if (startBtn) {
      startBtn.addEventListener('click', () => goToStep(2));
    }
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

    // Lightbox zoom buttons (stopPropagation para não selecionar o card)
    els.stageContainer.querySelectorAll('[data-zoom-img]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openLightbox(btn.dataset.zoomImg, btn.dataset.zoomTitle, btn.dataset.zoomDesc);
      });
    });

    // Multi-select cards & pills
    els.stageContainer.querySelectorAll('[data-select-type]').forEach((card) => {
      const handleToggle = () => {
        const type = card.dataset.selectType;
        const id = card.dataset.id;
        toggleInArray(draft.selections[type], id);
        persist();
        render();
      };
      card.addEventListener('click', handleToggle);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleToggle();
        }
      });
    });

    // Etapa 03 — Troca de grupo de estilo
    els.stageContainer.querySelectorAll('[data-style-group]').forEach((tab) => {
      tab.addEventListener('click', () => {
        ui.activeStyleGroup = tab.dataset.styleGroup;
        render();
      });
    });

    // Etapa 05 — Toggle amostra vs aplicação
    els.stageContainer.querySelectorAll('[data-mat-mode]').forEach((btn) => {
      btn.addEventListener('click', () => {
        ui.materialViewMode = btn.dataset.matMode;
        render();
      });
    });

    // Etapa 06 — Compositor de tríade
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

    // Etapa 07 — Cenários e slider de comparação
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

    // Etapa 08 — Rest space (single choice)
    els.stageContainer.querySelectorAll('[data-rest-space]').forEach((card) => {
      const selectRest = () => {
        const id = card.dataset.restSpace;
        draft.selections.restSpace = draft.selections.restSpace === id ? null : id;
        persist();
        render();
      };
      card.addEventListener('click', selectRest);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectRest();
        }
      });
    });

    // Etapa 09 — Contexto do projeto e contato
    els.stageContainer.querySelectorAll('[data-ctx-single]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.ctxSingle;
        const val = btn.dataset.ctxVal;
        draft.projectContext[key] = draft.projectContext[key] === val ? '' : val;
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
    els.stageContainer.querySelectorAll('[data-ctx-input]').forEach((input) => {
      input.addEventListener('input', (e) => {
        draft.projectContext[input.dataset.ctxInput] = e.target.value;
        persist();
      });
    });
    els.stageContainer.querySelectorAll('[data-client-input]').forEach((input) => {
      input.addEventListener('input', (e) => {
        draft.client[input.dataset.clientInput] = e.target.value;
        persist();
      });
    });
    const lgpdCheck = document.getElementById('lgpdConsentCheck');
    if (lgpdCheck) {
      lgpdCheck.addEventListener('change', (e) => {
        draft.client.lgpdConsent = e.target.checked;
        draft.client.lgpdConsentAt = e.target.checked ? new Date().toISOString() : null;
        persist();
      });
    }

    // Etapa 10 — Envio, PDF, Revisão e Exclusão LGPD
    const revealLgpdCheck = document.getElementById('revealLgpdCheck');
    if (revealLgpdCheck) {
      revealLgpdCheck.addEventListener('change', (e) => {
        draft.client.lgpdConsent = e.target.checked;
        draft.client.lgpdConsentAt = e.target.checked ? new Date().toISOString() : null;
        persist();
      });
    }

    const submitBtn = document.getElementById('submitProfileBtn');
    if (submitBtn) {
      submitBtn.addEventListener('click', async () => {
        if (!draft.client.lgpdConsent) {
          ui.submitFeedback =
            'Para registrar e enviar seu perfil, marque a autorização de privacidade (LGPD) acima.';
          render();
          return;
        }
        markStepCompleted(10);
        const synthesis = buildAestheticSynthesis();
        const { record, remoteSync } = await STORE.submitBriefing(draft, synthesis);
        const syncMsg = remoteSync.configured
          ? remoteSync.ok
            ? ' e sincronizado com o servidor do estúdio.'
            : ' (salvo localmente; falha ao contatar o endpoint externo).'
          : ' no registro estruturado da VA Arquitetura.';
        ui.submitFeedback = `Perfil ${record.recordId} registrado com sucesso${syncMsg}`;
        render();
      });
    }

    const printPdfBtn = document.getElementById('printPdfBtn');
    if (printPdfBtn) {
      printPdfBtn.addEventListener('click', () => window.print());
    }

    const reviewBtn = document.getElementById('reviewChoicesBtn');
    if (reviewBtn) {
      reviewBtn.addEventListener('click', () => goToStep(2));
    }

    const eraseBtn = document.getElementById('eraseMyDataBtn');
    if (eraseBtn) {
      eraseBtn.addEventListener('click', () => {
        if (
          window.confirm(
            'Deseja excluir permanentemente suas respostas e dados pessoais desta sessão?'
          )
        ) {
          if (draft.submittedRecordId) {
            STORE.deleteRecord(draft.submittedRecordId);
          }
          draft = STORE.clearDraft();
          ui.activeStyleGroup = null;
          ui.submitFeedback = null;
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
  // PAINEL INTERNO PRIVADO DA EQUIPE DE ARQUITETURA
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
              Digite a chave de acesso para consultar os briefings individuais dos clientes.
            </p>
          </div>
          <div class="field-group">
            <label class="field-label" for="adminPinInput">Chave de acesso</label>
            <input class="field-input" id="adminPinInput" type="password" autocomplete="current-password" placeholder="Digite a senha da equipe" required />
          </div>
          <p id="adminPinError" style="font-size:0.82rem;color:#7A3B3B;" hidden>Chave incorreta. Tente novamente.</p>
          <button type="submit" class="btn-primary">Entrar no painel</button>
          <p style="font-size:0.74rem;color:var(--ink-muted);">Chave padrão inicial: <code>va2024</code> (alterável nas configurações).</p>
        </form>
      `;

      const form = document.getElementById('adminLoginForm');
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const pin = document.getElementById('adminPinInput').value;
        const ok = await STORE.verifyAdminPin(pin);
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
    const query = ui.adminSearch.trim().toLowerCase();
    const filtered = query
      ? records.filter(
          (r) =>
            (r.client?.name || '').toLowerCase().includes(query) ||
            (r.projectContext?.city || '').toLowerCase().includes(query) ||
            (r.recordId || '').toLowerCase().includes(query)
        )
      : records;

    if (!ui.adminSelectedId && filtered.length) {
      ui.adminSelectedId = filtered[0].recordId;
    }
    const activeRecord = filtered.find((r) => r.recordId === ui.adminSelectedId) || filtered[0] || null;

    els.adminBody.innerHTML = `
      <div class="admin-toolbar">
        <div class="segmented-toggle">
          <button type="button" class="segmented-toggle__btn ${ui.adminTab === 'records' ? 'is-active' : ''}" data-admin-tab="records">Briefings (${records.length})</button>
          <button type="button" class="segmented-toggle__btn ${ui.adminTab === 'settings' ? 'is-active' : ''}" data-admin-tab="settings">Configurações & Integração</button>
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
      <div class="form-card" style="max-width:680px;">
        <h3 style="font-family:var(--font-display);font-size:1.65rem;font-weight:400;">Persistência & Segurança</h3>
        <p style="font-size:0.86rem;color:var(--ink-secondary);">
          Por padrão, os registros ficam armazenados localmente no navegador de forma estruturada. Para centralizar respostas enviadas pelos clientes em qualquer celular, conecte um endpoint HTTP (Webhook, Supabase, Make ou Formspree) abaixo.
        </p>

        <div class="field-group">
          <label class="field-label" for="cfgWebhook">URL de Endpoint / Webhook (POST JSON) <span class="field-optional">(opcional)</span></label>
          <input class="field-input" id="cfgWebhook" type="url" placeholder="https://seu-endpoint.com/api/briefings" value="${escapeHtml(settings.webhookUrl)}" />
        </div>

        <div class="field-group">
          <label class="field-label" for="cfgNewPin">Alterar chave de acesso da equipe <span class="field-optional">(deixe em branco para manter)</span></label>
          <input class="field-input" id="cfgNewPin" type="password" placeholder="Nova senha da equipe" />
        </div>

        <div style="display:flex;align-items:center;gap:1rem;">
          <button type="button" class="btn-primary" id="saveAdminSettingsBtn">Salvar configurações</button>
          <span id="settingsSavedMsg" style="font-size:0.84rem;color:#254035;" hidden>Configurações atualizadas.</span>
        </div>
      </div>
    `;
  }

  function renderAdminRecords(filtered, activeRecord) {
    if (!filtered.length) {
      return `
        <div class="form-card" style="text-align:center;padding:3rem 1.5rem;">
          <h3 style="font-family:var(--font-display);font-size:1.6rem;font-weight:400;">Nenhum briefing registrado ainda</h3>
          <p style="font-size:0.88rem;color:var(--ink-secondary);max-width:48ch;margin:0.4rem auto 0;">
            Assim que um cliente concluir a jornada e autorizar o envio na Etapa 10, a ficha completa aparecerá organizada aqui para a equipe.
          </p>
        </div>
      `;
    }

    const r = activeRecord;
    const s = r.rawSelections || {};
    const p = r.projectContext || {};
    const c = r.client || {};

    const selectedThumbs = [
      ...(s.environments || []).map((id) => {
        const it = findById(DATA.environments, id);
        return it ? { img: it.image, label: `${it.title} (${id})` } : null;
      }),
      ...(s.styles || []).map((id) => {
        const it = findById(DATA.styles, id);
        return it ? { img: it.image, label: `${it.title} (${id})` } : null;
      }),
      ...(s.materials || []).map((id) => {
        const it = findById(DATA.materials, id);
        return it ? { img: it.sampleImage, label: `${it.title} (${id})` } : null;
      })
    ].filter(Boolean);

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
                <div style="font-size:0.78rem;color:var(--ink-muted);margin-top:0.25rem;">
                  ${escapeHtml(item.projectContext?.projectType || 'Interiores')} · ${escapeHtml(item.projectContext?.city || 'Local não informado')}
                </div>
                <div style="font-size:0.72rem;color:var(--ink-muted);margin-top:0.2rem;">
                  ${item.submittedAt ? new Date(item.submittedAt).toLocaleDateString('pt-BR') : ''} · ID ${escapeHtml(item.recordId)}
                </div>
              </button>
            `
              )
              .join('')}
          </div>
        </div>

        <div class="admin-detail">
          <div style="display:flex;flex-wrap:wrap;justify-content:space-between;gap:1rem;align-items:flex-start;border-bottom:1px solid var(--hairline);padding-bottom:1rem;">
            <div>
              <span class="choice-card__kicker">Ficha de Briefing · ${escapeHtml(r.recordId)}</span>
              <h3 style="font-family:var(--font-display);font-size:1.9rem;font-weight:400;">${escapeHtml(c.name)}</h3>
              <p style="font-size:0.84rem;color:var(--ink-secondary);">
                ${[c.email, c.phone].filter(Boolean).map(escapeHtml).join(' · ') || 'Contato não informado'}
              </p>
              <p style="font-size:0.74rem;color:var(--ink-muted);margin-top:0.25rem;">
                LGPD: ${c.lgpdConsent ? `Consentimento registrado em ${new Date(c.lgpdConsentAt).toLocaleString('pt-BR')}` : 'Pendente'}
              </p>
            </div>
            <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
              <button type="button" class="btn-secondary" id="adminPrintOneBtn">Exportar PDF</button>
              <button type="button" class="btn-link-subtle" id="adminDeleteOneBtn" style="color:#7A3B3B;">Excluir</button>
            </div>
          </div>

          <div>
            <span class="summary-item__label">Interpretação Automática (Síntese)</span>
            <p style="font-family:var(--font-display);font-size:1.25rem;margin-top:0.2rem;">${escapeHtml(r.aestheticSynthesis?.headline || '')}</p>
            <p style="font-size:0.86rem;color:var(--ink-secondary);margin-top:0.25rem;">${escapeHtml(r.aestheticSynthesis?.narrative || '')}</p>
          </div>

          <div>
            <span class="summary-item__label">Escolhas Originais do Cliente (Referências Selecionadas)</span>
            <div class="admin-thumbs" style="margin-top:0.6rem;">
              ${selectedThumbs
                .map(
                  (t) => `
                <div class="admin-thumb">
                  <img src="${t.img}" alt="${escapeHtml(t.label)}" />
                  <span>${escapeHtml(t.label)}</span>
                </div>
              `
                )
                .join('') || '<p style="font-size:0.84rem;color:var(--ink-muted);">Nenhuma imagem selecionada.</p>'}
            </div>
          </div>

          <div class="form-grid">
            <div>
              <span class="summary-item__label">Paletas & Combinações</span>
              <p style="font-size:0.85rem;margin-top:0.25rem;">
                ${(s.palettes || []).map((id) => escapeHtml(findById(DATA.palettes, id)?.title || id)).join(', ') || '—'}
              </p>
              <p style="font-size:0.82rem;color:var(--ink-secondary);margin-top:0.25rem;">
                ${(s.combinations || []).map((id) => escapeHtml(findById(DATA.combinations, id)?.title || id)).join(' | ') || ''}
              </p>
            </div>
            <div>
              <span class="summary-item__label">Iluminação & Sensações</span>
              <p style="font-size:0.85rem;margin-top:0.25rem;">
                ${(s.lightingPreferences || []).map((id) => escapeHtml(findById(DATA.lightingPreferences, id)?.title || id)).join(', ') || '—'}
              </p>
              <p style="font-size:0.82rem;color:var(--ink-secondary);margin-top:0.25rem;">
                ${(s.homeFeelings || []).map((id) => escapeHtml(findById(DATA.homeFeelings, id)?.title || id)).join(', ') || ''}
              </p>
            </div>
            <div>
              <span class="summary-item__label">Dados do Projeto</span>
              <p style="font-size:0.85rem;margin-top:0.25rem;">
                ${[p.projectType, p.propertyCategory, p.city, p.timeline, p.investmentRange].filter(Boolean).map(escapeHtml).join(' · ') || '—'}
              </p>
              <p style="font-size:0.82rem;color:var(--ink-secondary);margin-top:0.25rem;">
                Ambientes: ${(p.rooms || []).map(escapeHtml).join(', ') || '—'}
              </p>
            </div>
            <div>
              <span class="summary-item__label">Necessidades, Restrições & Pendências</span>
              <p style="font-size:0.84rem;margin-top:0.25rem;">${escapeHtml(p.needs || 'Sem observações de necessidade.')}</p>
              ${p.restrictions ? `<p style="font-size:0.82rem;color:var(--ink-secondary);margin-top:0.2rem;">Restrições: ${escapeHtml(p.restrictions)}</p>` : ''}
              ${
                (r.pendingFields || []).length
                  ? `<p style="font-size:0.76rem;color:var(--bronze-dark);margin-top:0.35rem;">Respostas pendentes: ${r.pendingFields.map(escapeHtml).join(', ')}</p>`
                  : ''
              }
            </div>
          </div>

          <div style="border-top:1px solid var(--hairline);padding-top:1rem;">
            <label class="field-label" for="adminTeamNotes">Observações Internas da Equipe (separadas das escolhas do cliente)</label>
            <textarea class="field-textarea" id="adminTeamNotes" placeholder="Anotações técnicas do arquiteto, ideias de layout, orçamento interno..." style="margin-top:0.45rem;">${escapeHtml(r.teamNotes || '')}</textarea>
            <div style="display:flex;align-items:center;gap:0.8rem;margin-top:0.65rem;">
              <select class="field-select" id="adminRecordStatus" style="max-width:220px;">
                ${['Novo', 'Em análise', 'Briefing validado', 'Em proposta'].map((st) => `<option value="${st}" ${r.status === st ? 'selected' : ''}>${st}</option>`).join('')}
              </select>
              <button type="button" class="btn-primary" id="saveTeamNotesBtn">Salvar notas internas</button>
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
    if (csvBtn) csvBtn.addEventListener('click', () => STORE.exportRecordsToCsv(records, DATA));

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
        const notes = document.getElementById('adminTeamNotes').value;
        const status = document.getElementById('adminRecordStatus').value;
        STORE.updateRecordTeamData(activeRecord.recordId, { teamNotes: notes, status });
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
      printOneBtn.addEventListener('click', () => {
        const w = window.open('', '_blank', 'width=900,height=700');
        if (!w) {
          window.print();
          return;
        }
        const s = activeRecord.rawSelections || {};
        const p = activeRecord.projectContext || {};
        const c = activeRecord.client || {};
        w.document.write(`
          <!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Briefing VA — ${escapeHtml(c.name)}</title>
          <style>
            body{font-family:Georgia,serif;color:#221E1A;padding:36px;line-height:1.55;}
            h1{font-weight:400;margin:0 0 4px;} .meta{font-family:sans-serif;font-size:12px;color:#666;margin-bottom:24px;}
            h2{font-family:sans-serif;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#967751;margin:22px 0 6px;border-bottom:1px solid #ddd;padding-bottom:4px;}
            p{font-family:sans-serif;font-size:13px;margin:4px 0;}
          </style></head><body>
          <h1>VA Arquitetura e Interiores — Dossiê de Briefing</h1>
          <div class="meta">Cliente: ${escapeHtml(c.name)} · ${escapeHtml(c.email)} · ${escapeHtml(c.phone)} · ID ${escapeHtml(activeRecord.recordId)}</div>
          <h2>Síntese Estética</h2>
          <p><strong>${escapeHtml(activeRecord.aestheticSynthesis?.headline || '')}</strong></p>
          <p>${escapeHtml(activeRecord.aestheticSynthesis?.narrative || '')}</p>
          <h2>Escolhas Originais</h2>
          <p><strong>Estilos:</strong> ${(s.styles || []).map((id) => escapeHtml(findById(DATA.styles, id)?.title || id)).join(', ') || '—'}</p>
          <p><strong>Paletas:</strong> ${(s.palettes || []).map((id) => escapeHtml(findById(DATA.palettes, id)?.title || id)).join(', ') || '—'}</p>
          <p><strong>Materiais:</strong> ${(s.materials || []).map((id) => escapeHtml(findById(DATA.materials, id)?.title || id)).join(', ') || '—'}</p>
          <p><strong>Combinações:</strong> ${(s.combinations || []).map((id) => escapeHtml(findById(DATA.combinations, id)?.title || id)).join(' | ') || '—'}</p>
          <p><strong>Iluminação:</strong> ${(s.lightingPreferences || []).map((id) => escapeHtml(findById(DATA.lightingPreferences, id)?.title || id)).join(', ') || '—'}</p>
          <p><strong>Sensações:</strong> ${(s.homeFeelings || []).map((id) => escapeHtml(findById(DATA.homeFeelings, id)?.title || id)).join(', ') || '—'}</p>
          <h2>Contexto do Projeto</h2>
          <p>${[p.projectType, p.propertyCategory, p.city, p.timeline, p.investmentRange].filter(Boolean).map(escapeHtml).join(' · ') || '—'}</p>
          <p><strong>Ambientes:</strong> ${(p.rooms || []).map(escapeHtml).join(', ') || '—'}</p>
          <p><strong>Necessidades:</strong> ${escapeHtml(p.needs || '—')}</p>
          <p><strong>Restrições:</strong> ${escapeHtml(p.restrictions || '—')}</p>
          <h2>Observações Internas da Equipe</h2>
          <p>${escapeHtml(activeRecord.teamNotes || 'Sem observações internas.')}</p>
          </body></html>
        `);
        w.document.close();
        w.focus();
        w.print();
      });
    }

    const saveSettingsBtn = document.getElementById('saveAdminSettingsBtn');
    if (saveSettingsBtn) {
      saveSettingsBtn.addEventListener('click', async () => {
        const webhookUrl = document.getElementById('cfgWebhook').value.trim();
        const newPin = document.getElementById('cfgNewPin').value.trim();
        STORE.saveSettings({ webhookUrl });
        if (newPin.length >= 4) {
          await STORE.updateAdminPin(newPin);
        }
        const msg = document.getElementById('settingsSavedMsg');
        if (msg) {
          msg.hidden = false;
          setTimeout(() => (msg.hidden = true), 2500);
        }
      });
    }
  }

  // =========================================================================
  // EVENTOS GLOBAIS & INICIALIZAÇÃO
  // =========================================================================

  els.brandHomeBtn.addEventListener('click', () => goToStep(1));
  els.prevStepBtn.addEventListener('click', () =>
    goToStep(ui.returnToReveal ? 10 : draft.currentStep - 1)
  );
  els.nextStepBtn.addEventListener('click', () =>
    goToStep(ui.returnToReveal ? 10 : draft.currentStep + 1)
  );
  els.skipStepBtn.addEventListener('click', () => goToStep(draft.currentStep + 1));

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

  // Registro do Service Worker (PWA)
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    });
  }

  // Primeira renderização
  render();
})();
