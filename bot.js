require('dotenv').config();
const Telegraf = require('telegraf');
const Extra = require('telegraf/extra')
const fs = require('fs')
const mysql = require('mysql');

const bot = new Telegraf(process.env.BOT_TOKEN);

const conn = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
})

function dbconn() {
    console.log("Database connected !");
    conn.query(`SELECT * FROM user`, function (err, result, fields){
        if(err){
            throw err;
        }
        dataStore = [];
        // console.log(result);
        result.forEach(item => {
            dataStore.push({
                id: item.id,
                username: item.username,
                first_name: item.first_name,
                last_name: item.last_name,
                phone : item.phone,
                alamat : item.alamat
            })
        })
    })
}

conn.connect(function(err){
    if(err){
        throw err;
    }
    console.log("Database connected !");
    conn.query(`SELECT * FROM user`, function (err, result, fields){
        if(err){
            throw err;
        }
        dataStore = [];
        // console.log(result);
        result.forEach(item => {
            dataStore.push({
                id: item.id,
                username: item.username,
                first_name: item.first_name,
                last_name: item.last_name,
                phone : item.phone,
                alamat : item.alamat
            })
        })
    })
})

// const helpMessage = 'Daftar perintah dalam bot ini:\n/help - menampilkan daftar lengkap command.\nSelebihnya akan terus diupdate.';
    
// bot.help(ctx =>{
//     ctx.reply(helpMessage);
// });

//get user info
// bot.command('informas', ctx =>{
//     ctx.reply(ctx.from.id);
//     ctx.reply(ctx.from.username);
//     ctx.reply(ctx.from.first_name);
//     ctx.reply(ctx.from.last_name);
// });

bot.command('start', ctx => {
    let id = ctx.from.id
    let username = ctx.from.username
    let first_name = ctx.from.first_name
    let last_name = ctx.from.last_name

    //console.log(id, username, first_name, last_name);
    var sql = `INSERT IGNORE user(id, username, first_name, last_name) VALUES('${id}', '${username}', '${first_name}', '${last_name}')`;
    conn.query(sql, function(err, result){
        if(err){
            throw err;
        };
        // console.log(`Data user ${username} berhasil ditambahkan`);
        // ctx.reply(`Halo ${first_name} Selamat datang \nSilahkan gunakan menu /help untuk melihat daftar lengkap perintah Bot ini.`)
        dbconn();
    bot.telegram.sendMessage(ctx.chat.id, `Selamat Datang Kak, ${first_name} ✨\n\nSilahkan gunakan menu /help atau klik tombol di bawah untuk melihat daftar lengkap perintah Bot`,
    {
        reply_markup: {
            inline_keyboard: [
                [
                    {text: '📗 Help', callback_data: 'bantuan'}
                ]
            ]
        }
    })
    
    })

})

bot.help(ctx => ctx.replyWithPhoto(
    'https://raw.githubusercontent.com/rizaldanu/make-up-bot/main/img/perintahbot.png',
    Extra.caption('*Daftar perintah Bot ini*:\n\n/help - menampilkan daftar lengkap command\n\n/cekjadwal - menampilkan jadwal yang sudah dipesan\n\n/pricelist - menampilkan daftar harga dan jenis make up\n\n/alamat - merubah alamat anda (*wajib sebelum pesan*)\n\n/hp - merubah nomor handphone anda (*wajib sebelum pesan*)\n\n/profil - menampilkan informasi data diri anda\n\n/album - menampilkan contoh jenis make up\n\n/carapesan - memberikan panduan untuk pemesanan jasa make up artist\n\n/pesan - melakukan pemesanan make-up artist\n\n/pembayaran - memberikan panduan pembayaran\n\n/status - infromasi status pemesanan anda\n\n*Lihat gambar untuk contoh penulisan command yang benar*').markdown()
))

bot.action('bantuan', ctx => {
    ctx.answerCbQuery();
    ctx.replyWithPhoto(
        'https://raw.githubusercontent.com/rizaldanu/make-up-bot/main/img/perintahbot.png',
        Extra.caption('*Daftar perintah Bot ini*:\n\n/help - menampilkan daftar lengkap command\n\n/cekjadwal - menampilkan jadwal yang sudah dipesan\n\n/pricelist - menampilkan daftar harga dan jenis make up\n\n/alamat - merubah alamat anda (*wajib sebelum pesan*)\n\n/hp - merubah nomor handphone anda (*wajib sebelum pesan*)\n\n/profil - menampilkan informasi data diri anda\n\n/album - menampilkan contoh jenis make up\n\n/carapesan - memberikan panduan untuk pemesanan jasa make up artist\n\n/pesan - melakukan pemesanan make-up artist\n\n/pembayaran - memberikan panduan pembayaran\n\n/status - infromasi status pemesanan anda\n\n*Lihat gambar untuk contoh penulisan command yang benar*').markdown())
})

