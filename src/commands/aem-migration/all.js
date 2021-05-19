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
const constants = require("../../constants");
const helper = require("../../helper");
const util = require("util");
const path = require("path");
const fs = require("fs");
const exec = util.promisify(require("child_process").exec);

const jarFile = path.join(
    process.cwd(),
    constants.TARGET_WORKFLOW_FOLDER,
    constants.WF_MIGRATOR_JAR
);

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
    if (await RepositoryModernizer.checkConfig(config.repositoryModernizer)) {
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
    } else {
        command.log(
            `Missing configuration! Please check ${Commons.constants.LOG_FILE} for more information.\n`
        );
    }
}

async function runWorkflowMigrator(config, command) {
    helper.clearOutputFolder(constants.TARGET_WORKFLOW_FOLDER);
    command.log("\n********** Executing Workflow Migrator **********");
    if (!helper.isWorkflowConfigValid(config.workflowMigrator)) {
        // invalid wf-migrator related configs found.
        command.log(`Invalid configuration! Please check ${Commons.constants.LOG_FILE} for more information.\n`);
        return;    
    }
    helper
        .fetchLatestReleasedAsset(
            constants.WF_MIGRATOR_REPO_OWNER,
            constants.WF_MIGRATOR_REPO_NAME,
            constants.WF_MIGRATOR_JAR
        )
        .then(async () => {
            Commons.logger.info(
                `Downloading of ${constants.WF_MIGRATOR_JAR} from ${constants.WF_MIGRATOR_REPO_NAME} successful.`
            );
            for (const project of config.workflowMigrator.projects) {
                if (
                    fs.readdirSync(path.join(process.cwd(), Commons.constants.TARGET_PROJECT_SRC_FOLDER))
                        .includes(path.basename(project.projectPath))
                ) {
                    const runCommand =
                    "java -jar " +
                    jarFile + // jar file location
                    " " +
                    path.join(process.cwd(), Commons.constants.TARGET_PROJECT_SRC_FOLDER, path.basename(project.projectPath)) + // the source project path
                    " " +
                    constants.TARGET_WORKFLOW_FOLDER; // summary report destination
                    const { stderr } = await exec(runCommand);
                    if (stderr) {
                        this.log(`Error: ${stderr}`);
                    } else {
                        command.log(`Workflow migration Completed for ${path.join(process.cwd(), Commons.constants.TARGET_PROJECT_SRC_FOLDER, path.basename(project.projectPath))}`);
                        command.log(
                            `Please check ${constants.TARGET_WORKFLOW_FOLDER} for summary report.\n`
                        );
                        Commons.logger.info(`Workflow migration Completed for ${path.join(process.cwd(), Commons.constants.TARGET_PROJECT_SRC_FOLDER, path.basename(project.projectPath))}`);
                    }
                }
            }
        })
        .catch((e) => {
            command.log(e);
        });
}

async function runIndexConverter(config, command) {
    helper.clearOutputFolder(Commons.constants.TARGET_INDEX_FOLDER);
    command.log("\n********** Executing Index Converter **********");
    IndexConverter.performIndexConversion(
        config.indexConverter,
        helper.baseIndexDefResourcePath
    );
}

class AllCommand extends Command {
    async run() {
        try {
            let config = helper.readConfigFile(this.config.configDir);
            await runDispatcherConverter(config, this);
            await runRepositoryModernizer(config, this);
            // this does in-place migration in the target folder
            await runWorkflowMigrator(config, this);
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
* workflow-migrator
* index-converter

This command runs the tools in the above sequence & workflow migration if configured, is done in-place taking modernized code in the "target" folder as the source.`;

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
