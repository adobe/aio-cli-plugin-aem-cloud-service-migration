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
const DispatcherConverter = require("@adobe/aem-cs-source-migration-dispatcher-converter");
const helper = require("../../helper");

class DispatcherConverterCommand extends Command {
    async run() {
        this.log("\n********** Executing Dispatcher Converter **********");
        this.log("Converting Dispatcher Configurations...");
        try {
            helper.clearOutputFolder(
                Commons.constants.TARGET_DISPATCHER_FOLDER
            );
            let config = helper.readConfigFile(this.config.configDir);
            const { flags } = this.parse(DispatcherConverterCommand);
            let isConfigValid = false;
            if (flags.type && flags.type.toLowerCase() === "ams") {
                helper.createBaseDispatcherConfig(
                    config.dispatcherConverter.ams.cfg
                );
                let aemDispatcherConfigConverter = new DispatcherConverter.AEMDispatcherConfigConverter(
                    config.dispatcherConverter,
                    Commons.constants.TARGET_DISPATCHER_SRC_FOLDER
                );
                if (aemDispatcherConfigConverter.checkConfig(config.dispatcherConverter)) {
                    isConfigValid = true;
                    aemDispatcherConfigConverter.transform();
                }
            } else {
                helper.createBaseDispatcherConfig(
                    config.dispatcherConverter.sdkSrc
                );
                let singleFilesConverter = new DispatcherConverter.SingleFilesConverter(
                    config.dispatcherConverter,
                    Commons.constants.TARGET_DISPATCHER_SRC_FOLDER
                );
                if (singleFilesConverter.checkConfig(config.dispatcherConverter)) {
                    isConfigValid = true;
                    singleFilesConverter.transform();
                }
            }
            if (!isConfigValid) {
                this.log(
                    `Missing configuration! Please check ${Commons.constants.LOG_FILE} for more information.`
                );
                return;
            }
            this.log("\nConversion Complete!");
            this.log(
                `Please check ${Commons.constants.TARGET_DISPATCHER_SRC_FOLDER} folder for transformed configuration files.`
            );
            this.log(
                `Please check ${Commons.constants.TARGET_DISPATCHER_FOLDER} for summary report.`
            );
            this.log(`Please check ${Commons.constants.LOG_FILE} for logs.\n`);
        } catch (error) {
            this.error(error);
        }
    }
}

DispatcherConverterCommand.description = `convert existing dispatcher configurations into AEM as a Cloud Service compatible dispatcher configurations.
Configuring existing on-Premise or Adobe Managed Services (AMS) Dispatcher configurations to AEM as a Cloud
Service compatible Dispatcher configuration.

AEM as a Cloud Service has defined rules which are to be followed while configuring Dispatcher for AEM instances.
Dispatcher Converter reads on-Premise or Adobe Managed Services (AMS) Dispatcher configurations and changes them
to AEM as a Cloud Service compatible dispatcher configurations.`;

DispatcherConverterCommand.flags = {
    type: flags.string({
        char: "t",
        description: "the type of AEM provisioning (ams or on-prem)",
        options: ["ams", "on-premise"],
        default: "on-premise",
    }),
};

DispatcherConverterCommand.examples = [
    "$ aio aem-migration:dispatcher-converter",
    "$ aio aem-migration:dispatcher-converter -t=ams",
    "$ aio aem-migration:dispatcher-converter -t=on-premise",
];

module.exports = DispatcherConverterCommand;
