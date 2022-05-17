const express = require("express");
const app = express();
const request = require("request");
const config = require("./config.json");

console.log("\n\n       db                                                                    88                      ")
console.log("      d88b                                                             ,d    \"\"                      ")
console.log("     d8'`8b                                                            88                            ")
console.log("    d8'  `8b     8b,dPPYba,  ,adPPYba, 88,dPYba,,adPYba,   ,adPPYba, MM88MMM 88  ,adPPYba, ,adPPYYba,")
console.log("   d8YaaaaY8b    88P'   \"Y8 a8\"     \"\" 88P'   \"88\"    \"8a a8P_____88   88    88 a8\"     \"\" \"\"     `Y8")
console.log("  d8\"\"\"\"\"\"\"\"8b   88         8b         88      88      88 8PP\"\"\"\"\"\"\"   88    88 8b         ,adPPPPP88")
console.log(" d8'        `8b  88         \"8a,   ,aa 88      88      88 \"8b,   ,aa   88,   88 \"8a,   ,aa 88,    ,88")
console.log("d8'          `8b 88          `\"Ybbd8\"' 88      88      88  `\"Ybbd8\"'   \"Y888 88  `\"Ybbd8\"' `\"8bbdP\"Y8\n\n")

const nodes = [ // optifine is really fickle and won't accept the ip of the nodebalancer, randomly dispersing queries between nodes manually instead
	//"170.187.157.120",
	"170.187.144.132"
];

var cachedIps = new Object;

function getNodeIp() {
	return nodes[Math.floor(Math.random() * nodes.length)];
}

app.get("/", function (req, res) {
  res.send("Cosmetica has been installed!");
});

app.get("/capes/:username", function (req, res) {
	var user = req.params.username;
	if (user.toLowerCase().endsWith(".png")) user = user.substring(0, user.length - 4);
	//var url = "http://" + getNodeIp() + "/get/cloak?user=" + user + "&optifine=show&migrator=replace";
	var url = "http://" + getNodeIp() + "/get/cloak?user=" + user + "&migrator=replace";
	//var url = "http://" + getNodeIp() + "/get/cloak?user=notch&optifine=show&migrator=replace";
	//console.log(url);
	var ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
	//cacheUserIp(ip);
	res.redirect(301, url); // i tried this for ages in fastify and optifine wouldn't pick it up. giving up... for now
});

function cacheUserIp(ip) {
	if (Object.keys(cachedIps).includes(ip)) return;
	cachedIps[ip] = setTimeout(function() {
		delete cachedIps[ip];
	}, 60 * 1000);
	var base64 = Buffer.from(ip).toString("base64");
	var url = "https://api.cosmetica.cc/client/registerip?ipcacheaddress=" + base64 + "&ipcachepassword=" + config.ipCachePassword;
	request(url);
}

app.listen(80, function() {
	console.log("Server has started!");
});