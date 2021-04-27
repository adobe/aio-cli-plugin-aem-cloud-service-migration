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
const Commons = require("@adobe/aem-cs-source-migration-commons");
const helper = require("../src/helper");
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const { stdout } = require("stdout-stderr");

jest.mock("@adobe/aem-cs-source-migration-commons");

const dir = "./test/testFolder";

beforeAll(() => stdout.start());
afterAll(() => stdout.stop());

test("exports", async () => {
    expect(typeof helper.readConfigFile).toEqual("function");
    expect(typeof helper.clearOutputFolder).toEqual("function");
    expect(typeof helper.createBaseDispatcherConfig).toEqual("function");
    expect(typeof helper.baseRepoResourcePath).toEqual("string");
    expect(typeof helper.baseIndexDefResourcePath).toEqual("string");
});

describe("test readConfigFile()", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("reads config file", async () => {
        const configFileName = "aem-migration-config.yaml";
        const configDir = path.join(process.cwd(), "config");
        const config = yaml.load(
            fs.readFileSync(path.join(configDir, configFileName), "utf8")
        );
        return expect(helper.readConfigFile(configDir)).toEqual(config);
    });

    test("catches config file not found error", async () => {
        expect(() => {
            helper.readConfigFile(path.join(process.cwd(), "dummay_path"));
        }).toThrow();
    });
});

describe("test clearOutputFolder()", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("clears output folder", async () => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        helper.clearOutputFolder(dir);
        expect(Commons.util.deleteFolderRecursive).toHaveBeenCalledWith(dir);
        fs.rmdirSync(dir);
    });
});

describe("test createBaseDispatcherConfig()", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("creates base dispatcher config", async () => {
        helper.createBaseDispatcherConfig(dir);
        expect(Commons.util.copyFolderSync).toHaveBeenCalledWith(
            dir,
            Commons.constants.TARGET_DISPATCHER_SRC_FOLDER
        );
    });
});
