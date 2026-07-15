const { execFile } = require("child_process");
const path = require("path");

function predictPassword(password) {

    return new Promise((resolve, reject) => {

        const pythonScript = path.join(
            __dirname,
            "../ml-service/predict.py"
        );

        execFile(
            "python",
            [pythonScript, password],
            (error, stdout, stderr) => {

                if (error) {
                    reject(error);
                    return;
                }

                if (stderr) {
                    reject(stderr);
                    return;
                }

                try {

                    const result = JSON.parse(stdout);

                    resolve(result);

                }
                catch (err) {

                    reject(err);

                }

            }
        );

    });

}

module.exports = {

    predictPassword

};