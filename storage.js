// =========================================================================
// VA. ARQUITETURA & INTERIORES — PERSISTÊNCIA UNIFICADA (FASE 1 + FASE 2)
// Armazena jornada estética + checklist inteligente de necessidades + prioridades
// no mesmo registro estruturado, preservando respostas originais e LGPD.
// =========================================================================

(function () {
  const SESSION_KEY = 'va_discovery_session_v4';
  const REGISTRY_KEY = 'va_briefings_registry_v4';
  const SETTINGS_KEY = 'va_studio_settings_v3';

  // SHA-256 de "va2024" (chave inicial padrão da equipe)
  const DEFAULT_PIN_HASH =
    '0bb7ca9c5fa96f7c95c79f405fd12d1b9ae6ec4c64d7e006c293eb759489102c';

  function generateId(prefix) {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') {
      return `${prefix}_${window.crypto.randomUUID().slice(0, 12)}`;
    }
    return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  }

  async function sha256(text) {
    const data = new TextEncoder().encode(text);
    if (window.crypto && window.crypto.subtle) {
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
      return Array.from(new Uint8Array(hashBuffer))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
    }
    let h = 2166136261;
    for (let i = 0; i < data.length; i++) {
      h ^= data[i];
      h = Math.imul(h, 16777619);
    }
    return 'fallback_' + (h >>> 0).toString(16);
  }

  function createEmptyDraft() {
    return {
      sessionId: generateId('ses'),
      questionnaireVersion: (window.VA_CHECKLIST && window.VA_CHECKLIST.VERSION) || '4.0',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      currentStep: 1,
      currentSubStep: 0,
      completedSteps: [],
      submittedRecordId: null,
      selections: {
        environments: [],
        styles: [],
        palettes: [],
        materials: [],
        combinations: [],
        customCombination: {
          stone: null,
          wood: null,
          accent: null
        },
        lightingScenario: 'natural_abundante',
        lightingPreferences: [],
        homeFeelings: [],
        restSpace: null,
        specialElements: []
      },
      projectContext: {
        projectType: '',       // Reforma | Construção | Interiores | Consultoria
        propertyCategory: 'Residencial', // Residencial | Comercial
        interiorStatus: '',    // novo | ocupado (quando Interiores)
        commercialSegment: '', // loja | escritorio | clinica | gastronomia | outro
        rooms: [],             // IDs estáveis: sala, cozinha, jantar, quarto...
        contextFlags: [],      // pets, criancas, acessibilidade
        city: '',
        timeline: ''
      },
      checklist: {
        displayedQuestionIds: [],
        answers: {},           // { [questionId]: [optionId, ...] }
        originalAnswers: {},   // preserva 1ª resposta original mesmo após revisões
        priorities: [],        // até 3 IDs ("questionId::optionId")
        notes: ''
      },
      client: {
        name: '',
        email: '',
        phone: '',
        lgpdConsent: false,
        lgpdConsentAt: null
      }
    };
  }

  function loadDraft() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return createEmptyDraft();
      const parsed = JSON.parse(raw);
      const base = createEmptyDraft();
      return {
        ...base,
        ...parsed,
        selections: {
          ...base.selections,
          ...(parsed.selections || {}),
          customCombination: {
            ...base.selections.customCombination,
            ...((parsed.selections && parsed.selections.customCombination) || {})
          }
        },
        projectContext: {
          ...base.projectContext,
          ...(parsed.projectContext || {})
        },
        checklist: {
          ...base.checklist,
          ...(parsed.checklist || {})
        },
        client: {
          ...base.client,
          ...(parsed.client || {})
        }
      };
    } catch (e) {
      return createEmptyDraft();
    }
  }

  function saveDraft(draft) {
    try {
      draft.updatedAt = new Date().toISOString();
      localStorage.setItem(SESSION_KEY, JSON.stringify(draft));
      return true;
    } catch (e) {
      return false;
    }
  }

  function clearDraft() {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch (e) {
      // noop
    }
    return createEmptyDraft();
  }

  function loadRegistry() {
    try {
      const raw = localStorage.getItem(REGISTRY_KEY);
      if (!raw) return [];
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch (e) {
      return [];
    }
  }

  function saveRegistry(records) {
    try {
      localStorage.setItem(REGISTRY_KEY, JSON.stringify(records));
      return true;
    } catch (e) {
      return false;
    }
  }

  function loadSettings() {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      return {
        pinHash: parsed.pinHash || DEFAULT_PIN_HASH,
        webhookUrl: parsed.webhookUrl || ''
      };
    } catch (e) {
      return {
        pinHash: DEFAULT_PIN_HASH,
        webhookUrl: ''
      };
    }
  }

  function saveSettings(partial) {
    const current = loadSettings();
    const next = { ...current, ...partial };
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
      return next;
    } catch (e) {
      return current;
    }
  }

  async function verifyAdminPin(pin) {
    const settings = loadSettings();
    const input = String(pin || '').trim();
    if (!input) return false;
    const hashed = await sha256(input);
    if (hashed === settings.pinHash) return true;
    if (hashed.startsWith('fallback_') && settings.pinHash === DEFAULT_PIN_HASH) {
      return input === 'va2024';
    }
    return false;
  }

  async function updateAdminPin(newPin) {
    const hashed = await sha256(String(newPin).trim());
    return saveSettings({ pinHash: hashed });
  }

  function computePendingFields(draft) {
    const pending = [];
    if (!draft.selections.environments.length) pending.push('Ambientes estéticos');
    if (!draft.selections.styles.length) pending.push('Estilos');
    if (!draft.selections.palettes.length) pending.push('Paletas');
    if (!draft.selections.materials.length) pending.push('Materiais');
    if (!draft.projectContext.projectType) pending.push('Tipo de projeto');
    if (draft.projectContext.propertyCategory === 'Residencial' && !draft.projectContext.rooms.length) {
      pending.push('Ambientes do projeto');
    }
    if (!draft.projectContext.city) pending.push('Cidade');
    return pending;
  }

  async function submitBriefing(draft, synthesis, checklistSummary) {
    const registry = loadRegistry();
    const now = new Date().toISOString();
    const existingIdx = draft.submittedRecordId
      ? registry.findIndex((r) => r.recordId === draft.submittedRecordId)
      : -1;

    const recordId =
      existingIdx >= 0 ? registry[existingIdx].recordId : generateId('va');

    const existingNotes = existingIdx >= 0 ? registry[existingIdx].teamNotes || '' : '';
    const existingStatus = existingIdx >= 0 ? registry[existingIdx].status || 'Novo' : 'Novo';
    const preservedFirstAnswers =
      existingIdx >= 0 && registry[existingIdx].checklist?.originalAnswers
        ? registry[existingIdx].checklist.originalAnswers
        : JSON.parse(JSON.stringify(draft.checklist.originalAnswers || draft.checklist.answers));

    const record = {
      recordId,
      sessionId: draft.sessionId,
      questionnaireVersion: draft.questionnaireVersion || '4.0',
      submittedAt: existingIdx >= 0 ? registry[existingIdx].submittedAt : now,
      updatedAt: now,
      status: existingStatus,
      completedSteps: [...draft.completedSteps],
      pendingFields: computePendingFields(draft),
      client: {
        name: (draft.client.name || '').trim() || 'Cliente sem identificação',
        email: (draft.client.email || '').trim(),
        phone: (draft.client.phone || '').trim(),
        lgpdConsent: Boolean(draft.client.lgpdConsent),
        lgpdConsentAt: draft.client.lgpdConsentAt || now
      },
      projectContext: JSON.parse(JSON.stringify(draft.projectContext)),
      rawSelections: JSON.parse(JSON.stringify(draft.selections)),
      checklist: {
        displayedQuestionIds: [...(draft.checklist.displayedQuestionIds || [])],
        answers: JSON.parse(JSON.stringify(draft.checklist.answers || {})),
        originalAnswers: preservedFirstAnswers,
        priorities: [...(draft.checklist.priorities || [])],
        notes: (draft.checklist.notes || '').trim(),
        summary: checklistSummary || null
      },
      aestheticSynthesis: JSON.parse(JSON.stringify(synthesis)),
      teamNotes: existingNotes
    };

    if (existingIdx >= 0) {
      registry[existingIdx] = record;
    } else {
      registry.unshift(record);
    }

    saveRegistry(registry);
    draft.submittedRecordId = recordId;
    saveDraft(draft);

    const settings = loadSettings();
    let remoteSync = { configured: false, ok: false };
    if (settings.webhookUrl) {
      remoteSync.configured = true;
      try {
        const res = await fetch(settings.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(record)
        });
        remoteSync.ok = res.ok;
      } catch (err) {
        remoteSync.ok = false;
      }
    }

    return { record, remoteSync };
  }

  function updateRecordTeamData(recordId, updates) {
    const registry = loadRegistry();
    const idx = registry.findIndex((r) => r.recordId === recordId);
    if (idx < 0) return null;
    if (typeof updates.teamNotes === 'string') registry[idx].teamNotes = updates.teamNotes;
    if (typeof updates.status === 'string') registry[idx].status = updates.status;
    registry[idx].teamUpdatedAt = new Date().toISOString();
    saveRegistry(registry);
    return registry[idx];
  }

  function deleteRecord(recordId) {
    const registry = loadRegistry().filter((r) => r.recordId !== recordId);
    saveRegistry(registry);
    const draft = loadDraft();
    if (draft.submittedRecordId === recordId) {
      draft.submittedRecordId = null;
      saveDraft(draft);
    }
    return registry;
  }

  function escapeCsvCell(val) {
    const str = String(val == null ? '' : val).replace(/\r?\n/g, ' | ');
    if (/[",;]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
    return str;
  }

  function exportRecordsToCsv(records, dataCatalog, checklistCatalog) {
    const qIndex = checklistCatalog ? checklistCatalog.getAllQuestionsIndex() : {};
    const lookup = (list, ids) =>
      (ids || [])
        .map((id) => {
          const item = (list || []).find((x) => x.id === id);
          return item ? `${item.title || item.label} (${id})` : id;
        })
        .join(' / ');

    const headers = [
      'ID Registro',
      'Versão',
      'Data Envio',
      'Status',
      'Nome',
      'E-mail',
      'Telefone',
      'Consentimento LGPD',
      'Tipo de Projeto',
      'Imóvel',
      'Ambientes',
      'Cidade',
      'Prazo',
      'Estilos',
      'Paletas',
      'Materiais',
      'Combinações',
      'Iluminação',
      'Top 3 Prioridades',
      'Checklist por Ambiente',
      'Observações do Cliente',
      'Observações da Equipe'
    ];

    const rows = records.map((r) => {
      const s = r.rawSelections || {};
      const p = r.projectContext || {};
      const c = r.client || {};
      const chk = r.checklist || {};

      const chkText = Object.entries(chk.answers || {})
        .map(([qId, optIds]) => {
          const q = qIndex[qId];
          if (!q || !optIds.length) return '';
          const labels = optIds.map((oid) => q.options.find((o) => o.id === oid)?.label || oid);
          return `${q.category}: ${labels.join(', ')}`;
        })
        .filter(Boolean)
        .join(' || ');

      const prioText = (chk.priorities || [])
        .map((pid) => {
          const [qId, optId] = pid.split('::');
          const q = qIndex[qId];
          const opt = q?.options.find((o) => o.id === optId);
          return opt ? `${q.category.split(' · ')[0]}: ${opt.label}` : pid;
        })
        .join(' | ');

      return [
        r.recordId,
        r.questionnaireVersion || '4.0',
        r.submittedAt ? new Date(r.submittedAt).toLocaleString('pt-BR') : '',
        r.status || 'Novo',
        c.name || '',
        c.email || '',
        c.phone || '',
        c.lgpdConsent ? `Sim (${c.lgpdConsentAt || ''})` : 'Não',
        p.projectType || '',
        `${p.propertyCategory || ''}${p.interiorStatus ? ' (' + p.interiorStatus + ')' : ''}${p.commercialSegment ? ' (' + p.commercialSegment + ')' : ''}`,
        (p.rooms || []).join(', '),
        p.city || '',
        p.timeline || '',
        lookup(dataCatalog.styles, s.styles),
        lookup(dataCatalog.palettes, s.palettes),
        lookup(dataCatalog.materials, s.materials),
        lookup(dataCatalog.combinations, s.combinations),
        lookup(dataCatalog.lightingPreferences, s.lightingPreferences),
        prioText,
        chkText,
        chk.notes || '',
        r.teamNotes || ''
      ];
    });

    const csvContent =
      '\uFEFF' +
      [headers, ...rows]
        .map((row) => row.map(escapeCsvCell).join(';'))
        .join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `VA-Briefings-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function exportRecordsToJson(records) {
    const blob = new Blob([JSON.stringify(records, null, 2)], {
      type: 'application/json;charset=utf-8;'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `VA-Briefings-Backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  window.VA_STORAGE = {
    createEmptyDraft,
    loadDraft,
    saveDraft,
    clearDraft,
    loadRegistry,
    saveRegistry,
    loadSettings,
    saveSettings,
    verifyAdminPin,
    updateAdminPin,
    submitBriefing,
    updateRecordTeamData,
    deleteRecord,
    exportRecordsToCsv,
    exportRecordsToJson
  };
})();
