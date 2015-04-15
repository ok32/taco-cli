﻿/**
﻿ * ******************************************************
﻿ *                                                       *
﻿ *   Copyright (C) Microsoft. All rights reserved.       *
﻿ *                                                       *
﻿ *******************************************************
﻿ */
/// <reference path="../../typings/node.d.ts" />
/// <reference path="../../typings/Q.d.ts" />
/// <reference path="../../typings/taco-utils.d.ts" />
/// <reference path="../../typings/express.d.ts" />
"use strict";

import child_process = require ("child_process");
import express = require ("express");
import os = require ("os");
import Q = require ("q");
import RemoteBuildConf = require ("./remotebuild-conf");

class HostSpecifics {
    private static CachedSpecifics: HostSpecifics.IHostSpecifics;
    public static get hostSpecifics(): HostSpecifics.IHostSpecifics {
        if (!HostSpecifics.CachedSpecifics) {
            switch (os.platform()) {
                case "darwin":
                    HostSpecifics.CachedSpecifics = require("./darwin/darwin-specifics");
                    break;
                case "win32":
                    HostSpecifics.CachedSpecifics = require("./win32/win32-specifics");
                    break;
                default:
                    throw new Error("UnsupportedPlatform");
            }
        }

        return HostSpecifics.CachedSpecifics;
    }
}

module HostSpecifics {
    export interface ICertStore {
        newCerts: boolean;
        getKey: () => any;
        getCert: () => any;
        getCA: () => any;
    }

    export interface IHostSpecifics {
        defaults(base: { [key: string]: any }): { [key: string]: any };
        initialize(conf: RemoteBuildConf): Q.Promise<any>;
        printUsage(language: string): void;

        resetServerCert(conf: RemoteBuildConf): Q.Promise<any>;
        generateClientCert(conf: RemoteBuildConf): Q.Promise<number>;
        initializeServerCerts(conf: RemoteBuildConf): Q.Promise<ICertStore>;
        getServerCerts(): Q.Promise<ICertStore>;
        removeAllCertsSync(conf: RemoteBuildConf): void;
        downloadClientCerts(request: express.Request, response: express.Response): void;

        getHttpsAgent(conf: RemoteBuildConf): Q.Promise<NodeJSHttp.Agent>;
    }
}

export = HostSpecifics;