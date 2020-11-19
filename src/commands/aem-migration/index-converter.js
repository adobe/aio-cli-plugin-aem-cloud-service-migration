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
const IndexConverter = require("@adobe/aem-cs-source-migration-index-converter");
const helper = require("../../helper");

class IndexConverterCommand extends Command {
    async run() {
        this.log("\n********** Executing Index Converter **********");
        this.log("Staring Index Conversion..");
        try {
            helper.clearOutputFolder(Commons.constants.TARGET_INDEX_DEF_FOLDER);
            let config = helper.readConfigFile(this.config.configDir);
            IndexConverter.performIndexConversion(
                config.indexConverter,
                helper.baseIndexDefResourcePath
            );
            this.log("Index Conversion Completed!");
            this.log(
                `Please check ${Commons.constants.TARGET_INDEX_DEF_FOLDER} folder for converted index definitions.`
            );
            this.log(
                `Please check ${Commons.constants.TARGET_INDEX_DEF_FOLDER} for summary report.`
            );
            this.log(`Please check ${Commons.constants.LOG_FILE} for logs.\n`);
        } catch (e) {
            this.error(e);
        }
    }
}

IndexConverterCommand.description = ``;

IndexConverterCommand.examples = ["$ aio aem-migration:index-converter"];

module.exports = IndexConverterCommand;