bot.command('album', (ctx) => {
    ctx.replyWithMediaGroup([
        //   {
        //     media: 'https://picsum.photos/200/500/',
        //     caption: 'From URL',
        //     type: 'photo'
        //   },
        //   {
        //     media: { url: 'https://picsum.photos/200/300/?random' },
        //     caption: 'Piped from URL',
        //     type: 'photo'
        //   },
        {
            media: { source: 'img/make-up-flawless.jpeg' },
            caption: 'Make-Up Flawless',
            type: 'photo'
        },
        {
            media: { source: 'img/make-up-natural.jpeg' },
            caption: 'Make-up Natural',
            type: 'photo'
        },
        {
            media: { source: 'img/make-up-korea.jpeg' },
            caption: 'Make-up Korea Look',
            type: 'photo'
        }
    ])
})  

bot.command('cekjadwal', ctx => {
    var cekjadwal = `SELECT * FROM pesanan WHERE status="Proses Make Up"`;
    conn.query(cekjadwal, function(err, result){
        if(err){
            throw err;
        };
        let jadwalMessage = 'Berikut jadwal tanggal make up yang sudah di-order\n\n'
        dataStore = [];
        result.forEach(item => {
            dataStore.push({
                tanggal_makeup: item.tanggal_makeup
            })
        })
        dataStore.forEach(item => {
            jadwalMessage += `${item.tanggal_makeup}\n\n`;
        })
        
        ctx.replyWithMarkdown(jadwalMessage);
    ctx.replyWithMarkdown('*Tanggal yang sudah tercantum dalam daftar tersebut sudah tidak dapat di-order lagi.\nSilahkan order pada tanggal lain dari yang tercantum.\n\nJika order pada tanggal yang sudah tercantum maka pesanan akan dibatalkan oleh admin.*')
    })
})

bot.command('pricelist', ctx => {
    ctx.replyWithMediaGroup([
        {
            media: { source: 'img/price-list.png' },
            caption: 'Pricelist Make Up',
            type: 'photo'
        },
        {
            media: { source: 'img/price-list-item-tambahan.png' },
            caption: 'Pricelist Item Tambahan',
            type: 'photo'
        }
    ])
    ctx.replyWithMarkdown(`Jika lampiran gambar kurang jelas, bisa dilihat pada tautan berikut [Tabel Pricelist](https://dev.rizdan.com/ochii/pricelist.php)`);
})

bot.command('hp', ctx => {
    let id = ctx.from.id
    let input = ctx.message.text.split(" ");
    if (input.length != 2){
        ctx.reply("Anda harus menyertakan nomor handphone pada argumen kedua, lihat contoh pada lampiran gambar berikut.");
        ctx.replyWithPhoto('https://raw.githubusercontent.com/rizaldanu/make-up-bot/main/img/hp.png');
        return;
    }
    let phone = input[1];
    //console.log(input[1]);
    var sql = `UPDATE user
                SET phone="${phone}"
                WHERE id="${id}"`;
    conn.query(sql, function(err, result){
        if(err){
            throw err;
        };
        ctx.reply('Nomor handphone berhasil diperbarui.')
    })
})

bot.command('alamat', ctx => {
    let id = ctx.from.id
    let input = ctx.message.text.split(" ");
    if (input.length != 2){
        ctx.reply("Anda harus menyertakan alamat pada argumen kedua [spasi] dipisahkan dengan simbol _\nlihat contoh pada lampiran gambar berikut.");
        ctx.replyWithPhoto('https://raw.githubusercontent.com/rizaldanu/make-up-bot/main/img/panduan-alamat.png');
        return;
    }
    let alamat = input[1];
    //console.log(input[1]);
    var sql = `UPDATE user
                SET alamat="${alamat}"
                WHERE id="${id}"`;
    conn.query(sql, function(err, result){
        if(err){
            throw err;
        };
        ctx.reply('Alamat berhasil diperbarui.')
    })
})

