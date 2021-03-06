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
	"172.105.135.43", // node 1
	//"172.105.159.99", // node 2
	"170.187.157.120" // node 3
];

var cachedIps = new Object;

function getNodeIp() {
	return nodes[Math.floor(Math.random() * nodes.length)];
}

app.get("/", function(req, res) {
  res.send("Cosmetica has been installed! Nice.");
});

app.get("/capes/:username", function(req, res) { // optifine
	var user = req.params.username;
	if (user.toLowerCase().endsWith(".png")) user = user.substring(0, user.length - 4);
	var url = "http://" + getNodeIp() + "/get/cloak?user=" + user + "&optifine=show";
	var ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
	res.redirect(302, url); // i tried this for ages in fastify and optifine wouldn't pick it up. giving up... for now
});

app.get("/MinecraftCloaks/:username", function(req, res) { // old minecraft
	var user = req.params.username;
	if (user.toLowerCase().endsWith(".png")) user = user.substring(0, user.length - 4);
	var url = "http://" + getNodeIp() + "/get/cloak?user=" + user + "&optifine=show";
	var ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
	res.redirect(302, url); // i tried this for ages in fastify and optifine wouldn't pick it up. giving up... for now
});

app.get("/MinecraftSkins/:username", function(req, res) { // old minecraft
	var user = req.params.username;
	if (user.toLowerCase().endsWith(".png")) user = user.substring(0, user.length - 4);
	var url = "http://" + getNodeIp() + "/get/skin?user=" + user + "&optifine=show";
	var ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
	res.redirect(302, url); // i tried this for ages in fastify and optifine wouldn't pick it up. giving up... for now
});

app.get("/items/:type/:id/:resource", function(req, res) { // cosmetic
	var type = req.params.type;
	var id = req.params.id;
	var resource = req.params.resource;
	if (!(["model", "texture"]).includes(resource)) return res.status(404).send("invalid resource");
	var url = "http://" + getNodeIp() + "/get/optifine" + resource + "?type=" + type + "&id=" + id + "&mustbeapproved";
	res.redirect(302, url);
});

app.get("/users/:username", function(req, res) {
	var username = req.params.username;
	if (username.toLowerCase().endsWith(".cfg")) {
		username = username.substring(0, username.length - 4);
	}
	var url = "http://" + getNodeIp() + "/get/optifineprofile?username=" + username;
	res.redirect(302, url);
});

app.listen(80, function() {
	console.log("Server has started!");
});