const TelegramBot = require('node-telegram-bot-api');
const fetch = require('node-fetch');

// Deine Tokens – ersetze die Platzhalter!
const TOKEN = process.env.TELEGRAM_TOKEN;
const WETTER_KEY = process.env.WETTER_KEY;

// Bot erstellen
const bot = new TelegramBot(TOKEN, { polling: true });

// /start Befehl
bot.onText(/\/start/, (msg) => {
    const name = msg.from.first_name;
    bot.sendMessage(msg.chat.id, 
        `👋 Hallo ${name}! Ich bin der persönliche Bot von Dennis Habekost.\n\n` +
        `Hier sind meine Befehle:\n` +
        `📋 /hilfe – alle Befehle anzeigen\n` +
        `🌐 /portfolio – Portfolio Website\n` +
        `💼 /skills – meine Skills\n` +
        `📧 /kontakt – Kontaktdaten\n` +
        `🌤️ /wetter [Stadt] – aktuelles Wetter`
    );
});

// /hilfe Befehl
bot.onText(/\/hilfe/, (msg) => {
    bot.sendMessage(msg.chat.id,
        `📚 Verfügbare Befehle:\n\n` +
        `▶️ /start – Begrüßung\n` +
        `🌐 /portfolio – Portfolio Website\n` +
        `💼 /skills – meine Skills\n` +
        `📧 /kontakt – Kontaktdaten\n` +
        `🌤️ /wetter [Stadt] – z.B. /wetter Berlin`
    );
});

// /portfolio Befehl
bot.onText(/\/portfolio/, (msg) => {
    bot.sendMessage(msg.chat.id,
        `🌐 Meine Portfolio Website:\n` +
        `https://dennishabekost.github.io/portfolio\n\n` +
        `Dort findest du meine Projekte, Skills und Kontaktdaten!`
    );
});

// /skills Befehl
bot.onText(/\/skills/, (msg) => {
    bot.sendMessage(msg.chat.id,
        `💼 Meine Skills:\n\n` +
        `📚 Im Studium:\n` +
        `• Java • SQL\n\n` +
        `🛠️ Aus eigenen Projekten:\n` +
        `• HTML • CSS • JavaScript\n` +
        `• Git • Jira • KI-Tools\n\n` +
        `🌍 Sprachen:\n` +
        `• Deutsch (Muttersprache)\n` +
        `• Englisch (C1)`
    );
});

// /kontakt Befehl
bot.onText(/\/kontakt/, (msg) => {
    bot.sendMessage(msg.chat.id,
        `📧 Kontakt:\n\n` +
        `✉️ dennis.habekost@icloud.com\n` +
        `💼 github.com/DennisHabekost\n` +
        `🌐 dennishabekost.github.io/portfolio`
    );
});

// /wetter Befehl
bot.onText(/\/wetter (.+)/, async (msg, match) => {
    const stadt = match[1];
    
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${stadt}&appid=${WETTER_KEY}&units=metric&lang=de`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.cod !== 200) {
            bot.sendMessage(msg.chat.id, `❌ Stadt "${stadt}" nicht gefunden. Versuche es mit einer anderen Stadt.`);
            return;
        }
        
        const temp = Math.round(data.main.temp);
        const gefühlt = Math.round(data.main.feels_like);
        const beschreibung = data.weather[0].description;
        const luftfeuchtigkeit = data.main.humidity;
        const wind = Math.round(data.wind.speed * 3.6);
        
        bot.sendMessage(msg.chat.id,
            `🌤️ Wetter in ${data.name}:\n\n` +
            `🌡️ Temperatur: ${temp}°C\n` +
            `🤔 Gefühlt: ${gefühlt}°C\n` +
            `☁️ ${beschreibung}\n` +
            `💧 Luftfeuchtigkeit: ${luftfeuchtigkeit}%\n` +
            `💨 Wind: ${wind} km/h`
        );
    } catch (error) {
        bot.sendMessage(msg.chat.id, `❌ Fehler beim Abrufen des Wetters.`);
    }
});

const http = require('http');
http.createServer((req, res) => {
    res.writeHead(200);
    res.end('Bot läuft!');
}).listen(process.env.PORT || 3000);

console.log('Bot läuft! 🚀');