bot.command('pesan', ctx => {
    let id = ctx.from.id
    let input = ctx.message.text.split(" ");
    if (input.length != 4){
        ctx.replyWithMarkdown(`*Format pesanan ada yang kurang!*\nMohon lihat panduan pada gambar /carapesan untuk format penulisan yang benar`);
        return;
    }
    let kode_makeup = input[1];
    let kode_item = input[2];
    let tanggal_makeup = input[3];
    //console.log(input[1]);
    var sql = `INSERT IGNORE pesanan(id_user, kode_makeup, kode_item, tanggal_makeup, status) VALUES('${id}', '${kode_makeup}', '${kode_item}', '${tanggal_makeup}', 'Menunggu Pembayaran dan Konfirmasi')`;
    conn.query(sql, function(err, result){
        if(err){
            throw err;
        };
        ctx.replyWithMarkdown('*Pesanan Anda Sukses!*\n\nSilahkan lihat status pesanan di menu /status')
        $admin = 5398951868
        bot.telegram.sendMessage($admin, `Halo Admin, ada Pesanan Baru untuk tanggal ${tanggal_makeup}\n\nSilahkan segera di-cek pada web admin \nhttps://dev.rizdan.com/ochii/`)
    })
})

bot.command('profil', ctx => {
    let id_nya = ctx.from.id
    console.log(id_nya)
    var profil = `SELECT * FROM user WHERE id="${id_nya}"`;
    conn.query(profil, function(err, result){
        if(err){
            throw err;
        };
        let profilMessage = 'Informasi Profil Kamu\n\n'
        dataStore = [];
        result.forEach(item => {
            dataStore.push({
                id: item.id,
                username: item.username,
                first_name: item.first_name,
                last_name: item.last_name,
                phone : item.phone,
                alamat : item.alamat
            })
        })
        dataStore.forEach(item => {
            profilMessage += `ID User : ${item.id}\nUsername: ${item.username}\nNama Lengkap: ${item.first_name} ${item.last_name}\nNomor Telepon/WhatsApp: ${item.phone}\nAlamat Lengkap: ${item.alamat}`;
        })
        
        ctx.reply(profilMessage);
    })
})

bot.command('carapesan', ctx => {
    // ctx.reply("Akan segera hadir");
    ctx.reply("Panduan pemesanan dapat dilihat pada lampiran gambar berikut.");
    ctx.replyWithPhoto('https://raw.githubusercontent.com/rizaldanu/make-up-bot/main/img/pemesanan.png');
})

// bot.command('pesan', ctx => {
//     ctx.reply("Akan segera hadir");
// })

bot.command('pembayaran', ctx => {
    ctx.replyWithMarkdown('Silahkan chat admin @novikaanggraini untuk mendapatkan informasi pembayaran dan harga total yang harus dibayar.\n\nSetelah pembayaran selesai dan pesanan dikonfirmasi maka dalam menu /status pemesanan anda berstatus Proses Make Up\n\n*Catatan: harga total tidak dapat dicantumkan di awal karena biaya datang ke tempat client berbeda setiap jarak*');
})

bot.command('status', ctx => {
    let id_nya = ctx.from.id
    console.log(id_nya)
    var profil = `SELECT * FROM pesanan WHERE id_user="${id_nya}"`;
    conn.query(profil, function(err, result){
        if(err){
            throw err;
        };
        let statusMessage = 'Informasi Pesanan Kamu\n==============================\n\n'
        dataStore = [];
        result.forEach(item => {
            dataStore.push({
                id: item.id,
                kode_makeup: item.kode_makeup,
                kode_item: item.kode_item,
                tanggal_makeup: item.tanggal_makeup,
                status: item.status
            })
        })
        dataStore.forEach(item => {
            statusMessage += `ID Pesanan : #${item.id}\n\n*Status Pesanan: ${item.status}*\n\nKode Make Up: ${item.kode_makeup}\n\nKode Item: ${item.kode_item}\n\nTanggal Make Up: ${item.tanggal_makeup}\n\n==============================\n\n`;
        })
        
        ctx.replyWithMarkdown(statusMessage);
    ctx.replyWithMarkdown('*Silahkan gunakan menu /pembayaran untuk petunjuk pembayaran*')
    })
})

// bot.command('userlist', ctx => {
//     let userlistMessage = 'List user :\n'
//     let id = ctx.from.id
//     dataStore.forEach(item => {
//         userlistMessage += `${item.username}. ${item.first_name}. ${item.last_name}.${item.alamat}\n`;
//     })
    
//     ctx.reply(userlistMessage);
// })

bot.launch();

// bot.command('userlist', ctx => {
//     let userlistMessage = 'List user :\n'

//     dataStore.forEach(item => {
//         userlistMessage += `${item.username}. ${item.first_name}. ${item.last_name}\n`;
//     })
    
//     ctx.reply(userlistMessage);
// })

// bot.command('user', ctx =>{
//     let input = ctx.message.text.split(" ");
//     if(input.length != 2){
//         ctx.reply("Anda harus memberikan nama username pada argument kedua");
//         return;
//     }
//     let userInput = input[1];

//     dataStore.forEach(item => {
//         if(item.username.includes(userInput)){
//             ctx.reply("Nama depannya: " +item.first_name);

//             return;
//         }
//     })
// })
