/*global angular */
var cubeatrix = angular.module('cubeatrix', ['ui.filters', 'D3ClassFilter', 'ngSanitize']);

cubeatrix.controller('cubeController', function ($scope, $http) {
    'use strict';
    //Version
    $scope.version = "1.0.2";
    $scope.ItemDB = "";
    
    $scope.CProfile = "LR";
    
    $scope.SFType = '';
    $scope.SFSubType = '';
    $scope.SFClass = '';
    $scope.SFSearchText = '';
    
    //Column Options
    $scope.ShowNS = true;
    $scope.ShowS = true;
    $scope.ShowST = true;
    $scope.ShowType = true;
    $scope.ShowSubType = true;
    $scope.ShowDescription = true;
    $scope.SortType = 'Name';
    $scope.SortReverse = false;
    
    $scope.Options = {
        Display: {
            ShowNS: true,
            ShowS: true,
            ShowST: true,
            ShowType: true,
            ShowSubType: true,
            ShowDescription: true,
            ShowProgress: true
        },
        ThemeID: 1
    };
    
    $scope.LData = {
        LiveReg: {Items: []},
        LiveHard: {},
        PTRReg: {},
        PTRHard: {}
    };
    
    //Start up
    $http.get("Data/D3LegendaryItemDB.json").then(
        function success(response) {
            $scope.ItemDB = response.data;
            $scope.LoadData();
        }
    );
    
    //Load Options
    window.console.log("Processing Options");
    if (localStorage.getItem("d3ct.options") !== null) {
        window.console.log("Loading Options");
        $scope.Options = JSON.parse(localStorage.getItem("d3ct.options"));
    } else {
        window.console.log("Creating and Saving default options");
        $scope.Options = {
            Display: {
                ShowNS: true,
                ShowS: true,
                ShowST: true,
                ShowType: true,
                ShowSubType: true,
                ShowDescription: false,
                ShowProgress: false
            },
            ThemeID: 1
        };
    }
    
    //Functions Below
    $scope.Toggle = function (item, gid) {

        switch (gid) {
        case 0:
            item.NS = !item.NS;
            break;
                
        case 1:
            item.S = !item.S;
            break;

        case 2:
            item.ST = !item.ST;
            break;
        }
        $scope.SaveData();
    };
    
    $scope.SetTypeFilter = function (TypeFilter) {
        $scope.SFType = TypeFilter.toString();
        $scope.SFSubType = '';
    };
    
    $scope.SetSubTypeFilter = function (SubTypeFilter) {
        $scope.SFSubType = SubTypeFilter.toString();
    };
    
    $scope.SetClassFilter = function (ClassFilter) {
        $scope.SFClass = ClassFilter.toString();
    };

    $scope.ChangeProfile = function (nProfile) {
        if (nProfile === "CLEAR") {
            angular.forEach($scope.ItemDB.Items, function (value, key) {
                value.NS = false;
                value.S = false;
                value.ST = false;
            });
            nProfile = $scope.CProfile;
            $scope.SaveData();
        }
        
        $scope.CProfile = nProfile;
        $scope.UpdateDataDisplay();
    };
    
    $scope.saveOptions = function () {
        localStorage.setItem("d3ct.options", JSON.stringify($scope.Options));
    };
    
    $scope.EndSeason = function () {
        window.console.log("ENDING SEASON!");
        angular.forEach($scope.ItemDB.Items, function (item, key) {
            if (item.S === true && item.NS === false) { item.NS = true; }
            item.S = false;
        });
        $scope.SaveData();
    };
    
    $scope.SaveData = function () {
        var iScope = [];
        
        angular.forEach($scope.ItemDB.Items, function (item, key) {
            if (item.NS || item.S || item.ST) {
                iScope.push({ID: item.ID, NS: item.NS, S: item.S, ST: item.ST});
            }
        });
        
        switch ($scope.CProfile) {
        case "LR":
            $scope.LData.LiveReg.Items = iScope;
            break;
                
        case "LH":
            $scope.LData.LiveHard.Items = iScope;
            break;
                
        case "PR":
            $scope.LData.PTRReg.Items = iScope;
            break;
                
        case "PH":
            $scope.LData.PTRHard.Items = iScope;
            break;
        }

        localStorage.setItem("d3cdata", JSON.stringify($scope.LData));
    };
    
    $scope.LoadData = function () {
        if (localStorage.getItem("d3cdata") !== null) {
            $scope.LData = JSON.parse(localStorage.getItem("d3cdata"));
        } else {
            localStorage.setItem("d3cdata", JSON.stringify($scope.LData));
        }
        
        //Check for Old Data
        if (localStorage.getItem("d3it.save") !== null) {
            $scope.LData.LiveReg = JSON.parse(localStorage.getItem("d3it.save"));
            localStorage.setItem("d3cdata", JSON.stringify($scope.LData));
            localStorage.removeItem("d3it.save");
        }
        $scope.CProfile = "LR";
        $scope.UpdateDataDisplay();
    };
    
    $scope.UpdateDataDisplay = function () {
        var ItemSet = {};
        
        //Reset all items to nothing
        angular.forEach($scope.ItemDB.Items, function (value, key) {
            value.NS = false;
            value.S = false;
            value.ST = false;
        });
                
        switch ($scope.CProfile) {
        case "LR":
            ItemSet = $scope.LData.LiveReg.Items;
            break;
                
        case "LH":
            ItemSet = $scope.LData.LiveHard.Items;
            break;
                
        case "PR":
            ItemSet = $scope.LData.PTRReg.Items;
            break;
                
        case "PH":
            ItemSet = $scope.LData.PTRHard.Items;
            break;
        }
        
        angular.forEach(ItemSet, function (item, key) {
            $scope.ItemDB.Items[item.ID].NS = item.NS;
            $scope.ItemDB.Items[item.ID].S = item.S;
            $scope.ItemDB.Items[item.ID].ST = item.ST;
        });
    };

    $scope.ShowOptions = function () {
        window.$("#d3Options").modal();
    };
    
    $scope.ClearData = function () {
        $scope.LData = { LiveReg: {}, LiveHard: {}, PTRReg: {}, PTRHard: {} };
        $scope.SaveData();
    };
    
    $scope.Themes = [
        {ID: 0, Name: "Cerulean (L)", URL: "./CSS/Themes/cerulean.min.css" },
        {ID: 1, Name: "Darkly (D)", URL: "./CSS/Themes/darkly.min.css"},
        {ID: 2, Name: "Cosmo (L)", URL: "./CSS/Themes/Cosmo.min.css"},
        {ID: 3, Name: "Cyborg (D)", URL: "./CSS/Themes/Cyborg.min.css"},
        {ID: 4, Name: "Flatly (L)", URL: "./CSS/Themes/flatly.min.css"},
        {ID: 5, Name: "Journal (L)", URL: "./CSS/Themes/journal.min.css"},
        {ID: 6, Name: "Lumen (L)", URL: "./CSS/Themes/lumen.min.css"},
        {ID: 7, Name: "Paper (L)", URL: "./CSS/Themes/paper.min.css"},
        {ID: 8, Name: "Readable (L)", URL: "./CSS/Themes/readable.min.css"},
        {ID: 9, Name: "Sandstone (L)", URL: "./CSS/Themes/sandstone.min.css"},
        {ID: 10, Name: "Simplex (L)", URL: "./CSS/Themes/simplex.min.css"},
        {ID: 11, Name: "Slate (D)", URL: "./CSS/Themes/slate.min.css"},
        {ID: 12, Name: "Spacelab(L)", URL: "./CSS/Themes/spacelab.min.css"},
        {ID: 13, Name: "Superhero (D)", URL: "./CSS/Themes/superhero.min.css"},
        {ID: 14, Name: "United (L)", URL: "./CSS/Themes/united.min.css"},
        {ID: 15, Name: "Yeti (L)", URL: "./CSS/Themes/yeti.min.css"}
    ];
    
    window.$(document).ready(function () {
        window.$('[data-toggle="tooltip"]').tooltip({
            trigger : 'hover',
            container: 'body'
        });
    });
    
});

