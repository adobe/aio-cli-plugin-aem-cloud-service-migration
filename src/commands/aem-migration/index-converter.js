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
            helper.clearOutputFolder(Commons.constants.TARGET_INDEX_FOLDER);
            let config = helper.readConfigFile(this.config.configDir);
            IndexConverter.performIndexConversion(
                config.indexConverter,
                helper.baseIndexDefResourcePath
            );
            this.log("Index Conversion Completed!");
            this.log(
                `Please check ${Commons.constants.TARGET_INDEX_FOLDER} folder for converted index definitions.`
            );
            this.log(
                `Please check ${Commons.constants.TARGET_INDEX_FOLDER} for summary report.`
            );
            this.log(`Please check ${Commons.constants.LOG_FILE} for logs.\n`);
        } catch (e) {
            this.error(e);
        }
    }
}

IndexConverterCommand.description = `migrate existing Custom Oak Index Defintions into AEMaaCS compatible Custom Oak Index Defintions
Configuring existing Custom Oak Index Definitions to AEMaaCS compatible Custom Oak Index Defintions.
Custom Oak Index Definitions can be categorized as :
* Custom OOTB (Product) Oak Index Definitions : Modification into existing OOTB Oak Index Definitions
* Newly created Oak Index Definitions

Operation for custom OOTB (Product) Oak Index Definition :
* This tool will parse the Custom OOTB (Product) Oak Index Definition and fetch the associated OOTB Index Definition.
* It will compare the Custom OOTB Oak Index Definition to the associated OOTB Index Definition and retrieve the difference
 between Custom OOTB Index Definition. and associated OOTB Index Definition. That difference or delta is basically
 customisation done by the user in OOTB Oak Index Definition.
* It will validate the retrieved customisation as per AEMaaCS compatible OAK Index Definitions guidelines.
* It will merge validated customisation of Custom OOTB Oak Index Definition to corresponding OAK Index Definition present on AEMaaCS.
Naming convention for Custom OOTB (Product) Oak Index Definition :
    "Name of the corresponding OAK Index Definition on AEMaaCS"-"latest version of this index on AEMaaCS "-"custom"-1

Operation For newly created custom Oak Index Definition :
* It will parse and validate the custom Oak Index Definition as per AEMaaCS compatible OAK Index Definitions guidelines.
* It will rename the Custom Oak Index Definition.
Naming convention for Newly created Custom Oak Index Definition :
    "Name of the Custom Oak Index Defintion"-"custom"-1`;

IndexConverterCommand.examples = ["$ aio aem-migration:index-converter"];

module.exports = IndexConverterCommand;
