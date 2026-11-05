async function navigateTo(screenName) {
  const appContainer = document.getElementById('app');

  try {
    const response = await fetch(`screens/${screenName}.html`);
    if (!response.ok) throw new Error(`Tela ${screenName} não encontrada.`);
    const htmlContent = await response.text();

    loadCSS(screenName);

    appContainer.innerHTML = htmlContent;
    appContainer.scrollTop = 0;

    if (window.lucide) {
      lucide.createIcons();
    }
  } catch (error) {
    console.error('Erro ao carregar a tela:', error);
  }
}

// Função auxiliar para injetar a tag <link> do CSS caso ela ainda não exista
function loadCSS(screenName) {
  const cssId = `css-${screenName}`;
  if (!document.getElementById(cssId)) {
    const link = document.createElement('link');
    link.id = cssId;
    link.rel = 'stylesheet';
    link.href = `css/${screenName}.css`;
    document.head.appendChild(link);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  navigateTo('splash');
});

// Alterna a abertura do painel de filtros
function toggleFilterPanel() {
  const filterPanel = document.getElementById('filter-panel');
  const btnText = document.getElementById('filter-btn-text');
  const filterBtn = document.getElementById('btn-toggle-filter');

  if (filterPanel) {
    const isOpen = filterPanel.classList.toggle('open');
    filterBtn.classList.toggle('active', isOpen);
    
    if (btnText) {
      btnText.textContent = isOpen ? 'Aplicar' : 'Filtrar';
    }
  }
}

// Expande ou recolhe o card do animal para mostrar mais detalhes
function toggleCardDetails(cardId) {
  const card = document.getElementById(cardId);
  if (card) {
    card.classList.toggle('expanded');
  }
}

// Alterna entre Registrar Presença e Remover Presença
function togglePresence(eventId) {
  const card = document.getElementById(eventId);
  const textSpan = event.currentTarget.querySelector('span');

  if (card && textSpan) {
    const hasPresence = card.classList.toggle('presence-confirmed');
    
    if (hasPresence) {
      textSpan.textContent = 'Remover presença';
    } else {
      textSpan.textContent = 'Registrar presença';
      card.classList.remove('show-friends');
    }
  }
}

// Alterna a visibilidade da lista de amigos no evento
function toggleFriendsPanel(eventId) {
  const card = document.getElementById(eventId);
  if (card) {
    card.classList.toggle('show-friends');
  }
}

// Alterna a exibição do painel de filtro do mapa
function toggleMapFilterPanel() {
  const panel = document.getElementById('map-filter-panel');
  const btnText = document.getElementById('map-filter-btn-text');

  if (panel) {
    const isOpen = panel.classList.toggle('open');
    if (btnText) {
      btnText.textContent = isOpen ? 'Aplicar' : 'Filtrar';
    }
  }
}

// Alterna entre as abas do próprio perfil (Publicações, Reposts, Eventos, Menções)
function switchProfileTab(tabName) {
  const tabs = document.querySelectorAll('.profile-tabs .tab-item');
  tabs.forEach(tab => tab.classList.remove('active'));

  const feeds = document.querySelectorAll('.tab-feed-content');
  feeds.forEach(feed => feed.classList.remove('active'));

  // Ativa o botão selecionado
  const activeBtn = document.getElementById(`tab-${tabName}-btn`);
  if (activeBtn) activeBtn.classList.add('active');

  // Mostra o feed selecionado (posts ou events)
  const activeFeed = document.getElementById(`feed-${tabName}`);
  if (activeFeed) {
    activeFeed.classList.add('active');
  }
}

// Abre o modal de opções de postagem
function openPostModal() {
  const modal = document.getElementById('post-options-modal');
  if (modal) {
    modal.classList.add('open');
  }
}

// Fecha o modal ao clicar fora dos botões
function closePostModal() {
  const modal = document.getElementById('post-options-modal');
  if (modal) {
    modal.classList.remove('open');
  }
}

// Lógica de seleção do tipo de postagem
function selectPostType(type) {
  closePostModal();
  
  if (type === 'comum') {
    navigateTo('criar-post-comum'); 
  } else if (type === 'adocao') {
    navigateTo('criar-post-adocao'); 
  } else if (type === 'evento') {
    navigateTo('criar-post-evento');
}
}

// Alterna a exibição da caixa de enquete
function togglePollBox() {
  const pollBox = document.getElementById('poll-box');
  if (pollBox) {
    pollBox.classList.toggle('open');
  }
}

// Adiciona uma nova opção à enquete dentro dos limites da tela
function addPollOption() {
  const optionsList = document.getElementById('poll-options-list');
  if (optionsList) {
    const optionCount = optionsList.children.length + 1;
    const newOption = document.createElement('div');
    newOption.className = 'poll-option-item';
    newOption.innerHTML = `
      <i data-lucide="image" class="option-icon"></i>
      <input type="text" placeholder="Opção ${optionCount}" class="poll-input">
      <button class="poll-action-btn remove-btn" onclick="removePollOption(this)" title="Remover opção">
        <i data-lucide="minus-circle"></i>
      </button>
    `;
    optionsList.appendChild(newOption);
    if (window.lucide) lucide.createIcons();
  }
}

