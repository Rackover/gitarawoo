const fs = require("fs");

const channelsFileName = "CHANNELS.JSON";

let channelIDs = 
{
    botControl:0,
    userInteract:0
}

let channels = {}


module.exports = {
    keys: Object.keys(channelIDs),

    load: async function(client){
        if (fs.existsSync(channelsFileName))
        {
            const str = fs.readFileSync(channelsFileName, "utf8");
            
            const newChans = JSON.parse(str);

            for (k in Object.keys(newChans)){
                channelIDs[k] = newChans[k];
            }

            await refreshChannels(client);
        }
    },

    setChannel: async function (name, channel){
        channelIDs[name] = channel.id;
        channels[name] = channel;

        save();
    }
}

function save(){
    fs.writeFileSync(channelsFileName, JSON.stringify(channelIDs));
}

async function refreshChannels(client){
    for (k in Object.keys(channelIDs)){
        const id = channelIDs[k];

        if (!id || id <= 0) continue;

        console.log("Refreshing channel "+id);

        channels[k] = await client.channels.fetch(id);
    }
}