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
const WorkflowMigratorCommand = require("../../src/commands/aem-migration/workflow-migrator");
const helper = require("../../src/helper");
const constants = require("../../src/constants");
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const child_process = require("child_process");
const { stdout } = require("stdout-stderr");

jest.mock("../../src/helper");
//jest.mock("util");
jest.mock("child_process");

const configFileName = "aem-migration-config.yaml";
const configDir = path.join(process.cwd(), "config");
const config = yaml.load(
    fs.readFileSync(path.join(configDir, configFileName), "utf8")
);

beforeAll(() => stdout.start());
afterAll(() => stdout.stop());

test("exports", async () => {
    expect(typeof WorkflowMigratorCommand).toEqual("function");
});

test("description", async () => {
    expect(WorkflowMigratorCommand.description).toBeDefined();
});

describe("Test Command", () => {
    let command;

    beforeEach(() => {
        command = new WorkflowMigratorCommand([]);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("run", () => {
        test("exists", async () => {
            expect(command.run).toBeInstanceOf(Function);
        });

        test("executes wf-migrator.jar", () => {
            command.config = {
                configDir: configDir,
            };
            helper.clearOutputFolder.mockResolvedValue(true);
            helper.readConfigFile.mockReturnValue(config);
            helper.fetchLatestReleasedAsset.mockResolvedValue(true);
            child_process.exec.mockImplementation((command, callback) =>
                callback(null, { stdout: "ok" })
            );
            return command.run().then(() => {
                expect(helper.readConfigFile).toHaveBeenCalledWith(configDir);
                expect(helper.clearOutputFolder).toHaveBeenCalledWith(
                    constants.TARGET_WORKFLOW_FOLDER
                );
                expect(helper.fetchLatestReleasedAsset).toHaveBeenCalledWith(
                    constants.WF_MIGRATOR_REPO_OWNER,
                    constants.WF_MIGRATOR_REPO_NAME,
                    constants.WF_MIGRATOR_JAR
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
