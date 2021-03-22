<!--
Copyright 2020 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
-->

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@adobe/aio-cli-plugin-aem-cloud-service-migration.svg)](https://npmjs.org/package/@adobe/aio-cli-plugin-aem-cloud-service-migration)
[![Downloads/week](https://img.shields.io/npm/dw/@adobe/aio-cli-plugin-aem-cloud-service-migration.svg)](https://npmjs.org/package/@adobe/aio-cli-plugin-aem-cloud-service-migration)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Codecov Coverage](https://img.shields.io/codecov/c/github/adobe/aio-cli-plugin-aem-cloud-service-migration/master.svg?style=flat-square)](https://codecov.io/gh/adobe/aio-cli-plugin-aem-cloud-service-migration/)

# aio-cli-plugin-aem-cloud-service-migration

Follow the sections below to AEM as a Cloud Service Code Refactoring plugin for the [Adobe I/O CLI](https://github.com/adobe/aio-cli).

# Introduction

With the increase in number of code refactoring tools (with different set of installation, setup requirements and
Input/Output formats), the complexity of using these tools has also elevated.

`aio-cli-plugin-aem-cloud-service-migration` plugin unifies the code refactoring tools which refactor
customers code, repository structure, and configurations on user's local machine.

# The JavaScript Packages

* The [Adobe I/O CLI AEM Cloud Service Migration Plugin](https://github.com/adobe/aio-cli-plugin-aem-cloud-service-migration)
 is the main AEM as a Cloud Service source migration Adobe I/O CLI plugin.

* The [AEM Cloud Service Source Migration Packages](https://github.com/adobe/aem-cloud-service-source-migration)
 is the base library providing the underlying code refactoring tools.

   Following tool packages are  currently available:
   * [Dispatcher Converter tool](#https://github.com/adobe/aem-cloud-service-source-migration/packages/dispatcher-converter) : `@adobe/aem-cs-source-migration-dispatcher-converter`
   * [Repository Modernizer tool](#https://github.com/adobe/aem-cloud-service-source-migration/packages/repository-modernizer) : `@adobe/aem-cs-source-migration-repository-modernizer`
   * [Index Converter tool](#https://github.com/adobe/aem-cloud-service-source-migration/packages/index-converter) : `@adobe/aem-cs-source-migration-index-converter`

# Requirements

* Node.js 10.0+
* [Adobe I/O CLI](https://github.com/adobe/aio-cli)
   
# Setting up necessary Adobe I/O Dependencies

* Install the Adobe I/O CLI (_if you haven't already_) `$ npm install -g @adobe/aio-cli`

* Install AEM cloud service migration plugin with aio `$ aio plugins:install @adobe/aio-cli-plugin-aem-cloud-service-migration`

* When you run `$ aio aem-migration --help`, you should be able to see `aem-cloud-service-migration` as an available
 plugin with its sub-commands.

# Updating

```sh-session
$ aio plugins:install @adobe/aio-cli-plugin-aem-cloud-service-migration
```

# Working

Once the necessary dependencies are installed:

* Add the necessary configurations for executing a particular tool. Refer to [config](./config/README.md) for more details.
* Execute the required tool via the `aio` command (NOTE : Executing any tool would require an administartor session).
* Check the `target` folder for refactored code or configurations, summary report and tool execution logs.

# Commands

Follow the sections below to learn about commands and their execution.

## `aio aem-migration:all`

This command executes all the source refactoring tools.

### Configurations

Refer to [config](./config/README.md) for more details.

```
USAGE
  $ aio aem-migration:all

OPTIONS
  -t, --type=ams|on-premise  [default: on-premise] the type of AEM provisioning (ams or on-prem)
  --help                     show help

DESCRIPTION
  Available migration tools :
  * dispatcher-converter
  * repository-modernizer
  * index-converter

EXAMPLES
  $ aio aem-migration:all
  $ aio aem-migration:all -t=ams
  $ aio aem-migration:all -t=on-premise

```

Refer to Code :*[src/commands/aem-migration/all.js](./src/commands/aem-migration/all.js)*

## `aio aem-migration:dispatcher-converter` 

This command converts an existing dispatcher configurations into AEM as a Cloud Service compatible dispatcher configurations.

### Configurations

Refer to [config](./config/README.md) for more information.

```
USAGE
  $ aio aem-migration:dispatcher-converter

OPTIONS
  -t, --type=ams|on-premise  [default: on-premise] the type of AEM provisioning (ams or on-prem)
  --help                     show help

DESCRIPTION
  Configuring existing on-Premise or Adobe Managed Services (AMS) Dispatcher configurations to AEM as a Cloud
  Service compatible Dispatcher configuration.

  AEM as a Cloud Service has defined rules which are to be followed while configuring Dispatcher for AEM instances.
  Dispatcher Converter reads on-Premise or Adobe Managed Services (AMS) Dispatcher configurations and changes them
  to AEM as a Cloud Service compatible dispatcher configurations.

EXAMPLES
  $ aio aem-migration:dispatcher-converter
  $ aio aem-migration:dispatcher-converter -t=ams
  $ aio aem-migration:dispatcher-converter -t=on-premise
```

Refer to Code: *[src/commands/aem-migration/dispatcher-converter.js](./src/commands/aem-migration/dispatcher-converter.js)*.

## Command: `aio aem-migration:repository-modernizer`

This command restructures an existing projects packages into AEM as a Cloud Service compatible packages.

Please see [here](https://github.com/adobe/aem-cloud-service-source-migration/blob/master/packages/repository-modernizer/README.md)
 to know more about how the tool works, known limitations and what needs to be handled manually.

### Configurations

Refer to [config](./config/README.md)
for more info.

```
USAGE
  $ aio aem-migration:repository-modernizer

OPTIONS
  --help                     show help

DESCRIPTION
  AEM requires a separation of content and code, which means a single content package cannot deploy to both /apps
  and runtime-writable areas (for example, /content , /conf , /home , or anything not /apps ) of the repository.
  Instead, the application must separate code and content into discrete packages for deployment into AEM.

  Repository Modernizer automates the separation of such packages into :
  * ui.apps package, or Code Package
  * ui.config package, or OSGi Configurations Package
  * ui.content package, or Content Package
  * all (container) package that includes the above packages as embeds.

EXAMPLE
  $ aio aem-migration:repository-modernizer

```

Refer to Code: *[src/commands/aem-migration/repository-modernizer.js](./src/commands/aem-migration/repository-modernizer.js)*.

## Command: `aio aem-migration:index-converter`

This command migrates existing Custom Oak Index Defintions into AEM as a Cloud Service compatible Custom Oak Index Defintions.

Please see [here](https://github.com/adobe/aem-cloud-service-source-migration/blob/master/packages/index-converter/README.md)
 to know more about how the tool works, known limitations and what needs to be handled manually.

### Configurations

Refer to [config](./config/README.md)
for more info.

```
USAGE
  $ aio aem-migration:index-converter

OPTIONS
  --help                     show help

DESCRIPTION
  Configuring existing Custom Oak Index Definitions to AEMaaCS compatible Custom Oak Index Defintions.
  Custom Oak Index Definitions can be categorized as :
  * Custom OOTB (Product) Oak Index Definitions : Modification into existing OOTB Oak Index Definitions
  * Newly created Oak Index Definitions

  Operation for custom OOTB (Product) Oak Index Definition :
  * This tool will parse the Custom OOTB (Product) Oak Index Definition and fetch the associated OOTB Index Definition.
  * It will compare the Custom OOTB Oak Index Definition to the associated OOTB Index Definition and retrieve the
    difference between Custom OOTB Index Definition. and associated OOTB Index Definition. That difference or delta is
    basically customization done by the user in OOTB Oak Index Definition.
  * It will validate the retrieved customization as per AEM as Cloud Service compatible OAK Index Definitions guidelines.
  * It will merge validated customization of Custom OOTB Oak Index Definition to corresponding OAK Index Definition
    present on AEM as a Cloud Service.
  Naming convention for Custom OOTB (Product) Oak Index Definition :
       "Name of the corresponding OAK Index Definition on AEMaaCS"-"latest version of this index on AEMaaCS "-"custom"-1

  Operation for newly created custom Oak Index Definition :
  * It will parse and validate the Custom Oak Index Definition according to AEM as a Cloud Service OAK Index Definitions guidelines.
  * It will rename the Custom Oak Index Definition.
  Naming convention for newly created Custom Oak Index Definition :
       "Name of the Custom Oak Index Defintion"-"custom"-1

EXAMPLE
  $ aio aem-migration:index-converter

```

Refer to Code: *[src/commands/aem-migration/index-converter.js](./src/commands/aem-migration/index-converter.js)*

# Adding New Commands

Follow the steps below to add a new command:

1. Create a new javascript file, named after the command, in `src/commands/aem-migration`.

2. Use the contents of `src/commands/aem-migration/dispatcher-converter.js` as a starting point for your command,
 paying particular attention to the command's `flags`, `args`, and `description`. Refer to [https://oclif.io](https://oclif.io/) for additional information and features.

3. Ensure that the file's exports include an object with a property matching the command name.

# Publishing to npm
This repository has been configured to automatically publish the plugin to `npm` registry.
 It requires a commit to be made to the `master` branch with the required semver bump made
 to the package version in the [package.json](./package.json). This commit will automatically
 trigger the [Github Action](https://github.com/adobe/aio-cli-plugin-aem-cloud-service-migration/blob/master/.github/workflows/on-push-publish-to-npm.yml)
 which will publish the package to `npm` registry.

# Contributing

Contributions are welcomed! Read the [Contributing Guide](CONTRIBUTING.md) for more information.

# Licensing

This project is licensed under the Apache V2 License. Refer to [LICENSE](LICENSE) for more information.

# Reporting

Please follow the [Issue template](ISSUE_TEMPLATE.md) to report issues or to request enhancements.
