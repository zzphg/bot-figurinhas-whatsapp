const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');

const client = new Client({
    authStrategy: new LocalAuth(),

    puppeteer: {
        headless: false
    }
});

// QR CODE
client.on('qr', (qr) => {

    console.log('QR RECEBIDO!');
    qrcode.generate(qr, { small: true });

});

// BOT CONECTADO
client.on('ready', () => {

    console.log('✅ Bot conectado com sucesso!');

});

// MENSAGENS
client.on('message', async (message) => {

    // =========================
    // COMANDO PING
    // =========================
    if (message.body === '!ping') {

        await message.reply('pong 🏓');

    }

    // =========================
    // TRANSFORMAR IMAGEM/VÍDEO EM FIGURINHA
    // =========================
    if (
        message.hasMedia &&
        (
            message.type === 'image' ||
            message.type === 'video'
        )
    ) {

        try {

            // baixa mídia
            const media = await message.downloadMedia();

            // envia figurinha
            await client.sendMessage(
                message.from,
                media,
                {
                    sendMediaAsSticker: true,
                    stickerAuthor: 'Pedro',
                    stickerName: 'Meu Bot'
                }
            );

        } catch (error) {

            console.log('ERRO AO CRIAR FIGURINHA:');
            console.log(error);

            await message.reply('❌ Erro ao transformar mídia em figurinha.');

        }

    }

    // =========================
    // TRANSFORMAR LINK EM FIGURINHA
    // EXEMPLO:
    // !sticker https://site.com/imagem.jpg
    // =========================
    if (message.body.startsWith('!sticker ')) {

        try {

            // pega URL
            const imageUrl = message.body.split(' ')[1];

            // baixa imagem
            const response = await axios.get(imageUrl, {
                responseType: 'arraybuffer'
            });

            // converte para base64
            const base64 = Buffer
                .from(response.data, 'binary')
                .toString('base64');

            // cria mídia
            const media = new MessageMedia(
                'image/jpeg',
                base64
            );

            // envia figurinha
            await client.sendMessage(
                message.from,
                media,
                {
                    sendMediaAsSticker: true,
                    stickerAuthor: 'Pedro',
                    stickerName: 'Bot Sticker'
                }
            );

        } catch (error) {

            console.log('ERRO AO TRANSFORMAR LINK:');
            console.log(error);

            await message.reply('❌ Erro ao transformar link em figurinha.');

        }

    }

});

// INICIAR BOT
client.initialize();