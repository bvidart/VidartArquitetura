// =========================================================================
// VA. ARQUITETURA & INTERIORES — FASE 2: CHECKLIST INTELIGENTE DE NECESSIDADES
// Banco de perguntas com IDs estáveis, regras condicionais por tipo de projeto,
// segmento comercial, ambientes selecionados e exclusividade lógica.
// =========================================================================

(function () {
  const QUESTIONNAIRE_VERSION = '4.0';

  // -----------------------------------------------------------------------
  // BANCO DE PERGUNTAS — REFORMA RESIDENCIAL (e Interiores em imóvel ocupado)
  // -----------------------------------------------------------------------
  const REFORM_ROOM_QUESTIONS = {
    sala: {
      id: 'q_ref_sala',
      roomId: 'sala',
      category: 'Sala de Estar · Reforma',
      prompt: 'O que incomoda na sua sala?',
      instruction: 'Marque o que se aplica',
      mode: 'multi',
      kind: 'problem',
      options: [
        { id: 'ref_sala_assentos', label: 'Faltam assentos quando recebo visitas.' },
        { id: 'ref_sala_luz_tv', label: 'A luz da janela atrapalha a TV.' },
        { id: 'ref_sala_guardar', label: 'Faltam locais para guardar objetos.' },
        { id: 'ref_sala_passagem', label: 'Os móveis atrapalham a passagem.' },
        { id: 'ref_sala_atividades', label: 'Falta espaço para atividades que realizo.' },
        { id: 'ref_sala_visual', label: 'Quero apenas renovar o visual.', exclusive: true }
      ]
    },
    cozinha: {
      id: 'q_ref_cozinha',
      roomId: 'cozinha',
      category: 'Cozinha · Reforma',
      prompt: 'O que precisa melhorar na cozinha?',
      instruction: 'Marque o que se aplica',
      mode: 'multi',
      kind: 'problem',
      options: [
        { id: 'ref_coz_bancada', label: 'Falta bancada para preparar alimentos.' },
        { id: 'ref_coz_esbarram', label: 'Duas pessoas se esbarram ao cozinhar.' },
        { id: 'ref_coz_panelas', label: 'Faltam locais para panelas e mantimentos.' },
        { id: 'ref_coz_eletros', label: 'Eletrodomésticos ocupam a bancada.' },
        { id: 'ref_coz_cheiro', label: 'O cheiro da comida chega à sala.' },
        { id: 'ref_coz_portas', label: 'Portas e gavetas atrapalham a passagem.' },
        { id: 'ref_coz_visual', label: 'Quero apenas renovar o visual.', exclusive: true }
      ]
    },
    jantar: {
      id: 'q_ref_jantar',
      roomId: 'jantar',
      category: 'Sala de Jantar · Reforma',
      prompt: 'O que não funciona bem na sala de jantar?',
      instruction: 'Marque o que se aplica',
      mode: 'multi',
      kind: 'problem',
      options: [
        { id: 'ref_jan_mesa', label: 'A mesa não acomoda quem come junto.' },
        { id: 'ref_jan_cadeiras', label: 'Cadeiras atrapalham a passagem.' },
        { id: 'ref_jan_servir', label: 'Falta apoio para servir refeições.' },
        { id: 'ref_jan_loucas', label: 'Faltam locais para guardar louças.' },
        { id: 'ref_jan_outra_funcao', label: 'Quero dar outra função ao espaço.' },
        { id: 'ref_jan_visual', label: 'Quero apenas renovar o visual.', exclusive: true }
      ]
    },
    quarto: {
      id: 'q_ref_quarto',
      roomId: 'quarto',
      category: 'Quarto · Reforma',
      prompt: 'O que precisa mudar no quarto?',
      instruction: 'Marque o que se aplica',
      mode: 'multi',
      kind: 'problem',
      options: [
        { id: 'ref_qua_roupas', label: 'Falta espaço para roupas e acessórios.' },
        { id: 'ref_qua_claridade', label: 'A claridade externa atrapalha o sono.' },
        { id: 'ref_qua_trabalhar', label: 'Preciso trabalhar ou estudar no quarto.' },
        { id: 'ref_qua_horarios', label: 'Duas pessoas usam o quarto em horários diferentes.' },
        { id: 'ref_qua_arrumar', label: 'Falta um local para me arrumar.' },
        { id: 'ref_qua_fase', label: 'Preciso adaptar o quarto para outra fase da vida.' },
        { id: 'ref_qua_visual', label: 'Quero apenas renovar o visual.', exclusive: true }
      ]
    },
    banheiro: {
      id: 'q_ref_banheiro',
      roomId: 'banheiro',
      category: 'Banheiro · Reforma',
      prompt: 'O que incomoda atualmente no banheiro?',
      instruction: 'Marque o que se aplica',
      mode: 'multi',
      kind: 'problem',
      options: [
        { id: 'ref_ban_agua', label: 'A água do banho molha fora do box.' },
        { id: 'ref_ban_higiene', label: 'Faltam locais para produtos de higiene.' },
        { id: 'ref_ban_simultaneo', label: 'Duas pessoas se arrumam simultaneamente.' },
        { id: 'ref_ban_apoio', label: 'Falta apoio para objetos durante o uso.' },
        { id: 'ref_ban_ajuda', label: 'Alguém precisa de ajuda para utilizá-lo.' },
        { id: 'ref_ban_limpar', label: 'Algumas áreas são difíceis de limpar.' },
        { id: 'ref_ban_visual', label: 'Quero apenas renovar o visual.', exclusive: true }
      ]
    },
    lavanderia: {
      id: 'q_ref_lavanderia',
      roomId: 'lavanderia',
      category: 'Lavanderia · Reforma',
      prompt: 'O que dificulta as tarefas na lavanderia?',
      instruction: 'Marque o que se aplica',
      mode: 'multi',
      kind: 'problem',
      options: [
        { id: 'ref_lav_secar', label: 'Falta espaço para secar roupas.' },
        { id: 'ref_lav_dobrar', label: 'Falta apoio para separar e dobrar peças.' },
        { id: 'ref_lav_produtos', label: 'Produtos de limpeza não têm local adequado.' },
        { id: 'ref_lav_equipamentos', label: 'Falta espaço para equipamentos.' },
        { id: 'ref_lav_grandes', label: 'Não consigo lavar peças grandes.' },
        { id: 'ref_lav_visual', label: 'Quero apenas renovar o visual.', exclusive: true }
      ]
    },
    escritorio: {
      id: 'q_ref_escritorio',
      roomId: 'escritorio',
      category: 'Escritório · Reforma',
      prompt: 'O que atrapalha no escritório?',
      instruction: 'Marque o que se aplica',
      mode: 'multi',
      kind: 'problem',
      options: [
        { id: 'ref_esc_barulho', label: 'Barulhos interferem nas reuniões.' },
        { id: 'ref_esc_duas_pessoas', label: 'Duas pessoas usam o espaço juntas.' },
        { id: 'ref_esc_tomadas', label: 'Faltam tomadas para equipamentos.' },
        { id: 'ref_esc_reflexos', label: 'Reflexos atrapalham a tela.' },
        { id: 'ref_esc_documentos', label: 'Faltam locais para documentos e materiais.' },
        { id: 'ref_esc_clientes', label: 'Preciso receber clientes.' },
        { id: 'ref_esc_visual', label: 'Quero apenas renovar o visual.', exclusive: true }
      ]
    },
    gourmet: {
      id: 'q_ref_gourmet',
      roomId: 'gourmet',
      category: 'Área Gourmet · Reforma',
      prompt: 'O que precisa melhorar na área gourmet?',
      instruction: 'Marque o que se aplica',
      mode: 'multi',
      kind: 'problem',
      options: [
        { id: 'ref_gou_apoio', label: 'Falta apoio para preparar e servir alimentos.' },
        { id: 'ref_gou_isolado', label: 'Quem cozinha fica isolado dos convidados.' },
        { id: 'ref_gou_clima', label: 'Sol ou chuva atrapalham o uso.' },
        { id: 'ref_gou_utensilios', label: 'Faltam locais para utensílios.' },
        { id: 'ref_gou_receber', label: 'A disposição dificulta receber pessoas.' },
        { id: 'ref_gou_visual', label: 'Quero apenas renovar o visual.', exclusive: true }
      ]
    },
    externa: {
      id: 'q_ref_externa',
      roomId: 'externa',
      category: 'Área Externa · Reforma',
      prompt: 'O que atrapalha o uso da área externa?',
      instruction: 'Marque o que se aplica',
      mode: 'multi',
      kind: 'problem',
      options: [
        { id: 'ref_ext_sol', label: 'Sol intenso nos horários de uso.' },
        { id: 'ref_ext_chuva', label: 'Chuva impede as atividades desejadas.' },
        { id: 'ref_ext_armazenamento', label: 'Falta armazenamento de objetos externos.' },
        { id: 'ref_ext_criancas_pets', label: 'Preciso acomodar atividades de crianças ou pets.' },
        { id: 'ref_ext_visual', label: 'Quero apenas renovar o visual.', exclusive: true }
      ]
    },
    entrada: {
      id: 'q_ref_entrada',
      roomId: 'entrada',
      category: 'Entrada / Garagem · Reforma',
      prompt: 'O que não funciona na entrada ou garagem?',
      instruction: 'Marque o que se aplica',
      mode: 'multi',
      kind: 'problem',
      options: [
        { id: 'ref_ent_bolsas', label: 'Falta local para bolsas, calçados ou mochilas.' },
        { id: 'ref_ent_manobras', label: 'A posição dos veículos dificulta manobras.' },
        { id: 'ref_ent_bicicletas', label: 'Falta lugar para bicicletas ou equipamentos.' },
        { id: 'ref_ent_chuva', label: 'A entrada fica exposta à chuva.' },
        { id: 'ref_ent_entregas', label: 'Falta apoio para compras e entregas.' },
        { id: 'ref_ent_visual', label: 'Quero apenas renovar o visual.', exclusive: true }
      ]
    }
  };

  // -----------------------------------------------------------------------
  // BANCO DE PERGUNTAS — CONSTRUÇÃO NOVA (e Interiores em imóvel novo)
  // -----------------------------------------------------------------------
  const NEW_GENERAL_QUESTIONS = [
    {
      id: 'q_new_geral_moradores',
      roomId: 'geral',
      category: 'Visão Geral · Construção',
      prompt: 'Quem vai morar ou utilizar o imóvel?',
      instruction: 'Marque o que se aplica',
      mode: 'multi',
      kind: 'usage',
      options: [
        { id: 'new_mor_uma_pessoa', label: 'Uma pessoa.' },
        { id: 'new_mor_casal', label: 'Casal.' },
        { id: 'new_mor_filhos', label: 'Família com filhos.' },
        { id: 'new_mor_hospedes', label: 'Hóspedes com frequência.' },
        { id: 'new_mor_mudanca_familiar', label: 'Há mudanças familiares previstas nos próximos anos.' },
        { id: 'new_mor_funcao_especial', label: 'Algum ambiente terá função especial (ateliê, música, academia etc.).' }
      ]
    }
  ];

  const NEW_ROOM_QUESTIONS = {
    sala: {
      id: 'q_new_sala',
      roomId: 'sala',
      category: 'Sala de Estar · Uso Previsto',
      prompt: 'Como pretende utilizar a sala?',
      instruction: 'Marque o que se aplica',
      mode: 'multi',
      kind: 'usage',
      options: [
        { id: 'new_sala_tv', label: 'TV e filmes.' },
        { id: 'new_sala_visitas', label: 'Receber visitas e conversar.' },
        { id: 'new_sala_leitura', label: 'Leitura.' },
        { id: 'new_sala_brincadeiras', label: 'Brincadeiras.' },
        { id: 'new_sala_jogos', label: 'Jogos.' },
        { id: 'new_sala_musica', label: 'Música.' }
      ]
    },
    cozinha: {
      id: 'q_new_cozinha',
      roomId: 'cozinha',
      category: 'Cozinha · Rotina Prevista',
      prompt: 'Como será a rotina na cozinha?',
      instruction: 'Marque o que se aplica',
      mode: 'multi',
      kind: 'usage',
      options: [
        { id: 'new_coz_uma', label: 'Uma pessoa cozinha por vez.' },
        { id: 'new_coz_varias', label: 'Várias pessoas cozinham juntas.' },
        { id: 'new_coz_visitas', label: 'Interação com visitas durante o preparo.' },
        { id: 'new_coz_refeicoes_grandes', label: 'Refeições grandes com frequência.' },
        { id: 'new_coz_eletros', label: 'Uso de muitos eletrodomésticos.' },
        { id: 'new_coz_pouco', label: 'Pouco preparo de refeições em casa.' }
      ]
    },
    jantar: {
      id: 'q_new_jantar',
      roomId: 'jantar',
      category: 'Sala de Jantar · Uso Previsto',
      prompt: 'Como o espaço de jantar será utilizado?',
      instruction: 'Marque o que se aplica',
      mode: 'multi',
      kind: 'usage',
      options: [
        { id: 'new_jan_diarias', label: 'Refeições diárias.' },
        { id: 'new_jan_rapidas', label: 'Refeições rápidas.' },
        { id: 'new_jan_convidados', label: 'Receber convidados.' },
        { id: 'new_jan_encontros', label: 'Encontros familiares maiores.' },
        { id: 'new_jan_estudo', label: 'Estudo ou atividades na mesa.' }
      ]
    },
    quarto: {
      id: 'q_new_quarto',
      roomId: 'quarto',
      category: 'Quarto · Uso Previsto',
      prompt: 'O que fará no quarto além de dormir?',
      instruction: 'Marque o que se aplica',
      mode: 'multi',
      kind: 'usage',
      options: [
        { id: 'new_qua_leitura', label: 'Leitura.' },
        { id: 'new_qua_tv', label: 'Assistir à TV.' },
        { id: 'new_qua_estudo', label: 'Estudo ou trabalho.' },
        { id: 'new_qua_bebe', label: 'Cuidados com bebê.' },
        { id: 'new_qua_cuidados', label: 'Cuidados pessoais.' },
        { id: 'new_qua_colecoes', label: 'Guardar equipamentos ou coleções.' },
        { id: 'new_qua_nenhuma', label: 'Nenhuma outra atividade.', exclusive: true }
      ]
    },
    banheiro: {
      id: 'q_new_banheiro',
      roomId: 'banheiro',
      category: 'Banheiro · Uso Previsto',
      prompt: 'Como o banheiro será utilizado?',
      instruction: 'Marque o que se aplica',
      mode: 'multi',
      kind: 'usage',
      options: [
        { id: 'new_ban_uma', label: 'Uma pessoa por vez.' },
        { id: 'new_ban_duas', label: 'Duas pessoas se arrumam juntas.' },
        { id: 'new_ban_crianca', label: 'Adulto auxilia criança.' },
        { id: 'new_ban_ajuda', label: 'Pessoa precisa de ajuda no uso.' },
        { id: 'new_ban_visitas', label: 'Uso principal por visitas.' }
      ]
    },
    lavanderia: {
      id: 'q_new_lavanderia',
      roomId: 'lavanderia',
      category: 'Lavanderia · Rotina Prevista',
      prompt: 'Quais tarefas realizará na lavanderia?',
      instruction: 'Marque o que se aplica',
      mode: 'multi',
      kind: 'usage',
      options: [
        { id: 'new_lav_varal', label: 'Máquina de lavar e varal.' },
        { id: 'new_lav_secadora', label: 'Secadora separada.' },
        { id: 'new_lav_lava_seca', label: 'Lava e seca.' },
        { id: 'new_lav_manual', label: 'Lavagem manual de peças.' },
        { id: 'new_lav_passar', label: 'Passar roupas.' },
        { id: 'new_lav_externa', label: 'Uso frequente de lavanderia externa.' }
      ]
    },
    escritorio: {
      id: 'q_new_escritorio',
      roomId: 'escritorio',
      category: 'Escritório · Uso Previsto',
      prompt: 'Quais atividades acontecerão no escritório?',
      instruction: 'Marque o que se aplica',
      mode: 'multi',
      kind: 'usage',
      options: [
        { id: 'new_esc_computador', label: 'Trabalho em computador.' },
        { id: 'new_esc_video', label: 'Videoconferências frequentes.' },
        { id: 'new_esc_estudo', label: 'Estudo.' },
        { id: 'new_esc_clientes', label: 'Atender clientes presencialmente.' },
        { id: 'new_esc_criativas', label: 'Atividades criativas ou manuais.' },
        { id: 'new_esc_equipamentos', label: 'Guardar equipamentos e arquivos.' }
      ]
    },
    gourmet: {
      id: 'q_new_gourmet',
      roomId: 'gourmet',
      category: 'Área Gourmet · Uso Previsto',
      prompt: 'Quais atividades acontecerão na área gourmet?',
      instruction: 'Marque o que se aplica',
      mode: 'multi',
      kind: 'usage',
      options: [
        { id: 'new_gou_churrasco', label: 'Churrasco.' },
        { id: 'new_gou_cozinhar', label: 'Cozinhar no dia a dia ou fins de semana.' },
        { id: 'new_gou_refeicoes', label: 'Receber para refeições.' },
        { id: 'new_gou_tv', label: 'Assistir à TV.' },
        { id: 'new_gou_encontros', label: 'Encontros maiores.' },
        { id: 'new_gou_descanso', label: 'Descanso.' }
      ]
    },
    externa: {
      id: 'q_new_externa',
      roomId: 'externa',
      category: 'Área Externa · Uso Previsto',
      prompt: 'Quais atividades acontecerão na área externa?',
      instruction: 'Marque o que se aplica',
      mode: 'multi',
      kind: 'usage',
      options: [
        { id: 'new_ext_descanso', label: 'Descanso e contemplação.' },
        { id: 'new_ext_refeicoes', label: 'Refeições ao ar livre.' },
        { id: 'new_ext_jardim', label: 'Cultivo de plantas ou horta.' },
        { id: 'new_ext_criancas_pets', label: 'Atividades de crianças ou pets.' },
        { id: 'new_ext_armazenar', label: 'Guardar itens de jardim ou lazer.' }
      ]
    },
    entrada: {
      id: 'q_new_entrada',
      roomId: 'entrada',
      category: 'Entrada / Garagem · Uso Previsto',
      prompt: 'O que a entrada ou garagem precisa acomodar?',
      instruction: 'Marque o que se aplica',
      mode: 'multi',
      kind: 'usage',
      options: [
        { id: 'new_ent_carros', label: 'Carros.' },
        { id: 'new_ent_motos', label: 'Motos.' },
        { id: 'new_ent_bicicletas', label: 'Bicicletas.' },
        { id: 'new_ent_esportes', label: 'Equipamentos esportivos.' },
        { id: 'new_ent_chegada', label: 'Itens de chegada e saída (calçados, bolsas, casacos).' },
        { id: 'new_ent_encomendas', label: 'Encomendas e entregas.' }
      ]
    }
  };

  // -----------------------------------------------------------------------
  // PERGUNTAS CONDICIONAIS (Pets, Crianças, Acessibilidade, Preservação)
  // -----------------------------------------------------------------------
  const CONDITIONAL_QUESTIONS = {
    preservacao: {
      id: 'q_cond_preservar',
      roomId: 'preservacao',
      category: 'Preservação · Imóvel Existente',
      prompt: 'O que você gostaria de preservar no imóvel?',
      instruction: 'Marque o que deseja manter',
      mode: 'multi',
      kind: 'preserve',
      options: [
        { id: 'pres_planejados', label: 'Móveis planejados.' },
        { id: 'pres_soltos', label: 'Móveis soltos.' },
        { id: 'pres_revestimentos', label: 'Revestimentos (pisos ou paredes).' },
        { id: 'pres_esquadrias', label: 'Esquadrias (portas ou janelas).' },
        { id: 'pres_equipamentos', label: 'Equipamentos e eletrodomésticos.' },
        { id: 'pres_afetivos', label: 'Itens afetivos ou obras de arte.' }
      ]
    },
    pets: {
      id: 'q_cond_pets',
      roomId: 'pets',
      category: 'Rotina com Pets',
      prompt: 'Quais cuidados com pets o espaço precisa contemplar?',
      instruction: 'Marque o que se aplica',
      mode: 'multi',
      kind: 'conditional',
      options: [
        { id: 'pet_dormir_comer', label: 'Local definido para dormir e comer.' },
        { id: 'pet_banho', label: 'Banho do pet em casa.' },
        { id: 'pet_necessidades', label: 'Local discreto para necessidades.' },
        { id: 'pet_racao', label: 'Armazenamento de ração e acessórios.' }
      ]
    },
    criancas: {
      id: 'q_cond_criancas',
      roomId: 'criancas',
      category: 'Rotina com Crianças',
      prompt: 'Quais atividades infantis precisam ser consideradas?',
      instruction: 'Marque o que se aplica',
      mode: 'multi',
      kind: 'conditional',
      options: [
        { id: 'cri_brincar', label: 'Espaço para brincar.' },
        { id: 'cri_estudar', label: 'Local de estudo.' },
        { id: 'cri_brinquedos', label: 'Guardar brinquedos com facilidade.' },
        { id: 'cri_amigos', label: 'Receber amigos.' },
        { id: 'cri_especiais', label: 'Atividades especiais (arte, música, leitura).' }
      ]
    },
    acessibilidade: {
      id: 'q_cond_acessibilidade',
      roomId: 'acessibilidade',
      category: 'Acessibilidade',
      prompt: 'Há alguma necessidade de acessibilidade a considerar?',
      instruction: 'Marque o que se aplica (sem necessidade de detalhes médicos)',
      mode: 'multi',
      kind: 'conditional',
      options: [
        { id: 'ace_escadas', label: 'Dificuldade com escadas ou degraus.' },
        { id: 'ace_banho', label: 'Apoio ou adaptação no momento do banho.' },
        { id: 'ace_mobilidade', label: 'Circulação com equipamento de mobilidade.' },
        { id: 'ace_auxilio', label: 'Necessidade de auxílio de outra pessoa.' },
        { id: 'ace_equipe', label: 'Prefiro tratar diretamente com a equipe.', exclusive: true }
      ]
    }
  };

  // -----------------------------------------------------------------------
  // BANCO DE PERGUNTAS — CONSULTORIA (Questionário reduzido)
  // -----------------------------------------------------------------------
  const CONSULTING_QUESTIONS = [
    {
      id: 'q_cons_decisao',
      roomId: 'consultoria',
      category: 'Consultoria · Foco Principal',
      prompt: 'Qual decisão você precisa tomar agora?',
      instruction: 'Marque o que se aplica',
      mode: 'multi',
      kind: 'problem',
      options: [
        { id: 'cons_layout', label: 'Distribuição de móveis.' },
        { id: 'cons_cores', label: 'Cores e materiais.' },
        { id: 'cons_revestimentos', label: 'Escolha de revestimentos.' },
        { id: 'cons_iluminacao', label: 'Iluminação.' },
        { id: 'cons_organizacao', label: 'Organização funcional.' },
        { id: 'cons_viabilidade', label: 'Possibilidade de reforma.' },
        { id: 'cons_outro', label: 'Outra questão específica.' }
      ]
    },
    {
      id: 'q_cons_dificuldade',
      roomId: 'consultoria',
      category: 'Consultoria · Contexto',
      prompt: 'O que mais gera dúvida nessa decisão?',
      instruction: 'Marque o que se aplica',
      mode: 'multi',
      kind: 'usage',
      options: [
        { id: 'cons_dif_medidas', label: 'Insegurança com medidas e proporções.' },
        { id: 'cons_dif_combinar', label: 'Dificuldade em harmonizar acabamentos ou móveis existentes.' },
        { id: 'cons_dif_ordem', label: 'Não saber por onde começar ou o que priorizar.' },
        { id: 'cons_dif_aproveitar', label: 'Aproveitar melhor o espaço sem grandes obras.' }
      ]
    }
  ];

  // -----------------------------------------------------------------------
  // BANCO DE PERGUNTAS — COMERCIAL (Específico por segmento)
  // -----------------------------------------------------------------------
  function getCommercialQuestions(segment) {
    const seg = segment || 'outro';
    const base = [
      {
        id: 'q_com_usuarios',
        roomId: 'comercial_fluxo',
        category: 'Comercial · Usuários e Fluxo',
        prompt: 'Qual é o volume habitual de pessoas no espaço?',
        instruction: 'Escolha a opção mais próxima',
        mode: 'single',
        kind: 'usage',
        options: [
          { id: 'com_usr_ate5', label: 'Até 5 pessoas simultaneamente.' },
          { id: 'com_usr_6a15', label: 'De 6 a 15 pessoas simultaneamente.' },
          { id: 'com_usr_16a40', label: 'De 16 a 40 pessoas simultaneamente.' },
          { id: 'com_usr_40plus', label: 'Mais de 40 pessoas simultaneamente.' }
        ]
      }
    ];

    if (seg === 'loja') {
      base.push(
        {
          id: 'q_com_loja_atendimento',
          roomId: 'comercial_atendimento',
          category: 'Loja / Varejo · Atendimento',
          prompt: 'Como acontece a experiência de compra?',
          instruction: 'Marque o que se aplica',
          mode: 'multi',
          kind: 'usage',
          options: [
            { id: 'com_loj_vitrine', label: 'Exposição de destaque em vitrine.' },
            { id: 'com_loj_provador', label: 'Provadores ou área de experimentação.' },
            { id: 'com_loj_consultivo', label: 'Atendimento consultivo sentado.' },
            { id: 'com_loj_caixa', label: 'Ponto de caixa e embalagem rápido.' },
            { id: 'com_loj_retirada', label: 'Retirada de pedidos online.' }
          ]
        },
        {
          id: 'q_com_loja_operacao',
          roomId: 'comercial_operacao',
          category: 'Loja / Varejo · Estoque e Apoio',
          prompt: 'Quais demandas operacionais o espaço precisa resolver?',
          instruction: 'Marque o que se aplica',
          mode: 'multi',
          kind: 'problem',
          options: [
            { id: 'com_loj_estoque', label: 'Estoque de reposição próximo à área de venda.' },
            { id: 'com_loj_recebimento', label: 'Recebimento de mercadorias sem cruzar com clientes.' },
            { id: 'com_loj_copa', label: 'Apoio interno para equipe (copa e pertences).' },
            { id: 'com_loj_iluminacao', label: 'Iluminação específica para fidelidade de cores dos produtos.' }
          ]
        }
      );
    } else if (seg === 'escritorio') {
      base.push(
        {
          id: 'q_com_esc_atendimento',
          roomId: 'comercial_atendimento',
          category: 'Escritório · Rotina e Reuniões',
          prompt: 'Quais dinâmicas de trabalho acontecem no espaço?',
          instruction: 'Marque o que se aplica',
          mode: 'multi',
          kind: 'usage',
          options: [
            { id: 'com_esc_foco', label: 'Estações de trabalho individuais com foco.' },
            { id: 'com_esc_reunioes', label: 'Reuniões presenciais com clientes.' },
            { id: 'com_esc_video', label: 'Videoconferências simultâneas com privacidade acústica.' },
            { id: 'com_esc_recepcao', label: 'Recepção e espera de visitantes.' },
            { id: 'com_esc_hibrido', label: 'Equipe em formato híbrido (postos flexíveis).' }
          ]
        },
        {
          id: 'q_com_esc_operacao',
          roomId: 'comercial_operacao',
          category: 'Escritório · Equipamentos e Apoio',
          prompt: 'Quais itens técnicos e de apoio precisam de espaço dedicado?',
          instruction: 'Marque o que se aplica',
          mode: 'multi',
          kind: 'problem',
          options: [
            { id: 'com_esc_ti', label: 'Rack de TI, impressoras e cabeamento organizado.' },
            { id: 'com_esc_arquivos', label: 'Armazenamento de documentos, amostras ou acervo.' },
            { id: 'com_esc_copa', label: 'Copa e café para equipe e clientes.' },
            { id: 'com_esc_acustica', label: 'Isolamento acústico entre salas.' }
          ]
        }
      );
    } else if (seg === 'clinica') {
      base.push(
        {
          id: 'q_com_cli_atendimento',
          roomId: 'comercial_atendimento',
          category: 'Clínica · Atendimento',
          prompt: 'Como funciona o atendimento aos pacientes?',
          instruction: 'Marque o que se aplica',
          mode: 'multi',
          kind: 'usage',
          options: [
            { id: 'com_cli_recepcao', label: 'Recepção com cadastro e espera acolhedora.' },
            { id: 'com_cli_salas', label: 'Múltiplas salas de atendimento simultâneo.' },
            { id: 'com_cli_privacidade', label: 'Privacidade acústica e visual entre consultas.' },
            { id: 'com_cli_acessivel', label: 'Circulação acessível para cadeirantes ou idosos.' }
          ]
        },
        {
          id: 'q_com_cli_operacao',
          roomId: 'comercial_operacao',
          category: 'Clínica · Operação e Normas',
          prompt: 'Quais requisitos operacionais são necessários?',
          instruction: 'Marque o que se aplica',
          mode: 'multi',
          kind: 'problem',
          options: [
            { id: 'com_cli_esterilizacao', label: 'Área técnica para esterilização ou preparo.' },
            { id: 'com_cli_equipamentos', label: 'Equipamentos médicos com infraestrutura dedicada.' },
            { id: 'com_cli_insumos', label: 'Armazenamento fechado de insumos e descartáveis.' },
            { id: 'com_cli_superficies', label: 'Superfícies de higienização facilitada.' }
          ]
        }
      );
    } else if (seg === 'gastronomia') {
      base.push(
        {
          id: 'q_com_gas_atendimento',
          roomId: 'comercial_atendimento',
          category: 'Gastronomia · Salão e Serviço',
          prompt: 'Como será o atendimento ao público?',
          instruction: 'Marque o que se aplica',
          mode: 'multi',
          kind: 'usage',
          options: [
            { id: 'com_gas_salao', label: 'Consumo em mesas no salão.' },
            { id: 'com_gas_balcao', label: 'Atendimento rápido em balcão ou café.' },
            { id: 'com_gas_delivery', label: 'Fluxo dedicado para retirada e delivery.' },
            { id: 'com_gas_externo', label: 'Mesas em área externa ou varanda.' }
          ]
        },
        {
          id: 'q_com_gas_operacao',
          roomId: 'comercial_operacao',
          category: 'Gastronomia · Cozinha e Estoque',
          prompt: 'Quais pontos operacionais exigem atenção?',
          instruction: 'Marque o que se aplica',
          mode: 'multi',
          kind: 'problem',
          options: [
            { id: 'com_gas_exaustao', label: 'Exaustão e controle de odores para o salão.' },
            { id: 'com_gas_estoque', label: 'Estoque seco e refrigerado bem dimensionado.' },
            { id: 'com_gas_fluxo', label: 'Separação entre circulação de serviço e clientes.' },
            { id: 'com_gas_acustica', label: 'Conforto acústico em horários de pico.' }
          ]
        }
      );
    } else {
      base.push(
        {
          id: 'q_com_gen_atendimento',
          roomId: 'comercial_atendimento',
          category: 'Comercial · Atendimento e Operação',
          prompt: 'Como o espaço atende clientes e equipe?',
          instruction: 'Marque o que se aplica',
          mode: 'multi',
          kind: 'usage',
          options: [
            { id: 'com_gen_recepcao', label: 'Recepção e espera para clientes.' },
            { id: 'com_gen_atendimento', label: 'Atendimento individual ou em grupos.' },
            { id: 'com_gen_equipamentos', label: 'Equipamentos específicos da atividade.' },
            { id: 'com_gen_estoque', label: 'Armazenamento interno de materiais ou estoque.' },
            { id: 'com_gen_apoio', label: 'Área restrita de apoio para equipe.' }
          ]
        }
      );
    }

    return base;
  }

  // -----------------------------------------------------------------------
  // MOTOR CONDICIONAL: MONTA A LISTA EXATA DE PERGUNTAS PARA O CLIENTE
  // -----------------------------------------------------------------------
  function buildChecklistQuestions(projectContext) {
    const p = projectContext || {};
    const type = p.projectType || 'Interiores';
    const isCommercial = p.propertyCategory === 'Comercial';
    const isOccupiedInterior = type === 'Interiores' && p.interiorStatus === 'ocupado';
    const isReformFlow = type === 'Reforma' || isOccupiedInterior;
    const selectedRooms = Array.isArray(p.rooms) ? p.rooms : [];
    const flags = Array.isArray(p.contextFlags) ? p.contextFlags : [];

    const flow = [];

    // 1. Consultoria — questionário reduzido
    if (type === 'Consultoria') {
      flow.push(...CONSULTING_QUESTIONS);
      if (isCommercial) {
        flow.push(getCommercialQuestions(p.commercialSegment)[0]);
      }
      return flow;
    }

    // 2. Comercial — perguntas específicas por segmento (nunca reutiliza residencial)
    if (isCommercial) {
      flow.push(...getCommercialQuestions(p.commercialSegment));
      if (isReformFlow) {
        flow.push(CONDITIONAL_QUESTIONS.preservacao);
      }
      return flow;
    }

    // 3. Residencial — Construção Nova ou Interiores em imóvel novo
    if (!isReformFlow) {
      if (type === 'Construção') {
        flow.push(...NEW_GENERAL_QUESTIONS);
      }
      const roomsToAsk = selectedRooms.length ? selectedRooms : ['sala', 'cozinha', 'quarto'];
      roomsToAsk.forEach((roomId) => {
        if (NEW_ROOM_QUESTIONS[roomId]) {
          flow.push(NEW_ROOM_QUESTIONS[roomId]);
        }
      });
    } else {
      // 4. Residencial — Reforma ou Interiores em imóvel ocupado
      const roomsToAsk = selectedRooms.length ? selectedRooms : ['sala', 'cozinha', 'quarto'];
      roomsToAsk.forEach((roomId) => {
        if (REFORM_ROOM_QUESTIONS[roomId]) {
          flow.push(REFORM_ROOM_QUESTIONS[roomId]);
        }
      });
      flow.push(CONDITIONAL_QUESTIONS.preservacao);
    }

    // 5. Perguntas condicionais (somente se aplicáveis)
    if (flags.includes('pets')) flow.push(CONDITIONAL_QUESTIONS.pets);
    if (flags.includes('criancas')) flow.push(CONDITIONAL_QUESTIONS.criancas);
    if (flags.includes('acessibilidade')) flow.push(CONDITIONAL_QUESTIONS.acessibilidade);

    return flow;
  }

  // Aplica regra de exclusividade (ex: "Quero apenas renovar o visual." não coexiste com problemas)
  function toggleAnswerWithExclusivity(question, currentValues, optionId) {
    const arr = Array.isArray(currentValues) ? [...currentValues] : [];
    const opt = question.options.find((o) => o.id === optionId);
    if (!opt) return arr;

    if (question.mode === 'single') {
      return arr.includes(optionId) ? [] : [optionId];
    }

    if (arr.includes(optionId)) {
      return arr.filter((id) => id !== optionId);
    }

    if (opt.exclusive) {
      return [optionId];
    }

    const exclusiveIds = new Set(question.options.filter((o) => o.exclusive).map((o) => o.id));
    return [...arr.filter((id) => !exclusiveIds.has(id)), optionId];
  }

  // Extrai todas as necessidades concretas marcadas para a tela "O que é mais importante resolver?"
  function collectMarkedNeeds(questions, answersMap) {
    const needs = [];
    questions.forEach((q) => {
      if (q.kind === 'preserve') return;
      const selectedIds = answersMap[q.id] || [];
      selectedIds.forEach((optId) => {
        const opt = q.options.find((o) => o.id === optId);
        if (!opt || opt.exclusive) return;
        needs.push({
          id: `${q.id}::${opt.id}`,
          questionId: q.id,
          optionId: opt.id,
          roomId: q.roomId,
          category: q.category.split(' · ')[0],
          kind: q.kind,
          label: opt.label
        });
      });
    });
    return needs;
  }

  // Índice global de todas as perguntas para consulta no painel administrativo e exportação
  function getAllQuestionsIndex() {
    const all = [
      ...Object.values(REFORM_ROOM_QUESTIONS),
      ...NEW_GENERAL_QUESTIONS,
      ...Object.values(NEW_ROOM_QUESTIONS),
      ...Object.values(CONDITIONAL_QUESTIONS),
      ...CONSULTING_QUESTIONS,
      ...getCommercialQuestions('loja'),
      ...getCommercialQuestions('escritorio'),
      ...getCommercialQuestions('clinica'),
      ...getCommercialQuestions('gastronomia'),
      ...getCommercialQuestions('outro')
    ];
    const map = {};
    all.forEach((q) => {
      map[q.id] = q;
    });
    return map;
  }

  window.VA_CHECKLIST = {
    VERSION: QUESTIONNAIRE_VERSION,
    buildChecklistQuestions,
    toggleAnswerWithExclusivity,
    collectMarkedNeeds,
    getAllQuestionsIndex
  };
})();
