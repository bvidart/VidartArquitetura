// =========================================================================
// VA. ARQUITETURA & INTERIORES — CURADORIA INTERATIVA DE DESCOBERTA ESTÉTICA
// Catálogo estruturado com identificadores estáveis, tags de afinidade
// e referências fotográficas de padrão editorial.
// =========================================================================

window.VA_DATA = {
  brand: {
    name: 'VA Arquitetura e Interiores',
    shortName: 'VA',
    tagline: 'Todo espaço começa com uma forma única de sentir.'
  },

  chapters: [
    { step: 1, code: '01', label: 'Boas-vindas', short: 'Início' },
    { step: 2, code: '02', label: 'Conexão com os Ambientes', short: 'Ambientes' },
    { step: 3, code: '03', label: 'Descoberta dos Estilos', short: 'Estilos' },
    { step: 4, code: '04', label: 'Paletas e Sensações', short: 'Paletas' },
    { step: 5, code: '05', label: 'Materiais e Texturas', short: 'Materiais' },
    { step: 6, code: '06', label: 'Combinações de Materiais', short: 'Combinações' },
    { step: 7, code: '07', label: 'Iluminação e Atmosfera', short: 'Iluminação' },
    { step: 8, code: '08', label: 'Personalidade e Forma de Viver', short: 'Viver' },
    { step: 9, code: '09', label: 'Contexto do Projeto', short: 'Projeto' },
    { step: 10, code: '10', label: 'Sua Identidade Estética', short: 'Identidade' }
  ],

  // ETAPA 02 — CONEXÃO COM OS AMBIENTES
  environments: [
    {
      id: 'env_organico_mineral',
      title: 'Fluidez Mineral e Luz Suave',
      subtitle: 'Paredes curvas em reboco mineral, sofá orgânico em linho cru e carvalho claro.',
      atmosphere: 'Calma acolhedora',
      image: 'assets/va-ref-01.webp',
      tags: ['organico', 'natural', 'claro', 'suave', 'contemporaneo']
    },
    {
      id: 'env_classico_contemporaneo',
      title: 'Proporção Clássica Atualizada',
      subtitle: 'Boiseries sutis, pé-direito generoso e equilíbrio entre tradição e leveza.',
      atmosphere: 'Elegância serena',
      image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85',
      tags: ['classico', 'neoclassico', 'elegante', 'claro']
    },
    {
      id: 'env_minimalismo_zen',
      title: 'Silêncio e Essencialidade',
      subtitle: 'Superfícies contínuas em pedra natural, luz zenital e ausência de ruído visual.',
      atmosphere: 'Pureza contemplativa',
      image: 'assets/va-ref-06.webp',
      tags: ['minimalista', 'japandi', 'natural', 'monocromatico']
    },
    {
      id: 'env_intimista_madeira',
      title: 'Refúgio Envolvente em Madeira',
      subtitle: 'Estante em carvalho natural, pedra bruta e luminária de alabastro em penumbra suave.',
      atmosphere: 'Intimidade intelectual',
      image: 'assets/va-ref-07.webp',
      tags: ['moderno', 'rustico_sofisticado', 'profundo', 'intimista', 'natural']
    },
    {
      id: 'env_arquitetura_paisagem',
      title: 'Abertura Total e Concreto Quente',
      subtitle: 'Integração com a paisagem externa, planos horizontais amplos e luz natural abundante.',
      atmosphere: 'Amplitude e presença',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
      tags: ['moderno', 'contemporaneo', 'industrial', 'contraste']
    },
    {
      id: 'env_convivio_pedra',
      title: 'Convívio em Pedra e Carvalho',
      subtitle: 'Arco mineral enquadrando mesa monolítica em travertino e madeira de toque quente.',
      atmosphere: 'Encontros atemporais',
      image: 'assets/va-ref-04.webp',
      tags: ['contemporaneo', 'organico', 'escandinavo', 'natural', 'claro']
    }
  ],

  // ETAPA 03 — DESCOBERTA DOS ESTILOS (11 estilos em 3 grupos equilibrados)
  styleGroups: [
    {
      id: 'grp_pureza',
      title: 'Linhas, Proporção e Silêncio',
      subtitle: 'Composições limpas onde a arquitetura, o vazio e a luz conduzem o olhar.',
      tags: ['contemporaneo', 'minimalista', 'moderno', 'japandi']
    },
    {
      id: 'grp_materia',
      title: 'Matéria, Natureza e Textura',
      subtitle: 'Espaços guiados pelo toque autêntico de madeiras, pedras, fibras e contrastes reais.',
      tags: ['organico', 'escandinavo', 'rustico_sofisticado', 'industrial']
    },
    {
      id: 'grp_expressao',
      title: 'História, Ritmo e Personalidade',
      subtitle: 'Referências atemporais, simetrias elegantes e curadoria com identidade marcante.',
      tags: ['classico', 'neoclassico', 'ecletico']
    }
  ],

  styles: [
    {
      id: 'sty_contemporaneo',
      groupId: 'grp_pureza',
      title: 'Contemporâneo',
      desc: 'Equilíbrio atual entre conforto, linhas limpas e materiais nobres sem excessos.',
      image: 'assets/va-ref-05.webp',
      tags: ['contemporaneo', 'natural', 'claro']
    },
    {
      id: 'sty_minimalista',
      groupId: 'grp_pureza',
      title: 'Minimalista',
      desc: 'Redução ao essencial, planos contínuos e foco absoluto na proporção e na luz.',
      image: 'assets/va-ref-06.webp',
      tags: ['minimalista', 'monocromatico', 'claro']
    },
    {
      id: 'sty_moderno',
      groupId: 'grp_pureza',
      title: 'Moderno',
      desc: 'Geometria precisa, integração espacial, planos horizontais e honestidade estrutural.',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85',
      tags: ['moderno', 'contraste']
    },
    {
      id: 'sty_japandi',
      groupId: 'grp_pureza',
      title: 'Japandi',
      desc: 'Serenidade oriental aliada ao acolhimento nórdico, com madeira clara e beleza imperfeita.',
      image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1000&q=85',
      tags: ['japandi', 'natural', 'suave']
    },
    {
      id: 'sty_organico',
      groupId: 'grp_materia',
      title: 'Orgânico',
      desc: 'Formas curvas, revestimentos minerais e conexão fluida com elementos da natureza.',
      image: 'assets/va-ref-01.webp',
      tags: ['organico', 'natural', 'suave']
    },
    {
      id: 'sty_escandinavo',
      groupId: 'grp_materia',
      title: 'Escandinavo',
      desc: 'Luminosidade suave, madeiras claras, tecidos acolhedores e funcionalidade descomplicada.',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=85',
      tags: ['escandinavo', 'claro', 'natural']
    },
    {
      id: 'sty_rustico_sofisticado',
      groupId: 'grp_materia',
      title: 'Rústico Sofisticado',
      desc: 'Pedras brutas, madeiras marcantes e texturas artesanais refinadas por desenho contemporâneo.',
      image: 'assets/va-ref-07.webp',
      tags: ['rustico_sofisticado', 'terroso', 'natural']
    },
    {
      id: 'sty_industrial',
      groupId: 'grp_materia',
      title: 'Industrial',
      desc: 'Concreto aparente, esquadrias metálicas escuras e volumes amplos com caráter urbano.',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=85',
      tags: ['industrial', 'contraste', 'profundo']
    },
    {
      id: 'sty_classico',
      groupId: 'grp_expressao',
      title: 'Clássico',
      desc: 'Simetria harmoniosa, molduras arquitetônicas, mármores nobres e elegância perene.',
      image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=85',
      tags: ['classico', 'elegante']
    },
    {
      id: 'sty_neoclassico',
      groupId: 'grp_expressao',
      title: 'Neoclássico',
      desc: 'Releitura leve do clássico, com boiseries delicadas, paleta clara e mobiliário atual.',
      image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1000&q=85',
      tags: ['neoclassico', 'claro', 'elegante']
    },
    {
      id: 'sty_ecletico',
      groupId: 'grp_expressao',
      title: 'Eclético',
      desc: 'Diálogo curatorial entre épocas, peças de arte, texturas contrastantes e memória afetiva.',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=85',
      tags: ['ecletico', 'profundo', 'terroso']
    }
  ],

  // ETAPA 04 — PALETAS E SENSAÇÕES (7 direções aplicadas em ambientes reais)
  palettes: [
    {
      id: 'pal_neutros_acolhedores',
      title: 'Tons Neutros e Acolhedores',
      feeling: 'Calor sereno e permanência',
      desc: 'Bege mineral, areia, linho cru e amadeirados suaves que abraçam a luz ao longo do dia.',
      colors: ['#F5F1EA', '#E3D9C9', '#C5B39A', '#9A846B', '#5A4D3F'],
      image: 'assets/va-ref-01.webp',
      tags: ['natural', 'claro', 'organico', 'contemporaneo']
    },
    {
      id: 'pal_claras_naturais',
      title: 'Paletas Claras e Naturais',
      feeling: 'Frescor luminoso e amplitude',
      desc: 'Off-white mineral, carvalho lavado e pedras claras que ampliam a percepção espacial.',
      colors: ['#FAF8F4', '#EFECE6', '#D8D1C4', '#B5AA97', '#7A7265'],
      image: 'assets/va-ref-04.webp',
      tags: ['claro', 'escandinavo', 'minimalista', 'japandi']
    },
    {
      id: 'pal_profundas_sofisticadas',
      title: 'Cores Profundas e Sofisticadas',
      feeling: 'Envolvimento e elegância noturna',
      desc: 'Madeiras escuras, grafite, café e bronze envelhecido para atmosferas intimistas.',
      colors: ['#E8E2D9', '#8E7B68', '#52443A', '#2E2824', '#181614'],
      image: 'assets/va-ref-07.webp',
      tags: ['profundo', 'intimista', 'moderno', 'classico']
    },
    {
      id: 'pal_contrastes_marcantes',
      title: 'Contrastes Marcantes',
      feeling: 'Precisão arquitetônica e presença',
      desc: 'Diálogo nítido entre superfícies claras, pedras escuras e linhas metálicas definidas.',
      colors: ['#F7F6F3', '#D4D0C8', '#967751', '#383532', '#171513'],
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=85',
      tags: ['contraste', 'moderno', 'industrial', 'contemporaneo']
    },
    {
      id: 'pal_tons_terrosos',
      title: 'Tons Terrosos',
      feeling: 'Conexão tátil e autenticidade',
      desc: 'Argila, terracota dessaturada, couro sela e nogueira para espaços com alma orgânica.',
      colors: ['#F1EAE1', '#D4B79E', '#AD7C5D', '#784E37', '#3C281E'],
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=85',
      tags: ['terroso', 'organico', 'rustico_sofisticado', 'ecletico']
    },
    {
      id: 'pal_monocromaticas',
      title: 'Composições Monocromáticas',
      feeling: 'Silêncio visual e continuidade',
      desc: 'Variações sutis de uma mesma família mineral, onde a textura substitui o contraste cromático.',
      colors: ['#F3F1ED', '#E5E1DA', '#CFCAC0', '#A8A296', '#6F6A60'],
      image: 'assets/va-ref-06.webp',
      tags: ['monocromatico', 'minimalista', 'japandi']
    },
    {
      id: 'pal_suaves_delicadas',
      title: 'Cores Suaves e Delicadas',
      feeling: 'Leveza botânica e tranquilidade',
      desc: 'Sálvia acinzentado, cal mineral e tons névoa que acalmam o olhar sem perder sofisticação.',
      colors: ['#F2F3EE', '#DCE0D6', '#B3BCB0', '#7D897B', '#485247'],
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=85',
      tags: ['suave', 'escandinavo', 'neoclassico', 'natural']
    }
  ],

  // ETAPA 05 — MATERIAIS E TEXTURAS (11 materiais com visão Amostra e Aplicação)
  materials: [
    {
      id: 'mat_madeira_natural',
      title: 'Madeira Natural',
      category: 'Orgânico',
      finish: 'Fosco acetinado · poros abertos',
      desc: 'Carvalho europeu, freijó ou nogueira com veios autênticos que aquecem a arquitetura.',
      sampleImage: 'assets/va-ref-02.webp',
      appliedImage: 'assets/va-ref-07.webp',
      swatch: 'linear-gradient(135deg, #C7A882 0%, #9E7C56 100%)',
      tags: ['natural', 'organico', 'escandinavo', 'japandi', 'rustico_sofisticado']
    },
    {
      id: 'mat_pedras_naturais',
      title: 'Pedras Naturais',
      category: 'Mineral',
      finish: 'Levigado ou bruto · toque poroso',
      desc: 'Travertino romano e limestone que reagem à luz rasante com profundidade mineral.',
      sampleImage: 'assets/va-ref-08.webp',
      appliedImage: 'assets/va-ref-04.webp',
      swatch: 'linear-gradient(135deg, #DFD6C7 0%, #BEB09B 100%)',
      tags: ['natural', 'organico', 'minimalista', 'rustico_sofisticado']
    },
    {
      id: 'mat_marmore',
      title: 'Mármore',
      category: 'Mineral',
      finish: 'Acetinado ou polido suave · veios expressivos',
      desc: 'Movimento natural de veios que confere presença escultórica a bancadas, pisos e lareiras.',
      sampleImage: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=900&q=85',
      appliedImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=85',
      swatch: 'linear-gradient(135deg, #F2EFEA 0%, #CFC8BC 50%, #999085 100%)',
      tags: ['classico', 'neoclassico', 'elegante', 'contraste']
    },
    {
      id: 'mat_quartzito',
      title: 'Quartzito',
      category: 'Mineral',
      finish: 'Escovado ou fosco · alta resistência',
      desc: 'Translucidez sutil de pedra nobre com dureza elevada para ilhas e superfícies de uso intenso.',
      sampleImage: 'assets/va-ref-05.webp',
      appliedImage: 'assets/va-ref-05.webp',
      swatch: 'linear-gradient(135deg, #EAE2D6 0%, #C8B9A3 100%)',
      tags: ['contemporaneo', 'natural', 'claro']
    },
    {
      id: 'mat_metais',
      title: 'Metais Escovados',
      category: 'Detalhe',
      finish: 'Bronze, latão ou níquel fosco',
      desc: 'Pontos precisos de luz contida em puxadores, luminárias, perfis e metais de banho.',
      sampleImage: 'assets/va-ref-03.webp',
      appliedImage: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1000&q=85',
      swatch: 'linear-gradient(135deg, #B5956B 0%, #735A3B 100%)',
      tags: ['contemporaneo', 'moderno', 'industrial', 'elegante']
    },
    {
      id: 'mat_vidro',
      title: 'Vidro Arquitetônico',
      category: 'Transparência',
      finish: 'Canelado, fumê ou extraclear',
      desc: 'Leveza visual, passagem de luz filtrada e reflexão sutil em divisórias e vitrines.',
      sampleImage: 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=900&q=85',
      appliedImage: 'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=1000&q=85',
      swatch: 'linear-gradient(135deg, #DCE2E0 0%, #9CA6A3 100%)',
      tags: ['moderno', 'contemporaneo', 'minimalista']
    },
    {
      id: 'mat_tecidos_fibras',
      title: 'Tecidos e Fibras Naturais',
      category: 'Tátil',
      finish: 'Linho lavado, bouclé, lã e algodão',
      desc: 'Maciez acústica e conforto imediato em estofados, cortinas fluidas e tapetes artesanais.',
      sampleImage: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=85',
      appliedImage: 'assets/va-ref-01.webp',
      swatch: 'linear-gradient(135deg, #EDE7DC 0%, #CFC3B1 100%)',
      tags: ['natural', 'organico', 'escandinavo', 'japandi', 'suave']
    },
    {
      id: 'mat_revestimentos_foscos',
      title: 'Revestimentos Foscos',
      category: 'Acabamento',
      finish: 'Zero brilho · pintura à cal ou microcimento',
      desc: 'Absorvem o excesso de reflexo, criando planos serenos onde luz e sombra se tornam protagonistas.',
      sampleImage: 'assets/va-ref-06.webp',
      appliedImage: 'assets/va-ref-06.webp',
      swatch: 'linear-gradient(135deg, #E8E3DA 0%, #D3CCC0 100%)',
      tags: ['minimalista', 'monocromatico', 'organico']
    },
    {
      id: 'mat_superficies_acetinadas',
      title: 'Superfícies Acetinadas',
      category: 'Acabamento',
      finish: 'Toque sedoso · brilho sutil',
      desc: 'Lacas foscas acetinadas e pedras amaciadas que refletem suavemente a iluminação ambiente.',
      sampleImage: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=900&q=85',
      appliedImage: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=85',
      swatch: 'linear-gradient(135deg, #F5F2EC 0%, #DDD7CC 100%)',
      tags: ['contemporaneo', 'neoclassico', 'elegante']
    },
    {
      id: 'mat_com_textura',
      title: 'Materiais com Textura',
      category: 'Relevo',
      finish: 'Ripados, reboco mineral e pedras táteis',
      desc: 'Relevos sutis que convidam ao toque e enriquecem o ambiente sem depender de cores fortes.',
      sampleImage: 'assets/va-ref-02.webp',
      appliedImage: 'assets/va-ref-01.webp',
      swatch: 'repeating-linear-gradient(90deg, #C9B9A3 0 6px, #B4A086 6px 12px)',
      tags: ['organico', 'rustico_sofisticado', 'terroso', 'natural']
    },
    {
      id: 'mat_lisas_uniformes',
      title: 'Superfícies Lisas e Uniformes',
      category: 'Acabamento',
      finish: 'Planos contínuos · precisão minimalista',
      desc: 'Marcenaria sem puxadores e pisos contínuos que transmitem ordem visual e leveza imediata.',
      sampleImage: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=900&q=85',
      appliedImage: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1000&q=85',
      swatch: 'linear-gradient(135deg, #EFECE6 0%, #DFDBD2 100%)',
      tags: ['minimalista', 'moderno', 'monocromatico']
    }
  ],

  // ETAPA 06 — COMBINAÇÕES DE MATERIAIS (5 composições harmoniosas + compositor livre)
  combinations: [
    {
      id: 'cmb_clara_mineral',
      title: 'Madeira Clara + Pedra Bege + Tecidos Naturais',
      desc: 'Carvalho europeu natural, travertino romano levigado e linho cru lavado — luminosidade acolhedora.',
      elements: ['Carvalho Natural', 'Travertino Levigado', 'Linho Cru & Bouclé'],
      swatches: ['#C8AE8B', '#DFD5C5', '#F2EDE4'],
      image: 'assets/va-ref-08.webp',
      tags: ['natural', 'claro', 'organico', 'escandinavo', 'japandi']
    },
    {
      id: 'cmb_escura_bronze',
      title: 'Madeira Escura + Mármore Claro + Metal Escovado',
      desc: 'Nogueira amendoada, mármore claro acetinado e bronze escovado — sofisticação de alto contraste.',
      elements: ['Nogueira Escura', 'Mármore Claro', 'Bronze Escovado'],
      swatches: ['#4B372A', '#ECE8E1', '#967751'],
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=85',
      tags: ['profundo', 'contraste', 'moderno', 'elegante']
    },
    {
      id: 'cmb_neutra_organica',
      title: 'Superfícies Neutras + Texturas Orgânicas',
      desc: 'Microcimento mineral fosco, reboco artesanal e cerâmica crua — serenidade tátil.',
      elements: ['Cal Mineral Fosca', 'Reboco Texturizado', 'Cerâmica Artesanal'],
      swatches: ['#E5DFD5', '#C9BFA9', '#8E8375'],
      image: 'assets/va-ref-01.webp',
      tags: ['organico', 'minimalista', 'monocromatico', 'suave']
    },
    {
      id: 'cmb_pedra_classica',
      title: 'Pedra Natural + Elementos Clássicos',
      desc: 'Limestone acetinado, boiseries contemporâneas e metais champanhe — elegância atemporal.',
      elements: ['Limestone Claro', 'Moldura Acetinada', 'Latão Champanhe'],
      swatches: ['#E8E3D9', '#F6F3EE', '#B89E74'],
      image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=85',
      tags: ['classico', 'neoclassico', 'elegante', 'claro']
    },
    {
      id: 'cmb_minimalista_detalhes',
      title: 'Materiais Minimalistas + Detalhes Sofisticados',
      desc: 'Planos lisos em quartzito, vidro fumê e ferragens em bronze — precisão contemporânea.',
      elements: ['Quartzito Fosco', 'Vidro Fumê', 'Bronze Arquitetônico'],
      swatches: ['#DDD7CD', '#6B6A66', '#8F734B'],
      image: 'assets/va-ref-03.webp',
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
      { id: 'slot_vidro_niquel', label: 'Vidro Fumê + Níquel', swatch: '#8C8F8B' }
    ]
  },

  // ETAPA 07 — ILUMINAÇÃO E ATMOSFERA
  lightingScenarios: [
    {
      id: 'natural_abundante',
      title: 'Luz Natural Abundante',
      kelvin: '5000K · Dia',
      desc: 'Claridade aberta e arejada, evidenciando cores reais e integração com o exterior.',
      filter: 'brightness(1.06) contrast(1.01) saturate(0.98)',
      overlay: 'radial-gradient(circle at 75% 18%, rgba(255, 252, 245, 0.24) 0%, rgba(255, 255, 255, 0) 62%)'
    },
    {
      id: 'luz_difusa',
      title: 'Luz Difusa e Suave',
      kelvin: '3000K · Equilibrada',
      desc: 'Iluminação homogênea sem sombras duras, confortável para convivência e leitura.',
      filter: 'brightness(0.98) contrast(0.96) sepia(0.08)',
      overlay: 'linear-gradient(180deg, rgba(252, 243, 228, 0.14) 0%, rgba(30, 26, 23, 0.08) 100%)'
    },
    {
      id: 'luz_indireta',
      title: 'Luz Indireta e Destaque de Texturas',
      kelvin: '2700K · Cênica',
      desc: 'Fachos rasantes valorizando relevos da pedra, madeira e planos arquitetônicos.',
      filter: 'brightness(0.84) contrast(1.12) sepia(0.18)',
      overlay: 'radial-gradient(ellipse at 28% 35%, rgba(240, 198, 138, 0.28) 0%, rgba(22, 18, 15, 0.42) 72%)'
    },
    {
      id: 'intimista',
      title: 'Atmosfera Intimista',
      kelvin: '2400K · Penumbra',
      desc: 'Contraste suave entre luz quente focal e sombra acolhedora para desacelerar à noite.',
      filter: 'brightness(0.70) contrast(1.16) sepia(0.24)',
      overlay: 'radial-gradient(circle at 62% 58%, rgba(235, 180, 110, 0.26) 0%, rgba(16, 13, 11, 0.58) 70%)'
    }
  ],

  lightingPreferences: [
    { id: 'lgt_natural', title: 'Iluminação natural e abundante', desc: 'Aberturas amplas e sensação de espaço arejado.' },
    { id: 'lgt_indireta', title: 'Luz indireta', desc: 'Fontes ocultas em marcenaria, sancas limpas e cortineiros.' },
    { id: 'lgt_difusa', title: 'Luz difusa', desc: 'Claridade uniforme, suave e livre de ofuscamento.' },
    { id: 'lgt_decorativa', title: 'Iluminação decorativa', desc: 'Pendentes, abajures e arandelas como peças escultóricas.' },
    { id: 'lgt_intimista', title: 'Ambientes intimistas', desc: 'Temperatura quente e pontos focais para relaxar.' },
    { id: 'lgt_claros_arejados', title: 'Ambientes claros e arejados', desc: 'Luminosidade elevada e leveza durante todo o dia.' },
    { id: 'lgt_texturas', title: 'Destaque de texturas e materiais', desc: 'Luz rasante revelando pedra, madeira e relevos.' },
    { id: 'lgt_luz_sombra', title: 'Contrastes suaves entre luz e sombra', desc: 'Profundidade cênica e ritmo visual sereno.' }
  ],

  // ETAPA 08 — PERSONALIDADE E FORMA DE VIVER
  homeFeelings: [
    { id: 'feel_tranquilidade', title: 'Tranquilidade', desc: 'Um refúgio silencioso para desacelerar.' },
    { id: 'feel_acolhimento', title: 'Acolhimento', desc: 'Calor humano e vontade de permanecer.' },
    { id: 'feel_elegancia', title: 'Elegância', desc: 'Sofisticação discreta em cada detalhe.' },
    { id: 'feel_leveza', title: 'Leveza', desc: 'Fluidez, ordem e respiro visual.' },
    { id: 'feel_natureza', title: 'Conexão com a natureza', desc: 'Luz solar, plantas e matéria autêntica.' },
    { id: 'feel_praticidade', title: 'Praticidade', desc: 'Beleza que funciona sem esforço no dia a dia.' },
    { id: 'feel_personalidade', title: 'Personalidade', desc: 'Peças com história e identidade própria.' }
  ],

  restSpaces: [
    {
      id: 'rest_suite_linho',
      title: 'Silêncio em Linho e Luz Baixa',
      desc: 'Um refúgio sereno e monocromático dedicado ao descanso profundo.',
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=85'
    },
    {
      id: 'rest_leitura_madeira',
      title: 'Canto de Leitura Envolvente',
      desc: 'Poltrona confortável, madeira natural, livros e luz quente de apoio.',
      image: 'assets/va-ref-07.webp'
    },
    {
      id: 'rest_spa_mineral',
      title: 'Ritual de Banho e Descompressão',
      desc: 'Texturas minerais, água morna e atmosfera de spa particular.',
      image: 'assets/va-ref-06.webp'
    },
    {
      id: 'rest_estar_aberto',
      title: 'Estar Amplo Voltado para o Verde',
      desc: 'Sofá generoso, brisa natural e vista tranquila para contemplar.',
      image: 'assets/va-ref-01.webp'
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

  // ETAPA 09 — CONTEXTO DO PROJETO (sem valores/pacotes comerciais)
  projectOptions: {
    types: ['Interiores', 'Reforma', 'Construção', 'Consultoria'],
    categories: ['Residencial', 'Comercial'],
    rooms: [
      'Projeto Completo',
      'Sala de Estar e Jantar',
      'Cozinha e Área Gourmet',
      'Suíte Master',
      'Quartos',
      'Banheiros e Lavabo',
      'Home Office',
      'Varanda / Área Externa',
      'Espaço Corporativo / Loja'
    ],
    timelines: [
      'Nos próximos 3 meses',
      'Entre 3 e 6 meses',
      'Entre 6 e 12 meses',
      'Ainda estou planejando'
    ],
    investmentRanges: [
      'Prefiro conversar pessoalmente',
      'Soluções essenciais e racionalizadas',
      'Alto padrão com materiais naturais',
      'Curadoria exclusiva sob medida (bespoke)'
    ]
  }
};
