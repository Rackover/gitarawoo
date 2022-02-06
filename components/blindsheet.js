const webGet = require('./webget')
const parser = require('csv-parse/sync')

const sheetName = "InternalData";
const url = `https://docs.google.com/spreadsheets/d/${process.env.SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${sheetName}`;

let cachedSheet;
let isUpdating = false;

module.exports = {
    refresh:async function(){
        if (isUpdating) return;
        console.log("Starting sheet cache update...");

        isUpdating = true;

        const stream = await webGet.doRequest(url);
        
        const csv = await webGet.streamToString(stream);

        cachedSheet = parser.parse(csv, {
            columns: true,
            skip_empty_lines: true
        });

        isUpdating = false;
        console.log("Done refreshing sheet!");
    },
    getSheet:function(){
        return cachedSheet;
    }
}
