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
const RepositoryModernizerCommand = require("../../src/commands/aem-migration/repository-modernizer");
const Commons = require("@adobe/aem-cs-source-migration-commons");
const RepositoryModernizer = require("@adobe/aem-cs-source-migration-repository-modernizer");
const helper = require("../../src/helper");
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const { stdout } = require("stdout-stderr");

jest.mock("../../src/helper");
jest.mock("@adobe/aem-cs-source-migration-repository-modernizer");

const configFileName = "aem-migration-config.yaml";
const configDir = path.join(process.cwd(), "config");
const config = yaml.load(
    fs.readFileSync(path.join(configDir, configFileName), "utf8")
);

beforeAll(() => stdout.start());
afterAll(() => stdout.stop());

test("exports", async () => {
    expect(typeof RepositoryModernizerCommand).toEqual("function");
});

test("description", async () => {
    expect(RepositoryModernizerCommand.description).toBeDefined();
});

describe("Test Command", () => {
    let command;

    beforeEach(() => {
        command = new RepositoryModernizerCommand([]);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("run", () => {
        test("exists", async () => {
            expect(command.run).toBeInstanceOf(Function);
        });

        test("calls RepositoryModernizer", () => {
            command.config = {
                configDir: configDir,
            };
            helper.clearOutputFolder.mockResolvedValue(true);
            helper.readConfigFile.mockReturnValue(config);
            RepositoryModernizer.checkConfig.mockResolvedValue(true);
            RepositoryModernizer.performModernization.mockResolvedValue(true);
            return command.run().then(() => {
                expect(helper.readConfigFile).toHaveBeenCalledWith(configDir);
                expect(helper.clearOutputFolder).toHaveBeenCalledWith(
                    Commons.constants.TARGET_PROJECT_FOLDER
                );
                expect(RepositoryModernizer.checkConfig).toHaveBeenCalledWith(
                    config.repositoryModernizer
                );
                expect(
                    RepositoryModernizer.performModernization
                ).toHaveBeenCalledWith(
                    config.repositoryModernizer,
                    helper.baseRepoResourcePath
                );
            });
        });

        test("verify missing configuration", () => {
            command.config = {
                configDir: configDir,
            };
            helper.clearOutputFolder.mockResolvedValue(true);
            helper.readConfigFile.mockReturnValue(config);
            RepositoryModernizer.checkConfig.mockResolvedValue(false);
            return command.run().then(() => {
                expect(helper.readConfigFile).toHaveBeenCalledWith(configDir);
                expect(helper.clearOutputFolder).toHaveBeenCalledWith(
                    Commons.constants.TARGET_PROJECT_FOLDER
                );
                expect(RepositoryModernizer.checkConfig).toHaveBeenCalledWith(
                    config.repositoryModernizer
                );
                expect(
                    RepositoryModernizer.performModernization
                ).not.toHaveBeenCalled();
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
