const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

async function setupDb() {
    const db = await open({
        filename: './banco_genshin.sqlite',
        driver: sqlite3.Database
    });

    // 1. Criando as tabelas (Requisito: Relacionamentos/JOINs)
    await db.exec(`
        CREATE TABLE IF NOT EXISTS personagens (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            elemento TEXT NOT NULL,
            arma TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS artefatos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome_set TEXT NOT NULL,
            status_principal TEXT NOT NULL,
            personagem_id INTEGER,
            FOREIGN KEY (personagem_id) REFERENCES personagens(id)
        );
    `);

    // 2. Inserindo os 20 personagens (Requisito: Mínimo 20 registros)
    const countPerso = await db.get('SELECT COUNT(*) as total FROM personagens');
    if (countPerso.total === 0) {
        await db.run(`INSERT INTO personagens (nome, elemento, arma) VALUES 
            ('Hu Tao', 'Pyro', 'Lança'), ('Raiden', 'Electro', 'Lança'), 
            ('Zhongli', 'Geo', 'Lança'), ('Furina', 'Hydro', 'Espada'),
            ('Nahida', 'Dendro', 'Catalisador'), ('Kazuha', 'Anemo', 'Espada'),
            ('Neuvillette', 'Hydro', 'Catalisador'), ('Yelan', 'Hydro', 'Arco'),
            ('Arlecchino', 'Pyro', 'Lança'), ('Navia', 'Geo', 'Espadão'),
            ('Ayaka', 'Cryo', 'Espada'), ('Ganyu', 'Cryo', 'Arco'),
            ('Alhaitham', 'Dendro', 'Espada'), ('Wanderer', 'Anemo', 'Catalisador'),
            ('Nilou', 'Hydro', 'Espada'), ('Xiao', 'Anemo', 'Lança'),
            ('Eula', 'Cryo', 'Espadão'), ('Cyno', 'Electro', 'Lança'),
            ('Venti', 'Anemo', 'Arco'), ('Tartaglia', 'Hydro', 'Arco')`);
        console.log("✅ Banco populado com 20 personagens!");
    }

    // 3. Inserindo Artefatos para testar o JOIN
    const countArt = await db.get('SELECT COUNT(*) as total FROM artefatos');
    if (countArt.total === 0) {
        await db.run(`INSERT INTO artefatos (nome_set, status_principal, personagem_id) VALUES 
            ('Bruxa Carmesim', 'Dano Pyro', 1),
            ('Selo da Insolação', 'Recarga de Energia', 2),
            ('Millelith Firmes', 'Vida%', 3),
            ('Trupe Dourada', 'Dano Skill', 4),
            ('Memórias da Floresta', 'Dano Dendro', 5)`);
        console.log("✅ Artefatos vinculados para teste de JOIN!");
    }

    return db;
}

module.exports = setupDb;