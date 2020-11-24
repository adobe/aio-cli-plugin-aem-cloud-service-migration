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

const { Command, flags } = require("@oclif/command");
const Commons = require("@adobe/aem-cs-source-migration-commons");
const RepositoryModernizer = require("@adobe/aem-cs-source-migration-repository-modernizer");
const DispatcherConverter = require("@adobe/aem-cs-source-migration-dispatcher-converter");
const IndexConverter = require("@adobe/aem-cs-source-migration-index-converter");
const helper = require("../../helper");

async function runDispatcherConverter(config, command) {
    helper.clearOutputFolder(Commons.constants.TARGET_DISPATCHER_FOLDER);
    const { flags } = command.parse(AllCommand);
    const flag = flags.type;
    command.log("\n********** Executing Dispatcher Converter **********");
    command.log("Converting Dispatcher Configurations...");
    if (flag && flag.toLowerCase() === "ams") {
        helper.createBaseDispatcherConfig(config.dispatcherConverter.ams.cfg);
        let aemDispatcherConfigConverter = new DispatcherConverter.AEMDispatcherConfigConverter(
            config.dispatcherConverter,
            Commons.constants.TARGET_DISPATCHER_SRC_FOLDER
        );
        aemDispatcherConfigConverter.transform();
    } else {
        helper.createBaseDispatcherConfig(config.dispatcherConverter.sdkSrc);
        let singleFilesConverter = new DispatcherConverter.SingleFilesConverter(
            config.dispatcherConverter,
            Commons.constants.TARGET_DISPATCHER_SRC_FOLDER
        );
        singleFilesConverter.transform();
    }
    command.log("\nConversion Complete!");
    command.log(
        `Please check ${Commons.constants.TARGET_DISPATCHER_SRC_FOLDER} folder for transformed configuration files.`
    );
    command.log(
        `Please check ${Commons.constants.TARGET_DISPATCHER_FOLDER} for summary report.`
    );
    command.log(`Please check ${Commons.constants.LOG_FILE} for logs.\n`);
}

async function runRepositoryModernizer(config, command) {
    helper.clearOutputFolder(Commons.constants.TARGET_PROJECT_FOLDER);
    command.log("\n********** Executing Repository Modernizer **********");
    command.log("Restructuring Repository...");
    await RepositoryModernizer.performModernization(
        config.repositoryModernizer,
        helper.baseRepoResourcePath
    );
    command.log("Restructuring Completed!");
    command.log(
        `Please check ${Commons.constants.TARGET_PROJECT_SRC_FOLDER} folder for restructured project packages.`
    );
    command.log(
        `Please check ${Commons.constants.TARGET_PROJECT_FOLDER} for summary report.`
    );
    command.log(`Please check ${Commons.constants.LOG_FILE} for logs.\n`);
}

async function runIndexConverter(config, command) {
    helper.clearOutputFolder(Commons.constants.TARGET_INDEX_FOLDER);
    command.log("\n********** Executing Index Converter **********");
    command.log("Staring Index Conversion...");
    IndexConverter.performIndexConversion(
        config.indexConverter,
        helper.baseIndexDefResourcePath
    );
    command.log("Index Conversion Completed!");
    command.log(
        `Please check ${Commons.constants.TARGET_INDEX_FOLDER} folder for converted index definitions.`
    );
    command.log(
        `Please check ${Commons.constants.TARGET_INDEX_FOLDER} for summary report.`
    );
    command.log(`Please check ${Commons.constants.LOG_FILE} for logs.\n`);
}

class AllCommand extends Command {
    async run() {
        try {
            let config = helper.readConfigFile(this.config.configDir);
            await runDispatcherConverter(config, this);
            await runRepositoryModernizer(config, this);
            await runIndexConverter(config, this);
        } catch (e) {
            this.error(e);
        }
    }
}

AllCommand.description = `execute all source migration tools.
Available migration tools :
* dispatcher-converter
* repository-modernizer
* index-converter`;

AllCommand.flags = {
    type: flags.string({
        char: "t",
        description: "the type of AEM provisioning (ams or on-prem)",
        options: ["ams", "on-premise"],
        default: "on-premise",
    }),
};

AllCommand.examples = [
    "$ aio aem-migration:all",
    "$ aio aem-migration:all -t=ams",
    "$ aio aem-migration:all -t=on-premise",
];

module.exports = AllCommand;
