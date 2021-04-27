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
const IndexConverterCommand = require("../../src/commands/aem-migration/index-converter");
const Commons = require("@adobe/aem-cs-source-migration-commons");
const IndexConverter = require("@adobe/aem-cs-source-migration-index-converter");
const helper = require("../../src/helper");
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const { stdout } = require("stdout-stderr");

jest.mock("../../src/helper");
jest.mock("@adobe/aem-cs-source-migration-index-converter");

const configFileName = "aem-migration-config.yaml";
const configDir = path.join(process.cwd(), "config");
const config = yaml.load(
    fs.readFileSync(path.join(configDir, configFileName), "utf8")
);

beforeAll(() => stdout.start());
afterAll(() => stdout.stop());

test("exports", async () => {
    expect(typeof IndexConverterCommand).toEqual("function");
});

test("description", async () => {
    expect(IndexConverterCommand.description).toBeDefined();
});

describe("Test Command", () => {
    let command;

    beforeEach(() => {
        command = new IndexConverterCommand([]);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("run", () => {
        test("exists", async () => {
            expect(command.run).toBeInstanceOf(Function);
        });

        test("calls IndexConverter", () => {
            command.config = {
                configDir: configDir,
            };
            helper.clearOutputFolder.mockResolvedValue(true);
            helper.readConfigFile.mockReturnValue(config);
            IndexConverter.performIndexConversion.mockResolvedValue(true);
            return command.run().then(() => {
                expect(helper.readConfigFile).toHaveBeenCalledWith(configDir);
                expect(helper.clearOutputFolder).toHaveBeenCalledWith(
                    Commons.constants.TARGET_INDEX_FOLDER
                );
                expect(
                    IndexConverter.performIndexConversion
                ).toHaveBeenCalledWith(
                    config.indexConverter,
                    helper.baseIndexDefResourcePath
                );
            });
        });

        test("catches config file not found error", async () => {
            command.config = null;
            command.error = jest.fn();
            await command.run();
            expect(command.error).toHaveBeenCalled();
        });
    });
});