// Removes a opção selecionada da enquete
function removePollOption(btnElement) {
  const optionsList = document.getElementById('poll-options-list');
  if (optionsList && optionsList.children.length > 2) {
    // Mantém pelo menos 2 opções
    const optionItem = btnElement.closest('.poll-option-item');
    if (optionItem) {
      optionItem.remove();
    }
  } else if (optionsList) {
    alert('A enquete deve ter no mínimo 2 opções.');
  }
}

// Executa a publicação, redireciona para a home e mostra a mensagem de sucesso
async function submitPost() {
  await navigateTo('home');

  const toast = document.getElementById('post-success-toast');
  if (toast) {
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
}

// Desabilita/Habilita o campo de nome do pet caso a opção "Não possui/não sabe" seja marcada
function togglePetNameInput(checkbox) {
  const nameInput = document.getElementById('pet-name-input');
  if (nameInput) {
    nameInput.disabled = checkbox.checked;
    if (checkbox.checked) {
      nameInput.value = '';
    }
  }
}

// Executa a publicação do anúncio de adoção, redireciona para a página de adoção e exibe a notificação
async function submitAdocaoPost() {
  await navigateTo('adocao');

  const toast = document.getElementById('post-success-toast');
  if (toast) {
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
}

function aplicarFiltros() {
  // 1. Coleta os valores marcados em cada categoria de filtro
  const filtros = {
    animal: Array.from(document.querySelectorAll('.filter-group:nth-child(1) input:checked')).map(cb => cb.value),
    tamanho: Array.from(document.querySelectorAll('.filter-group:nth-child(2) input:checked')).map(cb => cb.value),
    sexo: Array.from(document.querySelectorAll('.filter-group:nth-child(3) input:checked')).map(cb => cb.value),
    idade: Array.from(document.querySelectorAll('.filter-group:nth-child(4) input:checked')).map(cb => Number(cb.value))
  };

  // 2. Seleciona todos os cards de pets
  const cards = document.querySelectorAll('.pet-card');

  cards.forEach(card => {
    // Obtém as propriedades do pet a partir dos dataset attributes
    const petAnimal = card.dataset.animal;
    const petTamanho = card.dataset.tamanho;
    const petSexo = card.dataset.sexo;
    const petIdade = Number(card.dataset.idade);

    // 3. Valida se o card atende a todas as categorias com filtros ativos
    const bateAnimal = filtros.animal.length === 0 || filtros.animal.includes(petAnimal);
    const bateTamanho = filtros.tamanho.length === 0 || filtros.tamanho.includes(petTamanho);
    const bateSexo = filtros.sexo.length === 0 || filtros.sexo.includes(petSexo);
    
    // Regra da idade: exibe se o pet tiver idade menor ou igual a qualquer um dos limites selecionados
    const bateIdade = filtros.idade.length === 0 || filtros.idade.some(limite => petIdade <= limite);

    // 4. Exibe ou oculta o card usando a classe .hidden fornecida no seu CSS
    if (bateAnimal && bateTamanho && bateSexo && bateIdade) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  });

  // 5. Atualiza a indicação (badge) no botão "Filtrar" se houver algum filtro ativo
  const totalFiltrosAtivos = filtros.animal.length + filtros.tamanho.length + filtros.sexo.length + filtros.idade.length;
  const filterBtn = document.getElementById('btn-toggle-filter');
  
  if (totalFiltrosAtivos > 0) {
    filterBtn.classList.add('active');
  } else {
    filterBtn.classList.remove('active');
  }
};

// Opcional: Função para limpar todas as checkboxes e refiltra
function limparFiltros() {
  const checkboxes = document.querySelectorAll('.filter-panel input[type="checkbox"]');
  checkboxes.forEach(cb => cb.checked = false);
  aplicarFiltros();
};

// Desabilita/Habilita o campo de nome do evento ao marcar "Não possui/não sabe"
function toggleEventNameInput(checkbox) {
  const nameInput = document.getElementById('event-name-input');
  if (nameInput) {
    nameInput.disabled = checkbox.checked;
    if (checkbox.checked) {
      nameInput.value = '';
    }
  }
}

// Desabilita/Habilita o campo de horário de término ao marcar "Não possui/não sabe"
function toggleEndTimeInput(checkbox) {
  const endTimeInput = document.getElementById('event-end-time-input');
  if (endTimeInput) {
    endTimeInput.disabled = checkbox.checked;
    if (checkbox.checked) {
      endTimeInput.value = '';
    }
  }
}

// Executa a publicação do anúncio de evento, redireciona e exibe o toast de sucesso
async function submitEventoPost() {
  await navigateTo('home');

  const toast = document.getElementById('post-success-toast');
  if (toast) {
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
}

// Alterna dinamicamente entre as 5 abas do perfil da ONG
function switchOngTab(tabName) {
  const tabs = document.querySelectorAll('.meu-perfil-screen .profile-tabs .tab-item');
  tabs.forEach(tab => tab.classList.remove('active'));

  const feeds = document.querySelectorAll('.meu-perfil-screen .tab-feed-content');
  feeds.forEach(feed => feed.classList.remove('active'));

  const activeBtn = document.getElementById(`tab-ong-${tabName}-btn`);
  if (activeBtn) {
    activeBtn.classList.add('active');
  }

  const activeFeed = document.getElementById(`feed-ong-${tabName}`);
  if (activeFeed) {
    activeFeed.classList.add('active');
  }
}