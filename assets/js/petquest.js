/* ===== PETQUEST MODULE ===== */

/**
 * PetQuest - Sistema de Gamificação e Missões
 */

const PetQuest = {
    currentLevel: 1,
    pointsToNextLevel: 250,

    /**
     * Configurações do sistema de níveis
     */
    levelConfig: {
        pointsPerLevel: 250,
        maxLevel: 50,
        levelNames: {
            1: 'Tutor Iniciante',
            5: 'Tutor Experiente',
            10: 'Cuidador Dedicado',
            15: 'Guardian dos Pets',
            20: 'Mestre dos Cuidados',
            25: 'Veterinário Honorary',
            30: 'Especialista em Bem-Estar',
            35: 'Protetor dos Animais',
            40: 'Lenda dos Pets',
            50: 'Mestre Supremo'
        }
    },

    /**
     * Templates de missões por categoria
     */
    questTemplates: {
        daily: {
            exercise: [
                { title: 'Caminhada Matinal', description: 'Faça 15 minutos de caminhada com seu pet', points: 30 },
                { title: 'Brincadeira Interativa', description: 'Brinque com seu pet por 10 minutos', points: 25 },
                { title: 'Exercício no Quintal', description: 'Deixe seu pet correr livre por 20 minutos', points: 35 }
            ],
            hygiene: [
                { title: 'Escovação Dental', description: 'Escove os dentes do seu pet', points: 25 },
                { title: 'Limpeza de Orelhas', description: 'Limpe as orelhas do seu pet', points: 20 },
                { title: 'Escovação do Pelo', description: 'Escove o pelo do seu pet', points: 15 }
            ],
            nutrition: [
                { title: 'Hidratação', description: 'Verifique se o pet bebeu água suficiente', points: 20 },
                { title: 'Horário das Refeições', description: 'Mantenha horários regulares de alimentação', points: 25 },
                { title: 'Petisco Saudável', description: 'Ofereça um petisco natural', points: 15 }
            ],
            monitoring: [
                { title: 'Verificação de Peso', description: 'Registre o peso do seu pet', points: 30 },
                { title: 'Observação Comportamental', description: 'Observe e registre o comportamento', points: 20 },
                { title: 'Check-up Visual', description: 'Faça uma inspeção visual geral', points: 25 }
            ]
        },

        weekly: [
            { title: 'Banho Completo', description: 'Dê um banho completo no seu pet', points: 80, category: 'hygiene' },
            { title: 'Treinamento de Comando', description: 'Ensine ou reforce um comando', points: 100, category: 'training' },
            { title: 'Socialização', description: 'Promova interação com outros pets ou pessoas', points: 90, category: 'social' },
            { title: 'Enriquecimento Ambiental', description: 'Crie uma atividade nova no ambiente', points: 70, category: 'enrichment' },
            { title: 'Sessão de Fotos', description: 'Tire fotos criativas do seu pet', points: 60, category: 'fun' }
        ],

        prescribed: [] // Preenchidas dinamicamente por veterinários
    },

    /**
     * Conquistas (Achievements) disponíveis
     */
    achievements: [
        {
            id: 'first_pet',
            name: 'Primeiro Pet',
            description: 'Cadastrou seu primeiro pet',
            icon: 'fas fa-paw',
            points: 50,
            condition: () => Storage.pets.getAll().length >= 1
        },
        {
            id: 'first_quest',
            name: 'Primeira Missão',
            description: 'Completou sua primeira missão',
            icon: 'fas fa-trophy',
            points: 25,
            condition: () => Storage.quests.getCompleted().length >= 1
        },
        {
            id: 'week_streak',
            name: 'Semana Completa',
            description: 'Completou missões por 7 dias seguidos',
            icon: 'fas fa-fire',
            points: 100,
            condition: () => this.getCurrentStreak() >= 7
        },
        {
            id: 'weight_tracker',
            name: 'Monitor de Peso',
            description: 'Atualizou o peso de um pet 5 vezes',
            icon: 'fas fa-weight',
            points: 75,
            condition: () => {
                const pets = Storage.pets.getAll();
                return pets.some(pet => pet.weightHistory && pet.weightHistory.length >= 5);
            }
        },
        {
            id: 'chat_master',
            name: 'Comunicador',
            description: 'Enviou 50 mensagens no PetConnect',
            icon: 'fas fa-comments',
            points: 60,
            condition: () => {
                const messages = Storage.chat.getHistory();
                return messages.filter(m => m.type === 'user').length >= 50;
            }
        },
        {
            id: 'level_5',
            name: 'Tutor Experiente',
            description: 'Alcançou o nível 5',
            icon: 'fas fa-star',
            points: 150,
            condition: () => Storage.stats.get().level >= 5
        },
        {
            id: 'quest_master',
            name: 'Mestre das Missões',
            description: 'Completou 50 missões',
            icon: 'fas fa-crown',
            points: 200,
            condition: () => Storage.stats.get().completedQuests >= 50
        },
        {
            id: 'pet_collector',
            name: 'Colecionador',
            description: 'Cadastrou 5 pets diferentes',
            icon: 'fas fa-users',
            points: 120,
            condition: () => Storage.pets.getAll().length >= 5
        }
    ],

    /**
     * Inicializa o sistema PetQuest
     */
    init() {
        this.generateDailyQuests();
        this.generateWeeklyQuests();
        this.checkAchievements();
        console.log('PetQuest inicializado');
    },

    /**
     * Gera missões diárias
     */
    generateDailyQuests() {
        const today = new Date().toISOString().split('T')[0];
        const existingQuests = Storage.quests.getByType('daily');
        
        // Verifica se já tem missões de hoje
        const todayQuests = existingQuests.filter(quest => {
            const questDate = new Date(quest.createdAt).toISOString().split('T')[0];
            return questDate === today;
        });

        if (todayQuests.length > 0) return; // Já tem missões de hoje

        // Remove missões diárias antigas
        const oldDailyQuests = existingQuests.filter(quest => {
            const questDate = new Date(quest.createdAt).toISOString().split('T')[0];
            return questDate !== today;
        });

        oldDailyQuests.forEach(quest => {
            Storage.quests.delete(quest.id);
        });

        // Gera novas missões diárias
        const categories = Object.keys(this.questTemplates.daily);
        const selectedQuests = [];

        categories.forEach(category => {
            const templates = this.questTemplates.daily[category];
            const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
            
            selectedQuests.push({
                ...randomTemplate,
                type: 'daily',
                category: category,
                status: 'active',
                createdAt: new Date().toISOString()
            });
        });

        // Adiciona uma missão extra aleatória
        const allDailyTemplates = Object.values(this.questTemplates.daily).flat();
        const bonusTemplate = allDailyTemplates[Math.floor(Math.random() * allDailyTemplates.length)];
        selectedQuests.push({
            ...bonusTemplate,
            type: 'daily',
            category: 'bonus',
            status: 'active',
            createdAt: new Date().toISOString(),
            points: Math.round(bonusTemplate.points * 1.5) // Bonus extra
        });

        selectedQuests.forEach(quest => {
            Storage.quests.add(quest);
        });
    },

    /**
     * Gera missões semanais
     */
    generateWeeklyQuests() {
        const thisWeek = this.getWeekNumber(new Date());
        const existingQuests = Storage.quests.getByType('weekly');
        
        // Verifica se já tem missões desta semana
        const thisWeekQuests = existingQuests.filter(quest => {
            const questWeek = this.getWeekNumber(new Date(quest.createdAt));
            return questWeek === thisWeek;
        });

        if (thisWeekQuests.length > 0) return; // Já tem missões desta semana

        // Remove missões semanais antigas
        const oldWeeklyQuests = existingQuests.filter(quest => {
            const questWeek = this.getWeekNumber(new Date(quest.createdAt));
            return questWeek !== thisWeek;
        });

        oldWeeklyQuests.forEach(quest => {
            Storage.quests.delete(quest.id);
        });

        // Seleciona 3 missões semanais aleatórias
        const shuffledWeekly = [...this.questTemplates.weekly].sort(() => 0.5 - Math.random());
        const selectedQuests = shuffledWeekly.slice(0, 3);

        selectedQuests.forEach(quest => {
            Storage.quests.add({
                ...quest,
                type: 'weekly',
                status: 'active',
                createdAt: new Date().toISOString()
            });
        });
    },

    /**
     * Calcula número da semana no ano
     * @param {Date} date - Data
     * @returns {number} Número da semana
     */
    getWeekNumber(date) {
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        const dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    },

    /**
     * Completa uma missão
     * @param {string} questId - ID da missão
     * @param {string} evidence - Evidência (opcional)
     */
    completeQuest(questId, evidence = null) {
        const quest = Storage.quests.getById(questId);
        if (!quest || quest.status === 'completed') return false;

        // Marca como completa
        const completedQuest = Storage.quests.complete(questId, evidence);
        
        if (completedQuest) {
            // Atualiza estatísticas
            this.updateStats(completedQuest.points);
            
            // Verifica conquistas
            this.checkAchievements();
            
            // Mostra feedback
            Components.Toast.success(
                `Missão "${completedQuest.title}" completa! +${completedQuest.points} pontos`,
                4000
            );

            // Efeito visual se estiver na tela
            this.animateQuestCompletion(questId);

            return true;
        }

        return false;
    },

    /**
     * Atualiza estatísticas do jogador
     * @param {number} points - Pontos ganhos
     */
    updateStats(points) {
        const stats = Storage.stats.get();
        
        const oldLevel = stats.level || 1;
        stats.totalPoints = (stats.totalPoints || 0) + points;
        
        // Calcula novo nível
        const newLevel = Math.min(
            Math.floor(stats.totalPoints / this.levelConfig.pointsPerLevel) + 1,
            this.levelConfig.maxLevel
        );
        
        stats.level = newLevel;
        stats.completedQuests = (stats.completedQuests || 0) + 1;
        
        // Atualiza streak
        this.updateStreak(stats);