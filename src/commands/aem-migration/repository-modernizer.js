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

const { Command } = require("@oclif/command");
const Commons = require("@adobe/aem-cs-source-migration-commons");
const RepositoryModernizer = require("@adobe/aem-cs-source-migration-repository-modernizer");
const helper = require("../../helper");

class RepositoryModernizerCommand extends Command {
    async run() {
        this.log("\n********** Executing Repository Modernizer **********");
        this.log("Restructuring Repository..");
        try {
            helper.clearOutputFolder(Commons.constants.TARGET_PROJECT_FOLDER);
            let config = helper.readConfigFile(this.config.configDir);
            await RepositoryModernizer.performModernization(
                config.repositoryModernizer,
                helper.baseRepoResourcePath
            );
            this.log("Restructuring Completed!");
            this.log(
                `Please check ${Commons.constants.TARGET_PROJECT_SRC_FOLDER} folder for restructured project packages.`
            );
            this.log(
                `Please check ${Commons.constants.TARGET_PROJECT_FOLDER} for summary report.`
            );
            this.log(`Please check ${Commons.constants.LOG_FILE} for logs.\n`);
        } catch (e) {
            this.error(e);
        }
    }
}

RepositoryModernizerCommand.description = `restructure existing projects packages into AEMasCS compatible packages.
AEM requires a separation of content and code, which means a single content package cannot deploy to both /apps and
runtime-writable areas (for example, /content , /conf , /home , or anything not /apps ) of the repository.
Instead, the application must separate code and content into discrete packages for deployment into AEM.

Repository Modernizer automates the separation of such packages into :
* ui.apps package, or Code Package
* ui.config package, or OSGi Configurations Package
* ui.content package, or Content Package
* all (container) package that includes the above packages as embeds.`;

RepositoryModernizerCommand.examples = [
    "$ aio aem-migration:repository-modernizer",
];

module.exports = RepositoryModernizerCommand;
