angular.module("app", ["ui.router"])
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state("app", {
        url: "/login",
        templateUrl:"login.html",
        controller: "LoginCtrl",
        resolve:{
            data: function($http){
                return $http.get('https://jsonplaceholder.typicode.com/users').then(function(res){
                    return res.data;
                }, function(){
                
                });
            }
        }
      });
     $stateProvider
       .state("profile", {
         url: "/profile/:id",
         templateUrl: 'profile.html',
         controller: "ProfileCtrl",
         resolve:{
            postsData: function($http){
                return $http.get('https://jsonplaceholder.typicode.com/posts').then(function(res){
                    return res.data;
                }, function(){
                
                });
            }
         }
       });

    $urlRouterProvider.otherwise("/login");

  })
  .controller("LoginCtrl", function(data, $scope, $state, DataTransferService) {
    $scope.showErrorMsg = false;
    var isValidEmail = false;
    $scope.login = function(){
        for(var i=0; i<data.length;i++){
            if(data[i].email===$scope.email){
                isValidEmail = true;
                $scope.id = data[i].id;
                $scope.userDetails = data[i];
                break;
            }
        }
        if(isValidEmail){
            $scope.showErrorMsg = false;
            DataTransferService.setData("userDetails",$scope.userDetails);
            $state.go('profile',{id:$scope.id});
        } else{
            $scope.showErrorMsg = true;
        }
    };

    
  })
  .controller("ProfileCtrl", function(postsData, $scope, DataTransferService, UtilityService) {
    $scope.showLoadingPostsandComments = true;
    $scope.userDetails = DataTransferService.getData('userDetails');
    $scope.commentsData = [];
    $scope.selectedPosts = [];
    UtilityService.getcommentsData().then(function(res){
        $scope.commentsData = res.data;
        
        for(var i=0; i< postsData.length;i++){
            if(postsData[i].userId===$scope.userDetails.id){
                $scope.selectedPosts.push(postsData[i]);
            }
        }
        $scope.showLoadingPostsandComments = false;
    }, function(){            
    
    });
    
    
  }).factory('DataTransferService', function(){
        var storObj = {};
        var obj = {
            setData:setData,
            getData:getData
        };
        return obj;

        function setData(msg, data) {
            storObj[msg] = data;
        }
        function getData(msg) {
            return angular.isDefined(storObj[msg]) ? storObj[msg] : undefined;
        }

  }).factory('UtilityService', function($http){
        var obj = {
            getcommentsData:getcommentsData
        };
        return obj;

        function getcommentsData() {
                return $http.get('https://jsonplaceholder.typicode.com/comments');
        }

  });