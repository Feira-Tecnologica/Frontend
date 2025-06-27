class ODSSelector {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.selectedODS = new Set();
        this.allODS = [
            { id: 1, title: "Erradicação da Pobreza", description: "Acabar com a pobreza em todas as suas formas, em todos os lugares" },
            { id: 2, title: "Fome Zero e Agricultura Sustentável", description: "Acabar com a fome, alcançar a segurança alimentar" },
            { id: 3, title: "Saúde e Bem-Estar", description: "Assegurar uma vida saudável e promover o bem-estar para todos" },
            { id: 4, title: "Educação de Qualidade", description: "Assegurar a educação inclusiva e equitativa de qualidade" },
            { id: 5, title: "Igualdade de Gênero", description: "Alcançar a igualdade de gênero e empoderar todas as mulheres" },
            { id: 6, title: "Água Potável e Saneamento", description: "Assegurar a disponibilidade e gestão sustentável da água" },
            { id: 7, title: "Energia Limpa e Acessível", description: "Assegurar o acesso à energia barata, confiável e sustentável" },
            { id: 8, title: "Trabalho Decente e Crescimento Econômico", description: "Promover o crescimento econômico sustentado e inclusivo" },
            { id: 9, title: "Indústria, Inovação e Infraestrutura", description: "Construir infraestruturas resilientes e promover a inovação" },
            { id: 10, title: "Redução das Desigualdades", description: "Reduzir a desigualdade dentro dos países e entre eles" },
            { id: 11, title: "Cidades e Comunidades Sustentáveis", description: "Tornar as cidades e os assentamentos humanos inclusivos" },
            { id: 12, title: "Consumo e Produção Responsáveis", description: "Assegurar padrões de produção e consumo sustentáveis" },
            { id: 13, title: "Ação Contra a Mudança Global do Clima", description: "Tomar medidas urgentes para combater a mudança climática" },
            { id: 14, title: "Vida na Água", description: "Conservação e uso sustentável dos oceanos" },
            { id: 15, title: "Vida Terrestre", description: "Proteger, recuperar e promover o uso sustentável dos ecossistemas" },
            { id: 16, title: "Paz, Justiça e Instituições Eficazes", description: "Promover sociedades pacíficas e inclusivas" },
            { id: 17, title: "Parcerias e Meios de Implementação", description: "Fortalecer os meios de implementação e revitalizar a parceria global" }
        ];
        this.init();
    }

    init() {
        this.render();
        this.bindEvents();
    }

    render() {
        this.container.innerHTML = `
            <div class="ods-container">
                <div class="ods-select-wrapper">
                    <select class="ods-select" id="odsSelect">
                        <option value="">Selecione um ODS...</option>
                        ${this.allODS.map(ods => 
                            `<option value="${ods.id}">ODS ${ods.id} - ${ods.title}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="ods-selected-list" id="selectedODSList"></div>
                <div class="ods-grid" id="odsGrid"></div>
            </div>
        `;
    }

    bindEvents() {
        const select = document.getElementById('odsSelect');
        select.addEventListener('change', (e) => {
            if (e.target.value) {
                this.addODS(parseInt(e.target.value));
                e.target.value = '';
            }
        });
    }

    addODS(odsId) {
        if (!this.selectedODS.has(odsId)) {
            this.selectedODS.add(odsId);
            this.updateDisplay();
        }
    }

    removeODS(odsId) {
        this.selectedODS.delete(odsId);
        this.updateDisplay();
    }

    updateDisplay() {
        this.updateSelectedList();
        this.updateGrid();
    }

    updateSelectedList() {
        const listContainer = document.getElementById('selectedODSList');
        const selectedArray = Array.from(this.selectedODS);
        
        if (selectedArray.length === 0) {
            listContainer.innerHTML = '';
            return;
        }
        
        listContainer.innerHTML = selectedArray.map(odsId => {
            const ods = this.allODS.find(o => o.id === odsId);
            return `
                <div class="ods-item">
                    <span class="ods-number">ODS ${ods.id}</span>
                    <span>${ods.title}</span>
                    <button class="remove-btn" onclick="odsSelector.removeODS(${ods.id})">×</button>
                </div>
            `;
        }).join('');
    }

    updateGrid() {
        const gridContainer = document.getElementById('odsGrid');
        const selectedArray = Array.from(this.selectedODS);
        
        if (selectedArray.length === 0) {
            gridContainer.innerHTML = '<div class="ods-empty-state">Nenhum ODS selecionado</div>';
            return;
        }
        
        gridContainer.innerHTML = selectedArray.map(odsId => {
            const ods = this.allODS.find(o => o.id === odsId);
            const colors = [
                '#E5243B', '#DDA63A', '#4C9F38', '#C5192D', '#FF3A21',
                '#26BDE2', '#FCC30B', '#A21942', '#FD6925', '#DD1367',
                '#FD9D24', '#BF8B2E', '#3F7E44', '#0A97D9', '#56C02B',
                '#00689D', '#19486A'
            ];
            
            return `
                <div class="ods-card">
                    <div class="ods-header">
                        <div class="ods-icon" style="background-color: ${colors[odsId - 1] || '#666'}">${ods.id}</div>
                        ODS ${ods.id} - ${ods.title}
                    </div>
                    <div class="ods-description">${ods.description}</div>
                </div>
            `;
        }).join('');
    }

    getSelectedODS() {
        return Array.from(this.selectedODS);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('odsContainer')) {
        window.odsSelector = new ODSSelector('odsContainer');
    }
});
