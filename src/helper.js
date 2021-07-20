/*
Copyright 2020 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const Commons = require("@adobe/aem-cs-source-migration-commons");
const constants = require("./constants");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const configFileName = "aem-migration-config.yaml";

// base paths for resources
// when it is being executed from cloned repo
let baseRepoResourcePath = path.join(
    path.dirname(__dirname),
    "node_modules",
    "@adobe",
    "aem-cs-source-migration-repository-modernizer"
);
// when it is being executed as a aio-cli-plugin
if (!fs.existsSync(baseRepoResourcePath)) {
    baseRepoResourcePath = path.join(
        path.dirname(path.dirname(__dirname)),
        "aem-cs-source-migration-repository-modernizer"
    );
}
// when it is being executed from cloned repo
let baseIndexDefResourcePath = path.join(
    path.dirname(__dirname),
    "node_modules",
    "@adobe",
    "aem-cs-source-migration-index-converter"
);
// when it is being executed as a aio-cli-plugin
if (!fs.existsSync(baseIndexDefResourcePath)) {
    baseIndexDefResourcePath = path.join(
        path.dirname(path.dirname(__dirname)),
        "aem-cs-source-migration-index-converter"
    );
}

function clearOutputFolder(outputFolderPath) {
    // if `output` folder already exists, delete it
    if (fs.existsSync(outputFolderPath)) {
        try {
            Commons.util.deleteFolderRecursive(outputFolderPath);
        } catch (e) {
            throw new Error(`Error while deleting ${outputFolderPath}!`);
        }
        Commons.logger.info(outputFolderPath + " cleaned successfully.");
    }
    // if target folder doesn't exist, create it
    if (!fs.existsSync(Commons.constants.TARGET_FOLDER)) {
        fs.mkdirSync(Commons.constants.TARGET_FOLDER);
    }
}

function readConfigFile(configDirPath) {
    const localDirPath = path.join(process.cwd(), `.${path.basename(configDirPath)}`);
    let configFilePath = path.join(localDirPath, configFileName);
    let yamlFile;
    if (fs.existsSync(configFilePath)) {
        yamlFile = fs.readFileSync(configFilePath, "utf8");
    } else {
        Commons.logger.warn(`Local config file ${configFilePath} not found, using global file.`);
        configFilePath = path.join(configDirPath, configFileName);
        if (!fs.existsSync(configFilePath)) {
            throw new Error(`Config file ${configFilePath} not found!`);
        }
        yamlFile = fs.readFileSync(configFilePath, "utf8");
    }
    return yaml.load(yamlFile);
}

function isWorkflowConfigValid(config) {
    for (const project of config.projects) { 
        if (project.projectPath == null) {
            Commons.logger.warn(`Invalid config found for Workflow migration`);
            return false;
        }
    }
    return true;
}

function createBaseDispatcherConfig(src) {
    Commons.util.copyFolderSync(
        src,
        Commons.constants.TARGET_DISPATCHER_SRC_FOLDER
    );
    // ensures marker file is created if not present as part of dispatcher sdk
    // marker file is used to validate the dispatcher configurations with latest checks
    Commons.util.ensureFileExistsSync(
        constants.USE_SOURCES_DIRECTLY,
        path.join(Commons.constants.TARGET_DISPATCHER_SRC_FOLDER, constants.OPT_IN)
    );
}

async function fetchLatestReleasedAsset(
    githubRepoOwner,
    githubRepoName,
    destinationAssetName
) {
    let url =
        constants.GITHUB_API +
        githubRepoOwner +
        constants.URL_PATH_SEPARATOR +
        githubRepoName +
        constants.LATEST_RELEASED_ASSET_PATH;
    try {
        let response = await axios.get(url);
        if (response.status === 200) {
            // create the required folder structure
            fs.mkdirSync(constants.TARGET_WORKFLOW_FOLDER, { recursive: true });
            let downloadUrl = response.data.assets[0].browser_download_url;
            let writer = fs.createWriteStream(
                path.join(
                    constants.TARGET_WORKFLOW_FOLDER,
                    destinationAssetName
                )
            );
            Commons.logger.info(
                `Fetching the latest released artifact info from ${githubRepoName}.`
            );
            return axios({
                method: "get",
                url: downloadUrl,
                responseType: "stream",
            }).then((response) => {
                //ensure that the user can call `then()` only when the file has
                //been downloaded entirely.
                return new Promise((resolve, reject) => {
                    response.data.pipe(writer);
                    let error = null;
                    writer.on("error", (err) => {
                        error = err;
                        writer.close();
                        reject(err);
                    });
                    writer.on("close", () => {
                        if (!error) {
                            resolve(true);
                        }
                        //no need to call the reject here, as it will have been called in the
                        //'error' stream;
                    });
                });
            });
        } else {
            throw new Error(
                `Error while fetching the latest released artifact info from ${githubRepoName} : ${response.status}!`
            );
        }
    } catch (e) {
        throw new Error(
            `Error while fetching the latest released artifact info from ${githubRepoName}!`
        );
    }
}

module.exports = {
    baseRepoResourcePath,
    baseIndexDefResourcePath,
    clearOutputFolder,
    createBaseDispatcherConfig,
    readConfigFile,
    fetchLatestReleasedAsset,
    isWorkflowConfigValid,
};
