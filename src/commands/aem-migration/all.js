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
const helper = require("../../helper");

function runDispatcherConverter(config, flag) {
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
}

function runRepositoryModernizer(config) {
    helper.clearOutputFolder(Commons.constants.TARGET_PROJECT_FOLDER);
    RepositoryModernizer.performModernization(
        config.repositoryModernizer,
        helper.baseRepoResourcePath
    );
}

class AllCommand extends Command {
    async run() {
        try {
            helper.clearOutputFolder(
                Commons.constants.TARGET_DISPATCHER_FOLDER
            );
            let config = helper.readConfigFile(this.config.configDir);
            const { flags } = this.parse(AllCommand);

            this.log("\n\nExecuting Repository Modernizer :");
            this.log("Restructuring Repository...");
            runRepositoryModernizer(config);
            this.log("Restructuring Completed!");
            this.log(
                `Please check ${Commons.constants.TARGET_PROJECT_SRC_FOLDER} folder for transformed configuration files.`
            );
            this.log(
                `Please check ${Commons.constants.TARGET_PROJECT_FOLDER} for summary report.`
            );

            this.log("\n\nExecuting Dispatcher Converter :");
            this.log("Converting Dispatcher Configurations...");
            runDispatcherConverter(config, flags.type);
            this.log("\nConversion Complete!");
            this.log(
                `Please check ${Commons.constants.TARGET_DISPATCHER_SRC_FOLDER} folder for transformed configuration files.`
            );
            this.log(
                `Please check ${Commons.constants.TARGET_DISPATCHER_FOLDER} for summary report.`
            );
            this.log(`Please check ${Commons.constants.LOG_FILE} for logs.`);
        } catch (e) {
            this.error(e);
        }
    }
}

AllCommand.description = `execute all source migration tools.
Available migration tools :
* dispatcher-converter
* repository-modernizer`;

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
