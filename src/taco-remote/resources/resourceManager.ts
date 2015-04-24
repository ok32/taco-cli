/// <reference path="../../typings/tacoUtils.d.ts" />

"use strict";

import tacoUtility = require("taco-utils");

class ResourceManager extends tacoUtility.ResourceManagerBase {
    protected get ResourcesDirectory(): string {
        return __dirname;
    }
}

var resourceManager: ResourceManager = new ResourceManager();
export = resourceManager;