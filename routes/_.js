/* jshint esversion: 11 */
/* global console */
import fs from 'fs';

export { routing };
function routing(app) {
    fs.readdirSync('./routes/').forEach(function(file) {
        if (file === "_.js") return;
        const path = './' + file;
        import(path)
            .then(function(module){
                module.default(app);
            }).catch((err) => {
                console.error(err);
        });
    });
}