const Discord = require("discord.js");
const fs = require("fs");
const ytdl = require("ytdl-core");
const youtube = require("youtube-info")
const ffmpeg = require("ffmpeg-binaries")

const Embed = require("./util/createEmbed.js");
const createPermissions = require("./util/createPermissions.js");
const checkGuild = require("./util/checkGuild.js");

const Client = new Discord.Client();

const config = JSON.parse(fs.readFileSync("./json/config.json", "utf8"));

var guilds = {};
var token = config.TOKEN;
var prefix = config.PREFIX;

const permissions = [];

const cmdmap = {
    help: "help",
    info: "info",
    invite: "invite",
    support: "support",
    stats: "stats",

    ping: "ping",

    play: "play", p: "play", add: "play",
    playtop: "playtop", playt: "playtop", pt: "playtop",
    playskip: "playskip", plays: "playskip", ps: "playskip",
    search: "search",
    pause: "pause",
    resume: "resume", r: "resume",
    loop: "loop",
    loopqueue: "loopqueue", loopq: "loopqueue", lq: "loopqueue",
    np: "np", nowplaying: "np", player: "np", control: "np", cp: "np",
    jump: "jump", j: "jump",
    shuffle: "shuffle", sh: "shuffle",
    skip: "skip", s: "skip",
    remove: "remove", rm: "remove",
    move: "move", mv: "move",
    reset: "reset",
    stop: "stop", st: "stop",
    leave: "leave", l: "leave",
    clear: "clear", cl: "clear",
    volume: "volume", vol: "volume",
    queue: "queue", q: "queue",

    eval: "eval", ev: "eval"
}

createPermissions.run(permissions);

Client.on('message', msg => {
    if(msg.author.bot) return;

    var guild = msg.guild;
    
    if(!guild) return;
    checkGuild.run(guilds, guild.id, prefix, guild.me.displayColor);

    guilds[msg.guild.id].last_msg = msg;

    if(msg.isMentioned(Client.user)) {
        if(guilds[msg.guild.id].language = "en") {
            Embed.createEmbed(msg.channel, "Hey, I'm musicBot, in case you want to know, what my features are, type `" + guilds[msg.guild.id].prefix + "help`. Some information about me, you'll get with `" + guilds[msg.guild.id].prefix + " info`. If you need help or found a bug, feel free to join my server: https://rxsto.github.io/musicBot/support/", "Hey, I'm musicBot");
        } else if(guilds[msg.guild.id].language = "de") {

        } else if(guilds[msg.guild.id].language = "fr") {
            
        } else {
            Embed.createEmbed(msg.channel, "Hey, I'm musicBot, in case you want to know, what my features are, type `" + guilds[msg.guild.id].prefix + "help`. Some information about me, you'll get with `" + guilds[msg.guild.id].prefix + " info`. If you need help or found a bug, feel free to join my server: https://rxsto.github.io/musicBot/support/", "Hey, I'm musicBot");
        }
        return;
    }

    if(msg.channel.type == "text" && msg.content.startsWith(guilds[msg.guild.id].prefix)) {

        if(!guild.me.hasPermission(permissions)) {
            Embed.createEmbed(msg.channel, ":no_entry: Missing permissions!\n" + permissions.join(" "), "Missing permissions!");
            return;
        }

        var invoke = msg.content.split(' ')[0].substr(guilds[msg.guild.id].prefix.length);
        var args   = msg.content.split(' ').slice(1);
        
        if(invoke in cmdmap) {
            try {
                let commandFile = require(`./commands/${cmdmap[invoke]}.js`);
                try {
                    commandFile.run(Client, guilds, Embed, msg, args);
                } catch (error) {
                    console.log(error);
                    Embed.createEmbed(msg.channel, error.message, "Error");
                }
            } catch(e) {
                console.log(e);
                Embed.createEmbed(msg.channel, e.message, "Error");
            }
        }
    }
});

Client.on('ready', () => {
    console.log(`[>] Bot has started, with ${Client.users.size} users, in ${Client.channels.size} channels of ${Client.guilds.size} guilds.`);
});

Client.login(token).then(() => console.log(`[>] Logged in as ${Client.user.username}...`));
