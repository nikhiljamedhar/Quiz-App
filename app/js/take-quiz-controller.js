pencilBoxApp.controller('TakeQuizController', ['$scope', '$routeParams', 'TakeQuiz', 'Contents', 'Chapters', 'Subjects',
    function ($scope, $routeParams, TakeQuiz) {
        $scope.current_grade = $routeParams.gradeId;
        $scope.current_subject = $routeParams.subjectId;
        $scope.current_chapter = $routeParams.chapterId;

        TakeQuiz.query(function(response) {
            $scope.quizJson = { questions: response.questions };
            $scope.preprocessJson();
            $scope.initQuiz();
        });

        $scope.preprocessJson = function() {
            for(var i= 0, length = $scope.quizJson.questions.length; i<length; i++) {
                if($scope.quizJson.questions[i].type === "fill-the-blanks" || $scope.quizJson.questions[i].type === "fill-the-blanks") {
                    $scope.quizJson.questions[i].answer = [];
                } else if($scope.quizJson.questions[i].type === "match-the-following") {
                    var random = $scope.generateRandom($scope.quizJson.questions[i].questions.length);
                    var questions = angular.copy($scope.quizJson.questions[i].questions);
                    for(var j = 0; j<questions.length; j++) {
                        questions[j].answer = $scope.quizJson.questions[i].questions[random[j]].answer;
                    }
                    $scope.quizJson.questions[i].questions = questions;
                }
            }
        }

        $scope.initQuiz = function() {
            if($scope.quizJson.questions.length === 0) {return;}
            $scope.selectQuestion();
        }

        $scope.selectQuestion = function(index) {
            index = typeof index != 'undefined' && index != null ? index : 0;
            $scope.selectedQuestion = index;
            $scope.currentQuestion = $scope.quizJson.questions[$scope.selectedQuestion];
            $scope.currentQuestionType = $scope.currentQuestion.type;
            $scope.setQuestionObject();
        }

        $scope.setQuestionObject = function() {
            if($scope.currentQuestionType === "fill-the-blanks") {
                $scope.fillQuestion = [];
                var result = $scope.currentQuestion.question.replace(/___.*?___/g, '__').split(" ");
                for(var i= 0, length = result.length; i<length; i++) {
                    if(result[i] === "__") {
                        $scope.fillQuestion.push({type: "answer"});
                    } else {
                        $scope.fillQuestion.push({type: "question", value: result[i]});
                    }
                }
            } else if($scope.currentQuestionType === "match-the-following") {

            }
        }

        $scope.navigateQuestion = function(position) {
            var index = $scope.selectedQuestion + position;
            if($scope.quizJson.questions.length > index && 0 <= index) {
                $scope.selectQuestion(index);
            }
        }

        $scope.generateRandom = function(max) {
            var numbers = [];
            for(var i= 0; i<max; i++) {
                numbers.push(i);
            }
            function shuffle(o) {
                for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
                return o;
            }
            return shuffle(numbers);
        }
    }
]);