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
            if (!helper.isWorkflowConfigValid(config.workflowMigrator)) {
                // invalid wf-migrator related configs found.
                this.log(`Invalid configuration! Please check ${Commons.constants.LOG_FILE} for more information.\n`);
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
                        const runCommand =
                        "java -jar " +
                        jarFile + // jar file location
                        " " +
                        project.projectPath + // the source project path
                        " " +
                        constants.TARGET_WORKFLOW_FOLDER; // summary report destination
                        const { stderr } = await exec(runCommand);
                        if (stderr) {
                            this.log(`Error: ${stderr}`);
                        } else {
                            this.log(`Workflow migration Completed for ${project.projectPath}`);
                            this.log(
                                `Please check ${constants.TARGET_WORKFLOW_FOLDER} for summary report.\n`
                            );
                            Commons.logger.info(`Workflow migration Completed for ${project.projectPath}`);
                        }
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
This script will perform an automated migration from custom workflow configurations for asset processing to the corresponding configurations that are required by AEM as a Cloud Service.  After executing the script, the transformed code can be committed to a test branch and deployed to a Cloud Service development environment for testing and validation.

When run, the script will perform the following actions:

#### Create Maven Projects
The following maven projects will be created:

- aem-cloud-migration.apps - for immutable content that is to be deployed under /apps
- aem-cloud-migration.content - for mutable content that is to be deployed elsewhere, such as /conf

Each project will only be created if it is required.  The created projects will be added as modules to the reactor POM.  In cases where the project has been migrated to follow the [new package structures](https://docs.adobe.com/content/help/en/experience-manager-cloud-service/implementing/developing/aem-project-content-package-structure.html), we will integrate these projects into the container content package as well.`;

WorkflowMigratorCommand.examples = ["$ aio aem-migration:workflow-migrator"];

module.exports = WorkflowMigratorCommand;
