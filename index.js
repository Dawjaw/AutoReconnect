/// <reference types="../CTAutocomplete" />

import { request } from "../requestV2"
import Settings from "./config";

let currentLocation = "";
let onServer = false;
let inLimob = false;
let inProcessOfConnecting = false;

const CUTE_PROFILE_NAMES = ['Apple', 'Banana', 'Blueberry', 'Coconut', 'Cucumber', 'Grapes', 'Kiwi', 'Lemon', 'Lime', 'Mango', 'Orange', 'Papaya', 'Pear', 'Peach', 
'Pineapple', 'Pomegranate', 'Raspberry', 'Strawberry', 'Tomato', 'Watermelon', 'Zucchini']
const GuiMultiplayer = Java.type("net.minecraft.client.gui.GuiMultiplayer");
const GuiMainMenu = Java.type("net.minecraft.client.gui.GuiMainMenu");

register('command', (...args) => {
    print(args.length);
    print(JSON.stringify(args));
	if (args.length == 0 || args[0] == null) {
		Settings.openGUI();
	} else if (args[0] == "island") {
        if(Settings.islandRejoinEnabled) {
            Settings.islandRejoinEnabled = false;
            ChatLib.chat("§aDisabled self reconnect.§r");
        }
        if(!Settings.visitingEnabled) {
            Settings.visitingEnabled = true;
            ChatLib.chat("§aEnabled visiting reconnect.§r");
        } else if(Settings.visitingEnabled) {
            Settings.visitingEnabled = false;
        ChatLib.chat("§aDisabled visiting reconnect.§r");
        }
	} else if (args[0] == "reconnect") {
        if (Settings.visitingEnabled) {
            Settings.visitingEnabled = false;
            ChatLib.chat("§aDisabled visiting reconnect.§r");
        }
        if (!Settings.islandRejoinEnabled) {
            Settings.islandRejoinEnabled = true;
            ChatLib.chat("§aEnabled self reconnect.§r");
        } else if (Settings.islandRejoinEnabled) {
            Settings.islandRejoinEnabled = false;
            ChatLib.chat("§aDisabled self reconnect.§r");
        }
	}
}).setName("autoreconnect");

register('step', () => {
    //print(Client.currentGui.get());
    //print(currentLocation);
    //print(Server.getIP());
    if(Server.getIP() == "hypixel.net" || Server.getIP() == "play.hypixel.net") {
        onServer = true
    } else { 
        onServer = false
        currentLocation = "";
    }
}).setDelay(1);


register('chat', (message) => {
    ChatLib.command("lobby");
}).setChatCriteria("You cannot join SkyBlock from here!");


register('step', () => {
    //print(currentLocation === "");
    //print(Client.currentGui.get() instanceof GuiMainMenu || Client.currentGui.get() instanceof GuiMultiplayer);
    if(Settings.islandRejoinEnabled && Settings.visitingEnabled) {
        Settings.islandRejoinEnabled = false;
        Settings.visitingEnabled = false;
        ChatLib.chat("§eCan't have both options enabled at once!§r");
    }
    if (Settings.islandRejoinEnabled || Settings.visitingEnabled) {
        if (currentLocation === "") {
            if (Client.currentGui.get() instanceof GuiMainMenu || Client.currentGui.get() instanceof GuiMultiplayer) {
                print("connecting")
                Client.connect("play.hypixel.net");
            }
        }
        if (currentLocation === "HYPIXEL") {
            ChatLib.command("skyblock");
        }
        if (currentLocation === "SKYBLOCK" || currentLocation === "Island") {
            if (Settings.islandRejoinEnabled) {
                ChatLib.command("is");
            }
            if (Settings.visitingEnabled && inProcessOfConnecting === false) {
                visitProfile();
            }
        }
        if (currentLocation === "Visiting") {
            inProcessOfConnecting = false;
        }
    }
}).setDelay(10);


function visitProfile() {
    inProcessOfConnecting = true;
    ChatLib.command(`visit ${Settings.visitName}`);
}


