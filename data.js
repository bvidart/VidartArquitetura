// =========================================================================
// VA. ARQUITETURA & INTERIORES — CATÁLOGO ESTÉTICO (FASE 1 REFINADA)
// Jornada em 8 etapas com 1 pergunta principal por tela e imagens 100% únicas.
// =========================================================================

window.VA_DATA = {
  brand: {
    name: 'VA Arquitetura e Interiores',
    shortName: 'VA',
    tagline: 'Todo espaço começa com uma forma única de sentir.'
  },

  // 8 Etapas principais (conforme arquitetura revisada)
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

  welcomeHeroImage: 'assets/va-ref-01.webp',
  lightingBaseImage: 'assets/va-ref-04.webp',

  // ETAPA 02 (1/3) — AMBIENTES (6 imagens distintas e exclusivas)
  environments: [
    {
      id: 'env_organico_mineral',
      title: 'Fluidez Mineral e Luz Suave',
      subtitle: 'Linhas curvas, linho cru e textura calcária banhada por luz natural.',
      atmosphere: 'Calma acolhedora',
      image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=960&q=82',
      tags: ['organico', 'natural', 'claro', 'suave', 'contemporaneo']
    },
    {
      id: 'env_classico_contemporaneo',
      title: 'Proporção Clássica Atualizada',
      subtitle: 'Molduras sutis, pé-direito generoso e equilíbrio sereno.',
      atmosphere: 'Elegância serena',
      image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=960&q=82',
      tags: ['classico', 'neoclassico', 'elegante', 'claro']
    },
    {
      id: 'env_minimalismo_zen',
      title: 'Silêncio e Essencialidade',
      subtitle: 'Superfícies contínuas em pedra natural e ausência de ruído visual.',
      atmosphere: 'Pureza contemplativa',
      image: 'assets/va-ref-06.webp',
      tags: ['minimalista', 'japandi', 'natural', 'monocromatico']
    },
    {
      id: 'env_intimista_madeira',
      title: 'Refúgio Envolvente em Madeira',
      subtitle: 'Carvalho natural, pedra bruta e luz suave para desacelerar.',
      atmosphere: 'Intimidade acolhedora',
      image: 'assets/va-ref-07.webp',
      tags: ['moderno', 'rustico_sofisticado', 'profundo', 'intimista', 'natural']
    },
    {
      id: 'env_arquitetura_paisagem',
      title: 'Abertura Total e Concreto Quente',
      subtitle: 'Integração com o exterior, planos amplos e luz abundante.',
      atmosphere: 'Amplitude e presença',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=960&q=82',
      tags: ['moderno', 'contemporaneo', 'industrial', 'contraste']
    },
    {
      id: 'env_convivio_pedra',
      title: 'Cozinha Escultural e Convívio',
      subtitle: 'Ilha monolítica em pedra natural e marcenaria limpa.',
      atmosphere: 'Encontros atemporais',
      image: 'assets/va-ref-05.webp',
      tags: ['contemporaneo', 'organico', 'escandinavo', 'natural', 'claro']
    }
  ],

  // ETAPA 02 (2/3) — ESTILOS (11 estilos em 3 famílias, 11 imagens exclusivas)
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
      subtitle: 'Espaços guiados pelo toque autêntico de madeiras, pedras e fibras naturais.',
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
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=960&q=82',
      tags: ['contemporaneo', 'natural', 'claro']
    },
    {
      id: 'sty_minimalista',
      groupId: 'grp_pureza',
      title: 'Minimalista',
      desc: 'Redução ao essencial, planos contínuos e foco absoluto na proporção e na luz.',
      image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=960&q=82',
      tags: ['minimalista', 'monocromatico', 'claro']
    },
    {
      id: 'sty_moderno',
      groupId: 'grp_pureza',
      title: 'Moderno',
      desc: 'Geometria precisa, integração espacial e honestidade estrutural.',
      image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=960&q=82',
      tags: ['moderno', 'contraste']
    },
    {
      id: 'sty_japandi',
      groupId: 'grp_pureza',
      title: 'Japandi',
      desc: 'Serenidade oriental aliada ao acolhimento nórdico, com madeira clara e calma.',
      image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=960&q=82',
      tags: ['japandi', 'natural', 'suave']
    },
    {
      id: 'sty_organico',
      groupId: 'grp_materia',
      title: 'Orgânico',
      desc: 'Formas curvas, revestimentos minerais e conexão fluida com a natureza.',
      image: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=960&q=82',
      tags: ['organico', 'natural', 'suave']
    },
    {
      id: 'sty_escandinavo',
      groupId: 'grp_materia',
      title: 'Escandinavo',
      desc: 'Luminosidade suave, madeiras claras e funcionalidade acolhedora.',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=960&q=82',
      tags: ['escandinavo', 'claro', 'natural']
    },
    {
      id: 'sty_rustico_sofisticado',
      groupId: 'grp_materia',
      title: 'Rústico Sofisticado',
      desc: 'Pedras brutas, madeiras marcantes e texturas artesanais refinadas.',
      image: 'https://images.unsplash.com/photo-1600585152915-d208bec867a1?auto=format&fit=crop&w=960&q=82',
      tags: ['rustico_sofisticado', 'terroso', 'natural']
    },
    {
      id: 'sty_industrial',
      groupId: 'grp_materia',
      title: 'Industrial',
      desc: 'Concreto aparente, esquadrias metálicas escuras e caráter urbano.',
      image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=960&q=82',
      tags: ['industrial', 'contraste', 'profundo']
    },
    {
      id: 'sty_classico',
      groupId: 'grp_expressao',
      title: 'Clássico',
      desc: 'Simetria harmoniosa, molduras arquitetônicas e elegância perene.',
      image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=960&q=82',
      tags: ['classico', 'elegante']
    },
    {
      id: 'sty_neoclassico',
      groupId: 'grp_expressao',
      title: 'Neoclássico',
      desc: 'Releitura leve do clássico, com boiseries delicadas e paleta luminosa.',
      image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=960&q=82',
      tags: ['neoclassico', 'claro', 'elegante']
    },
    {
      id: 'sty_ecletico',
      groupId: 'grp_expressao',
      title: 'Eclético',
      desc: 'Diálogo curatorial entre épocas, arte, texturas e memória afetiva.',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=960&q=82',
      tags: ['ecletico', 'profundo', 'terroso']
    }
  ],

  // ETAPA 02 (3/3) — PALETAS E SENSAÇÕES (7 direções, 7 imagens exclusivas)
  palettes: [
    {
      id: 'pal_neutros_acolhedores',
      title: 'Tons Neutros e Acolhedores',
      feeling: 'Calor sereno e permanência',
      desc: 'Bege mineral, areia, linho cru e amadeirados suaves.',
      colors: ['#F5F1EA', '#E3D9C9', '#C5B39A', '#9A846B', '#5A4D3F'],
      image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=960&q=82',
      tags: ['natural', 'claro', 'organico', 'contemporaneo']
    },
    {
      id: 'pal_claras_naturais',
      title: 'Paletas Claras e Naturais',
      feeling: 'Frescor luminoso e amplitude',
      desc: 'Off-white mineral, carvalho lavado e pedras claras.',
      colors: ['#FAF8F4', '#EFECE6', '#D8D1C4', '#B5AA97', '#7A7265'],
      image: 'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=960&q=82',
      tags: ['claro', 'escandinavo', 'minimalista', 'japandi']
    },
    {
      id: 'pal_profundas_sofisticadas',
      title: 'Cores Profundas e Sofisticadas',
      feeling: 'Envolvimento e elegância noturna',
      desc: 'Madeiras escuras, grafite, café e bronze envelhecido.',
      colors: ['#E8E2D9', '#8E7B68', '#52443A', '#2E2824', '#181614'],
      image: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=960&q=82',
      tags: ['profundo', 'intimista', 'moderno', 'classico']
    },
    {
      id: 'pal_contrastes_marcantes',
      title: 'Contrastes Marcantes',
      feeling: 'Precisão arquitetônica',
      desc: 'Superfícies claras em diálogo nítido com pedras escuras e metais.',
      colors: ['#F7F6F3', '#D4D0C8', '#967751', '#383532', '#171513'],
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=960&q=82',
      tags: ['contraste', 'moderno', 'industrial', 'contemporaneo']
    },
    {
      id: 'pal_tons_terrosos',
      title: 'Tons Terrosos',
      feeling: 'Conexão tátil e autenticidade',
      desc: 'Argila, terracota dessaturada, couro sela e nogueira.',
      colors: ['#F1EAE1', '#D4B79E', '#AD7C5D', '#784E37', '#3C281E'],
      image: 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=960&q=82',
      tags: ['terroso', 'organico', 'rustico_sofisticado', 'ecletico']
    },
    {
      id: 'pal_monocromaticas',
      title: 'Composições Monocromáticas',
      feeling: 'Silêncio visual e continuidade',
      desc: 'Nuances de uma mesma família mineral onde a textura guia o olhar.',
      colors: ['#F3F1ED', '#E5E1DA', '#CFCAC0', '#A8A296', '#6F6A60'],
      image: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=960&q=82',
      tags: ['monocromatico', 'minimalista', 'japandi']
    },
    {
      id: 'pal_suaves_delicadas',
      title: 'Cores Suaves e Delicadas',
      feeling: 'Leveza botânica e tranquilidade',
      desc: 'Sálvia acinzentado, cal mineral e tons névoa.',
      colors: ['#F2F3EE', '#DCE0D6', '#B3BCB0', '#7D897B', '#485247'],
      image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=960&q=82',
      tags: ['suave', 'escandinavo', 'neoclassico', 'natural']
    }
  ],

  // ETAPA 03 — MATERIAIS E TEXTURAS (11 materiais, 11 imagens exclusivas)
  materials: [
    {
      id: 'mat_madeira_natural',
      title: 'Madeira Natural',
      category: 'Orgânico',
      finish: 'Fosco acetinado · poros abertos',
      desc: 'Carvalho europeu, freijó ou nogueira com veios autênticos.',
      image: 'assets/va-ref-02.webp',
      swatch: 'linear-gradient(135deg, #C7A882 0%, #9E7C56 100%)',
      tags: ['natural', 'organico', 'escandinavo', 'japandi', 'rustico_sofisticado']
    },
    {
      id: 'mat_pedras_naturais',
      title: 'Pedras Naturais',
      category: 'Mineral',
      finish: 'Levigado ou bruto · toque poroso',
      desc: 'Travertino romano e limestone com profundidade mineral.',
      image: 'assets/va-ref-08.webp',
      swatch: 'linear-gradient(135deg, #DFD6C7 0%, #BEB09B 100%)',
      tags: ['natural', 'organico', 'minimalista', 'rustico_sofisticado']
    },
    {
      id: 'mat_marmore',
      title: 'Mármore',
      category: 'Mineral',
      finish: 'Acetinado ou polido suave',
      desc: 'Veios expressivos que conferem presença escultórica.',
      image: 'https://images.unsplash.com/photo-1618221381711-42ca8ab6e908?auto=format&fit=crop&w=900&q=82',
      swatch: 'linear-gradient(135deg, #F2EFEA 0%, #CFC8BC 50%, #999085 100%)',
      tags: ['classico', 'neoclassico', 'elegante', 'contraste']
    },
    {
      id: 'mat_quartzito',
      title: 'Quartzito',
      category: 'Mineral',
      finish: 'Escovado ou fosco · alta resistência',
      desc: 'Pedra nobre de dureza elevada para ilhas e superfícies intensas.',
      image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=900&q=82',
      swatch: 'linear-gradient(135deg, #EAE2D6 0%, #C8B9A3 100%)',
      tags: ['contemporaneo', 'natural', 'claro']
    },
    {
      id: 'mat_metais',
      title: 'Metais Escovados',
      category: 'Detalhe',
      finish: 'Bronze, latão ou níquel fosco',
      desc: 'Pontos precisos de brilho contido em ferragens e metais.',
      image: 'assets/va-ref-03.webp',
      swatch: 'linear-gradient(135deg, #B5956B 0%, #735A3B 100%)',
      tags: ['contemporaneo', 'moderno', 'industrial', 'elegante']
    },
    {
      id: 'mat_vidro',
      title: 'Vidro Arquitetônico',
      category: 'Transparência',
      finish: 'Canelado, fumê ou extraclear',
      desc: 'Leveza visual e luz filtrada em divisórias e vitrines.',
      image: 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=900&q=82',
      swatch: 'linear-gradient(135deg, #DCE2E0 0%, #9CA6A3 100%)',
      tags: ['moderno', 'contemporaneo', 'minimalista']
    },
    {
      id: 'mat_tecidos_fibras',
      title: 'Tecidos e Fibras Naturais',
      category: 'Tátil',
      finish: 'Linho lavado, bouclé, lã e algodão',
      desc: 'Maciez acústica e conforto imediato em estofados e cortinas.',
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=82',
      swatch: 'linear-gradient(135deg, #EDE7DC 0%, #CFC3B1 100%)',
      tags: ['natural', 'organico', 'escandinavo', 'japandi', 'suave']
    },
    {
      id: 'mat_revestimentos_foscos',
      title: 'Revestimentos Foscos',
      category: 'Acabamento',
      finish: 'Zero brilho · cal ou microcimento',
      desc: 'Planos serenos onde luz e sombra se tornam protagonistas.',
      image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=900&q=82',
      swatch: 'linear-gradient(135deg, #E8E3DA 0%, #D3CCC0 100%)',
      tags: ['minimalista', 'monocromatico', 'organico']
    },
    {
      id: 'mat_superficies_acetinadas',
      title: 'Superfícies Acetinadas',
      category: 'Acabamento',
      finish: 'Toque sedoso · brilho sutil',
      desc: 'Lacas acetinadas e pedras amaciadas com reflexão suave.',
      image: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=900&q=82',
      swatch: 'linear-gradient(135deg, #F5F2EC 0%, #DDD7CC 100%)',
      tags: ['contemporaneo', 'neoclassico', 'elegante']
    },
    {
      id: 'mat_com_textura',
      title: 'Materiais com Textura',
      category: 'Relevo',
      finish: 'Ripados, reboco mineral e pedras táteis',
      desc: 'Relevos sutis que enriquecem o espaço sem depender de cor.',
      image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=82',
      swatch: 'repeating-linear-gradient(90deg, #C9B9A3 0 6px, #B4A086 6px 12px)',
      tags: ['organico', 'rustico_sofisticado', 'terroso', 'natural']
    },
    {
      id: 'mat_lisas_uniformes',
      title: 'Superfícies Lisas e Uniformes',
      category: 'Acabamento',
      finish: 'Planos contínuos · precisão minimalista',
      desc: 'Marcenaria sem puxadores e pisos contínuos de ordem visual.',
      image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=900&q=82',
      swatch: 'linear-gradient(135deg, #EFECE6 0%, #DFDBD2 100%)',
      tags: ['minimalista', 'moderno', 'monocromatico']
    }
  ],

  // ETAPA 04 — COMBINAÇÕES DE MATERIAIS (5 composições com 5 imagens exclusivas)
  combinations: [
    {
      id: 'cmb_clara_mineral',
      title: 'Madeira Clara + Pedra Bege + Tecidos Naturais',
      desc: 'Carvalho natural, travertino levigado e linho cru lavado.',
      elements: ['Carvalho Natural', 'Travertino Levigado', 'Linho Cru'],
      swatches: ['#C8AE8B', '#DFD5C5', '#F2EDE4'],
      image: 'https://images.unsplash.com/photo-1616137466211-f939a420be84?auto=format&fit=crop&w=900&q=82',
      tags: ['natural', 'claro', 'organico', 'escandinavo', 'japandi']
    },
    {
      id: 'cmb_escura_bronze',
      title: 'Madeira Escura + Mármore Claro + Metal Escovado',
      desc: 'Nogueira amendoada, mármore acetinado e bronze escovado.',
      elements: ['Nogueira Escura', 'Mármore Claro', 'Bronze Escovado'],
      swatches: ['#4B372A', '#ECE8E1', '#967751'],
      image: 'https://images.unsplash.com/photo-1600121848594-d8644e75ab69?auto=format&fit=crop&w=900&q=82',
      tags: ['profundo', 'contraste', 'moderno', 'elegante']
    },
    {
      id: 'cmb_neutra_organica',
      title: 'Superfícies Neutras + Texturas Orgânicas',
      desc: 'Microcimento mineral fosco, reboco artesanal e cerâmica crua.',
      elements: ['Cal Mineral Fosca', 'Reboco Texturizado', 'Cerâmica'],
      swatches: ['#E5DFD5', '#C9BFA9', '#8E8375'],
      image: 'https://images.unsplash.com/photo-1615875605825-5eb9bb5d52ac?auto=format&fit=crop&w=900&q=82',
      tags: ['organico', 'minimalista', 'monocromatico', 'suave']
    },
    {
      id: 'cmb_pedra_classica',
      title: 'Pedra Natural + Elementos Clássicos',
      desc: 'Limestone acetinado, boiseries contemporâneas e latão champanhe.',
      elements: ['Limestone Claro', 'Moldura Acetinada', 'Latão Suave'],
      swatches: ['#E8E3D9', '#F6F3EE', '#B89E74'],
      image: 'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=900&q=82',
      tags: ['classico', 'neoclassico', 'elegante', 'claro']
    },
    {
      id: 'cmb_minimalista_detalhes',
      title: 'Materiais Minimalistas + Detalhes Sofisticados',
      desc: 'Planos lisos em quartzito, vidro fumê e ferragens em bronze.',
      elements: ['Quartzito Fosco', 'Vidro Fumê', 'Bronze Matte'],
      swatches: ['#DDD7CD', '#6B6A66', '#8F734B'],
      image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=900&q=82',
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

  // ETAPA 05 — ILUMINAÇÃO E ATMOSFERA
  lightingScenarios: [
    {
      id: 'natural_abundante',
      title: 'Luz Natural Abundante',
      kelvin: '5000K · Dia',
      desc: 'Claridade aberta e arejada, evidenciando cores reais.',
      filter: 'brightness(1.06) contrast(1.01) saturate(0.98)',
      overlay: 'radial-gradient(circle at 75% 18%, rgba(255, 252, 245, 0.24) 0%, rgba(255, 255, 255, 0) 62%)'
    },
    {
      id: 'luz_difusa',
      title: 'Luz Difusa e Suave',
      kelvin: '3000K · Equilibrada',
      desc: 'Iluminação homogênea sem sombras duras para o dia a dia.',
      filter: 'brightness(0.98) contrast(0.96) sepia(0.08)',
      overlay: 'linear-gradient(180deg, rgba(252, 243, 228, 0.14) 0%, rgba(30, 26, 23, 0.08) 100%)'
    },
    {
      id: 'luz_indireta',
      title: 'Luz Indireta e Destaque de Texturas',
      kelvin: '2700K · Cênica',
      desc: 'Fachos rasantes valorizando relevos da pedra e madeira.',
      filter: 'brightness(0.84) contrast(1.12) sepia(0.18)',
      overlay: 'radial-gradient(ellipse at 28% 35%, rgba(240, 198, 138, 0.28) 0%, rgba(22, 18, 15, 0.42) 72%)'
    },
    {
      id: 'intimista',
      title: 'Atmosfera Intimista',
      kelvin: '2400K · Penumbra',
      desc: 'Contraste suave entre luz quente focal e sombra acolhedora.',
      filter: 'brightness(0.70) contrast(1.16) sepia(0.24)',
      overlay: 'radial-gradient(circle at 62% 58%, rgba(235, 180, 110, 0.26) 0%, rgba(16, 13, 11, 0.58) 70%)'
    }
  ],

  lightingPreferences: [
    { id: 'lgt_natural', title: 'Iluminação natural e abundante', desc: 'Aberturas amplas e sensação de espaço arejado.' },
    { id: 'lgt_indireta', title: 'Luz indireta', desc: 'Fontes ocultas em marcenaria, sancas limpas e cortineiros.' },
    { id: 'lgt_difusa', title: 'Luz difusa', desc: 'Claridade uniforme, suave e livre de ofuscamento.' },
    { id: 'lgt_decorativa', title: 'Iluminação decorativa', desc: 'Pendentes, abajures e arandelas como peças de destaque.' },
    { id: 'lgt_intimista', title: 'Ambientes intimistas', desc: 'Temperatura quente e pontos focais para relaxar.' },
    { id: 'lgt_claros_arejados', title: 'Ambientes claros e arejados', desc: 'Luminosidade elevada e leveza durante o dia.' },
    { id: 'lgt_texturas', title: 'Destaque de texturas e materiais', desc: 'Luz rasante revelando pedra, madeira e relevos.' },
    { id: 'lgt_luz_sombra', title: 'Contrastes suaves entre luz e sombra', desc: 'Profundidade cênica e ritmo visual sereno.' }
  ],

  // ETAPA 06 — SEU JEITO DE VIVER (4 imagens exclusivas nos espaços de descanso)
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
      desc: 'Um refúgio sereno dedicado ao descanso profundo.',
      image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=900&q=82&sat=-18'
    },
    {
      id: 'rest_leitura_madeira',
      title: 'Canto de Leitura Envolvente',
      desc: 'Poltrona confortável, livros e luz quente de apoio.',
      image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=900&q=82'
    },
    {
      id: 'rest_spa_mineral',
      title: 'Ritual de Banho e Descompressão',
      desc: 'Texturas minerais, água morna e atmosfera de spa.',
      image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=82'
    },
    {
      id: 'rest_estar_aberto',
      title: 'Estar Amplo Voltado para o Verde',
      desc: 'Sofá generoso, brisa natural e vista tranquila.',
      image: 'https://images.unsplash.com/photo-1600210491369-e753d80a41f3?auto=format&fit=crop&w=900&q=82'
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

  // ETAPA 07 — SEU PROJETO (alimenta diretamente o Checklist Inteligente da Fase 2)
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
    // IDs alinhados 1:1 com o banco de perguntas da Fase 2
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
