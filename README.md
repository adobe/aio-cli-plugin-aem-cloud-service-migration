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
[![Version](https://img.shields.io/npm/v/@adobe/aio-cli-plugin-cloud-service-migration.svg)](https://npmjs.org/package/@adobe/aio-cli-plugin-cloud-service-migration)
[![Downloads/week](https://img.shields.io/npm/dw/@adobe/aio-cli-plugin-cloud-service-migration.svg)](https://npmjs.org/package/@adobe/aio-cli-plugin-cloud-service-migration)
[![Build Status](https://travis-ci.org/adobe/aio-cli-plugin-cloud-service-migration.svg?branch=master)](https://travis-ci.org/adobe/aio-cli-plugin-cloud-service-migration)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Codecov Coverage](https://img.shields.io/codecov/c/github/adobe/aio-cli-plugin-cloud-service-migration/master.svg?style=flat-square)](https://codecov.io/gh/adobe/aio-cli-plugin-cloud-service-migration/)

# aio-cli-plugin-cloud-service-migration

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

# Requirements

* Node.js 10.0+
* [Adobe I/O CLI](https://github.com/adobe/aio-cli)
   
# Setting up necessary Adobe I/O Dependencies

* Install aio-cli core libraries`$ npm install -g @adobe/aio-cli`

* Install AEM cloud service migration aio plugin `$ npm install -g @adobe/aio-cli-plugin-aem-cloud-service-migration`

* Link AEM cloud service migration plugin with aio `$ aio plugins:install @adobe/aio-cli-plugin-aem-cloud-service-migration`

* When you run `$ aio aem-migration --help`, you should be able to see `aem-cloud-service-migration` as an available
 plugin with its sub-commands.

# Updating

```sh-session
$ aio plugins:update
```

# Working

Once the necessary dependencies are installed:

* Add the necessary configurations for executing a particular tool. Refer to [config](./config/README.md) for more details.
* Execute the required tool via the `aio` command.
* Check the `target` folder for refactored code or configurations, summary report and tool execution logs.

# Commands

Follow the sections below to learn about commands and their execution.

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

# Adding New Commands

Follow the steps below to add a new command:

1. Create a new javascript file, named after the command, in `src/commands/aem-migration`.

1. Use the contents of `src/commands/aem-migration/dispatcher-converter.js` as a starting point for your command,
 paying particular attention to the command's `flags`, `args`, and `description`. Refer to [https://oclif.io](https://oclif.io/) for additional information and features.

1. Ensure that the file's exports include an object with a property matching the command name.

# Contributing

Contributions are welcomed! Read the [Contributing Guide](CONTRIBUTING.md) for more information.

# Licensing

This project is licensed under the Apache V2 License. Refer to [LICENSE](LICENSE) for more information.

# Reporting

Please follow the [Issue template](ISSUE_TEMPLATE.md) to report issues or to request enhancements.
