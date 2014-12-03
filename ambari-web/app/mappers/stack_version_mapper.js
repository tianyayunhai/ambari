/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var App = require('app');

App.stackVersionMapper = App.QuickDataMapper.create({
  modelStackVerion: App.StackVersion,

  modelStack: {
    "id": "id",
    "cluster_name": "cluster_name",
    "stack": "stack",
    "version": "version",
    "repository_version_id": "repository_version_id",
    "state": "state",
    "installing_hosts": "host_states.INSTALLING",
    "installed_hosts": "host_states.INSTALLED",
    "install_failed_hosts": "host_states.INSTALL_FAILED",
    "upgrading_hosts": "host_states.UPGRADING",
    "upgraded_hosts": "host_states.UPGRADED",
    "upgrade_failed_hosts": "host_states.UPGRADE_FAILED",
    "current_hosts": "host_states.CURRENT"
  },

  map: function (json) {
    var modelStackVerion = this.get('modelStackVerion');
    var resultStack = [];

    if (json && json.items) {
      json.items.forEach(function (item) {
        var stack = item.ClusterStackVersions;
        if (item.repository_versions[0]) {
          stack.repository_version_id = item.repository_versions[0].RepositoryVersions.id;
          item.repository_versions[0].RepositoryVersions.stackVersionId = item.ClusterStackVersions.id;
          resultStack.push(this.parseIt(stack, this.get('modelStack')));
          App.repoVersionMapper.map({"items": item.repository_versions });
        }
      }, this);
    }
    App.store.commit();
    App.store.loadMany(modelStackVerion, resultStack);
  }
});
