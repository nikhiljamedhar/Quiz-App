pencilBoxApp.controller('TakeQuizController', ['$scope', '$routeParams', 'TakeQuiz', 'Contents', 'Chapters', 'Subjects',
    function ($scope, $routeParams, TakeQuiz) {
        $scope.current_grade = $routeParams.gradeId;
        $scope.current_subject = $routeParams.subjectId;
        $scope.current_chapter = $routeParams.chapterId;

        TakeQuiz.query(function(response) {
            $scope.quizJson = { questions: response.questions };
            $scope.initQuiz();
        });

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
    }
]);