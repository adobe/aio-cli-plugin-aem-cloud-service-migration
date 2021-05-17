/*
Copyright 2021 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const Commons = require("@adobe/aem-cs-source-migration-commons");
const { Command } = require("@oclif/command");
const constants = require("../../constants");
const helper = require("../../helper");
const util = require("util");
const path = require("path");
const exec = util.promisify(require("child_process").exec);

const jarFile = path.join(
    process.cwd(),
    constants.TARGET_WORKFLOW_FOLDER,
    constants.WF_MIGRATOR_JAR
);

class WorkflowMigratorCommand extends Command {
    async run() {
        this.log("\n********** Executing Workflow Migrator **********");
        try {
            helper.clearOutputFolder(constants.TARGET_WORKFLOW_FOLDER);
            let config = helper.readConfigFile(this.config.configDir);
            const runCommand =
                "java -jar " +
                jarFile + // jar file location
                " " +
                config.workflowMigrator.projectPath + // the source project path
                " " +
                constants.TARGET_WORKFLOW_FOLDER; // summary report destination
            helper
                .fetchLatestReleasedAsset(
                    constants.WF_MIGRATOR_REPO_OWNER,
                    constants.WF_MIGRATOR_REPO_NAME,
                    constants.WF_MIGRATOR_JAR
                )
                .then(async () => {
                    Commons.logger.info(
                        `Downloaded of ${constants.WF_MIGRATOR_JAR} from ${constants.WF_MIGRATOR_REPO_NAME} successful.`
                    );
                    const { stderr } = await exec(runCommand);
                    if (stderr) {
                        this.log(`Error: ${stderr}`);
                    } else {
                        this.log("Workflow migration Completed!");
                        this.log(
                            `Please check ${constants.TARGET_WORKFLOW_FOLDER} for summary report.\n`
                        );
                        Commons.logger.info(`Workflow migration completed.`);
                    }
                })
                .catch((e) => {
                    this.log(e);
                });
        } catch (e) {
            this.error(e);
        }
    }
}

WorkflowMigratorCommand.description = `
Automatically migrate asset processing workflows from on-premise or AMS deployments of AEM
 to processing profiles and OSGi Configurations for use in AEM Assets as a Cloud Service.`;

WorkflowMigratorCommand.examples = ["$ aio aem-migration:workflow-migrator"];

module.exports = WorkflowMigratorCommand;
