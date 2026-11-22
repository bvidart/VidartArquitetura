// =========================================================================
// VA. ARQUITETURA & INTERIORES — CATÁLOGO EDITORIAL DE ALTO PADRÃO
// 100% ambientes de interiores e macro-superfícies arquitetônicas fiéis
// a cada proposta, estilo, paleta, material e cenário luminotécnico.
// =========================================================================

window.VA_DATA = {
  brand: {
    name: 'VA Arquitetura e Interiores',
    shortName: 'VA',
    tagline: 'Todo espaço começa com uma forma única de sentir.'
  },

  chapters: [
    { step: 1, code: '01', label: 'Boas-vindas', short: 'Início' },
    { step: 2, code: '02', label: 'Descoberta Estética', short: 'Estética' },
    { step: 3, code: '03', label: 'Materiais e Texturas', short: 'Materiais' },
    { step: 4, code: '04', label: 'Combinações de Materiais', short: 'Combinações' },
    { step: 5, code: '05', label: 'Iluminação e Atmosfera', short: 'Iluminação' },
    { step: 6, code: '06', label: 'Seu Jeito de Viver', short: 'Viver' },
    { step: 7, code: '07', label: 'Seu Projeto', short: 'Projeto' },
    { step: 8, code: '08', label: 'Necessidades & Identidade', short: 'Conclusão' }
  ],

  // Sala contemporânea alto padrão com travertino, madeira ripada e jardim verde
  welcomeHeroImage: 'assets/hero-living.webp',
  lightingBaseImage: 'assets/va-ref-04.webp',

  // ETAPA 02 (1/3) — AMBIENTES COMPLETOS DE ALTO PADRÃO (Títulos objetivos)
  environments: [
    {
      id: 'env_organico_mineral',
      title: 'Sala Orgânica com Pedra e Luz Natural',
      subtitle: 'Paredes curvas em reboco mineral, sofá em linho cru, travertino e carvalho.',
      atmosphere: 'Fluidez mineral',
      image: 'assets/va-ref-01.webp',
      tags: ['organico', 'natural', 'claro', 'suave', 'contemporaneo']
    },
    {
      id: 'env_classico_contemporaneo',
      title: 'Sala Clássica Contemporânea',
      subtitle: 'Boiseries limpas, lareira em travertino, piso espinha de peixe e latão.',
      atmosphere: 'Elegância clássica',
      image: 'assets/env-classico.webp',
      tags: ['classico', 'neoclassico', 'elegante', 'claro']
    },
    {
      id: 'env_mediterraneo_spa',
      title: 'Banheiro Spa Estilo Mediterrâneo',
      subtitle: 'Arcos em cal mineral, banheira esculpida em pedra calcária e luz zenital.',
      atmosphere: 'Spa mediterrâneo',
      image: 'assets/env-mediterraneo.webp',
      tags: ['minimalista', 'organico', 'natural', 'monocromatico']
    },
    {
      id: 'env_intimista_madeira',
      title: 'Refúgio Envolvente em Madeira',
      subtitle: 'Marcenaria em carvalho natural, pedra bruta e iluminação suave de apoio.',
      atmosphere: 'Intimidade em madeira',
      image: 'assets/va-ref-07.webp',
      tags: ['moderno', 'rustico_sofisticado', 'profundo', 'intimista', 'natural']
    },
    {
      id: 'env_minimal_aberturas',
      title: 'Sala Minimalista com Amplas Aberturas',
      subtitle: 'Concreto quente, forro em carvalho e grandes vãos de vidro voltados ao jardim.',
      atmosphere: 'Minimalismo aberto',
      image: 'assets/env-minimal.webp',
      tags: ['moderno', 'minimalista', 'contemporaneo', 'natural']
    },
    {
      id: 'env_cozinha_pedra',
      title: 'Cozinha Gourmet em Pedra e Carvalho',
      subtitle: 'Ilha monolítica em quartzito Taj Mahal e marcenaria ripada sem puxadores.',
      atmosphere: 'Convívio contemporâneo',
      image: 'assets/va-ref-05.webp',
      tags: ['contemporaneo', 'natural', 'claro']
    }
  ],

  // ETAPA 02 (2/3) — ESTILOS DE INTERIORES (100% ambientes internos de alto padrão)
  styleGroups: [
    {
      id: 'grp_pureza',
      title: 'Linhas, Proporção e Silêncio',
      subtitle: 'Composições limpas onde arquitetura, proporção e luz conduzem o olhar.',
      tags: ['contemporaneo', 'minimalista', 'moderno', 'japandi']
    },
    {
      id: 'grp_materia',
      title: 'Matéria, Natureza e Textura',
      subtitle: 'Espaços guiados pelo toque autêntico de madeiras, pedras e fibras naturais.',
      tags: ['organico', 'escandinavo', 'rustico_sofisticado', 'industrial']
    },
    {
      id: 'grp_expressao',
      title: 'História, Ritmo e Personalidade',
      subtitle: 'Referências atemporais, simetrias elegantes e curadoria autoral.',
      tags: ['classico', 'neoclassico', 'ecletico']
    }
  ],

  styles: [
    {
      id: 'sty_contemporaneo',
      groupId: 'grp_pureza',
      title: 'Contemporâneo',
      desc: 'Linhas atuais, marcenaria em nogueira, pedra neutra e iluminação arquitetônica.',
      image: 'assets/sty-contemporaneo.webp',
      tags: ['contemporaneo', 'natural', 'claro']
    },
    {
      id: 'sty_minimalista',
      groupId: 'grp_pureza',
      title: 'Minimalista',
      desc: 'Planos monolíticos em pedra calcária, marcenaria oculta e pureza espacial.',
      image: 'assets/sty-minimalista.webp',
      tags: ['minimalista', 'monocromatico', 'claro']
    },
    {
      id: 'sty_moderno',
      groupId: 'grp_pureza',
      title: 'Moderno',
      desc: 'Concreto aparente, madeira freijó, mobiliário geométrico e grandes vãos.',
      image: 'assets/sty-moderno.webp',
      tags: ['moderno', 'contraste', 'terroso']
    },
    {
      id: 'sty_japandi',
      groupId: 'grp_pureza',
      title: 'Japandi',
      desc: 'Madeira clara baixa, reboco mineral wabi-sabi, brises ripados e serenidade.',
      image: 'assets/sty-japandi.webp',
      tags: ['japandi', 'natural', 'suave']
    },
    {
      id: 'sty_organico',
      groupId: 'grp_materia',
      title: 'Orgânico',
      desc: 'Paredes curvas em gesso mineral, estofados curvos em bouclé e travertino.',
      image: 'assets/sty-organico.webp',
      tags: ['organico', 'natural', 'suave']
    },
    {
      id: 'sty_escandinavo',
      groupId: 'grp_materia',
      title: 'Escandinavo',
      desc: 'Madeira clara lavada, paredes luminosas, tramas naturais e luz abundante.',
      image: 'assets/sty-escandinavo.webp',
      tags: ['escandinavo', 'claro', 'natural']
    },
    {
      id: 'sty_rustico_sofisticado',
      groupId: 'grp_materia',
      title: 'Rústico Sofisticado',
      desc: 'Vigas de madeira natural, pedra artesanal, couro e linho com acabamento refinado.',
      image: 'assets/sty-rustico.webp',
      tags: ['rustico_sofisticado', 'terroso', 'natural']
    },
    {
      id: 'sty_industrial',
      groupId: 'grp_materia',
      title: 'Industrial',
      desc: 'Divisórias metálicas pretas, concreto aparente, couro caramelo e nogueira.',
      image: 'assets/sty-industrial.webp',
      tags: ['industrial', 'contraste', 'profundo']
    },
    {
      id: 'sty_classico',
      groupId: 'grp_expressao',
      title: 'Clássico',
      desc: 'Simetria rigorosa, boiseries tradicionais, mármore esculpido e piso parquet.',
      image: 'assets/sty-classico.webp',
      tags: ['classico', 'elegante']
    },
    {
      id: 'sty_neoclassico',
      groupId: 'grp_expressao',
      title: 'Neoclássico',
      desc: 'Releitura leve e luminosa com molduras suaves, mármore claro e mobiliário atual.',
      image: 'assets/sty-neoclassico.webp',
      tags: ['neoclassico', 'claro', 'elegante']
    },
    {
      id: 'sty_ecletico',
      groupId: 'grp_expressao',
      title: 'Eclético',
      desc: 'Curadoria autoral entre épocas, obras de arte, texturas e peças com história.',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=960&q=82',
      tags: ['ecletico', 'profundo', 'terroso']
    }
  ],

  // ETAPA 02 (3/3) — PALETAS E SENSAÇÕES (Ambientes de alto padrão fiéis às cores)
  palettes: [
    {
      id: 'pal_neutros_acolhedores',
      title: 'Tons Neutros e Acolhedores',
      feeling: 'Calor sereno',
      desc: 'Bege mineral, areia, linho cru e amadeirados suaves.',
      colors: ['#F5F1EA', '#E3D9C9', '#C5B39A', '#9A846B', '#5A4D3F'],
      image: 'assets/sty-organico.webp',
      tags: ['natural', 'claro', 'organico', 'contemporaneo']
    },
    {
      id: 'pal_claras_naturais',
      title: 'Paletas Claras e Naturais',
      feeling: 'Frescor luminoso',
      desc: 'Off-white mineral, carvalho lavado e amplitude luminosa.',
      colors: ['#FAF8F4', '#EFECE6', '#D8D1C4', '#B5AA97', '#7A7265'],
      image: 'assets/sty-escandinavo.webp',
      tags: ['claro', 'escandinavo', 'minimalista', 'japandi']
    },
    {
      id: 'pal_profundas_sofisticadas',
      title: 'Cores Profundas e Sofisticadas',
      feeling: 'Envolvimento noturno',
      desc: 'Madeiras profundas, pedra escura e bronze envelhecido.',
      colors: ['#E8E2D9', '#8E7B68', '#52443A', '#2E2824', '#181614'],
      image: 'assets/va-ref-07.webp',
      tags: ['profundo', 'intimista', 'moderno', 'classico']
    },
    {
      id: 'pal_contrastes_marcantes',
      title: 'Contrastes Marcantes',
      feeling: 'Precisão arquitetônica',
      desc: 'Diálogo nítido entre planos claros, preto metálico e tons escuros.',
      colors: ['#F7F6F3', '#D4D0C8', '#967751', '#383532', '#171513'],
      image: 'assets/sty-industrial.webp',
      tags: ['contraste', 'moderno', 'industrial', 'contemporaneo']
    },
    {
      id: 'pal_tons_terrosos',
      title: 'Tons Terrosos',
      feeling: 'Autenticidade tátil',
      desc: 'Madeira amendoada, couro sela, argila e terracota mineral.',
      colors: ['#F1EAE1', '#D4B79E', '#AD7C5D', '#784E37', '#3C281E'],
      image: 'assets/sty-moderno.webp',
      tags: ['terroso', 'organico', 'rustico_sofisticado', 'ecletico']
    },
    {
      id: 'pal_monocromaticas',
      title: 'Composições Monocromáticas',
      feeling: 'Silêncio visual',
      desc: 'Nuances de calcário tom sobre tom guiadas pela textura.',
      colors: ['#F3F1ED', '#E5E1DA', '#CFCAC0', '#A8A296', '#6F6A60'],
      image: 'assets/sty-minimalista.webp',
      tags: ['monocromatico', 'minimalista', 'japandi']
    },
    {
      id: 'pal_suaves_delicadas',
      title: 'Cores Suaves e Delicadas',
      feeling: 'Leveza serena',
      desc: 'Off-white suave, champanhe fosco e tons claros delicados.',
      colors: ['#F5F3EE', '#E6E1D8', '#CFC6B6', '#A69A86', '#6B6254'],
      image: 'assets/env-classico.webp',
      tags: ['suave', 'escandinavo', 'neoclassico', 'natural']
    }
  ],

  // ETAPA 03/08 — MATERIAIS E TEXTURAS (Foco exclusivo nas superfícies, zero pessoas)
  materials: [
    {
      id: 'mat_madeira_natural',
      title: 'Madeira Natural',
      category: 'Orgânico',
      finish: 'Carvalho ripado · poros abertos',
      desc: 'Madeira natural em painéis ripados com veios autênticos e toque quente.',
      image: 'assets/va-ref-02.webp',
      swatch: 'linear-gradient(135deg, #C7A882 0%, #9E7C56 100%)',
      tags: ['natural', 'organico', 'escandinavo', 'japandi', 'rustico_sofisticado']
    },
    {
      id: 'mat_pedras_naturais',
      title: 'Pedras Naturais',
      category: 'Mineral',
      finish: 'Travertino romano levigado',
      desc: 'Pedra calcária porosa com textura natural que reage à luz rasante.',
      image: 'assets/va-ref-08.webp',
      swatch: 'linear-gradient(135deg, #DFD6C7 0%, #BEB09B 100%)',
      tags: ['natural', 'organico', 'minimalista', 'rustico_sofisticado']
    },
    {
      id: 'mat_marmore',
      title: 'Mármore',
      category: 'Mineral',
      finish: 'Veios naturais · acetinado',
      desc: 'Chapa natural com movimento expressivo de veios para peças de destaque.',
      image: 'assets/mat-marmore.webp',
      swatch: 'linear-gradient(135deg, #F2EFEA 0%, #CFC8BC 50%, #999085 100%)',
      tags: ['classico', 'neoclassico', 'elegante', 'contraste']
    },
    {
      id: 'mat_quartzito',
      title: 'Quartzito',
      category: 'Mineral',
      finish: 'Taj Mahal · alta resistência',
      desc: 'Pedra natural nobre e resistente, ideal para bancadas e ilhas monolíticas.',
      image: 'assets/mat-quartzito.webp',
      swatch: 'linear-gradient(135deg, #EAE2D6 0%, #C8B9A3 100%)',
      tags: ['contemporaneo', 'natural', 'claro']
    },
    {
      id: 'mat_metais',
      title: 'Metais Escovados',
      category: 'Detalhe',
      finish: 'Bronze e latão fosco',
      desc: 'Ferragens, perfis e detalhes em metal escovado de brilho contido.',
      image: 'assets/va-ref-03.webp',
      swatch: 'linear-gradient(135deg, #B5956B 0%, #735A3B 100%)',
      tags: ['contemporaneo', 'moderno', 'industrial', 'elegante']
    },
    {
      id: 'mat_vidro',
      title: 'Vidro Arquitetônico',
      category: 'Transparência',
      finish: 'Vidro canelado e perfil metálico',
      desc: 'Divisórias em vidro canelado ou fumê que filtram a luz com leveza.',
      image: 'assets/mat-vidro.webp',
      swatch: 'linear-gradient(135deg, #DCE2E0 0%, #9CA6A3 100%)',
      tags: ['moderno', 'contemporaneo', 'minimalista', 'industrial']
    },
    {
      id: 'mat_tecidos_fibras',
      title: 'Tecidos e Fibras Naturais',
      category: 'Tátil',
      finish: 'Bouclé, linho cru e lã',
      desc: 'Tramas naturais que entregam maciez tátil e conforto acústico.',
      image: 'assets/mat-tecidos.webp',
      swatch: 'linear-gradient(135deg, #EDE7DC 0%, #CFC3B1 100%)',
      tags: ['natural', 'organico', 'escandinavo', 'japandi', 'suave']
    },
    {
      id: 'mat_revestimentos_foscos',
      title: 'Revestimentos Foscos',
      category: 'Acabamento',
      finish: 'Cal mineral · zero brilho',
      desc: 'Paredes minerais foscas sem reflexo, valorizando luz natural e sombra.',
      image: 'assets/va-ref-06.webp',
      swatch: 'linear-gradient(135deg, #E8E3DA 0%, #D3CCC0 100%)',
      tags: ['minimalista', 'monocromatico', 'organico']
    },
    {
      id: 'mat_superficies_acetinadas',
      title: 'Superfícies Acetinadas',
      category: 'Acabamento',
      finish: 'Toque sedoso · brilho sutil',
      desc: 'Lacas e molduras acetinadas que refletem suavemente a luminosidade.',
      image: 'assets/mat-acetinado.webp',
      swatch: 'linear-gradient(135deg, #F5F2EC 0%, #DDD7CC 100%)',
      tags: ['contemporaneo', 'neoclassico', 'elegante']
    },
    {
      id: 'mat_com_textura',
      title: 'Materiais com Textura',
      category: 'Relevo',
      finish: 'Pedra bruta e ripados',
      desc: 'Relevos arquitetônicos táteis que enriquecem paredes e volumes.',
      image: 'assets/mat-textura.webp',
      swatch: 'repeating-linear-gradient(90deg, #C9B9A3 0 6px, #B4A086 6px 12px)',
      tags: ['organico', 'rustico_sofisticado', 'terroso', 'natural']
    },
    {
      id: 'mat_lisas_uniformes',
      title: 'Superfícies Lisas e Uniformes',
      category: 'Acabamento',
      finish: 'Planos contínuos sem puxadores',
      desc: 'Marcenaria e revestimentos lisos que criam silêncio e ordem visual.',
      image: 'assets/mat-lisas.webp',
      swatch: 'linear-gradient(135deg, #EFECE6 0%, #DFDBD2 100%)',
      tags: ['minimalista', 'moderno', 'monocromatico']
    }
  ],

  // ETAPA 04/08 — COMBINAÇÕES DE MATERIAIS (5 ambientes fiéis às tríades)
  combinations: [
    {
      id: 'cmb_clara_mineral',
      title: 'Madeira Clara + Pedra Bege + Tecidos Naturais',
      desc: 'Carvalho claro, reboco mineral bege e linho cru em atmosfera luminosa.',
      elements: ['Carvalho Claro', 'Base Mineral Bege', 'Linho Cru'],
      swatches: ['#C8AE8B', '#DFD5C5', '#F2EDE4'],
      image: 'assets/sty-japandi.webp',
      tags: ['natural', 'claro', 'organico', 'escandinavo', 'japandi']
    },
    {
      id: 'cmb_escura_bronze',
      title: 'Madeira Escura + Pedra Clara + Metal Escovado',
      desc: 'Nogueira profunda, pedra neutra e detalhes em latão/bronze escovado.',
      elements: ['Nogueira Escura', 'Pedra Clara', 'Metal Escovado'],
      swatches: ['#4B372A', '#ECE8E1', '#967751'],
      image: 'assets/sty-contemporaneo.webp',
      tags: ['profundo', 'contraste', 'moderno', 'elegante']
    },
    {
      id: 'cmb_neutra_organica',
      title: 'Superfícies Neutras + Texturas Orgânicas',
      desc: 'Gesso mineral curvo, travertino e tecidos crus de toque suave.',
      elements: ['Gesso Mineral', 'Travertino', 'Linho Natural'],
      swatches: ['#E5DFD5', '#C9BFA9', '#8E8375'],
      image: 'assets/va-ref-01.webp',
      tags: ['organico', 'minimalista', 'monocromatico', 'suave']
    },
    {
      id: 'cmb_pedra_classica',
      title: 'Mármore Natural + Elementos Clássicos',
      desc: 'Boiseries claras, mármore com veios suaves e metais champanhe.',
      elements: ['Mármore Claro', 'Boiserie Acetinada', 'Latão Suave'],
      swatches: ['#E8E3D9', '#F6F3EE', '#B89E74'],
      image: 'assets/sty-neoclassico.webp',
      tags: ['classico', 'neoclassico', 'elegante', 'claro']
    },
    {
      id: 'cmb_minimalista_detalhes',
      title: 'Pedra Monumental + Ripado + Detalhes Sofisticados',
      desc: 'Travertino em grande formato, madeira ripada e iluminação linear precisa.',
      elements: ['Travertino', 'Carvalho Ripado', 'Bronze Matte'],
      swatches: ['#DDD7CD', '#9E7C56', '#2B2622'],
      image: 'assets/hero-living.webp',
      tags: ['minimalista', 'contemporaneo', 'moderno', 'contraste']
    }
  ],

  composerSlots: {
    stone: [
      { id: 'slot_travertino', label: 'Travertino Romano', swatch: '#DFD5C5' },
      { id: 'slot_quartzito', label: 'Quartzito Taj Mahal', swatch: '#EAE2D6' },
      { id: 'slot_marmore_claro', label: 'Mármore Branco', swatch: '#F3F1ED' },
      { id: 'slot_cal_mineral', label: 'Cal Mineral Fosca', swatch: '#E2DDD4' },
      { id: 'slot_pedra_escura', label: 'Mármore Nero / Basalto', swatch: '#35322F' }
    ],
    wood: [
      { id: 'slot_carvalho', label: 'Carvalho Claro', swatch: '#C9AE8B' },
      { id: 'slot_freijo', label: 'Freijó Natural', swatch: '#B38D63' },
      { id: 'slot_nogueira', label: 'Nogueira Escura', swatch: '#593F2F' },
      { id: 'slot_ebanizado', label: 'Madeira Ebanizada', swatch: '#282421' }
    ],
    accent: [
      { id: 'slot_linho_bronze', label: 'Linho Cru + Bronze', swatch: '#967751' },
      { id: 'slot_boucle_latao', label: 'Bouclé + Latão Suave', swatch: '#C6A982' },
      { id: 'slot_couro_preto', label: 'Couro Sela + Metal Matte', swatch: '#8E5A3C' },
      { id: 'slot_vidro_niquel', label: 'Vidro Canelado + Níquel', swatch: '#8C8F8B' }
    ]
  },

  // ETAPA 05/08 — ILUMINAÇÃO REAL DO MESMO AMBIENTE (4 renders reais!)
  lightingScenarios: [
    {
      id: 'natural_abundante',
      title: 'Luz Natural Abundante',
      kelvin: '5000K · Dia',
      desc: 'Claridade natural entrando pelas aberturas, revelando cores reais.',
      image: 'assets/va-ref-04.webp'
    },
    {
      id: 'luz_difusa',
      title: 'Luz Difusa e Suave',
      kelvin: '3000K · Entardecer',
      desc: 'Iluminação homogênea e confortável sem sombras duras.',
      image: 'assets/light-difusa.webp'
    },
    {
      id: 'luz_indireta',
      title: 'Luz Indireta e Destaque de Texturas',
      kelvin: '2700K · Cênica',
      desc: 'LED oculto rasante no arco e no forro, destacando pedra e reboco.',
      image: 'assets/light-indireta.webp'
    },
    {
      id: 'intimista',
      title: 'Atmosfera Intimista',
      kelvin: '2400K · Noturna',
      desc: 'Foco quente sobre a mesa cercado por penumbra acolhedora.',
      image: 'assets/light-intimista.webp'
    }
  ],

  lightingPreferences: [
    { id: 'lgt_natural', title: 'Iluminação natural e abundante', desc: 'Aberturas amplas e espaço arejado.' },
    { id: 'lgt_indireta', title: 'Luz indireta', desc: 'Fontes ocultas em marcenaria e sancas.' },
    { id: 'lgt_difusa', title: 'Luz difusa', desc: 'Claridade uniforme e sem ofuscamento.' },
    { id: 'lgt_decorativa', title: 'Iluminação decorativa', desc: 'Pendentes, abajures e arandelas.' },
    { id: 'lgt_intimista', title: 'Ambientes intimistas', desc: 'Luz quente e pontos focais para relaxar.' },
    { id: 'lgt_claros_arejados', title: 'Ambientes claros e arejados', desc: 'Luminosidade elevada durante o dia.' },
    { id: 'lgt_texturas', title: 'Destaque de texturas e materiais', desc: 'Luz rasante revelando pedra e madeira.' },
    { id: 'lgt_luz_sombra', title: 'Contrastes suaves de luz e sombra', desc: 'Profundidade cênica e ritmo sereno.' }
  ],

  // ETAPA 06/08 — SEU JEITO DE VIVER (4 cenas de interiores 100% fiéis)
  homeFeelings: [
    { id: 'feel_tranquilidade', title: 'Tranquilidade', desc: 'Um refúgio silencioso para desacelerar.' },
    { id: 'feel_acolhimento', title: 'Acolhimento', desc: 'Calor humano e vontade de permanecer.' },
    { id: 'feel_elegancia', title: 'Elegância', desc: 'Sofisticação discreta em cada detalhe.' },
    { id: 'feel_leveza', title: 'Leveza', desc: 'Fluidez, ordem e respiro visual.' },
    { id: 'feel_natureza', title: 'Conexão com a natureza', desc: 'Luz solar, plantas e matéria autêntica.' },
    { id: 'feel_praticidade', title: 'Praticidade', desc: 'Beleza que funciona sem esforço.' },
    { id: 'feel_personalidade', title: 'Personalidade', desc: 'Peças com história e identidade.' }
  ],

  restSpaces: [
    {
      id: 'rest_suite_linho',
      title: 'Silêncio em Linho e Luz Baixa',
      desc: 'Penumbra suave, linho natural e atmosfera calma para desacelerar.',
      image: 'assets/light-intimista.webp'
    },
    {
      id: 'rest_leitura_madeira',
      title: 'Canto de Leitura Envolvente',
      desc: 'Espaço silencioso em carvalho natural, pedra e luminária acolhedora.',
      image: 'assets/va-ref-07.webp'
    },
    {
      id: 'rest_spa_mineral',
      title: 'Ritual de Banho e Descompressão',
      desc: 'Banheiro spa em pedra calcária natural, arcos minerais e luz serena.',
      image: 'assets/env-mediterraneo.webp'
    },
    {
      id: 'rest_estar_aberto',
      title: 'Estar Amplo Voltado para o Verde',
      desc: 'Sofá generoso, grandes vãos de vidro e vista direta para o jardim.',
      image: 'assets/env-minimal.webp'
    }
  ],

  specialElements: [
    { id: 'spc_luz_manha', label: 'A forma como a luz entra ao longo do dia' },
    { id: 'spc_toque_materiais', label: 'O toque autêntico dos materiais naturais' },
    { id: 'spc_receber_bem', label: 'Espaços que convidam a receber pessoas queridas' },
    { id: 'spc_ordem_invisivel', label: 'Organização inteligente sem poluição visual' },
    { id: 'spc_arte_memoria', label: 'Obras de arte, livros e objetos com memória' },
    { id: 'spc_conforto_acustico', label: 'Silêncio, conforto térmico e acústico' }
  ],

  // ETAPA 07/08 — SEU PROJETO
  projectOptions: {
    types: [
      { id: 'Reforma', label: 'Reforma', desc: 'Alterar ou atualizar um imóvel existente' },
      { id: 'Construção', label: 'Construção', desc: 'Projetar do zero ou em fase de obra' },
      { id: 'Interiores', label: 'Interiores', desc: 'Ambientação, marcenaria e mobiliário' },
      { id: 'Consultoria', label: 'Consultoria', desc: 'Orientação pontual para uma decisão específica' }
    ],
    categories: [
      { id: 'Residencial', label: 'Residencial' },
      { id: 'Comercial', label: 'Comercial' }
    ],
    interiorStatuses: [
      { id: 'novo', label: 'Imóvel novo (ainda não ocupado)' },
      { id: 'ocupado', label: 'Imóvel já ocupado / em uso' }
    ],
    commercialSegments: [
      { id: 'loja', label: 'Loja / Varejo' },
      { id: 'escritorio', label: 'Escritório / Corporativo' },
      { id: 'clinica', label: 'Clínica / Consultório' },
      { id: 'gastronomia', label: 'Restaurante / Café' },
      { id: 'outro', label: 'Outro segmento comercial' }
    ],
    rooms: [
      { id: 'sala', label: 'Sala de Estar' },
      { id: 'cozinha', label: 'Cozinha' },
      { id: 'jantar', label: 'Sala de Jantar' },
      { id: 'quarto', label: 'Quarto / Suíte' },
      { id: 'banheiro', label: 'Banheiro' },
      { id: 'lavanderia', label: 'Lavanderia' },
      { id: 'escritorio', label: 'Escritório / Home Office' },
      { id: 'gourmet', label: 'Área Gourmet' },
      { id: 'externa', label: 'Área Externa' },
      { id: 'entrada', label: 'Entrada / Garagem' }
    ],
    contextFlags: [
      { id: 'pets', label: 'Há pets no imóvel' },
      { id: 'criancas', label: 'Há crianças no imóvel' },
      { id: 'acessibilidade', label: 'Cuidados de acessibilidade' }
    ],
    timelines: [
      'Nos próximos 3 meses',
      'Entre 3 e 6 meses',
      'Entre 6 e 12 meses',
      'Ainda estou planejando'
    ]
  }
};