register('step', () => {
    if (!Settings.visitingEnabled || inProcessOfConnecting === false) return;
    let inventoryName = Player?.getContainer()?.getName()?.toString();
    let foundInFirstScreen = false;
    let foundInSecondScreen = false;
    //print(inventoryName);
    if(inventoryName === `Visit ${Settings.visitName}`) {
        for (i = 0; i < 35; i++) { // 4 row inventory
            let stack = Player.getContainer().getStackInSlot(i);
            let lore = stack?.getLore();
            lore?.forEach(line => {
                //print(ChatLib.removeFormatting(line));
                //print(ChatLib.removeFormatting(line) === `Profile: ${CUTE_PROFILE_NAMES[Settings.visitCuteName]}`)
                if (ChatLib.removeFormatting(line) === `Profile: ${CUTE_PROFILE_NAMES[Settings.visitCuteName]}`) {
                    Player.getContainer().click(i);
                    foundInFirstScreen = true;
                }
            })
        }
        if (!foundInFirstScreen) { // click on more button if not found in first screen
            Player.getContainer().click(15);
        }
    }
    if(inventoryName === `Visit ${Settings.visitName} (More...)`) {
        for (i = 0; i < 35; i++) { // 4 row inventory
            let stack = Player.getContainer().getStackInSlot(i);
            let lore = stack?.getLore();
            lore?.forEach(line => {
                //print(ChatLib.removeFormatting(line));
                //print(ChatLib.removeFormatting(line) === `Profile: ${CUTE_PROFILE_NAMES[Settings.visitCuteName]}`)
                if (ChatLib.removeFormatting(line) === `Profile: ${CUTE_PROFILE_NAMES[Settings.visitCuteName]}`) {
                    Player.getContainer().click(i);
                    foundInSecondScreen = true;
                }
            })
        }
    }
    if(foundInFirstScreen || foundInSecondScreen) {
        inProcessOfConnecting = false;
    } 
}).setDelay(3);


register('tick', () => {
    if (!World.isLoaded()) return;
    if(Server.getIP() == "hypixel.net" || Server.getIP() == "play.hypixel.net") {
        onServer = true
    } else { onServer = false }
    let onIsland = false;
    let guesting = false;
    let islandOwner = "";
    let onSkyblock = false;
    //print(ChatLib.removeFormatting(Scoreboard.getTitle()));
    if (ChatLib.removeFormatting(Scoreboard.getTitle()) === "SKYBLOCK" || ChatLib.removeFormatting(Scoreboard.getTitle()) === "SKYBLOCK§A§L GUEST") {
        onSkyblock = true;
    }
    TabList.getNames().forEach(name => {
        if (ChatLib.removeFormatting(name).includes("Area: Private Island")) {
            onIsland = true;
        }
        if (ChatLib.removeFormatting(name).includes("Status: Guest")) {
            guesting = true;
        }
        if (ChatLib.removeFormatting(name).includes("Owner: ")) {
            islandOwner = ChatLib.removeFormatting(name).split("Owner: ")[1];
        }
    });
    if(!onServer) {
        currentLocation = "";
    }
    if(onServer && !onIsland && !guesting && !onSkyblock) {
        currentLocation = "HYPIXEL";
    }
    if(onServer && !onIsland && !guesting && onSkyblock) {
        currentLocation = "SKYBLOCK";
    }
    if(onServer && onIsland && !guesting && onSkyblock) {
        currentLocation = "Island";
    }
    if(onServer && onIsland && guesting && onSkyblock && islandOwner == Settings.visitName) {
        currentLocation = "Visiting";
    }
    //print(`${onIsland} ${guesting} ${onServer} ${islandOwner} ${onSkyblock}`);
});

const generateNewKey = () => {
	// Your session and UUID are used here to authenticate with Mojang servers, they're not sent to me.
	const sessionId = Client.getMinecraft().func_110432_I().func_148254_d(); // .getSession().getToken()
	const uuid = Client.getMinecraft().func_110432_I().func_148255_b(); // .getSession().getPlayerID()
	const username = Client.getMinecraft().func_110432_I().func_111285_a(); // .getSession().getPlayerID()
	const hash = generateHash(uuid);

	return request({
		url: "https://sessionserver.mojang.com/session/minecraft/join",
		method: "POST",
		body: {
			accessToken: sessionId,
			selectedProfile: uuid,
			serverId: hash
		}
	}).then(res => {
		print(res);
	}).catch(err => {
		print(err);
	});
}
